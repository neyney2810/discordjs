@echo off
cls
if not exist node_modules (
    npm install
)
cls
node deploy-commands.js
node index.js