// TOEIC問題生成エンジン
// のうてんきょ専用の問題生成ロジック

export interface QuestionBase {
  id: string
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading'
  part: number // TOEIC Part 1-7
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number // 正解のインデックス (0-3)
  explanation: string
  audio?: string // リスニング問題用の音声URL
  tags: string[]
  estimatedTime: number // 推定解答時間（秒）
}

export interface VocabularyQuestion extends QuestionBase {
  type: 'vocabulary'
  word: string
  pronunciation: string
  partOfSpeech: string
  exampleSentence: string
}

export interface GrammarQuestion extends QuestionBase {
  type: 'grammar'
  grammarPoint: string
  rule: string
}

export interface ListeningQuestion extends QuestionBase {
  type: 'listening'
  part: 1 | 2 | 3 | 4
  audio: string
  transcript?: string // スクリプト（答え合わせ用）
}

export interface ReadingQuestion extends QuestionBase {
  type: 'reading'
  part: 5 | 6 | 7
  passage?: string // Part 7用の文章
}

// TOEIC頻出単語データベース（金フレ相当）
const TOEIC_VOCABULARY = [
  {
    word: 'accomplish',
    pronunciation: '/əˈkʌmplɪʃ/',
    meaning: '達成する、成し遂げる',
    partOfSpeech: 'verb',
    level: 600,
    frequency: 85,
    synonyms: ['achieve', 'complete', 'finish'],
    exampleSentences: [
      'We accomplished our goal ahead of schedule.',
      'The team accomplished remarkable results this quarter.',
      'She accomplished her mission successfully.'
    ]
  },
  {
    word: 'acquire',
    pronunciation: '/əˈkwaɪər/',
    meaning: '獲得する、習得する',
    partOfSpeech: 'verb',
    level: 700,
    frequency: 78,
    synonyms: ['obtain', 'gain', 'get'],
    exampleSentences: [
      'The company plans to acquire new technology.',
      'He acquired valuable skills through experience.',
      'We need to acquire more data before making a decision.'
    ]
  },
  {
    word: 'adequate',
    pronunciation: '/ˈædɪkwət/',
    meaning: '適切な、十分な',
    partOfSpeech: 'adjective',
    level: 650,
    frequency: 72,
    synonyms: ['sufficient', 'satisfactory', 'enough'],
    exampleSentences: [
      'The funding is adequate for this project.',
      'Please ensure adequate ventilation in the room.',
      'We have adequate resources to complete the task.'
    ]
  },
  {
    word: 'administrative',
    pronunciation: '/ədˈmɪnɪstrətɪv/',
    meaning: '管理の、行政の',
    partOfSpeech: 'adjective',
    level: 700,
    frequency: 69,
    synonyms: ['managerial', 'executive', 'bureaucratic'],
    exampleSentences: [
      'She handles all administrative duties.',
      'The administrative staff will assist you.',
      'Administrative procedures must be followed.'
    ]
  },
  {
    word: 'agenda',
    pronunciation: '/əˈdʒendə/',
    meaning: '議題、予定表',
    partOfSpeech: 'noun',
    level: 650,
    frequency: 75,
    synonyms: ['schedule', 'program', 'plan'],
    exampleSentences: [
      'Please review the meeting agenda.',
      'The agenda includes three main topics.',
      'We need to add this item to the agenda.'
    ]
  }
  // ... さらに1000語以上のデータベース
]

// 文法問題のテンプレート
const GRAMMAR_PATTERNS = [
  {
    id: 'present-perfect',
    name: '現在完了',
    rule: 'have/has + 過去分詞で「経験・完了・継続」を表す',
    difficulty: 'medium',
    templates: [
      {
        question: 'I _____ never _____ to New York before.',
        options: ['have / been', 'had / been', 'will / be', 'am / being'],
        correct: 0,
        explanation: '経験を表す現在完了形。"never"があるので"have never been"が正解。'
      }
    ]
  },
  {
    id: 'passive-voice',
    name: '受動態',
    rule: 'be動詞 + 過去分詞で「〜される」を表す',
    difficulty: 'medium',
    templates: [
      {
        question: 'The report _____ by the manager yesterday.',
        options: ['was completed', 'completed', 'has completed', 'will complete'],
        correct: 0,
        explanation: '受動態の過去形。"yesterday"があるので過去の受動態"was completed"が正解。'
      }
    ]
  }
]

