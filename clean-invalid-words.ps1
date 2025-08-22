# 不正な造語を削除するPowerShellスクリプト

$filePath = "src\lib\enhanced-vocabulary-database.ts"
$content = Get-Content $filePath -Encoding UTF8 -Raw

Write-Host "Original file size: $($content.Length) characters"

# 不正な造語のパターンリスト
$invalidWords = @(
    'sustainabilityless',
    'accordinglyable',
    'accountabilityless',
    'productivityable',
    'managementless',
    'strategyfull',
    'analysisable',
    'evaluationless',
    'implementationable',
    'developmentless',
    'assessmentable',
    'achievementless',
    'improvementable',
    'administrationless'
)

foreach ($word in $invalidWords) {
    # エントリ全体を削除する正規表現パターン
    $regexPattern = "  \{\r?\n\s*id: '[^']*',\r?\n\s*word: '$word',[^}]+\}\s*,?\r?\n"
    $oldLength = $content.Length
    $content = $content -replace $regexPattern, ''
    $newLength = $content.Length
    
    if ($oldLength -ne $newLength) {
        Write-Host "Removed entry for: $word (saved $($oldLength - $newLength) characters)"
    }
}

# ファイルに書き戻し
Set-Content $filePath $content -Encoding UTF8
Write-Host "Cleanup complete. New file size: $($content.Length) characters"
