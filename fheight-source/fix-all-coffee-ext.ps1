# Fix all .coffee extension imports in the entire project
$paths = @(
    "C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\server",
    "C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\worker"
)

foreach ($path in $paths) {
    $files = Get-ChildItem -Path $path -Recurse -Include "*.coffee", "*.js" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match "\.coffee['\`"]") {
            $newContent = $content -replace "\.coffee'", "'"
            $newContent = $newContent -replace '\.coffee"', '"'
            if ($newContent -ne $content) {
                Set-Content -Path $file.FullName -Value $newContent -NoNewline
                Write-Host "Fixed: $($file.FullName)"
            }
        }
    }
}
