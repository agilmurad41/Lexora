import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { puzzleLevels, getDailyPuzzle, PuzzleLevel, isValidWord } from '../services/dictionary';
import { currentUser } from '../services/mockData';
import { config } from '../constants/config';

interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: string;
}

interface GameState {
  // User data
  coins: number;
  hints: number;
  currentLevel: number;
  totalScore: number;
  streak: number;
  lastPlayedDate: string | null;
  
  // Settings
  settings: GameSettings;
  
  // Game session
  isPlaying: boolean;
  currentPuzzle: PuzzleLevel | null;
  foundWords: string[];
  selectedLetters: string[];
  timeRemaining: number;
  
  // Daily challenge
  dailyCompleted: boolean;
  dailyStreak: number;
  completedDays: number[];
  dailyCompletedDates: string[];
}

interface GameContextType extends GameState {
  // Actions
  startLevel: (levelId: number) => void;
  startDailyChallenge: () => void;
  selectLetter: (letter: string, index: number) => void;
  clearSelection: () => void;
  submitWord: () => boolean;
  checkAutoSubmit: () => boolean;
  useHint: () => string | null;
  shuffleLetters: () => void;
  completeLevel: () => { stars: number; coinsEarned: number; xpEarned: number; timeBonus: number };
  completeDailyChallenge: () => void;
  addCoins: (amount: number) => void;
  buyHints: (amount: number, cost: number) => boolean;
  updateTimer: (time: number) => void;
  resetGame: () => void;
  resetProgress: () => Promise<void>;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  isDayCompleted: (dateString: string) => boolean;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  darkMode: true,
  language: 'az',
};

