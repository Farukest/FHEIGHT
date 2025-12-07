Get-ChildItem -Path "C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\server" -Recurse -Filter "*.coffee" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "logger\.coffee") {
        $newContent = $content -replace "logger\.coffee", "logger"
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Fixed: $($_.FullName)"
    }
}
