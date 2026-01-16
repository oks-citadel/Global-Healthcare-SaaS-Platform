@echo off
REM ============================================
REM UnifiedHealth Platform - Docker Build Script (Windows)
REM Builds, tags, and pushes Docker images
REM ============================================

setlocal enabledelayedexpansion

REM Configuration
set REGISTRY=your-aws-account-id.dkr.ecr.us-east-1.amazonaws.com
if not "%DOCKER_REGISTRY%"=="" set REGISTRY=%DOCKER_REGISTRY%

set PROJECT_NAME=unifiedhealth

for /f %%i in ('git rev-parse --short HEAD 2^>nul') do set GIT_SHA=%%i
if "%GIT_SHA%"=="" set GIT_SHA=latest

for /f %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set GIT_BRANCH=%%i
if "%GIT_BRANCH%"=="" set GIT_BRANCH=unknown

set BUILD_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%T%time:~0,2%:%time:~3,2%:%time:~6,2%Z
set VERSION=1.0.0
if not "%VERSION%"=="" set VERSION=%VERSION%

set BUILD_MODE=prod
if not "%BUILD_MODE%"=="" set BUILD_MODE=%BUILD_MODE%

echo ============================================
echo UnifiedHealth Docker Build Script
echo ============================================
echo.
echo Configuration:
echo   Registry:     %REGISTRY%
echo   Version:      %VERSION%
echo   Git SHA:      %GIT_SHA%
echo   Git Branch:   %GIT_BRANCH%
echo   Build Date:   %BUILD_DATE%
echo   Build Mode:   %BUILD_MODE%
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo ============================================
echo Building Docker Images
echo ============================================
echo.

REM Build API service
echo [INFO] Building API service...
docker build ^
    --target production ^
    --tag %PROJECT_NAME%/api:%GIT_SHA% ^
    --tag %PROJECT_NAME%/api:%VERSION% ^
    --tag %PROJECT_NAME%/api:latest ^
    --tag %REGISTRY%/%PROJECT_NAME%/api:%GIT_SHA% ^
    --tag %REGISTRY%/%PROJECT_NAME%/api:%VERSION% ^
    --tag %REGISTRY%/%PROJECT_NAME%/api:latest ^
    --build-arg BUILD_DATE=%BUILD_DATE% ^
    --build-arg VERSION=%VERSION% ^
    --build-arg GIT_SHA=%GIT_SHA% ^
    --build-arg GIT_BRANCH=%GIT_BRANCH% ^
    -f services/api/Dockerfile ^
    services/api

if errorlevel 1 (
    echo [ERROR] Failed to build API service
    exit /b 1
)
echo [SUCCESS] API build successful
echo.

REM Build Web service
echo [INFO] Building Web service...
docker build ^
    --target production ^
    --tag %PROJECT_NAME%/web:%GIT_SHA% ^
    --tag %PROJECT_NAME%/web:%VERSION% ^
    --tag %PROJECT_NAME%/web:latest ^
    --tag %REGISTRY%/%PROJECT_NAME%/web:%GIT_SHA% ^
    --tag %REGISTRY%/%PROJECT_NAME%/web:%VERSION% ^
    --tag %REGISTRY%/%PROJECT_NAME%/web:latest ^
    --build-arg BUILD_DATE=%BUILD_DATE% ^
    --build-arg VERSION=%VERSION% ^
    --build-arg GIT_SHA=%GIT_SHA% ^
    --build-arg GIT_BRANCH=%GIT_BRANCH% ^
    -f apps/web/Dockerfile ^
    apps/web

if errorlevel 1 (
    echo [ERROR] Failed to build Web service
    exit /b 1
)
echo [SUCCESS] Web build successful
echo.

echo ============================================
echo Build Summary
echo ============================================
echo.
echo [SUCCESS] Build completed successfully!
echo.
echo Built images:
echo   - %PROJECT_NAME%/api:%GIT_SHA%
echo   - %PROJECT_NAME%/api:%VERSION%
echo   - %PROJECT_NAME%/api:latest
echo   - %PROJECT_NAME%/web:%GIT_SHA%
echo   - %PROJECT_NAME%/web:%VERSION%
echo   - %PROJECT_NAME%/web:latest
echo.

if "%PUSH%"=="true" (
    echo ============================================
    echo Pushing Images to Registry
    echo ============================================
    echo.

    echo [INFO] Logging into registry...
    if not "%DOCKER_USERNAME%"=="" (
        echo %DOCKER_PASSWORD% | docker login %REGISTRY% -u %DOCKER_USERNAME% --password-stdin
    ) else if not "%ACR_SERVICE_PRINCIPAL_ID%"=="" (
        echo %ACR_SERVICE_PRINCIPAL_PASSWORD% | docker login %REGISTRY% -u %ACR_SERVICE_PRINCIPAL_ID% --password-stdin
    ) else (
        echo [WARNING] No registry credentials provided
        echo [WARNING] Set DOCKER_USERNAME/DOCKER_PASSWORD or ACR credentials to push images
        goto :skip_push
    )

    echo [INFO] Pushing API images...
    docker push %REGISTRY%/%PROJECT_NAME%/api:%GIT_SHA%
    docker push %REGISTRY%/%PROJECT_NAME%/api:%VERSION%
    docker push %REGISTRY%/%PROJECT_NAME%/api:latest

    echo [INFO] Pushing Web images...
    docker push %REGISTRY%/%PROJECT_NAME%/web:%GIT_SHA%
    docker push %REGISTRY%/%PROJECT_NAME%/web:%VERSION%
    docker push %REGISTRY%/%PROJECT_NAME%/web:latest

    echo.
    echo [SUCCESS] Images pushed to: %REGISTRY%

    :skip_push
) else (
    echo To push images, run: SET PUSH=true ^&^& docker-build.bat
)

echo.
echo ============================================
echo Done!
echo ============================================

endlocal
