@echo off
REM Build script for Global Healthcare SaaS Platform
REM This script builds all packages, services, and apps

echo =========================================
echo Global Healthcare SaaS Platform - Build
echo =========================================
echo.

cd /d "%~dp0"

echo Step 1: Installing dependencies...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Building all packages and apps...
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    exit /b %ERRORLEVEL%
)

echo.
echo =========================================
echo Build completed successfully!
echo =========================================
