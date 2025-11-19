# Start both server and client in separate windows
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; Write-Host 'Starting Server...' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; Write-Host 'Starting Client...' -ForegroundColor Cyan; npm run dev"
Write-Host "Both servers are starting in separate windows..." -ForegroundColor Yellow
Write-Host "Server: http://localhost:5000" -ForegroundColor Green
Write-Host "Client: http://localhost:5173" -ForegroundColor Cyan

