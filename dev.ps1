# 🛠️ Script de Desarrollo para Mistatas - Agenda Empresarial
# Utilidades para desarrollo local

param(
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🛠️  Mistatas - Agenda Empresarial - Herramientas de Desarrollo" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Cyan
    Write-Host "  start         🚀 Inicia el servidor de desarrollo" -ForegroundColor White
    Write-Host "  build         🏗️  Construye la aplicación para producción" -ForegroundColor White
    Write-Host "  test          🧪 Ejecuta las pruebas" -ForegroundColor White
    Write-Host "  deploy        🚀 Despliega a GitHub Pages" -ForegroundColor White
    Write-Host "  clean         🧹 Limpia node_modules y reinstala dependencias" -ForegroundColor White
    Write-Host "  status        📊 Muestra el estado del repositorio Git" -ForegroundColor White
    Write-Host "  logs          📋 Muestra los últimos commits" -ForegroundColor White
    Write-Host "  help          ❓ Muestra esta ayuda" -ForegroundColor White
    Write-Host ""
    Write-Host "Uso: .\dev.ps1 <comando>" -ForegroundColor Yellow
    Write-Host "Ejemplo: .\dev.ps1 start" -ForegroundColor Yellow
}

function Start-Dev {
    Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green
    npm start
}

function Build-App {
    Write-Host "🏗️  Construyendo aplicación..." -ForegroundColor Blue
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completado exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en el build" -ForegroundColor Red
    }
}

function Test-App {
    Write-Host "🧪 Ejecutando pruebas..." -ForegroundColor Blue
    npm test
}

function Deploy-App {
    Write-Host "🚀 Iniciando deploy..." -ForegroundColor Green
    .\deploy.ps1
}

function Clean-Project {
    Write-Host "🧹 Limpiando proyecto..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item "node_modules" -Recurse -Force
        Write-Host "✅ node_modules eliminado" -ForegroundColor Green
    }
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -Force
        Write-Host "✅ package-lock.json eliminado" -ForegroundColor Green
    }
    Write-Host "📦 Reinstalando dependencias..." -ForegroundColor Blue
    npm install
    Write-Host "✅ Proyecto limpio y dependencias reinstaladas!" -ForegroundColor Green
}

function Show-Status {
    Write-Host "📊 Estado del repositorio Git:" -ForegroundColor Cyan
    git status
    Write-Host ""
    Write-Host "🌐 URL del repositorio: https://github.com/robertomistatas/agenda" -ForegroundColor Cyan
    Write-Host "🚀 URL de producción: https://robertomistatas.github.io/agenda" -ForegroundColor Cyan
}

function Show-Logs {
    Write-Host "📋 Últimos commits:" -ForegroundColor Cyan
    git log --oneline -10
}

switch ($Command) {
    "start" { Start-Dev }
    "build" { Build-App }
    "test" { Test-App }
    "deploy" { Deploy-App }
    "clean" { Clean-Project }
    "status" { Show-Status }
    "logs" { Show-Logs }
    "help" { Show-Help }
    default { 
        Write-Host "❌ Comando no reconocido: $Command" -ForegroundColor Red
        Show-Help 
    }
}
