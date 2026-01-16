@echo off
REM ============================================
REM UnifiedHealth Platform - Docker Health Check Script (Windows)
REM Verifies all services are healthy in CI/CD
REM ============================================

setlocal enabledelayedexpansion

REM Configuration
set MAX_RETRIES=30
if not "%MAX_RETRIES%"=="" set MAX_RETRIES=%MAX_RETRIES%

set RETRY_INTERVAL=10
if not "%RETRY_INTERVAL%"=="" set RETRY_INTERVAL=%RETRY_INTERVAL%

set COMPOSE_FILE=docker-compose.yml
if not "%COMPOSE_FILE%"=="" set COMPOSE_FILE=%COMPOSE_FILE%

echo ============================================
echo UnifiedHealth Health Check Script
echo ============================================
echo.
echo Configuration:
echo   Max Retries:      %MAX_RETRIES%
echo   Retry Interval:   %RETRY_INTERVAL%s
echo   Compose File:     %COMPOSE_FILE%
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Check if compose file exists
if not exist "%COMPOSE_FILE%" (
    echo [ERROR] Docker Compose file '%COMPOSE_FILE%' not found
    exit /b 1
)

echo ============================================
echo Checking Container Status
echo ============================================
echo.

set ALL_HEALTHY=1

REM Check if containers are running
echo [INFO] Checking if API container is running...
docker-compose -f %COMPOSE_FILE% ps -q api >nul 2>&1
if errorlevel 1 (
    echo [ERROR] API container is not running
    set ALL_HEALTHY=0
) else (
    echo [SUCCESS] API container is running
)

echo [INFO] Checking if Web container is running...
docker-compose -f %COMPOSE_FILE% ps -q web >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Web container is not running
    set ALL_HEALTHY=0
) else (
    echo [SUCCESS] Web container is running
)

echo [INFO] Checking if PostgreSQL container is running...
docker-compose -f %COMPOSE_FILE% ps -q postgres >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL container is not running
    set ALL_HEALTHY=0
) else (
    echo [SUCCESS] PostgreSQL container is running
)

echo [INFO] Checking if Redis container is running...
docker-compose -f %COMPOSE_FILE% ps -q redis >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Redis container is not running
    set ALL_HEALTHY=0
) else (
    echo [SUCCESS] Redis container is running
)

echo.
echo ============================================
echo Checking Service Health
echo ============================================
echo.

REM Check PostgreSQL health
echo [INFO] Checking PostgreSQL health...
set RETRY_COUNT=0
:check_postgres
docker-compose -f %COMPOSE_FILE% exec -T postgres pg_isready -U unified_health >nul 2>&1
if errorlevel 1 (
    set /a RETRY_COUNT+=1
    if !RETRY_COUNT! LSS %MAX_RETRIES% (
        echo [WARNING] PostgreSQL not ready yet (attempt !RETRY_COUNT!/%MAX_RETRIES%). Retrying in %RETRY_INTERVAL%s...
        timeout /t %RETRY_INTERVAL% /nobreak >nul
        goto :check_postgres
    ) else (
        echo [ERROR] PostgreSQL failed health check after %MAX_RETRIES% attempts
        set ALL_HEALTHY=0
    )
) else (
    echo [SUCCESS] PostgreSQL is healthy
)

REM Check Redis health
echo [INFO] Checking Redis health...
set RETRY_COUNT=0
:check_redis
docker-compose -f %COMPOSE_FILE% exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    set /a RETRY_COUNT+=1
    if !RETRY_COUNT! LSS %MAX_RETRIES% (
        echo [WARNING] Redis not ready yet (attempt !RETRY_COUNT!/%MAX_RETRIES%). Retrying in %RETRY_INTERVAL%s...
        timeout /t %RETRY_INTERVAL% /nobreak >nul
        goto :check_redis
    ) else (
        echo [ERROR] Redis failed health check after %MAX_RETRIES% attempts
        set ALL_HEALTHY=0
    )
) else (
    echo [SUCCESS] Redis is healthy
)

REM Check API health
echo [INFO] Checking API health...
set RETRY_COUNT=0
:check_api
curl -f -s http://localhost:8080/health >nul 2>&1
if errorlevel 1 (
    set /a RETRY_COUNT+=1
    if !RETRY_COUNT! LSS %MAX_RETRIES% (
        echo [WARNING] API not ready yet (attempt !RETRY_COUNT!/%MAX_RETRIES%). Retrying in %RETRY_INTERVAL%s...
        timeout /t %RETRY_INTERVAL% /nobreak >nul
        goto :check_api
    ) else (
        echo [ERROR] API failed health check after %MAX_RETRIES% attempts
        set ALL_HEALTHY=0
    )
) else (
    echo [SUCCESS] API is healthy
)

REM Check Web health
echo [INFO] Checking Web health...
set RETRY_COUNT=0
:check_web
curl -f -s http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    set /a RETRY_COUNT+=1
    if !RETRY_COUNT! LSS %MAX_RETRIES% (
        echo [WARNING] Web not ready yet (attempt !RETRY_COUNT!/%MAX_RETRIES%). Retrying in %RETRY_INTERVAL%s...
        timeout /t %RETRY_INTERVAL% /nobreak >nul
        goto :check_web
    ) else (
        echo [ERROR] Web failed health check after %MAX_RETRIES% attempts
        set ALL_HEALTHY=0
    )
) else (
    echo [SUCCESS] Web is healthy
)

echo.
echo ============================================
echo Health Check Summary
echo ============================================
echo.

if %ALL_HEALTHY%==1 (
    echo [SUCCESS] All services are healthy!
    echo.
    echo Service Status:
    docker-compose -f %COMPOSE_FILE% ps
    exit /b 0
) else (
    echo [ERROR] Some services are unhealthy
    echo.
    echo Service Status:
    docker-compose -f %COMPOSE_FILE% ps
    exit /b 1
)

endlocal
