$actionsPath = 'C:\Users\Farukest-Working\Desktop\PROJECT\FHEIGHT\fheight-source\app\sdk\actions'
$files = Get-ChildItem -Path $actionsPath -Filter '*.js' -File

$fixCount = 0
foreach ($file in $files) {
    # Skip base action.js
    if ($file.Name -eq 'action.js') { continue }

    $content = Get-Content -Path $file.FullName -Raw

    # Pattern: if (this.type == null) { this.type = ClassName.type; }
    # Replace with: this.type = ClassName.type;
    $pattern = 'if \(this\.type == null\) \{ (this\.type = \w+\.type;) \}'

    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, '$1'
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        $fixCount++
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "`nTotal files fixed: $fixCount"
