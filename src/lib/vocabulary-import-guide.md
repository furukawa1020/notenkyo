// VocabularyLearning.tsxのインポート変更

import React from 'react';
import { read } from 'fs';
import { VocabularyEntry, getVocabularyByLevel, getRandomVocabulary } from '@/lib/enhanced-vocabulary-database';

// これは単なるスクリプトファイルで、拡張子を .md にして実行されないようにしています。
// enhanced-vocabulary-database.ts が生成された後に、
// VocabularyLearning.tsx のインポート部分を以下のように変更してください:
//
// FROM:
// import { VocabularyEntry, getVocabularyByLevel, getRandomVocabulary } from '@/lib/massive-vocabulary-database'
//
// TO:
// import { VocabularyEntry, getVocabularyByLevel, getRandomVocabulary } from '@/lib/enhanced-vocabulary-database'
//
// これにより、自動生成された低品質の単語ではなく、意味が適切に設定された
// 高品質な単語データベースを使用できるようになります。
