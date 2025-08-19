// 天気API統合システム
// OpenWeatherMap APIを使用した実際の天気データ取得

export interface WeatherData {
  location: string
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'
  description: string
  humidity: number
  pressure: number
  timestamp: string
  icon: string
}

export interface WeatherConfig {
  apiKey?: string
  defaultLocation: string
  units: 'metric' | 'imperial'
  language: string
}

// デフォルト設定
const DEFAULT_CONFIG: WeatherConfig = {
  defaultLocation: 'Tokyo,JP',
  units: 'metric',
  language: 'ja'
}

// OpenWeatherMap APIキーの設定
// 本番環境では環境変数から取得
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''

// 天気データのキャッシュ（5分間有効）
const CACHE_DURATION = 5 * 60 * 1000 // 5分
let weatherCache: { data: WeatherData | null, timestamp: number } = {
  data: null,
  timestamp: 0
}

// 天気状況を標準形式に変換
function normalizeWeatherCondition(openWeatherCondition: string, weatherId: number): WeatherData['condition'] {
  // OpenWeatherMap weather condition IDs
  // https://openweathermap.org/weather-conditions
  
  if (weatherId >= 200 && weatherId < 300) return 'stormy' // Thunderstorm
  if (weatherId >= 300 && weatherId < 600) return 'rainy'  // Drizzle & Rain
  if (weatherId >= 600 && weatherId < 700) return 'snowy'  // Snow
  if (weatherId >= 701 && weatherId < 800) return 'cloudy' // Atmosphere (fog, mist, etc.)
  if (weatherId === 800) return 'sunny'                    // Clear
  if (weatherId > 800) return 'cloudy'                     // Clouds
  
  return 'cloudy' // デフォルト
}

// 実際の天気データを取得
export async function fetchRealWeatherData(location?: string): Promise<WeatherData | null> {
  if (!API_KEY) {
    console.warn('OpenWeatherMap API key not configured. Using fallback weather data.')
    return getFallbackWeatherData()
  }

  // キャッシュチェック
  const now = Date.now()
  if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION) {
    return weatherCache.data
  }

  try {
    const targetLocation = location || DEFAULT_CONFIG.defaultLocation
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(targetLocation)}&appid=${API_KEY}&units=${DEFAULT_CONFIG.units}&lang=${DEFAULT_CONFIG.language}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    
    const weatherData: WeatherData = {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: normalizeWeatherCondition(data.weather[0].main, data.weather[0].id),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      timestamp: new Date().toISOString(),
      icon: data.weather[0].icon
    }

    // キャッシュに保存
    weatherCache = {
      data: weatherData,
      timestamp: now
    }

    return weatherData
  } catch (error) {
    console.error('Failed to fetch weather data:', error)
    return getFallbackWeatherData()
  }
}

// 位置情報ベースの天気取得
export async function fetchWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData | null> {
  if (!API_KEY) {
    return getFallbackWeatherData()
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${DEFAULT_CONFIG.units}&lang=${DEFAULT_CONFIG.language}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: normalizeWeatherCondition(data.weather[0].main, data.weather[0].id),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      timestamp: new Date().toISOString(),
      icon: data.weather[0].icon
    }
  } catch (error) {
    console.error('Failed to fetch weather data by coordinates:', error)
    return getFallbackWeatherData()
  }
}

// ユーザーの位置情報を取得
export function getUserLocation(): Promise<{ lat: number, lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    )
  })
}

// フォールバック天気データ（APIが利用できない場合）
function getFallbackWeatherData(): WeatherData {
  // 時間帯に基づく簡易的な天気推定
  const hour = new Date().getHours()
  let condition: WeatherData['condition'] = 'cloudy'
  
  if (hour >= 6 && hour <= 18) {
    condition = 'sunny'
  } else {
    condition = 'cloudy'
  }

  return {
    location: '東京',
    temperature: 20,
    condition,
    description: condition === 'sunny' ? '晴れ' : '曇り',
    humidity: 60,
    pressure: 1013,
    timestamp: new Date().toISOString(),
    icon: condition === 'sunny' ? '01d' : '02d'
  }
}

// 天気アイコンのURL生成
export function getWeatherIconUrl(iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`
}

// 天気に基づく学習効果の調整値を計算
export function getWeatherLearningImpact(weather: WeatherData): {
  energyImpact: number
  focusImpact: number
  moodImpact: number
  recommendation: string
} {
  switch (weather.condition) {
    case 'sunny':
      return {
        energyImpact: 0.15,  // +15%
        focusImpact: 0.1,    // +10%
        moodImpact: 0.2,     // +20%
        recommendation: '晴天で気分も上々！集中して学習に取り組めそうです。'
      }
    
    case 'cloudy':
      return {
        energyImpact: 0,     // 0%
        focusImpact: 0.05,   // +5%
        moodImpact: -0.05,   // -5%
        recommendation: '曇り空ですが、落ち着いて学習に集中できる環境です。'
      }
    
    case 'rainy':
      return {
        energyImpact: -0.1,  // -10%
        focusImpact: 0.15,   // +15% (雨音で集中しやすい人も)
        moodImpact: -0.1,    // -10%
        recommendation: '雨の日は室内での学習に集中しやすい環境です。リスニング学習もおすすめ。'
      }
    
    case 'stormy':
      return {
        energyImpact: -0.2,  // -20%
        focusImpact: -0.15,  // -15%
        moodImpact: -0.25,   // -25%
        recommendation: '嵐の日は無理をせず、軽めの学習や復習がおすすめです。'
      }
    
    case 'snowy':
      return {
        energyImpact: -0.05, // -5%
        focusImpact: 0.1,    // +10%
        moodImpact: 0.05,    // +5%
        recommendation: '雪の日は静かで集中しやすい環境。温かい飲み物と一緒に学習しましょう。'
      }
    
    default:
      return {
        energyImpact: 0,
        focusImpact: 0,
        moodImpact: 0,
        recommendation: '今日も学習を頑張りましょう！'
      }
  }
}

// 自動天気データ取得（位置情報 -> 都市名 -> フォールバック の順）
export async function getOptimalWeatherData(): Promise<WeatherData> {
  try {
    // 1. 位置情報ベースで取得を試す
    const coords = await getUserLocation()
    const locationWeather = await fetchWeatherByCoordinates(coords.lat, coords.lon)
    if (locationWeather) return locationWeather
  } catch (error) {
    console.log('Location-based weather failed, trying city name...')
  }

  try {
    // 2. デフォルト都市での取得を試す
    const cityWeather = await fetchRealWeatherData()
    if (cityWeather) return cityWeather
  } catch (error) {
    console.log('City-based weather failed, using fallback...')
  }

  // 3. フォールバックデータを返す
  return getFallbackWeatherData()
}
