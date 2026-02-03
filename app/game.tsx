import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGame } from '../contexts/GameContext';
import { theme, shadows } from '../constants/theme';
import { puzzleLevels } from '../services/dictionary';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WHEEL_SIZE = 260;
const LETTER_SIZE = 56;
const CENTER_SIZE = 80;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ daily?: string }>();
  const isDaily = params.daily === 'true';
  
  const {
    currentLevel,
    currentPuzzle,
    foundWords,
    selectedLetters,
    timeRemaining,
    hints,
    settings,
    startLevel,
    startDailyChallenge,
    selectLetter,
    clearSelection,
    submitWord,
    checkAutoSubmit,
    useHint,
    shuffleLetters,
    updateTimer,
    completeLevel,
    completeDailyChallenge,
    resetGame,
  } = useGame();

  const [localLetters, setLocalLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hintLetter, setHintLetter] = useState<string | null>(null);
  const [lastAutoSubmitWord, setLastAutoSubmitWord] = useState<string>('');

  // Animation values
  const wheelRotation = useSharedValue(0);
  const submitScale = useSharedValue(1);

  // Initialize game
  useEffect(() => {
    if (isDaily) {
      startDailyChallenge();
    } else {
      startLevel(currentLevel);
    }
    return () => resetGame();
  }, []);

  // Set local letters when puzzle loads
  useEffect(() => {
    if (currentPuzzle) {
      setLocalLetters([...currentPuzzle.letters]);
    }
  }, [currentPuzzle?.id]);

  // Timer
  useEffect(() => {
    if (!currentPuzzle || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      updateTimer(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPuzzle, timeRemaining]);

  // Auto-submit when word matches
  useEffect(() => {
    if (!currentPuzzle || selectedLetters.length < 2) return;
    
    const currentWord = selectedLetters.join('').toUpperCase();
    
    // Check if this word matches any target word and hasn't been found yet
    if (currentPuzzle.targetWords.includes(currentWord) && 
        !foundWords.includes(currentWord) &&
        currentWord !== lastAutoSubmitWord) {
      
      // Auto submit!
      setLastAutoSubmitWord(currentWord);
      
      if (settings.vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      submitScale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1)
      );
      
      // Trigger submit
      const success = submitWord();
      if (success) {
        setSelectedIndices([]);
      }
    }
  }, [selectedLetters, currentPuzzle, foundWords]);

  // Check for level complete
  useEffect(() => {
    if (currentPuzzle && foundWords.length >= currentPuzzle.targetWords.length) {
      // Add small delay for animation
      const timeout = setTimeout(() => {
        if (isDaily) {
          completeDailyChallenge();
        }
        const result = completeLevel();
        router.replace({
          pathname: '/complete',
          params: {
            stars: result.stars.toString(),
            coins: result.coinsEarned.toString(),
            xp: result.xpEarned.toString(),
            time: formatTime(currentPuzzle.timeLimit - timeRemaining),
            level: currentLevel.toString(),
          },
        });
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [foundWords.length]);

  // Time's up
  useEffect(() => {
    if (timeRemaining <= 0 && currentPuzzle) {
      if (isDaily && foundWords.length > 0) {
        completeDailyChallenge();
      }
      router.replace({
        pathname: '/complete',
        params: {
          stars: Math.max(1, foundWords.length).toString(),
          coins: (foundWords.length * 50).toString(),
          xp: (foundWords.length * 30).toString(),
          time: formatTime(currentPuzzle.timeLimit),
          level: currentLevel.toString(),
          timeout: 'true',
        },
      });
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLetterPress = (letter: string, index: number) => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    
    if (selectedIndices.includes(index)) {
      // Deselect
      const idx = selectedIndices.indexOf(index);
      setSelectedIndices(prev => prev.filter((_, i) => i !== idx));
      selectLetter(letter, index);
    } else {
      // Select
      setSelectedIndices(prev => [...prev, index]);
      selectLetter(letter, index);
    }
  };

  const handleManualSubmit = () => {
    if (selectedLetters.length < 2) return;
    
    const success = submitWord();
    
    if (success) {
      if (settings.vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      submitScale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1)
      );
    } else {
      if (settings.vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      submitScale.value = withSequence(
        withTiming(0.9, { duration: 50 }),
        withSpring(1)
      );
    }
    
    setSelectedIndices([]);
  };

  const handleClear = () => {
    clearSelection();
    setSelectedIndices([]);
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
  };

  const handleHint = () => {
    const hint = useHint();
    if (hint) {
      setHintLetter(hint);
      if (settings.vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setTimeout(() => setHintLetter(null), 3000);
    }
  };

  const handleShuffle = () => {
    wheelRotation.value = withTiming(wheelRotation.value + 360, { duration: 500 });
    setLocalLetters(prev => [...prev].sort(() => Math.random() - 0.5));
    handleClear();
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const submitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  // Calculate letter positions in a circle
  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const radius = (WHEEL_SIZE - LETTER_SIZE) / 2 - 10;
    return {
      left: WHEEL_SIZE / 2 + radius * Math.cos(angle) - LETTER_SIZE / 2,
      top: WHEEL_SIZE / 2 + radius * Math.sin(angle) - LETTER_SIZE / 2,
    };
  };

  if (!currentPuzzle) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Yüklənir...</Text>
      </View>
    );
  }

  const progress = timeRemaining / currentPuzzle.timeLimit;

  return (
    <View style={styles.container}>
      {/* Full Black Background */}
      <View style={StyleSheet.absoluteFill} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.levelText}>
              {isDaily ? 'Gündəlik Yarış' : `Səviyyə ${currentLevel}`}
            </Text>
            <LinearGradient
              colors={[theme.secondary, theme.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumLabelGradient}
            >
              <Text style={styles.premiumLabel}>LEXORA</Text>
            </LinearGradient>
          </View>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>QALAN VAXT</Text>
          <Text style={[styles.timerValue, progress < 0.3 && { color: theme.error }]}>{formatTime(timeRemaining)}</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <LinearGradient
            colors={progress < 0.3 ? [theme.error, theme.coral] : [theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {/* Word Slots */}
        <View style={styles.wordSlotsContainer}>
          {currentPuzzle.targetWords.map((word, wordIndex) => (
            <View key={wordIndex} style={styles.wordRow}>
              {word.split('').map((letter, letterIndex) => {
                const isFound = foundWords.includes(word);
                const isHinted = hintLetter === letter && letterIndex === 0;
                return (
                  <View key={letterIndex} style={styles.letterSlotContainer}>
                    {isFound ? (
                      <LinearGradient
                        colors={[theme.accent, theme.teal]}
                        style={styles.letterSlotFound}
                      >
                        <Text style={styles.letterSlotTextFound}>{letter}</Text>
                      </LinearGradient>
                    ) : isHinted ? (
                      <LinearGradient
                        colors={[theme.gold, theme.tertiary]}
                        style={styles.letterSlotHinted}
                      >
                        <Text style={styles.letterSlotTextHinted}>{letter}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.letterSlot}>
                        <Text style={styles.letterSlotText}></Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Current Selection */}
        {selectedLetters.length > 0 && (
          <Animated.View style={[styles.selectionContainer, submitStyle]}>
            <Pressable style={styles.selectionBox} onPress={handleManualSubmit}>
              <LinearGradient
                colors={['rgba(0, 122, 255, 0.3)', 'rgba(94, 92, 230, 0.2)']}
                style={styles.selectionGradient}
              >
                <Text style={styles.selectionText}>{selectedLetters.join(' ')}</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton} onPress={handleHint}>
            <LinearGradient
              colors={['rgba(255, 214, 10, 0.2)', 'rgba(255, 159, 10, 0.1)']}
              style={styles.actionButtonGradient}
            >
              <View style={styles.actionIconBg}>
                <LinearGradient
                  colors={[theme.gold, theme.tertiary]}
                  style={styles.actionIconGradient}
                >
                  <Ionicons name="bulb" size={20} color="#000" />
                </LinearGradient>
              </View>
              <Text style={styles.actionLabel}>İPUCU ({hints})</Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={handleShuffle}>
            <LinearGradient
              colors={['rgba(100, 210, 255, 0.2)', 'rgba(0, 122, 255, 0.1)']}
              style={styles.actionButtonGradient}
            >
              <View style={styles.actionIconBg}>
                <LinearGradient
                  colors={[theme.cyan, theme.primary]}
                  style={styles.actionIconGradient}
                >
                  <Ionicons name="shuffle" size={20} color="#000" />
                </LinearGradient>
              </View>
              <Text style={styles.actionLabel}>QARIŞDIR</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Letter Wheel */}
        <View style={styles.wheelContainer}>
          <Animated.View style={[styles.wheel, wheelStyle]}>
            {/* Outer ring */}
            <LinearGradient
              colors={['rgba(0, 122, 255, 0.2)', 'rgba(191, 90, 242, 0.1)']}
              style={styles.wheelOuter}
            />
            
            {/* Letters */}
            {localLetters.map((letter, index) => {
              const pos = getLetterPosition(index, localLetters.length);
              const isSelected = selectedIndices.includes(index);
              
              return (
                <AnimatedPressable
                  key={index}
                  style={[
                    styles.letterButton,
                    { left: pos.left, top: pos.top },
                  ]}
                  onPress={() => handleLetterPress(letter, index)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={[theme.primary, theme.indigo]}
                      style={styles.letterButtonSelected}
                    >
                      <Text style={styles.letterTextSelected}>{letter}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.letterButtonInner}>
                      <Text style={styles.letterText}>{letter}</Text>
                    </View>
                  )}
                </AnimatedPressable>
              );
            })}
            
            {/* Center */}
            <Pressable style={styles.wheelCenter} onPress={handleClear}>
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.9)', 'rgba(20, 20, 30, 0.8)']}
                style={styles.centerGradient}
              >
                <Ionicons name="arrow-undo" size={28} color={theme.primary} />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  safeArea: {
    flex: 1,
  },

  loadingText: {
    fontSize: 18,
    color: theme.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  headerCenter: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  premiumLabelGradient: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  premiumLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 1,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  progressBar: {
    height: 5,
    backgroundColor: theme.surface,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  wordSlotsContainer: {
    alignItems: 'center',
    paddingTop: 28,
    gap: 10,
  },
  wordRow: {
    flexDirection: 'row',
    gap: 8,
  },
  letterSlotContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  letterSlot: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.primary,
  },
  letterSlotFound: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterSlotHinted: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterSlotText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  letterSlotTextFound: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  letterSlotTextHinted: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  selectionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectionBox: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectionGradient: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  selectionText: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.textPrimary,
    letterSpacing: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
    paddingHorizontal: 40,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  actionIconBg: {
    marginBottom: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelOuter: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  letterButton: {
    position: 'absolute',
    width: LETTER_SIZE,
    height: LETTER_SIZE,
    borderRadius: LETTER_SIZE / 2,
    overflow: 'hidden',
  },
  letterButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: LETTER_SIZE / 2,
    backgroundColor: 'rgba(0, 122, 255, 0.25)',
    borderWidth: 2,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterButtonSelected: {
    width: '100%',
    height: '100%',
    borderRadius: LETTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  letterText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  letterTextSelected: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  wheelCenter: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    overflow: 'hidden',
  },
  centerGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CENTER_SIZE / 2,
    borderWidth: 2,
    borderColor: theme.primary,
  },
});