const defaultState: GameState = {
  coins: 1250,
  hints: 5,
  currentLevel: 1,
  totalScore: 4550,
  streak: 12,
  lastPlayedDate: null,
  settings: defaultSettings,
  isPlaying: false,
  currentPuzzle: null,
  foundWords: [],
  selectedLetters: [],
  timeRemaining: 120,
  dailyCompleted: false,
  dailyStreak: 12,
  completedDays: [1, 2, 3, 4],
  dailyCompletedDates: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [letterIndices, setLetterIndices] = useState<number[]>([]);

  // Load saved state
  useEffect(() => {
    loadGameState();
  }, []);

  // Save state changes
  useEffect(() => {
    saveGameState();
  }, [state.coins, state.hints, state.currentLevel, state.totalScore, state.streak, state.dailyStreak, state.settings, state.dailyCompletedDates]);

  const loadGameState = async () => {
    try {
      const saved = await AsyncStorage.getItem('lexora_game_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsed,
          settings: { ...defaultSettings, ...parsed.settings },
          isPlaying: false,
          currentPuzzle: null,
          foundWords: [],
          selectedLetters: [],
        }));
      }
    } catch (e) {
      console.log('Error loading game state:', e);
    }
  };

  const saveGameState = async () => {
    try {
      const toSave = {
        coins: state.coins,
        hints: state.hints,
        currentLevel: state.currentLevel,
        totalScore: state.totalScore,
        streak: state.streak,
        dailyStreak: state.dailyStreak,
        lastPlayedDate: state.lastPlayedDate,
        completedDays: state.completedDays,
        settings: state.settings,
        dailyCompletedDates: state.dailyCompletedDates,
      };
      await AsyncStorage.setItem('lexora_game_state', JSON.stringify(toSave));
    } catch (e) {
      console.log('Error saving game state:', e);
    }
  };

  const startLevel = (levelId: number) => {
    const puzzle = puzzleLevels.find(p => p.id === levelId) || puzzleLevels[0];
    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentPuzzle: puzzle,
      foundWords: [],
      selectedLetters: [],
      timeRemaining: puzzle.timeLimit,
    }));
    setLetterIndices([]);
  };

  const startDailyChallenge = () => {
    const puzzle = getDailyPuzzle();
    const today = new Date().toISOString().split('T')[0];
    const alreadyCompleted = state.dailyCompletedDates.includes(today);
    
    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentPuzzle: puzzle,
      foundWords: [],
      selectedLetters: [],
      timeRemaining: puzzle.timeLimit,
      dailyCompleted: alreadyCompleted,
    }));
    setLetterIndices([]);
  };

  const selectLetter = (letter: string, index: number) => {
    if (letterIndices.includes(index)) {
      // Deselect if already selected
      const idx = letterIndices.indexOf(index);
      setLetterIndices(prev => prev.filter((_, i) => i !== idx));
      setState(prev => ({
        ...prev,
        selectedLetters: prev.selectedLetters.filter((_, i) => i !== idx),
      }));
    } else {
      // Select new letter
      setLetterIndices(prev => [...prev, index]);
      setState(prev => ({
        ...prev,
        selectedLetters: [...prev.selectedLetters, letter],
      }));
    }
  };

  const clearSelection = () => {
    setState(prev => ({ ...prev, selectedLetters: [] }));
    setLetterIndices([]);
  };

  const submitWord = (): boolean => {
    const word = state.selectedLetters.join('').toUpperCase();
    
    if (word.length < 2) {
      clearSelection();
      return false;
    }

    // Check if word is valid and not already found
    if (state.currentPuzzle?.targetWords.includes(word) && !state.foundWords.includes(word)) {
      setState(prev => ({
        ...prev,
        foundWords: [...prev.foundWords, word],
        selectedLetters: [],
        coins: prev.coins + config.game.coinsPerWord,
        totalScore: prev.totalScore + word.length * 10,
      }));
      setLetterIndices([]);
      return true;
    }

    clearSelection();
    return false;
  };

  // Auto-submit check - returns true if word was auto-submitted
  const checkAutoSubmit = (): boolean => {
    if (!state.currentPuzzle || state.selectedLetters.length < 2) return false;
    
    const word = state.selectedLetters.join('').toUpperCase();
    
    // Check if current selection matches any unfound target word
    if (state.currentPuzzle.targetWords.includes(word) && !state.foundWords.includes(word)) {
      setState(prev => ({
        ...prev,
        foundWords: [...prev.foundWords, word],
        selectedLetters: [],
        coins: prev.coins + config.game.coinsPerWord,
        totalScore: prev.totalScore + word.length * 10,
      }));
      setLetterIndices([]);
      return true;
    }
    
    return false;
  };

  const useHint = (): string | null => {
    if (state.hints <= 0 || !state.currentPuzzle) return null;

    const remainingWords = state.currentPuzzle.targetWords.filter(
      w => !state.foundWords.includes(w)
    );

    if (remainingWords.length === 0) return null;

    const hintWord = remainingWords[0];
    const hintLetter = hintWord[0];

    setState(prev => ({ ...prev, hints: prev.hints - 1 }));
    return hintLetter;
  };

  const shuffleLetters = () => {
    if (!state.currentPuzzle) return;
    
    const shuffled = [...state.currentPuzzle.letters].sort(() => Math.random() - 0.5);
    setState(prev => ({
      ...prev,
      currentPuzzle: prev.currentPuzzle ? { ...prev.currentPuzzle, letters: shuffled } : null,
    }));
    clearSelection();
  };

  const completeLevel = () => {
    const stars = state.foundWords.length >= (state.currentPuzzle?.targetWords.length || 3) ? 3 :
                  state.foundWords.length >= 2 ? 2 : 1;
    const coinsEarned = config.game.coinsPerLevel * stars;
    const xpEarned = 100 + (state.timeRemaining > 60 ? 50 : 0);
    const timeBonus = state.timeRemaining > 60 ? 50 : 0;

    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentLevel: prev.currentLevel + 1,
      coins: prev.coins + coinsEarned,
      totalScore: prev.totalScore + xpEarned,
      streak: prev.streak + 1,
      lastPlayedDate: new Date().toISOString().split('T')[0],
    }));

    return { stars, coinsEarned, xpEarned, timeBonus };
  };

  const completeDailyChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayDay = new Date().getDate();
    
    if (!state.dailyCompletedDates.includes(today)) {
      setState(prev => ({
        ...prev,
        dailyCompleted: true,
        dailyStreak: prev.dailyStreak + 1,
        dailyCompletedDates: [...prev.dailyCompletedDates, today],
        completedDays: prev.completedDays.includes(todayDay) 
          ? prev.completedDays 
          : [...prev.completedDays, todayDay],
        coins: prev.coins + 500,
        totalScore: prev.totalScore + 500,
      }));
    }
  };

  const isDayCompleted = (dateString: string): boolean => {
    return state.dailyCompletedDates.includes(dateString);
  };

  const addCoins = (amount: number) => {
    setState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const buyHints = (amount: number, cost: number): boolean => {
    if (state.coins < cost) return false;
    setState(prev => ({
      ...prev,
      coins: prev.coins - cost,
      hints: prev.hints + amount,
    }));
    return true;
  };

  const updateTimer = (time: number) => {
    setState(prev => ({ ...prev, timeRemaining: time }));
  };

  const resetGame = () => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentPuzzle: null,
      foundWords: [],
      selectedLetters: [],
    }));
    setLetterIndices([]);
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('lexora_game_state');
      setState({
        ...defaultState,
        settings: state.settings, // Keep settings
      });
      setLetterIndices([]);
    } catch (e) {
      console.log('Error resetting progress:', e);
    }
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  return (
    <GameContext.Provider value={{
      ...state,
      startLevel,
      startDailyChallenge,
      selectLetter,
      clearSelection,
      submitWord,
      checkAutoSubmit,
      useHint,
      shuffleLetters,
      completeLevel,
      completeDailyChallenge,
      addCoins,
      buyHints,
      updateTimer,
      resetGame,
      resetProgress,
      updateSettings,
      isDayCompleted,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
