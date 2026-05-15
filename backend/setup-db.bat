@echo off
echo Configurando PostgreSQL para Giraffe Motors...

REM Verificar si PostgreSQL está instalado
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL no está instalado o no está en el PATH
    echo Descarga PostgreSQL desde: https://www.postgresql.org/download/
    pause
    exit /b 1
)

echo Estableciendo contraseña para usuario postgres...
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'dino13';" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: No se pudo conectar a PostgreSQL como usuario postgres
    echo Asegúrate de que PostgreSQL esté ejecutándose y que tengas permisos
    echo Puedes intentar ejecutar como administrador o cambiar la contraseña manualmente
    pause
    exit /b 1
)

echo Creando base de datos giraffe_db...
createdb -U postgres giraffe_db 2>nul
if %errorlevel% neq 0 (
    echo ERROR: No se pudo crear la base de datos
    echo Posiblemente ya existe o no tienes permisos
)

echo Ejecutando esquema de base de datos...
psql -U postgres -d giraffe_db -f database.sql 2>nul
if %errorlevel% neq 0 (
    echo ERROR: No se pudo ejecutar el esquema
    echo Verifica que el archivo database.sql existe
)

echo.
echo Configuración completada!
echo Ahora puedes ejecutar: npm run dev
echo.
pause