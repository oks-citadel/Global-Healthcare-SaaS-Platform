@echo off
REM Reset Database Script for Windows
REM This script resets the database and reseeds it with test data

echo ==========================================
echo Database Reset and Seed Script
echo ==========================================
echo.
echo WARNING: This will delete ALL data in the database!
echo.

REM Check if running in production
if "%NODE_ENV%"=="production" (
  echo ERROR: Cannot reset database in production environment!
  exit /b 1
)

REM Confirm before proceeding
set /p CONFIRM="Are you sure you want to continue? (yes/no): "

if not "%CONFIRM%"=="yes" (
  echo Operation cancelled.
  exit /b 0
)

echo.
echo Step 1: Resetting database with migrations...
echo ----------------------------------------------
call npx prisma migrate reset --force --skip-seed

if errorlevel 1 (
  echo ERROR: Failed to reset database
  exit /b 1
)

echo.
echo Step 2: Generating Prisma Client...
echo ----------------------------------------------
call npx prisma generate

if errorlevel 1 (
  echo ERROR: Failed to generate Prisma Client
  exit /b 1
)

echo.
echo Step 3: Seeding database with test data...
echo ----------------------------------------------
call npx prisma db seed

if errorlevel 1 (
  echo ERROR: Failed to seed database
  exit /b 1
)

echo.
echo ==========================================
echo Database reset completed successfully!
echo ==========================================
echo.
echo Test Credentials:
echo   Admin:    admin@unifiedhealth.com / Admin123!
echo   Provider: dr.smith@unifiedhealth.com / Provider123!
echo   Patient:  john.doe@example.com / Patient123!
echo.

pause
