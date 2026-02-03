// Azerbaijani Word Dictionary for Lexora
// Sample words organized by length

export const azerbaijaniWords: Record<number, string[]> = {
  3: [
    'ANA', 'ATA', 'BAŞ', 'GÖZ', 'ƏL', 'QIZ', 'OĞL', 'EV', 'SU', 'OD',
    'YER', 'GÜN', 'AY', 'İL', 'YOL', 'DAĞ', 'DƏM', 'SAZ', 'QAR', 'YAZ',
  ],
  4: [
    'ALMA', 'ARMUD', 'BAĞÇA', 'ÇÖRƏK', 'DƏNIZ', 'GÜNƏŞ', 'HƏYAT', 'İŞIQ',
    'KITAB', 'MEYVƏ', 'NƏĞMƏ', 'ÖMÜR', 'PAYIZ', 'QƏLƏM', 'RƏNG', 'SƏHƏR',
    'ULDUZ', 'VƏTƏN', 'YAŞIL', 'ZƏFƏR', 'ŞƏKIL', 'ƏSIL', 'GÖZƏL', 'QAPI',
    'BABA', 'NƏNƏ', 'QARDAŞ', 'BACΙ', 'DOST', 'YUXU', 'AYNA', 'BULUD',
  ],
  5: [
    'AZƏRI', 'BAHAR', 'CAHAN', 'DÜNYA', 'ƏBƏDI', 'FƏSIL', 'GECƏ', 'HƏFTƏ',
    'İNSAN', 'KÖNÜL', 'LƏZZƏT', 'MƏHƏBBƏT', 'NƏSIL', 'OCAQ', 'PƏNCƏRƏ',
    'QONAQ', 'RƏHBƏR', 'SƏRVƏT', 'TƏBII', 'ÜRƏK', 'VÜQAR', 'YADDAŞ',
    'ZAMAN', 'ŞƏRƏF', 'ƏDALƏT', 'TORPAQ', 'KƏND', 'ŞƏHƏR', 'AILƏ', 'SEVGI',
  ],
  6: [
    'AZƏRBAYCAN', 'BABALAR', 'CƏSARƏT', 'DOSTLUQ', 'ƏZIZIM', 'FƏXARƏT',
    'GÖZƏLLIK', 'HƏQIQƏT', 'İRADƏ', 'KAINAT', 'LƏTAFƏT', 'MƏRIFƏT',
    'NƏCIBLIK', 'OCAQLAR', 'PARLAQ', 'QÜDRƏT', 'RƏHMƏT', 'SƏADƏT',
    'TƏVAZÖ', 'ÜMIDLI', 'VƏFALI', 'YENILIK', 'ZƏHMƏT', 'ŞÜCAƏT',
  ],
};

// Puzzle levels with target words
export interface PuzzleLevel {
  id: number;
  letters: string[];
  targetWords: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number;
}

