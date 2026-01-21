@echo off
REM ####################################################
REM Database Backup Script (Windows)
REM Unified Health Platform
REM ####################################################

setlocal enabledelayedexpansion

REM Load environment variables
if exist .env (
  for /f "tokens=*" %%a in (.env) do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" (
      set "%%a"
    )
  )
)

REM Configuration
set BACKUP_ROOT_DIR=%BACKUP_DIR%
if "%BACKUP_ROOT_DIR%"=="" set BACKUP_ROOT_DIR=C:\backups\postgresql

set TIMESTAMP=%date:~-4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=%BACKUP_ROOT_DIR%\%TIMESTAMP%
set LOG_FILE=%BACKUP_ROOT_DIR%\backup.log

REM Database configuration
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=5432
if "%DB_NAME%"=="" set DB_NAME=healthcare_db
if "%DB_USER%"=="" set DB_USER=postgres

REM Backup type
set BACKUP_TYPE=%1
if "%BACKUP_TYPE%"=="" set BACKUP_TYPE=full

echo [%date% %time%] Starting database backup process >> %LOG_FILE%
echo Backup type: %BACKUP_TYPE%
echo ============================================

REM Create backup directory
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Check if pg_dump exists
where pg_dump >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: pg_dump not found. Please install PostgreSQL client tools.
  exit /b 1
)

REM Collect statistics
echo Collecting database statistics...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT pg_size_pretty(pg_database_size('%DB_NAME%'));" > "%BACKUP_DIR%\database_size.txt"
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;" > "%BACKUP_DIR%\table_sizes.txt"

REM Perform backup
echo Creating %BACKUP_TYPE% backup...
if "%BACKUP_TYPE%"=="full" (
  pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -Fc -v -f "%BACKUP_DIR%\full_backup.dump" 2>> %LOG_FILE%
) else if "%BACKUP_TYPE%"=="schema-only" (
  pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -Fc -v --schema-only -f "%BACKUP_DIR%\schema_backup.dump" 2>> %LOG_FILE%
) else if "%BACKUP_TYPE%"=="data-only" (
  pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -Fc -v --data-only -f "%BACKUP_DIR%\data_backup.dump" 2>> %LOG_FILE%
) else (
  echo ERROR: Invalid backup type. Use: full, schema-only, or data-only
  exit /b 1
)

if %errorlevel% neq 0 (
  echo ERROR: Backup failed
  exit /b 1
)

REM Create manifest
echo Creating backup manifest...
echo { > "%BACKUP_DIR%\manifest.json"
echo   "backup_timestamp": "%TIMESTAMP%", >> "%BACKUP_DIR%\manifest.json"
echo   "backup_type": "%BACKUP_TYPE%", >> "%BACKUP_DIR%\manifest.json"
echo   "database_name": "%DB_NAME%", >> "%BACKUP_DIR%\manifest.json"
echo   "database_host": "%DB_HOST%", >> "%BACKUP_DIR%\manifest.json"
echo   "created_by": "%USERNAME%" >> "%BACKUP_DIR%\manifest.json"
echo } >> "%BACKUP_DIR%\manifest.json"

echo ============================================
echo Backup completed successfully!
echo Backup location: %BACKUP_DIR%
echo ============================================

endlocal
