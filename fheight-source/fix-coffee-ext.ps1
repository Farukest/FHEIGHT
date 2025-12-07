$files = Get-ChildItem -Path "C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\server" -Recurse -Filter "*.coffee"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "\.coffee'") {
        $newContent = $content -replace "\.coffee'", "'"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Fixed single quotes: $($file.Name)"
    }
}
