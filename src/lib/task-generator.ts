import { UserState, Task } from './types'

// 問題の難易度レベル
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

// 学習タスクのテンプレート
interface TaskTemplate {
  id: string
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'workingmemory'
  difficulty: DifficultyLevel
  estimatedMinutes: number
  cognitiveLoad: number // 1-10の認知負荷
  title: string
  description: string
  requiredEnergy: number // 1-5の必要エネルギー
  requiredFocus: number // 1-5の必要集中力
  adaptiveFeatures: string[]
}

// 問題テンプレートデータベース
const TASK_TEMPLATES: TaskTemplate[] = [
  // 単語学習
  {
    id: 'vocab-basic',
    type: 'vocabulary',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    cognitiveLoad: 3,
    title: '基礎単語復習',
    description: 'TOEIC頻出単語500語から10語を復習',
    requiredEnergy: 2,
    requiredFocus: 2,
    adaptiveFeatures: ['SRS対応', '音声再生', '例文表示']
  },
  {
    id: 'vocab-intermediate',
    type: 'vocabulary',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    cognitiveLoad: 5,
    title: '中級単語学習',
    description: '金フレ頻出語から新規15語を学習',
    requiredEnergy: 3,
    requiredFocus: 3,
    adaptiveFeatures: ['文脈推測', '類義語関連', 'コロケーション']
  },
  {
    id: 'vocab-advanced',
    type: 'vocabulary',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    cognitiveLoad: 7,
    title: '上級語彙マスター',
    description: '990点レベルの語彙・熟語を集中学習',
    requiredEnergy: 4,
    requiredFocus: 4,
    adaptiveFeatures: ['ニュアンス理解', '語源分析', '上級コロケーション']
  },
  // 文法学習
  {
    id: 'grammar-basic',
    type: 'grammar',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    cognitiveLoad: 4,
    title: '基礎文法確認',
    description: '時制・助動詞の基本問題10問',
    requiredEnergy: 2,
    requiredFocus: 3,
    adaptiveFeatures: ['解説動画', 'パターン練習', '例文豊富']
  },
  {
    id: 'grammar-part5',
    type: 'grammar',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    cognitiveLoad: 6,
    title: 'Part 5文法問題',
    description: 'TOEIC Part 5形式の文法問題15問',
    requiredEnergy: 3,
    requiredFocus: 4,
    adaptiveFeatures: ['時間制限', '解答根拠', '類似問題']
  },
  // リスニング
  {
    id: 'listening-part1',
    type: 'listening',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    cognitiveLoad: 4,
    title: 'Part 1写真描写',
    description: '写真描写問題6問を解く',
    requiredEnergy: 2,
    requiredFocus: 3,
    adaptiveFeatures: ['速度調整', 'リピート再生', '語彙解説']
  },
  {
    id: 'listening-part3',
    type: 'listening',
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    cognitiveLoad: 7,
    title: 'Part 3会話問題',
    description: '会話問題3セット（9問）+ 先読み練習',
    requiredEnergy: 3,
    requiredFocus: 4,
    adaptiveFeatures: ['先読み訓練', 'キーワード特定', '推測技術']
  },
  // ワーキングメモリ強化
  {
    id: 'wm-basic',
    type: 'workingmemory',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    cognitiveLoad: 5,
    title: 'WM基礎訓練',
    description: '数字・単語の短期保持ゲーム',
    requiredEnergy: 2,
    requiredFocus: 3,
    adaptiveFeatures: ['難易度自動調整', 'ゲーム化', '成果可視化']
  },
  {
    id: 'wm-advanced',
    type: 'workingmemory',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    cognitiveLoad: 8,
    title: 'WM上級訓練',
    description: '複雑な情報処理・同時タスク訓練',
    requiredEnergy: 4,
    requiredFocus: 5,
    adaptiveFeatures: ['マルチタスク', 'チャンク化', '干渉耐性']
  },
  // 回復モード用軽負荷タスク
  {
    id: 'recovery-listen',
    type: 'vocabulary',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    cognitiveLoad: 1,
    title: '耳だけ単語',
    description: '既習単語を音声で聞き流し',
    requiredEnergy: 1,
    requiredFocus: 1,
    adaptiveFeatures: ['受動学習', '音声のみ', 'リラックス']
  },
  {
    id: 'recovery-view',
    type: 'vocabulary',
    difficulty: 'beginner',
    estimatedMinutes: 3,
    cognitiveLoad: 1,
    title: '見るだけ復習',
    description: '単語カードをゆっくり眺める',
    requiredEnergy: 1,
    requiredFocus: 1,
    adaptiveFeatures: ['受動学習', '視覚のみ', 'マイペース']
  }
]

// のうてんきょスコアから学習負荷を計算
function calculateOptimalLoad(noutenkyoScore: number): number {
  if (noutenkyoScore >= 80) return 8 // 高負荷学習
  if (noutenkyoScore >= 60) return 6 // 中負荷学習
  if (noutenkyoScore >= 40) return 4 // 軽負荷学習
  return 2 // 最軽負荷・回復モード
}