export const puzzleLevels: PuzzleLevel[] = [
  { id: 1, letters: ['A', 'L', 'M', 'A'], targetWords: ['ALMA', 'ALA', 'MAL'], difficulty: 'easy', timeLimit: 180 },
  { id: 2, letters: ['G', 'Ö', 'Z', 'Ə', 'L'], targetWords: ['GÖZƏL', 'GÖZ', 'ÖZ'], difficulty: 'easy', timeLimit: 180 },
  { id: 3, letters: ['K', 'İ', 'T', 'A', 'B'], targetWords: ['KITAB', 'KAB', 'TAK'], difficulty: 'easy', timeLimit: 180 },
  { id: 4, letters: ['Ş', 'Ə', 'K', 'İ', 'L'], targetWords: ['ŞƏKIL', 'ŞƏK', 'KİL'], difficulty: 'medium', timeLimit: 150 },
  { id: 5, letters: ['D', 'Ə', 'N', 'İ', 'Z'], targetWords: ['DƏNIZ', 'DƏN', 'İZ'], difficulty: 'medium', timeLimit: 150 },
  { id: 6, letters: ['G', 'Ü', 'N', 'Ə', 'Ş'], targetWords: ['GÜNƏŞ', 'GÜN', 'ŞƏN'], difficulty: 'medium', timeLimit: 150 },
  { id: 7, letters: ['S', 'Ə', 'H', 'Ə', 'R'], targetWords: ['SƏHƏR', 'SƏR', 'HƏR'], difficulty: 'medium', timeLimit: 120 },
  { id: 8, letters: ['B', 'A', 'H', 'A', 'R'], targetWords: ['BAHAR', 'BAR', 'AH'], difficulty: 'medium', timeLimit: 120 },
  { id: 9, letters: ['T', 'O', 'R', 'P', 'A', 'Q'], targetWords: ['TORPAQ', 'TOP', 'RAQ'], difficulty: 'hard', timeLimit: 100 },
  { id: 10, letters: ['S', 'E', 'V', 'G', 'İ'], targetWords: ['SEVGI', 'SEV', 'GİV'], difficulty: 'hard', timeLimit: 100 },
  { id: 11, letters: ['Ü', 'R', 'Ə', 'K'], targetWords: ['ÜRƏK', 'RƏK'], difficulty: 'medium', timeLimit: 120 },
  { id: 12, letters: ['Ə', 'S', 'İ', 'L', 'Ş', 'Ə', 'K', 'İ', 'L'], targetWords: ['ƏSİL', 'ŞƏKİL', 'İŞ'], difficulty: 'hard', timeLimit: 90 },
  { id: 13, letters: ['V', 'Ə', 'T', 'Ə', 'N'], targetWords: ['VƏTƏN', 'VƏT', 'TƏN'], difficulty: 'medium', timeLimit: 120 },
  { id: 14, letters: ['D', 'O', 'S', 'T', 'L', 'U', 'Q'], targetWords: ['DOSTLUQ', 'DOST', 'SOT'], difficulty: 'expert', timeLimit: 90 },
  { id: 15, letters: ['A', 'İ', 'L', 'Ə'], targetWords: ['AİLƏ', 'ALİ', 'İL'], difficulty: 'easy', timeLimit: 180 },
  { id: 16, letters: ['Z', 'A', 'M', 'A', 'N'], targetWords: ['ZAMAN', 'ZAM', 'MAN'], difficulty: 'medium', timeLimit: 120 },
  { id: 17, letters: ['H', 'Ə', 'Y', 'A', 'T'], targetWords: ['HƏYAT', 'HAY', 'YAT'], difficulty: 'medium', timeLimit: 120 },
  { id: 18, letters: ['İ', 'N', 'S', 'A', 'N'], targetWords: ['İNSAN', 'SAN', 'AN'], difficulty: 'medium', timeLimit: 120 },
  { id: 19, letters: ['G', 'Ö', 'Z', 'Ə', 'L', 'L', 'İ', 'K'], targetWords: ['GÖZƏLLIK', 'GÖZƏL', 'GÖZ'], difficulty: 'expert', timeLimit: 75 },
  { id: 20, letters: ['Ə', 'D', 'A', 'L', 'Ə', 'T'], targetWords: ['ƏDALƏT', 'ƏDA', 'LƏT'], difficulty: 'hard', timeLimit: 90 },
];

// Daily puzzles (rotates based on day)
export const dailyPuzzles: PuzzleLevel[] = [
  { id: 101, letters: ['Q', 'Ə', 'L', 'Ə', 'M'], targetWords: ['QƏLƏM', 'QƏL', 'ƏL'], difficulty: 'expert', timeLimit: 120 },
  { id: 102, letters: ['U', 'L', 'D', 'U', 'Z'], targetWords: ['ULDUZ', 'ULD', 'DUZ'], difficulty: 'expert', timeLimit: 120 },
  { id: 103, letters: ['P', 'A', 'Y', 'I', 'Z'], targetWords: ['PAYIZ', 'PAY', 'YAZ'], difficulty: 'expert', timeLimit: 120 },
  { id: 104, letters: ['B', 'U', 'L', 'U', 'D'], targetWords: ['BULUD', 'BUL', 'DUL'], difficulty: 'expert', timeLimit: 120 },
  { id: 105, letters: ['M', 'Ə', 'K', 'T', 'Ə', 'B'], targetWords: ['MƏKTƏB', 'MƏK', 'TƏB'], difficulty: 'expert', timeLimit: 120 },
  { id: 106, letters: ['Ö', 'M', 'Ü', 'R'], targetWords: ['ÖMÜR', 'ÖM', 'MÜR'], difficulty: 'expert', timeLimit: 120 },
  { id: 107, letters: ['K', 'Ö', 'N', 'Ü', 'L'], targetWords: ['KÖNÜL', 'KÖN', 'ÜL'], difficulty: 'expert', timeLimit: 120 },
];

// Validate if a word exists in dictionary
export const isValidWord = (word: string): boolean => {
  const upperWord = word.toUpperCase();
  for (const length in azerbaijaniWords) {
    if (azerbaijaniWords[parseInt(length)].includes(upperWord)) {
      return true;
    }
  }
  // Also check puzzle target words
  for (const level of [...puzzleLevels, ...dailyPuzzles]) {
    if (level.targetWords.includes(upperWord)) {
      return true;
    }
  }
  return false;
};

// Get today's daily puzzle
export const getDailyPuzzle = (): PuzzleLevel => {
  const dayOfWeek = new Date().getDay();
  return dailyPuzzles[dayOfWeek % dailyPuzzles.length];
};
