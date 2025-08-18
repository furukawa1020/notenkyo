import { UserState, Task } from './types'

export function calculateNoutenkyoScore(userState: UserState): number {
  const { mood, energy, focus, anxiety, weather, sleepHours } = userState

  // 基本スコア計算（0-100）
  let score = 0
  
  // 体調要素 (60%)
  score += energy * 12 // エネルギー（0-60）
  score += focus * 8   // 集中力（0-40）
  score += mood * 6    // 気分（0-30）
  score -= anxiety * 4 // 不安度（マイナス要素、0-20）
  
  // 睡眠調整 (15%)
  if (sleepHours >= 7 && sleepHours <= 9) {
    score += 15
  } else if (sleepHours >= 6 && sleepHours <= 10) {
    score += 10
  } else if (sleepHours >= 5 && sleepHours <= 11) {
    score += 5
  }
  
  // 天気調整 (25%)
  switch (weather) {
    case 'sunny':
      score += 25
      break
    case 'cloudy':
      score += 15
      break
    case 'rainy':
      score += 10 // 雨の日は集中しやすい人もいる
      break
  }
  
  // 0-100の範囲に正規化
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function generateDailyTasks(noutenkyoScore: number): Task[] {
  const tasks: Task[] = []
  
  if (noutenkyoScore >= 80) {
    // 高スコア: Heavy 2本 + Medium 1本
    tasks.push(
      createTask('vocabulary', 'heavy', '金フレ新単語50個', 30),
      createTask('grammar', 'heavy', 'Part 5/6 文法問題集中', 45),
      createTask('listening', 'medium', 'Part 1-4 通し練習', 25)
    )
  } else if (noutenkyoScore >= 60) {
    // 中スコア: Medium 2本 + Light 1本
    tasks.push(
      createTask('vocabulary', 'medium', '既習単語復習25個', 20),
      createTask('reading', 'medium', 'Part 7 短文読解', 30),
      createTask('grammar', 'light', '基本文法確認', 15)
    )
  } else {
    // 低スコア: Light 1本 + 回復モード
    tasks.push(
      createTask('vocabulary', 'light', '音声のみ単語復習', 15),
      createTask('recovery', 'light', 'リラックス学習', 10)
    )
  }
  
  // ワーキングメモリトレーニングを追加（ADHD対応）
  if (noutenkyoScore >= 40) {
    tasks.push(createTask('workingmemory', 'light', 'WMトレーニング', 10))
  }
  
  return tasks
}

function createTask(
  part: Task['part'], 
  load: Task['load'], 
  title: string, 
  lengthMinutes: number
): Task {
  return {
    id: `${part}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description: getTaskDescription(part, load),
    part,
    load,
    lengthMinutes,
    tags: getTaskTags(part, load),
    completed: false
  }
}

function getTaskDescription(part: Task['part'], load: Task['load']): string {
  const descriptions = {
    vocabulary: {
      light: '音声を聞きながらゆっくり単語復習',
      medium: '新単語を含む復習と定着確認',
      heavy: '新単語大量インプット + SRS復習'
    },
    grammar: {
      light: '基本文法の見直しと簡単な例文確認',
      medium: 'Part 5形式での文法問題演習',
      heavy: '文法問題集中演習 + 解説理解'
    },
    listening: {
      light: 'Part 1/2の短い音声でウォーミングアップ',
      medium: 'Part 1-4通し練習（設問先読み付き）',
      heavy: '模試レベルのリスニング集中訓練'
    },
    reading: {
      light: 'Part 7短文をゆっくり読解',
      medium: 'Part 7中文読解 + 時間意識',
      heavy: 'Part 7長文 + 速読訓練'
    },
    mocktest: {
      light: 'Part別部分模試',
      medium: '時間短縮版模試',
      heavy: 'フル模試（2時間）'
    },
    workingmemory: {
      light: '短期記憶ゲーム + chunk化練習',
      medium: '処理速度向上 + 複数タスク',
      heavy: '高負荷WMトレーニング'
    },
    recovery: {
      light: '音声のみ学習 + リラックス',
      medium: '見るだけ復習',
      heavy: '軽いインタラクション'
    }
  }
  
  return descriptions[part]?.[load] || 'タスクの詳細'
}

function getTaskTags(part: Task['part'], load: Task['load']): string[] {
  const baseTags = {
    vocabulary: ['単語', 'SRS'],
    grammar: ['文法', 'Part5'],
    listening: ['リスニング', '音声'],
    reading: ['読解', 'Part7'],
    mocktest: ['模試', '本番形式'],
    workingmemory: ['WM', 'ADHD対応'],
    recovery: ['回復', '軽負荷']
  }
  
  const loadTags = {
    light: ['軽負荷', '短時間'],
    medium: ['中負荷', '標準'],
    heavy: ['高負荷', '集中']
  }
  
  return [...(baseTags[part] || []), ...(loadTags[load] || [])]
}
