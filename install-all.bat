@echo off
echo ===================================================
echo   Installing Dependencies for CropCover Platform
echo ===================================================

echo [1/5] Installing Root dependencies...
call npm install

echo [2/5] Installing Backend dependencies...
cd backend
call npm install
cd ..

echo [3/5] Installing Oracle dependencies...
cd oracle
call npm install
cd ..

echo [4/5] Installing IoT Simulator dependencies...
cd iot-sim
call npm install
cd ..

echo [5/5] Installing Frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ===================================================
echo   All CropCover dependencies installed successfully!
echo ===================================================
pause
