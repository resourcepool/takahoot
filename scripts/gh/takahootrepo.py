import constant
import tempfile
import shutil
import subprocess
from git import Repo

tmpdir = tempfile.mkdtemp(suffix='player')
repodir = tmpdir + "/repo"

def init_with_docs():
    print("Building docs")
    return_code = subprocess.call("cd ../docs && mkdocs build", shell=True)
    if (return_code != 0):
        exit(1)
    print("Copying resources to " + repodir)
    shutil.copytree("../docs/site", repodir)

def commit_and_push_force_ghpages():
    repo = Repo.init(repodir)
    origin = repo.create_remote('origin', constant.GIT_REPO)
    assert origin.exists()
    repo.git.add("--all")
    repo.git.commit(message="Initial Commit")
    repo.git.push("-f", "origin", "master:gh-pages")

def clear():
    global tmpdir
    global repodir
    tmpdir = tempfile.mkdtemp(suffix='player')
    repodir = tmpdir + "/repo"
