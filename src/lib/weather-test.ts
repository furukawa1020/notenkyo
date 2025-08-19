// 天気システムのテスト用ファイル
import { weatherManager } from '@/lib/weather-manager'

export async function testWeatherSystem() {
  console.log('🌤️ Weather System Test Started')
  
  try {
    // 1. 天気データ取得テスト
    console.log('1. Fetching weather data...')
    const weather = await weatherManager.getCurrentWeather()
    console.log('Weather data:', {
      weather: weather.weather,
      temperature: weather.temperature,
      location: weather.location,
      description: weather.description,
      source: weather.timestamp ? 'Real/Fallback Data' : 'Error Fallback'
    })
    
    // 2. 天気影響計算テスト
    console.log('2. Testing weather impact calculation...')
    const impact = weatherManager.calculateWeatherImpact(weather)
    console.log('Weather impact:', impact)
    
    // 3. ローカルストレージテスト
    console.log('3. Testing local storage...')
    weatherManager.saveWeatherToStorage(weather)
    const stored = weatherManager.getWeatherFromStorage()
    console.log('Stored weather:', stored ? 'Successfully saved/retrieved' : 'Storage failed')
    
    // 4. 天気履歴テスト
    console.log('4. Testing weather history...')
    const history = weatherManager.getWeatherHistory()
    console.log('Weather history entries:', history.length)
    
    // 5. 各天気パターンでの影響度テスト
    console.log('5. Testing all weather patterns...')
    const weatherPatterns = ['sunny', 'cloudy', 'rainy'] as const
    const temperatures = [15, 22, 30] // 涼しい、理想、暑い
    
    weatherPatterns.forEach(weatherType => {
      temperatures.forEach(temp => {
        const testWeather = {
          weather: weatherType,
          temperature: temp,
          humidity: 60,
          description: 'Test',
          location: 'Test',
          timestamp: new Date()
        }
        const testImpact = weatherManager.calculateWeatherImpact(testWeather)
        console.log(`${weatherType} (${temp}°C):`, {
          mood: testImpact.moodImpact,
          energy: testImpact.energyImpact,
          focus: testImpact.focusImpact
        })
      })
    })
    
    console.log('✅ Weather System Test Completed Successfully')
    return true
    
  } catch (error) {
    console.error('❌ Weather System Test Failed:', error)
    return false
  }
}

// ブラウザコンソールで実行可能な関数
if (typeof window !== 'undefined') {
  (window as any).testWeatherSystem = testWeatherSystem
}
