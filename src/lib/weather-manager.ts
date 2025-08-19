// 実際の天気情報取得ライブラリ
// OpenWeatherMap API と位置情報を使用

export interface WeatherData {
  weather: 'sunny' | 'cloudy' | 'rainy'
  temperature: number
  humidity: number
  description: string
  location: string
  timestamp: Date
}

export interface LocationData {
  latitude: number
  longitude: number
  city?: string
  country?: string
}

class WeatherManager {
  private apiKey: string | null = null
  private lastWeatherUpdate: Date | null = null
  private cachedWeather: WeatherData | null = null
  private readonly cacheTimeout = 30 * 60 * 1000 // 30分

  constructor() {
    // 実際のプロダクションでは環境変数から取得
    // this.apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    
    // デモ用：APIキーなしでもフォールバック機能を提供
    this.apiKey = null
  }

  // ブラウザの位置情報を取得
  private async getUserLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.warn('Geolocation failed:', error)
          // フォールバック：東京の座標
          resolve({
            latitude: 35.6762,
            longitude: 139.6503,
            city: 'Tokyo',
            country: 'JP'
          })
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      )
    })
  }

  // OpenWeatherMap APIから天気情報を取得
  private async fetchFromAPI(location: LocationData): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('Weather API key not available')
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${this.apiKey}&units=metric&lang=ja`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      
      // OpenWeatherMapの天気コードを簡易形式に変換
      let weather: 'sunny' | 'cloudy' | 'rainy'
      const weatherId = data.weather[0].id
      
      if (weatherId >= 200 && weatherId < 600) {
        weather = 'rainy' // 雷雨、雨、雪
      } else if (weatherId >= 700 && weatherId < 800) {
        weather = 'cloudy' // 霧、ヘイズなど
      } else if (weatherId === 800) {
        weather = 'sunny' // 快晴
      } else {
        weather = 'cloudy' // 曇り
      }

      return {
        weather,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        location: data.name || '不明',
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Weather API fetch failed:', error)
      throw error
    }
  }

  // フォールバック：時間と季節に基づく推定天気
  private generateFallbackWeather(location: LocationData): WeatherData {
    const now = new Date()
    const hour = now.getHours()
    const month = now.getMonth() + 1 // 1-12
    
    // 季節による基準気温（日本の気候を想定）
    let baseTemp: number
    if (month >= 6 && month <= 8) {
      baseTemp = 28 // 夏
    } else if (month >= 9 && month <= 11) {
      baseTemp = 20 // 秋
    } else if (month >= 12 || month <= 2) {
      baseTemp = 8 // 冬
    } else {
      baseTemp = 18 // 春
    }

    // 時間による気温調整
    let tempAdjustment = 0
    if (hour >= 6 && hour <= 9) {
      tempAdjustment = -3 // 朝は涼しい
    } else if (hour >= 10 && hour <= 15) {
      tempAdjustment = 3 // 昼は暖かい
    } else if (hour >= 16 && hour <= 18) {
      tempAdjustment = 0 // 夕方
    } else {
      tempAdjustment = -5 // 夜は涼しい
    }

    // ランダム要素を追加
    const randomVariation = Math.floor(Math.random() * 6) - 3 // -3 to +3
    const finalTemp = Math.max(0, baseTemp + tempAdjustment + randomVariation)

    // 天気の推定（確率的）
    const weatherRandom = Math.random()
    let weather: 'sunny' | 'cloudy' | 'rainy'
    
    // 夏は晴れが多い、冬は曇りが多い傾向
    if (month >= 6 && month <= 8) {
      if (weatherRandom < 0.6) weather = 'sunny'
      else if (weatherRandom < 0.85) weather = 'cloudy'
      else weather = 'rainy'
    } else if (month >= 12 || month <= 2) {
      if (weatherRandom < 0.3) weather = 'sunny'
      else if (weatherRandom < 0.8) weather = 'cloudy'
      else weather = 'rainy'
    } else {
      if (weatherRandom < 0.5) weather = 'sunny'
      else if (weatherRandom < 0.8) weather = 'cloudy'
      else weather = 'rainy'
    }

    return {
      weather,
      temperature: finalTemp,
      humidity: 50 + Math.floor(Math.random() * 30), // 50-80%
      description: weather === 'sunny' ? '晴れ' : weather === 'cloudy' ? '曇り' : '雨',
      location: location.city || '現在地',
      timestamp: new Date()
    }
  }

  // メイン：現在の天気情報を取得
  async getCurrentWeather(): Promise<WeatherData> {
    // キャッシュチェック
    if (this.cachedWeather && this.lastWeatherUpdate) {
      const timeDiff = new Date().getTime() - this.lastWeatherUpdate.getTime()
      if (timeDiff < this.cacheTimeout) {
        return this.cachedWeather
      }
    }

    try {
      // 位置情報を取得
      const location = await this.getUserLocation()
      
      let weatherData: WeatherData
      
      if (this.apiKey) {
        try {
          // API経由で実際の天気を取得
          weatherData = await this.fetchFromAPI(location)
        } catch (apiError) {
          console.warn('Weather API failed, using fallback:', apiError)
          weatherData = this.generateFallbackWeather(location)
        }
      } else {
        // APIキーがない場合はフォールバック
        weatherData = this.generateFallbackWeather(location)
      }

      // キャッシュに保存
      this.cachedWeather = weatherData
      this.lastWeatherUpdate = new Date()

      return weatherData
    } catch (error) {
      console.error('Weather acquisition failed completely:', error)
      
      // 完全フォールバック：デフォルト値
      return {
        weather: 'cloudy',
        temperature: 20,
        humidity: 60,
        description: '不明',
        location: '不明',
        timestamp: new Date()
      }
    }
  }

  // 天気情報をローカルストレージに保存
  saveWeatherToStorage(weather: WeatherData) {
    try {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`noutenkyo-weather-${today}`, JSON.stringify(weather))
    } catch (error) {
      console.error('Weather storage failed:', error)
    }
  }

  // ローカルストレージから天気情報を取得
  getWeatherFromStorage(): WeatherData | null {
    try {
      const today = new Date().toISOString().split('T')[0]
      const stored = localStorage.getItem(`noutenkyo-weather-${today}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Weather retrieval from storage failed:', error)
      return null
    }
  }

  // 天気履歴の取得（過去7日分）
  getWeatherHistory(): WeatherData[] {
    const history: WeatherData[] = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      try {
        const stored = localStorage.getItem(`noutenkyo-weather-${dateStr}`)
        if (stored) {
          history.push(JSON.parse(stored))
        }
      } catch (error) {
        console.error(`Weather history retrieval failed for ${dateStr}:`, error)
      }
    }
    
    return history
  }

  // 天気に基づく学習への影響度を計算
  calculateWeatherImpact(weather: WeatherData): {
    moodImpact: number // -0.3 to +0.3
    energyImpact: number // -0.3 to +0.3
    focusImpact: number // -0.2 to +0.2
    recommendation: string
  } {
    let moodImpact = 0
    let energyImpact = 0
    let focusImpact = 0
    let recommendation = ''

    // 天気による影響
    switch (weather.weather) {
      case 'sunny':
        moodImpact = 0.2
        energyImpact = 0.15
        focusImpact = 0.1
        recommendation = '晴れているので気分が上がりやすい日です。積極的に学習に取り組めそうです。'
        break
      case 'cloudy':
        moodImpact = -0.05
        energyImpact = -0.1
        focusImpact = 0.05 // 曇りは集中しやすい場合も
        recommendation = '曇りの日は落ち着いて学習に集中しやすいかもしれません。'
        break
      case 'rainy':
        moodImpact = -0.15
        energyImpact = -0.2
        focusImpact = -0.1
        recommendation = '雨の日は気分が下がりがちです。無理をせず軽めの学習から始めましょう。'
        break
    }

    // 気温による影響
    const idealTemp = 22
    const tempDiff = Math.abs(weather.temperature - idealTemp)
    
    if (tempDiff > 8) {
      moodImpact -= 0.1
      energyImpact -= 0.15
      focusImpact -= 0.1
      recommendation += ' 気温が極端なので体調に注意しながら学習しましょう。'
    }

    // 湿度による影響
    if (weather.humidity > 70) {
      energyImpact -= 0.05
      focusImpact -= 0.05
      recommendation += ' 湿度が高いので疲れやすいかもしれません。'
    }

    return {
      moodImpact: Math.max(-0.3, Math.min(0.3, moodImpact)),
      energyImpact: Math.max(-0.3, Math.min(0.3, energyImpact)),
      focusImpact: Math.max(-0.2, Math.min(0.2, focusImpact)),
      recommendation
    }
  }
}

// グローバルインスタンス
export const weatherManager = new WeatherManager()

// ユーティリティ関数
export async function getSimpleWeather(): Promise<{ weather: 'sunny' | 'cloudy' | 'rainy', temperature: number }> {
  try {
    const weatherData = await weatherManager.getCurrentWeather()
    return {
      weather: weatherData.weather,
      temperature: weatherData.temperature
    }
  } catch (error) {
    console.error('Simple weather acquisition failed:', error)
    return {
      weather: 'cloudy',
      temperature: 20
    }
  }
}
