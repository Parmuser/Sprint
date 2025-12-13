# Builds Java service images from repo root to ensure parent/module poms are available.
$services = @("eureka-server","User","restaurant-service","order-service","notification-service")
foreach ($s in $services) {
    $dockerfile = "./$s/Dockerfile"
    if (-not (Test-Path $dockerfile)) {
        Write-Host "Dockerfile not found for $s at $dockerfile" -ForegroundColor Yellow
        continue
    }
    Write-Host "Building $s from repo root..." -ForegroundColor Cyan
    docker build --progress=plain -f $dockerfile -t "local/$s:latest" .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed for $s. Check output above." -ForegroundColor Red
        break
    }
}
Write-Host "Done. If builds succeeded, run: docker compose up -d zookeeper kafka redis user-postgres restaurant-postgres order-postgres payment-postgres eureka-server" -ForegroundColor Green
