@echo off
title CropCover Master Launcher
color 0A

echo =====================================================================
echo                 CropCover Autonomous Insurance Protocol
echo                         Author: Aum Mangal
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/4] Starting Local Ethereum Node on port 8545...
start "CropCover Blockchain Node (Port 8545)" cmd /k "npx hardhat node"

echo Waiting for blockchain node to initialize...
timeout /t 5 /nobreak >nul

echo [2/4] Deploying Smart Contracts & Initializing Policy Products...
call npx hardhat run scripts/deploy.js --network localhost
call npx hardhat run scripts/setup-demo.js --network localhost

echo.
echo [3/4] Starting Backend API (Port 3001), Oracle (Port 3002), and IoT Simulator...
start "CropCover Backend API (Port 3001)" cmd /k "cd backend && npm start"
start "CropCover Oracle Network (Port 3002)" cmd /k "cd oracle && npm start"
start "CropCover IoT Simulator" cmd /k "cd iot-sim && npm start"

echo.
echo [4/4] Starting React Frontend on Port 3000...
start "CropCover Frontend (Port 3000)" cmd /k "cd frontend && npm start"

echo.
echo =====================================================================
echo   All systems active!
echo   - Web UI:   http://localhost:3000
echo   - Backend:  http://localhost:3001
echo   - Node RPC: http://127.0.0.1:8545 (Chain ID: 31337)
echo =====================================================================
echo.
pause
