#!/usr/bin/env python3
from gh import takahootrepo
import os
os.chdir(os.path.dirname(os.path.realpath(__file__)))
takahootrepo.init_with_docs()
takahootrepo.commit_and_push_force_ghpages()
takahootrepo.clear()
