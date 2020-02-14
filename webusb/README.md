## Takahoot WebUSB !

# Run http server
npx http-server -S -p 443 

# Run chrome client
google-chrome --disable-web-security --app=https://takahoot.takima.io --user-data-dir=<TAKAHOOT_SESSION_DIR>