// 体調に適したタスクをフィルタリング
function filterTasksByCondition(
  templates: TaskTemplate[],
  userState: UserState,
  noutenkyoScore: number
): TaskTemplate[] {
  const optimalLoad = calculateOptimalLoad(noutenkyoScore)

  return templates.filter(template => {
    // 認知負荷チェック
    if (template.cognitiveLoad > optimalLoad) return false

    // エネルギーレベルチェック
    if (template.requiredEnergy > userState.energy) return false

    // 集中力レベルチェック
    if (template.requiredFocus > userState.focus) return false

    // 不安レベルが高い場合は難易度を下げる
    if (userState.anxiety >= 4 && template.difficulty === 'advanced') return false

    return true
  })
}

// 学習タイプのバランスを考慮した選択
function selectBalancedTasks(
  availableTasks: TaskTemplate[],
  maxTasks: number
): TaskTemplate[] {
  const taskTypes = ['vocabulary', 'grammar', 'listening', 'reading', 'workingmemory']
  const selectedTasks: TaskTemplate[] = []

  // 各タイプから均等に選択
  for (let i = 0; i < maxTasks; i++) {
    const targetType = taskTypes[i % taskTypes.length]
    const tasksOfType = availableTasks.filter(t =>
      t.type === targetType && !selectedTasks.includes(t)
    )

    if (tasksOfType.length > 0) {
      // 現在の体調に最も適したタスクを選択
      const bestTask = tasksOfType.reduce((best, current) =>
        current.cognitiveLoad < best.cognitiveLoad ? current : best
      )
      selectedTasks.push(bestTask)
    }
  }

  // 足りない分を他のタイプから補完
  while (selectedTasks.length < maxTasks && selectedTasks.length < availableTasks.length) {
    const remainingTasks = availableTasks.filter(t => !selectedTasks.includes(t))
    if (remainingTasks.length === 0) break

    selectedTasks.push(remainingTasks[0])
  }

  return selectedTasks
}

// ADHD特性を考慮した問題生成
function generateADHDOptimizedTasks(
  userState: UserState,
  noutenkyoScore: number
): TaskTemplate[] {
  // ADHD特性の場合は短時間・高頻度タスクを優先
  const adhdOptimizedTemplates = TASK_TEMPLATES.map(template => ({
    ...template,
    estimatedMinutes: Math.max(5, Math.floor(template.estimatedMinutes * 0.7)), // 時間短縮
    adaptiveFeatures: [...template.adaptiveFeatures, 'マイクロラーニング', 'ゲーミフィケーション']
  }))

  return adhdOptimizedTemplates
}

// うつ傾向を考慮した問題生成
function generateDepressionOptimizedTasks(
  userState: UserState,
  noutenkyoScore: number
): TaskTemplate[] {
  // うつ傾向の場合は達成感・成功体験を重視
  const depressionOptimizedTemplates = TASK_TEMPLATES.map(template => ({
    ...template,
    cognitiveLoad: Math.max(1, template.cognitiveLoad - 2), // 負荷軽減
    adaptiveFeatures: [...template.adaptiveFeatures, '達成感重視', '小さな成功', 'ポジティブフィードバック']
  }))

  return depressionOptimizedTemplates
}

// TypeをPartに変換するヘルパー関数
function convertTypeToPartMap(type: string): 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mocktest' | 'workingmemory' | 'recovery' {
  switch (type) {
    case 'workingmemory':
      return 'workingmemory'
    case 'vocabulary':
    case 'grammar':
    case 'listening':
    case 'reading':
      return type
    default:
      return 'vocabulary'
  }
}

// LoadレベルをCognitiveLoadから決定するヘルパー関数
function convertCognitiveLoadToLoad(cognitiveLoad: number): 'light' | 'medium' | 'heavy' {
  if (cognitiveLoad <= 3) return 'light'
  if (cognitiveLoad <= 6) return 'medium'
  return 'heavy'
}