// リスニング問題のテンプレート
const LISTENING_SCENARIOS = [
  {
    part: 1,
    type: 'photo-description',
    scenarios: [
      {
        image: 'office_meeting',
        correctDescription: 'People are sitting around a conference table.',
        distractors: [
          'People are standing in a line.',
          'People are walking through a corridor.',
          'People are working at individual desks.'
        ]
      }
    ]
  },
  {
    part: 2,
    type: 'question-response',
    scenarios: [
      {
        question: 'When is the deadline for the project?',
        correctResponse: 'It\'s due next Friday.',
        distractors: [
          'The project manager will decide.',
          'In the conference room.',
          'Yes, it\'s very important.'
        ]
      }
    ]
  }
]

// 問題生成メイン関数
export class TOEICQuestionGenerator {
  
  // 単語問題を生成
  static generateVocabularyQuestion(
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    focusWord?: string
  ): VocabularyQuestion {
    const targetLevel = difficulty === 'easy' ? 600 : difficulty === 'medium' ? 700 : 800
    const availableWords = TOEIC_VOCABULARY.filter(word => 
      Math.abs(word.level - targetLevel) <= 100
    )
    
    const selectedWord = focusWord 
      ? TOEIC_VOCABULARY.find(w => w.word === focusWord)
      : availableWords[Math.floor(Math.random() * availableWords.length)]
    
    if (!selectedWord) throw new Error('Word not found')
    
    // 選択肢を生成（正解 + 似たような意味の間違い選択肢）
    const distractors = TOEIC_VOCABULARY
      .filter(w => w.word !== selectedWord.word && w.partOfSpeech === selectedWord.partOfSpeech)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning)
    
    const options = [selectedWord.meaning, ...distractors].sort(() => Math.random() - 0.5)
    const correctAnswer = options.indexOf(selectedWord.meaning)
    
