@echo off
echo ===================================================
echo   Starting CropCover Microservices
echo ===================================================

echo Starting Backend API on port 3001...
start "CropCover Backend (Port 3001)" cmd /k "cd backend && npm start"

echo Starting Weather Oracle on port 3002...
start "CropCover Oracle Network (Port 3002)" cmd /k "cd oracle && npm start"

echo Starting IoT Sensor Simulator...
start "CropCover IoT Simulator" cmd /k "cd iot-sim && npm start"

echo Starting React Frontend on port 3000...
start "CropCover Frontend (Port 3000)" cmd /k "cd frontend && npm start"

echo.
echo ===================================================
echo   All 4 services launched in separate windows!
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:3001
echo   - Oracle:   http://localhost:3002
echo ===================================================
pause
