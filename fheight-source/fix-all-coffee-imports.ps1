# Fix .coffee extension in require statements for both .coffee and .js files
Get-ChildItem -Path "C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\server" -Recurse -Include "*.coffee", "*.js" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -and $content -match "require.*\.coffee") {
        $newContent = $content -replace "\.coffee(['\`"]\))", '$1' -replace "\.coffee(['\`"]$)", '$1'
        if ($newContent -ne $content) {
            Set-Content -Path $_.FullName -Value $newContent -NoNewline
            Write-Host "Fixed: $($_.FullName)"
        }
    }
}
