# Script de démarrage propre pour Novauto dev server
# Usage: .\start-dev.ps1

Write-Host "🧹 Nettoyage des anciens processus Angular..." -ForegroundColor Yellow

# Arrêter tous les processus node qui tournent sur les ports Angular
$ports = @(4200, 63668, 65485, 52341)

foreach ($port in $ports) {
    $connections = netstat -ano | Select-String ":$port " | Select-String "LISTENING"

    if ($connections) {
        foreach ($line in $connections) {
            if ($line -match '\s+(\d+)\s*$') {
                $pid = $matches[1]
                Write-Host "  Arrêt du processus PID $pid sur port $port" -ForegroundColor Gray
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                } catch {
                    # Ignore errors
                }
            }
        }
    }
}

Start-Sleep -Seconds 2

Write-Host "✅ Ports libérés" -ForegroundColor Green
Write-Host ""

# Vérifier que le port 4200 est libre
$port4200 = netstat -ano | Select-String ":4200 " | Select-String "LISTENING"
if ($port4200) {
    Write-Host "❌ Port 4200 encore occupé! Veuillez fermer l'application manuellement." -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Démarrage du serveur Angular sur port 4200..." -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur
npm start

# Note: Le script se termine quand on arrête le serveur (Ctrl+C)
