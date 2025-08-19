# のうてんきょ 天気システム改良 - 実装ガイド

## 🌤️ 改良内容

### 1. **実際の天気API統合**
- **WeatherManager**: 実際のOpenWeatherMap APIを使用
- **位置情報取得**: ブラウザのGeolocation APIで現在地を特定
- **フォールバック機能**: APIエラー時は時間・季節ベースの推定天気

### 2. **高度な天気影響計算**
```typescript
// 天気による学習能力への影響
weatherImpact = {
  moodImpact: -0.3 to +0.3    // 気分への影響
  energyImpact: -0.3 to +0.3   // エネルギーレベルへの影響  
  focusImpact: -0.2 to +0.2    // 集中力への影響
}
```

### 3. **詳細な天気表示**
- **現在地表示**: 市区町村名
- **詳細説明**: 天気APIからの説明文
- **学習影響説明**: ADHD・うつ配慮の推奨メッセージ
- **リアルタイム更新**: 30分間隔でキャッシュ更新

## 📋 セットアップ手順

### 1. **OpenWeatherMap APIキー取得**
1. [OpenWeatherMap](https://openweathermap.org/api) に登録
2. 無料プランでAPI key取得
3. `.env.local` に設定：
```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### 2. **天気システムの動作**
```typescript
// 使用例
import { weatherManager } from '@/lib/weather-manager'

// 現在の天気取得
const weather = await weatherManager.getCurrentWeather()
// 結果: { weather: 'sunny', temperature: 22, location: '渋谷区', ... }

// 天気による影響度計算
const impact = weatherManager.calculateWeatherImpact(weather)
// 結果: { moodImpact: 0.2, energyImpact: 0.15, focusImpact: 0.1 }
```

## 🧠 ADHD・うつ配慮機能

### 1. **天気による学習調整**
- **晴れの日** → 積極的学習推奨（mood+20%, energy+15%）
- **曇りの日** → 集中しやすい環境（focus+5%）
- **雨の日** → 軽負荷学習推奨（mood-15%, energy-20%）

### 2. **気温による体調配慮**
- **理想気温**: 22°C
- **極端な気温**: 体調・集中力への負の影響を考慮
- **湿度考慮**: 70%以上で疲労感増加

### 3. **のうてんきょスコアへの反映**
```typescript
// 改良されたスコア計算
adjustedMood = mood + (weatherImpact.moodImpact * 5)
adjustedEnergy = energy + (weatherImpact.energyImpact * 5)
adjustedFocus = focus + (weatherImpact.focusImpact * 5)

finalScore = (adjustedMood * 0.25 + adjustedEnergy * 0.25 + 
             adjustedFocus * 0.20 + anxiety * 0.15 + 
             sleep * 0.15) * 20
```

## 🔧 技術的詳細

### 1. **WeatherManager クラス**
- **キャッシュ機能**: 30分間のデータ保持
- **エラーハンドリング**: API失敗時の適切なフォールバック
- **ローカルストレージ**: 天気履歴の7日間保持
- **位置情報**: Geolocation API使用、フォールバック対応

### 2. **データ構造**
```typescript
interface WeatherData {
  weather: 'sunny' | 'cloudy' | 'rainy'
  temperature: number
  humidity: number
  description: string
  location: string
  timestamp: Date
}
```

### 3. **フォールバック機能**
- **APIキーなし**: 時間・季節ベースの推定
- **位置情報拒否**: 東京の座標を使用
- **ネットワークエラー**: ローカルキャッシュまたはデフォルト値

## 🎯 使用効果

### 1. **精度向上**
- 実際の天気データによる正確な学習調整
- 地域特有の気象条件を反映
- ADHD・うつ症状との相関を考慮

### 2. **ユーザー体験**
- 透明性の高い天気情報表示
- 学習への影響を分かりやすく説明
- 無理のない学習負荷調整

### 3. **プライバシー配慮**
- 位置情報は一時的使用のみ
- 天気データのローカル保存
- API使用の透明性確保

## 📊 今後の拡張予定

1. **天気予報統合**: 明日の天気で学習計画調整
2. **季節性うつ対応**: 日照時間データの活用
3. **気圧データ**: 頭痛・体調不良との相関分析
4. **地域別調整**: 気候による学習パターン最適化

---

**注意**: APIキーが設定されていない場合も、フォールバック機能により天気システムは正常に動作します。より正確な天気データが必要な場合のみ、OpenWeatherMap APIキーを設定してください。
