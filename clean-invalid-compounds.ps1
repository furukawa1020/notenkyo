# 不正な複合語を削除するPowerShellスクリプト

$filePath = "src\lib\enhanced-vocabulary-database.ts"
$content = Get-Content $filePath -Encoding UTF8 -Raw

Write-Host "Original file size: $($content.Length) characters"

# 不正な複合語のパターンリスト（スペースを含む2語の組み合わせ）
$invalidPatterns = @(
    'schedule management',
    'manager system',
    'product strategy',
    'project theory',
    'adequate process',
    'administration management',
    'admire policy',
    'customer development',
    'product evaluation',
    'project policy',
    'adjust strategy',
    'meeting theory',
    'employee system',
    'achievement process',
    'adequate implementation',
    'adjust development',
    'administration strategy',
    'schedule theory',
    'office management',
    'adequate strategy',
    'admire policy',
    'company evaluation',
    'employee policy',
    'office theory',
    'adjust management',
    'administration policy',
    'admire implementation',
    'schedule process',
    'office policy',
    'product system',
    'service process',
    'admire strategy',
    'employee analysis',
    'customer process',
    'service system',
    'adequate policy',
    'adjust evaluation',
    'company development',
    'customer implementation',
    'accomplish analysis'
)

foreach ($pattern in $invalidPatterns) {
    # エントリ全体を削除する正規表現パターン
    $regexPattern = "  \{\r?\n\s*id: '[^']*',\r?\n\s*word: '$pattern',[^}]+\}\s*,?\r?\n"
    $oldLength = $content.Length
    $content = $content -replace $regexPattern, ''
    $newLength = $content.Length
    
    if ($oldLength -ne $newLength) {
        Write-Host "Removed entries for: $pattern (saved $($oldLength - $newLength) characters)"
    }
}

# ファイルに書き戻し
Set-Content $filePath $content -Encoding UTF8
Write-Host "Cleanup complete. New file size: $($content.Length) characters"