    return {
      id: `vocab_${selectedWord.word}_${Date.now()}`,
      type: 'vocabulary',
      part: 5, // 語彙問題はPart 5として扱う
      difficulty,
      question: `Choose the best meaning for "${selectedWord.word}".`,
      options,
      correctAnswer,
      explanation: `"${selectedWord.word}" means "${selectedWord.meaning}". Pronunciation: ${selectedWord.pronunciation}`,
      word: selectedWord.word,
      pronunciation: selectedWord.pronunciation,
      partOfSpeech: selectedWord.partOfSpeech,
      exampleSentence: selectedWord.exampleSentences[0],
      tags: ['vocabulary', selectedWord.partOfSpeech, `level-${selectedWord.level}`],
      estimatedTime: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 30
    }
  }

  // 文法問題を生成
  static generateGrammarQuestion(
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    grammarPoint?: string
  ): GrammarQuestion {
    const availablePatterns = GRAMMAR_PATTERNS.filter(pattern => 
      !grammarPoint || pattern.id === grammarPoint
    )
    
    const selectedPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)]
    const template = selectedPattern.templates[Math.floor(Math.random() * selectedPattern.templates.length)]
    
    return {
      id: `grammar_${selectedPattern.id}_${Date.now()}`,
      type: 'grammar',
      part: 5,
      difficulty,
      question: template.question,
      options: template.options,
      correctAnswer: template.correct,
      explanation: template.explanation,
      grammarPoint: selectedPattern.name,
      rule: selectedPattern.rule,
      tags: ['grammar', selectedPattern.id, `part-5`],
      estimatedTime: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 45
    }
  }

  // リスニング問題を生成
  static generateListeningQuestion(
    part: 1 | 2 | 3 | 4,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): ListeningQuestion {
    const scenarios = LISTENING_SCENARIOS.filter(s => s.part === part)
    if (scenarios.length === 0) {
      throw new Error(`No scenarios available for Part ${part}`)
    }
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    const content = scenario.scenarios[Math.floor(Math.random() * scenario.scenarios.length)]
    
    let question: string
    let options: string[]
    let correctAnswer: number
    
    if (part === 1 && 'correctDescription' in content) {
      question = 'What is happening in the picture?'
      options = [content.correctDescription, ...content.distractors].sort(() => Math.random() - 0.5)
      correctAnswer = options.indexOf(content.correctDescription)
    } else if (part === 2 && 'correctResponse' in content) {
      question = content.question
      options = [content.correctResponse, ...content.distractors].sort(() => Math.random() - 0.5)
      correctAnswer = options.indexOf(content.correctResponse)
    } else {
      // Part 3, 4用の問題生成（簡易版）
      question = 'What is the main topic of the conversation?'
      options = ['Business meeting', 'Travel plans', 'Restaurant reservation', 'Job interview']
      correctAnswer = 0
    }
    
    return {
      id: `listening_part${part}_${Date.now()}`,
      type: 'listening',
      part,
      difficulty,
      question,
      options,
      correctAnswer,
      explanation: `This is a Part ${part} listening question. The correct answer demonstrates understanding of the audio content.`,
      audio: `/audio/part${part}/sample_${Math.floor(Math.random() * 10) + 1}.mp3`,
      tags: ['listening', `part-${part}`, scenario.type],
      estimatedTime: part === 1 ? 10 : part === 2 ? 8 : 30
    }
  }

  // のうてんきょスコアに基づく問題セット生成
  static generateQuestionSet(
    noutenkyoScore: number,
    requestedTypes: ('vocabulary' | 'grammar' | 'listening' | 'reading')[],
    count: number = 10
  ) {
    const difficulty = noutenkyoScore >= 80 ? 'hard' : noutenkyoScore >= 50 ? 'medium' : 'easy'
    const questions: QuestionBase[] = []
    
    for (let i = 0; i < count; i++) {
      const type = requestedTypes[i % requestedTypes.length]
      
      try {
        let question: QuestionBase
        
        switch (type) {
          case 'vocabulary':
            question = this.generateVocabularyQuestion(difficulty)
            break
          case 'grammar':
            question = this.generateGrammarQuestion(difficulty)
            break
          case 'listening':
            const part = Math.floor(Math.random() * 4) + 1 as 1 | 2 | 3 | 4
            question = this.generateListeningQuestion(part, difficulty)
            break
          default:
            question = this.generateVocabularyQuestion(difficulty)
        }
        
        questions.push(question)
      } catch (error) {
        console.error(`Error generating ${type} question:`, error)
        // フォールバック: 単語問題を生成
        questions.push(this.generateVocabularyQuestion(difficulty))
      }
    }
    
    return {
      questions,
      metadata: {
        difficulty,
        noutenkyoScore,
        estimatedTotalTime: questions.reduce((sum, q) => sum + q.estimatedTime, 0),
        generatedAt: new Date().toISOString()
      }
    }
  }

  // ADHD対応: 短時間集中型問題セット
  static generateADHDFriendlySet(noutenkyoScore: number, maxTime: number = 300) {
    const difficulty = noutenkyoScore >= 70 ? 'medium' : 'easy'
    const questions: QuestionBase[] = []
    let totalTime = 0
    
    // 時間制限内でできるだけ多くの問題を生成
    while (totalTime < maxTime) {
      const remainingTime = maxTime - totalTime
      let question: QuestionBase
      
      if (remainingTime < 30) {
        // 残り時間が少ない場合は簡単な単語問題
        question = this.generateVocabularyQuestion('easy')
      } else if (remainingTime < 60) {
        // 中程度の時間がある場合
        question = Math.random() > 0.5 
          ? this.generateVocabularyQuestion(difficulty)
          : this.generateGrammarQuestion('easy')
      } else {
        // 十分時間がある場合はバランス良く
        const types: ('vocabulary' | 'grammar')[] = ['vocabulary', 'grammar']
        const type = types[Math.floor(Math.random() * types.length)]
        question = type === 'vocabulary' 
          ? this.generateVocabularyQuestion(difficulty)
          : this.generateGrammarQuestion(difficulty)
      }
      
      if (totalTime + question.estimatedTime <= maxTime) {
        questions.push(question)
        totalTime += question.estimatedTime
      } else {
        break
      }
    }
    
    return {
      questions,
      metadata: {
        type: 'ADHD-friendly',
        difficulty,
        noutenkyoScore,
        totalTime,
        maxTime,
        questionCount: questions.length,
        generatedAt: new Date().toISOString()
      }
    }
  }
}
