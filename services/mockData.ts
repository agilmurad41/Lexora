// Mock Data for Lexora

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  streak: number;
  rank: number;
}

export interface LeaderboardEntry extends Player {
  weeklyScore: number;
  allTimeScore: number;
}

// Avatar URLs (using UI Avatars)
const getAvatar = (name: string, bg: string = '3B82F6') => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200`;

export const currentUser: Player = {
  id: 'user_1',
  name: 'Rauf Əliyev',
  avatar: getAvatar('Rauf Ə', '3B82F6'),
  score: 4550,
  level: 24,
  streak: 12,
  rank: 42,
};

// Hələlik yalnız cari istifadəçi - backend qoşulduqda real oyunçular əlavə olunacaq
export const leaderboardData: LeaderboardEntry[] = [];

// Daily challenge completion status (mock calendar data)
export interface DayStatus {
  day: number;
  completed: boolean;
  diamonds: number;
}

export const getMonthDays = (year: number, month: number): DayStatus[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const days: DayStatus[] = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const isCurrentOrPastMonth = year < currentYear || (year === currentYear && month < currentMonth);
    const isPastDay = year === currentYear && month === currentMonth && i < today;
    const isToday = year === currentYear && month === currentMonth && i === today;
    
    // Simulate some completed days
    const completed = (isCurrentOrPastMonth || isPastDay) && Math.random() > 0.3;
    
    days.push({
      day: i,
      completed,
      diamonds: completed ? Math.floor(Math.random() * 3) + 1 : 0,
    });
  }
  
  return days;
};

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  { id: '1', title: 'İlk addım', description: 'İlk sözü tap', icon: 'star', progress: 1, target: 1, unlocked: true },
  { id: '2', title: 'Söz ustası', description: '100 söz tap', icon: 'trophy', progress: 87, target: 100, unlocked: false },
  { id: '3', title: 'Seriya kralı', description: '7 günlük seriya', icon: 'flame', progress: 5, target: 7, unlocked: false },
  { id: '4', title: 'Səviyyə qəhrəmanı', description: '50 səviyyə keç', icon: 'medal', progress: 24, target: 50, unlocked: false },
  { id: '5', title: 'Sürətli düşüncə', description: '30 saniyədə səviyyə keç', icon: 'flash', progress: 0, target: 1, unlocked: false },
];

// Game stats
export interface GameStats {
  totalWords: number;
  totalLevels: number;
  totalTime: string;
  averageTime: string;
  bestStreak: number;
  currentStreak: number;
  hintsUsed: number;
  perfectLevels: number;
}

export const userStats: GameStats = {
  totalWords: 342,
  totalLevels: 24,
  totalTime: '5s 23d',
  averageTime: '1:12',
  bestStreak: 15,
  currentStreak: 12,
  hintsUsed: 47,
  perfectLevels: 18,
};
