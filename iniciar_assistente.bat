@echo off
cd /d "%~dp0"
title Assistente Coder - Backend FastAPI
echo ========================================================
echo   Iniciando o Assistente Coder (FastAPI + Uvicorn)
echo ========================================================
echo Diretorio de Execucao: %CD%
echo.

echo Ativando ambiente Anaconda Python...
if exist "C:\Users\jorge\anaconda3\Scripts\activate.bat" (
    call "C:\Users\jorge\anaconda3\Scripts\activate.bat" "C:\Users\jorge\anaconda3"
) else (
    echo [AVISO] Atalho Anaconda nao encontrado no caminho padrao. Tentando uvicorn direto...
)

echo.
echo Verificando e liberando a porta 8000 (caso haja processo travado)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Encerrando processo antigo PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================================
echo   Servidor iniciando em: http://localhost:8000
echo   Pressione CTRL+C nesta janela para parar o servidor.
echo.
echo Abrindo o aplicativo no Chrome (http://localhost:8000)...
start "" chrome http://localhost:8000 2>nul || start "" http://localhost:8000

uvicorn app:app --reload --port 8000
pause

