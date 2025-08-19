// 拡大学習時間レンジ & スコア反映のテスト
import { getRecommendedStudyTime, getStudyTimeRange, getStudyStrategy } from './noutenkyo-engine'
import { RealContentGenerator } from './real-content-generator'

export function testExtendedStudyTime() {
  console.log('🚀 拡大学習時間レンジ & スコア反映テスト開始')
  
  const testScores = [10, 25, 40, 55, 70, 80, 90, 95]
  
  testScores.forEach(score => {
    console.log(`\n📊 のうてんきょスコア: ${score}`)
    
    // 1. 推奨学習時間
    const recommendedTime = getRecommendedStudyTime(score)
    console.log(`⏰ 推奨学習時間: ${recommendedTime}分`)
    
    // 2. 学習時間レンジ
    const timeRange = getStudyTimeRange(score)
    console.log(`📈 時間レンジ: ${timeRange.min}-${timeRange.max}分 (推奨: ${timeRange.recommended}分)`)
    
    // 3. 学習戦略
    const strategy = getStudyStrategy(score)
    console.log(`🎯 戦略: ${strategy.strategy}`)
    console.log(`📋 フォーカス: ${strategy.focus}`)
    console.log(`💡 ヒント数: ${strategy.tips.length}個`)
    
    // 4. タスク生成テスト
    const mockUserState = {
      mood: 3,
      energy: 3,
      focus: 3,
      anxiety: 3,
      sleepHours: 7,
      date: new Date().toISOString().split('T')[0],
      weather: 'sunny' as const,
      temperature: 22,
      note: 'テスト用'
    }
    
    const tasks = RealContentGenerator.generateDailyTasks(score, mockUserState, {
      targetStudyTime: recommendedTime
    })
    
    const totalTaskTime = tasks.reduce((sum, task) => sum + task.lengthMinutes, 0)
    console.log(`📝 生成タスク: ${tasks.length}個, 合計時間: ${totalTaskTime}分`)
    
    tasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title} (${task.lengthMinutes}分, 認知負荷: ${task.cognitiveLoad})`)
    })
  })
  
  // 極端なケースのテスト
  console.log('\n🔬 極端ケーステスト')
  
  // 超高スコア (95点) で長時間学習
  const superHighTasks = RealContentGenerator.generateDailyTasks(95, {
    mood: 5, energy: 5, focus: 5, anxiety: 1, sleepHours: 8,
    date: new Date().toISOString().split('T')[0],
    weather: 'sunny' as const,
    temperature: 22,
    note: '超高調テスト'
  }, { targetStudyTime: 240 }) // 4時間指定
  
  console.log('🎯 超高スコア (95点) + 4時間学習:')
  console.log(`タスク数: ${superHighTasks.length}個`)
  console.log(`合計時間: ${superHighTasks.reduce((sum, task) => sum + task.lengthMinutes, 0)}分`)
  
  // 超低スコア (5点) で最小限学習
  const superLowTasks = RealContentGenerator.generateDailyTasks(5, {
    mood: 1, energy: 1, focus: 1, anxiety: 5, sleepHours: 3,
    date: new Date().toISOString().split('T')[0],
    weather: 'rainy' as const,
    temperature: 18,
    note: '超低調テスト'
  }, { targetStudyTime: 5 }) // 5分指定
  
  console.log('🆘 超低スコア (5点) + 5分学習:')
  console.log(`タスク数: ${superLowTasks.length}個`)
  console.log(`合計時間: ${superLowTasks.reduce((sum, task) => sum + task.lengthMinutes, 0)}分`)
  
  console.log('\n✅ 拡大学習時間レンジテスト完了')
}

// 実際の学習効果比較
export function compareStudyEffectiveness() {
  console.log('\n📈 学習効果比較分析')
  
  const scenarios = [
    { score: 30, name: '低調時（回復モード）' },
    { score: 60, name: '通常時（標準モード）' },
    { score: 90, name: '高調時（集中モード）' }
  ]
  
  scenarios.forEach(scenario => {
    console.log(`\n${scenario.name} (スコア: ${scenario.score})`)
    
    const vocabTask = RealContentGenerator.generateVocabularyTask(scenario.score, 'intermediate')
    const grammarTask = RealContentGenerator.generateGrammarTask(scenario.score, 5)
    
    console.log(`単語学習: ${vocabTask.content?.length || 0}語, ${vocabTask.lengthMinutes}分`)
    console.log(`文法学習: ${grammarTask.content?.length || 0}問, ${grammarTask.lengthMinutes}分`)
    console.log(`認知負荷: 単語${vocabTask.cognitiveLoad}, 文法${grammarTask.cognitiveLoad}`)
  })
}

// ブラウザコンソールで実行可能
if (typeof window !== 'undefined') {
  (window as any).testExtendedStudyTime = testExtendedStudyTime
}
