@echo off
echo ===================================================
echo   Deploying CropCover Contracts to Localhost
echo ===================================================

echo [1/2] Deploying Core Contracts...
call npx hardhat run scripts/deploy.js --network localhost

echo.
echo [2/2] Funding Treasury and Creating Initial Products...
call npx hardhat run scripts/setup-demo.js --network localhost

echo.
echo ===================================================
echo   Contracts deployed and configured successfully!
echo ===================================================
pause
