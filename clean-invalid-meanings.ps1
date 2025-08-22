# 不正な意味を持つエントリを削除するPowerShellスクリプト

$filePath = "src\lib\enhanced-vocabulary-database.ts"
$content = Get-Content $filePath -Encoding UTF8 -Raw

Write-Host "Original file size: $($content.Length) characters"

# 不正な意味を持つエントリを削除（「ない」「できる」「化」「〜」を含む意味）
$patterns = @(
    'meanings: \["ない"[^\]]*\]',
    'meanings: \["できる"[^\]]*\]',
    'meanings: \["化"[^\]]*\]',
    'meanings: \["〜"[^\]]*\]',
    'meanings: \[[^"]+"ない"[^\]]*\]',
    'meanings: \[[^"]+"できる"[^\]]*\]',
    'meanings: \[[^"]+"化"[^\]]*\]',
    'meanings: \[[^"]+"〜"[^\]]*\]'
)

foreach ($pattern in $patterns) {
    # マッチするエントリを見つけて、そのエントリ全体を削除
    $matches = [regex]::Matches($content, $pattern)
    Write-Host "Found $($matches.Count) matches for pattern: $pattern"
    
    # 各マッチに対してエントリ全体を削除
    foreach ($match in $matches) {
        $start = $match.Index
        # エントリの開始を遡って見つける
        $entryStart = $content.LastIndexOf('{', $start)
        if ($entryStart -ge 0) {
            # エントリの終了を見つける（次の},まで）
            $entryEnd = $content.IndexOf('},', $start)
            if ($entryEnd -lt 0) {
                $entryEnd = $content.IndexOf('}]', $start)
            }
            if ($entryEnd -ge 0) {
                $entryEnd += 2  # '},'.Length
                # エントリ全体を削除
                $entryText = $content.Substring($entryStart, $entryEnd - $entryStart)
                $content = $content.Replace($entryText, "")
            }
        }
    }
}

# ファイルに書き戻し
Set-Content $filePath $content -Encoding UTF8
Write-Host "Cleanup complete. New file size: $($content.Length) characters"
