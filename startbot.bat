@echo off
cls
if not exist node_modules (
    npm install
)
echo .
cls
node deploy-commands.js
node index.js