Get-ChildItem -Path "C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\server" -Recurse -Filter "*.js" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "require\(['\`"].*\.coffee['\`"]\)") {
        $newContent = $content -replace "\.coffee(['\`"]\))", '$1'
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Fixed: $($_.FullName)"
    }
}