// メイン問題生成関数
export function generateOptimizedTasks(
  noutenkyoScore: number,
  options: {
    maxDailyTasks?: number
    difficulty?: 'auto' | DifficultyLevel
    userState?: UserState
    specialMode?: 'adhd' | 'depression' | 'recovery' | null
  } = {}
): Task[] {
  const {
    maxDailyTasks = 3,
    difficulty = 'auto',
    userState = {
      date: new Date().toISOString().split('T')[0],
      mood: 3,
      energy: 3,
      focus: 3,
      anxiety: 3,
      sleepHours: 7,
      weather: 'cloudy',
      temperature: 20, // temperatureプロパティを追加
      note: ''
    },
    specialMode = null
  } = options

  let templates = TASK_TEMPLATES

  // 特別モードの適用
  if (specialMode === 'adhd') {
    templates = generateADHDOptimizedTasks(userState, noutenkyoScore)
  } else if (specialMode === 'depression') {
    templates = generateDepressionOptimizedTasks(userState, noutenkyoScore)
  } else if (specialMode === 'recovery') {
    templates = templates.filter(t => t.cognitiveLoad <= 2)
  }

  // 体調に適したタスクをフィルタリング
  const availableTasks = filterTasksByCondition(templates, userState, noutenkyoScore)

  // バランスよくタスクを選択
  const selectedTemplates = selectBalancedTasks(availableTasks, maxDailyTasks)

  // Taskオブジェクトに変換（型定義に合わせて修正）
  return selectedTemplates.map((template, index) => ({
    id: `task-${Date.now()}-${index}`,
    title: template.title,
    description: template.description,
    part: convertTypeToPartMap(template.type), // partプロパティを追加
    load: convertCognitiveLoadToLoad(template.cognitiveLoad), // loadプロパティを追加
    lengthMinutes: template.estimatedMinutes, // lengthMinutesプロパティを追加
    tags: template.adaptiveFeatures, // tagsプロパティを追加
    type: template.type,
    difficulty: template.difficulty,
    estimatedMinutes: template.estimatedMinutes,
    cognitiveLoad: template.cognitiveLoad,
    completed: false,
    score: null,
    timeSpent: 0,
    adaptiveFeatures: template.adaptiveFeatures,
    generatedAt: new Date().toISOString()
  }))
}

// 学習履歴に基づく動的難易度調整
export function adjustDifficultyBasedOnHistory(
  baseScore: number,
  recentPerformance: { accuracy: number; timeEfficiency: number }[]
): number {
  if (recentPerformance.length === 0) return baseScore

  const avgAccuracy = recentPerformance.reduce((sum, p) => sum + p.accuracy, 0) / recentPerformance.length
  const avgEfficiency = recentPerformance.reduce((sum, p) => sum + p.timeEfficiency, 0) / recentPerformance.length

  let adjustedScore = baseScore

  // 正答率が高い場合は難易度を上げる
  if (avgAccuracy > 0.85) adjustedScore += 10
  else if (avgAccuracy < 0.6) adjustedScore -= 10

  // 時間効率が良い場合も難易度を上げる
  if (avgEfficiency > 0.8) adjustedScore += 5
  else if (avgEfficiency < 0.5) adjustedScore -= 5

  return Math.max(20, Math.min(100, adjustedScore))
}

// 問題生成ロジックの説明を取得
export function getTaskGenerationExplanation(noutenkyoScore: number): string {
  const load = calculateOptimalLoad(noutenkyoScore)

  if (noutenkyoScore >= 80) {
    return `🚀 絶好調モード（スコア: ${noutenkyoScore}）
    - 高負荷学習タスクを3-4個
    - 上級難易度の問題を含む
    - 長時間集中型のタスク
    - 新しい分野への挑戦を推奨`
  } else if (noutenkyoScore >= 60) {
    return `📚 安定学習モード（スコア: ${noutenkyoScore}）
    - 中負荷学習タスクを2-3個
    - 中級難易度中心
    - バランスの取れた学習時間
    - 復習と新規学習の混合`
  } else if (noutenkyoScore >= 40) {
    return `🌱 軽学習モード（スコア: ${noutenkyoScore}）
    - 軽負荷タスクを1-2個
    - 基礎的な内容中心
    - 短時間で達成可能
    - 復習メインで新規学習は最小限`
  } else {
    return `💤 回復モード（スコア: ${noutenkyoScore}）
    - 最軽負荷タスクのみ
    - 受動的学習（聞く・見るだけ）
    - 3-5分の短時間タスク
    - 無理をしない、続けることが目標`
  }
}

// デバッグ用：問題生成プロセスの詳細ログ
export function debugTaskGeneration(
  noutenkyoScore: number,
  userState: UserState
): any {
  const optimalLoad = calculateOptimalLoad(noutenkyoScore)
  const availableTasks = filterTasksByCondition(TASK_TEMPLATES, userState, noutenkyoScore)

  return {
    input: {
      noutenkyoScore,
      userState,
      optimalLoad
    },
    process: {
      totalTemplates: TASK_TEMPLATES.length,
      availableAfterFiltering: availableTasks.length,
      filteredOutReasons: TASK_TEMPLATES
        .filter(t => !availableTasks.includes(t))
        .map(t => ({
          task: t.title,
          reason: t.cognitiveLoad > optimalLoad ? 'cognitive load too high' :
                  t.requiredEnergy > userState.energy ? 'energy too low' :
                  t.requiredFocus > userState.focus ? 'focus too low' : 'anxiety filter'
        }))
    },
    output: {
      selectedTasks: selectBalancedTasks(availableTasks, 3).map(t => ({
        title: t.title,
        type: t.type,
        difficulty: t.difficulty,
        cognitiveLoad: t.cognitiveLoad
      }))
    }
  }
}
