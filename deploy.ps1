# 🚀 Script de Deploy para Mistatas - Agenda Empresarial
# Ejecuta este script para hacer deploy de cambios a GitHub Pages

Write-Host "🚀 Iniciando deploy de Mistatas - Agenda Empresarial..." -ForegroundColor Green

# Verificar que estamos en la rama main
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "❌ Error: Debes estar en la rama 'main' para hacer deploy" -ForegroundColor Red
    exit 1
}

# Verificar que no hay cambios sin commit
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Hay cambios sin commit. Commiteando automáticamente..." -ForegroundColor Yellow
    
    # Mostrar los archivos modificados
    Write-Host "📝 Archivos modificados:" -ForegroundColor Cyan
    git status --short
    
    # Pedir mensaje de commit
    $commitMessage = Read-Host "💬 Ingresa el mensaje del commit"
    if (-not $commitMessage) {
        $commitMessage = "📦 Actualización automática - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    # Hacer commit
    git add .
    git commit -m $commitMessage
}

# Hacer push
Write-Host "📤 Subiendo cambios a GitHub..." -ForegroundColor Blue
git push origin main

Write-Host "✅ Deploy iniciado! El sitio estará disponible en unos minutos en:" -ForegroundColor Green
Write-Host "🌐 https://robertomistatas.github.io/agenda" -ForegroundColor Cyan
Write-Host "📊 Puedes ver el progreso en: https://github.com/robertomistatas/agenda/actions" -ForegroundColor Cyan

Write-Host "🎉 ¡Deploy completado!" -ForegroundColor Green
