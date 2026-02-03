// Lexora Configuration
export const config = {
  app: {
    name: 'Lexora',
    version: '1.0.0',
  },
  game: {
    defaultTime: 120, // seconds
    dailyTime: 120,
    hintsPerLevel: 3,
    coinsPerWord: 50,
    coinsPerLevel: 150,
    streakBonus: 50,
    wordsPerLevel: 3,
  },
  levels: {
    easy: { time: 180, letters: 4 },
    medium: { time: 120, letters: 5 },
    hard: { time: 90, letters: 6 },
    expert: { time: 60, letters: 7 },
  },
  shop: {
    coinPackages: [
      { id: 'starter', coins: 500, price: '0.99 AZN', label: 'Başlanğıc üçün' },
      { id: 'value', coins: 1200, price: '1.99 AZN', label: 'Sərfəli Seçim' },
      { id: 'big', coins: 3000, price: '4.49 AZN', label: 'Böyük Paket' },
      { id: 'master', coins: 7500, price: '9.99 AZN', label: 'Ustad Paketi' },
    ],
    boosters: [
      { id: 'hints', name: '5x İpucu', description: 'Çətin sözləri aç', price: 250, icon: 'lightbulb' },
      { id: 'time', name: '3x Vaxt Uzadıcı', description: '+30 saniyə əlavə et', price: 150, icon: 'timer' },
    ],
    megaPack: {
      coins: 5000,
      hints: 10,
      price: '9.99 AZN',
      label: 'Reklamsız + 5000 Sikkə + 10 İpucu',
    },
  },
};
