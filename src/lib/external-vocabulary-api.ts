// 外部API連携による語彙データ取得
// コンテスト用フォールバック戦略

import { VocabularyEntry } from './toeic-core-vocabulary'

export interface ExternalVocabularyAPI {
  getWord(word: string): Promise<VocabularyEntry>
  getRandomWords(count: number, level: string): Promise<VocabularyEntry[]>
}

// フリー辞書API利用
export class DictionaryAPIClient implements ExternalVocabularyAPI {
  private baseURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
  
  async getWord(word: string): Promise<VocabularyEntry> {
    try {
      const response = await fetch(`${this.baseURL}${word}`)
      const data = await response.json()
      
      if (response.ok && data[0]) {
        return this.transformTOEICFormat(data[0])
      }
      
      // フォールバック：ローカル辞書
      return this.getLocalFallback(word)
    } catch (error) {
      console.warn(`API failed for ${word}, using local fallback`)
      return this.getLocalFallback(word)
    }
  }
  
  private transformTOEICFormat(apiData: any): VocabularyEntry {
    return {
      word: apiData.word,
      pronunciation: apiData.phonetics?.[0]?.text || '',
      meanings: apiData.meanings?.map((m: any) => 
        m.definitions?.[0]?.definition || ''
      ).slice(0, 3) || [],
      level: this.guessLevel(apiData.word),
      frequency: 50, // デフォルト値
      partOfSpeech: apiData.meanings?.map((m: any) => m.partOfSpeech) || [],
      exampleSentences: apiData.meanings?.[0]?.definitions?.[0]?.example ? 
        [apiData.meanings[0].definitions[0].example] : [],
      synonyms: [],
      antonyms: [],
      toeicPart: ['Part5'] // デフォルト
    }
  }
  
  private guessLevel(word: string): 'basic' | 'intermediate' | 'advanced' | 'expert' {
    if (word.length <= 4) return 'basic'
    if (word.length <= 7) return 'intermediate'
    if (word.length <= 10) return 'advanced'
    return 'expert'
  }
  
  public getLocalFallback(word: string): VocabularyEntry {
    // 最低限の辞書データ
    const fallbackDict: Record<string, Partial<VocabularyEntry>> = {
      'account': { meanings: ['口座', '説明'], level: 'basic' },
      'achieve': { meanings: ['達成する'], level: 'basic' },
      'advantage': { meanings: ['利点', 'メリット'], level: 'basic' },
      // ... 頻出語のみ手動で追加
    }
    
    return {
      word,
      pronunciation: '',
      meanings: fallbackDict[word]?.meanings || ['定義を確認中'],
      level: fallbackDict[word]?.level || 'intermediate',
      frequency: 50,
      partOfSpeech: ['unknown'],
      exampleSentences: [],
      synonyms: [],
      antonyms: [],
      toeicPart: ['Part5']
    }
  }
  
  async getRandomWords(count: number, level: string): Promise<VocabularyEntry[]> {
    // 事前定義された単語リストからランダム選択
    const wordLists = {
      basic: ['account', 'achieve', 'advantage', 'annual', 'apply'],
      intermediate: ['agenda', 'approach', 'appropriate', 'arrange'],
      advanced: ['accommodate', 'accompany', 'accomplish'],
      expert: ['meticulous', 'exacerbate', 'ubiquitous']
    }
    
    const words = wordLists[level as keyof typeof wordLists] || wordLists.basic
    const selectedWords = words.slice(0, count)
    
    return Promise.all(selectedWords.map(word => this.getWord(word)))
  }
}

// コンテスト用の安全な語彙システム
export const createContestVocabularySystem = () => {
  const apiClient = new DictionaryAPIClient()
  
  return {
    // オフライン対応
    isOnline: navigator.onLine,
    
    // 語彙取得（API + フォールバック）
    async getVocabulary(word: string) {
      if (this.isOnline) {
        return await apiClient.getWord(word)
      } else {
        return apiClient.getLocalFallback(word)
      }
    },
    
    // レッスン用語彙セット
    async getLessonWords(level: string, count: number = 10) {
      return await apiClient.getRandomWords(count, level)
    }
  }
}
