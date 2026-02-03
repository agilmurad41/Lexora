import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme, shadows } from '../constants/theme';
import { useGame } from '../contexts/GameContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function CompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    stars: string;
    coins: string;
    xp: string;
    time: string;
    level: string;
    timeout?: string;
  }>();
  
  const { currentLevel } = useGame();
  
  const stars = parseInt(params.stars || '3');
  const coinsEarned = parseInt(params.coins || '150');
  const xpEarned = parseInt(params.xp || '100');
  const timeUsed = params.time || '0:45';
  const level = parseInt(params.level || '1');
  const isTimeout = params.timeout === 'true';

  // Animation values
  const titleScale = useSharedValue(0);
  const card1Scale = useSharedValue(0);
  const card2Scale = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    titleScale.value = withSpring(1);
    card1Scale.value = withDelay(200, withSpring(1));
    card2Scale.value = withDelay(400, withSpring(1));
    buttonScale.value = withDelay(600, withSpring(1));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const card1Style = useAnimatedStyle(() => ({
    transform: [{ scale: card1Scale.value }],
  }));

  const card2Style = useAnimatedStyle(() => ({
    transform: [{ scale: card2Scale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/game');
  };

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  // Calculate XP progress
  const currentXP = 750;
  const nextLevelXP = 1000;
  const progress = currentXP / nextLevelXP;

  return (
    <View style={styles.container}>
      {/* Vibrant Background */}
      <LinearGradient
        colors={['#1a1008', '#0f0a05', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Orbs */}
      <View style={styles.decorativeOrb1} />
      <View style={styles.decorativeOrb2} />
      
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={handleHome}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Lexora</Text>
          <Pressable style={styles.shareButton}>
            <Ionicons name="share-social" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Animated.View style={[styles.titleContainer, titleStyle]}>
            <LinearGradient
              colors={[theme.gold, theme.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.congratsGradient}
            >
              <Text style={styles.congratsText}>
                {isTimeout ? 'Vaxt Bitdi!' : 'Təbriklər!'}
              </Text>
            </LinearGradient>
            <Text style={styles.levelCompleteText}>
              Səviyyə {level} Tamamlandı
            </Text>
          </Animated.View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <Animated.View style={[styles.statCard, card1Style]}>
              <LinearGradient
                colors={['rgba(255, 214, 10, 0.15)', 'rgba(255, 159, 10, 0.05)']}
                style={styles.statCardGradient}
              >
                <View style={styles.statIconBg}>
                  <LinearGradient
                    colors={[theme.gold, theme.tertiary]}
                    style={styles.statIconGradient}
                  >
                    <Ionicons name="star" size={22} color="#000" />
                  </LinearGradient>
                </View>
                <Text style={styles.statLabel}>ULDUZLAR</Text>
                <Text style={styles.statValue}>{stars} / 3</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View style={[styles.statCard, card2Style]}>
              <LinearGradient
                colors={['rgba(48, 209, 88, 0.15)', 'rgba(64, 200, 224, 0.05)']}
                style={styles.statCardGradient}
              >
                <View style={styles.statIconBg}>
                  <LinearGradient
                    colors={[theme.accent, theme.teal]}
                    style={styles.statIconGradient}
                  >
                    <Ionicons name="wallet" size={22} color="#000" />
                  </LinearGradient>
                </View>
                <Text style={styles.statLabel}>QAZANC</Text>
                <Text style={styles.statValue}>+{coinsEarned}</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Bonus Row */}
          <Animated.View style={[styles.bonusRow, card1Style]}>
            <View style={styles.bonusItem}>
              <LinearGradient
                colors={['rgba(255, 214, 10, 0.2)', 'rgba(255, 159, 10, 0.1)']}
                style={styles.bonusItemGradient}
              >
                <View style={styles.bonusIcon}>
                  <LinearGradient
                    colors={[theme.gold, theme.tertiary]}
                    style={styles.bonusIconGradient}
                  >
                    <Ionicons name="flash" size={16} color="#000" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={styles.bonusLabel}>SÜRƏT BONUSU</Text>
                  <Text style={styles.bonusValue}>+50 XP</Text>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.bonusItem}>
              <LinearGradient
                colors={['rgba(100, 210, 255, 0.2)', 'rgba(0, 122, 255, 0.1)']}
                style={styles.bonusItemGradient}
              >
                <View style={styles.bonusIcon}>
                  <LinearGradient
                    colors={[theme.cyan, theme.primary]}
                    style={styles.bonusIconGradient}
                  >
                    <Ionicons name="timer" size={16} color="#000" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={styles.bonusLabel}>VAXT</Text>
                  <Text style={styles.bonusValue}>{timeUsed}</Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Progress to next level */}
          <Animated.View style={[styles.progressSection, card2Style]}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Növbəti Səviyyə: {level + 1}</Text>
              <Text style={styles.progressXP}>{currentXP} / {nextLevelXP} XP</Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[theme.gold, theme.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressHint}>Növbəti mərhələyə az qaldı!</Text>
          </Animated.View>

          {/* Action Button */}
          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <LinearGradient
                colors={[theme.gold, theme.tertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>NÖVBƏTİ</Text>
                <Ionicons name="arrow-forward" size={22} color="#000" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            <View style={styles.paginationDot} />
            <LinearGradient
              colors={[theme.gold, theme.tertiary]}
              style={[styles.paginationDot, styles.paginationDotActive]}
            />
            <View style={styles.paginationDot} />
          </View>
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
  decorativeOrb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 214, 10, 0.1)',
    top: -80,
    right: -100,
  },
  decorativeOrb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 159, 10, 0.08)',
    bottom: 150,
    left: -80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  congratsGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  congratsText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
  },
  levelCompleteText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  statIconBg: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 4,
  },
  bonusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  bonusItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bonusItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  bonusIcon: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  bonusIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonusLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  bonusValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  progressSection: {
    marginBottom: 28,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 15,
    color: theme.textPrimary,
  },
  progressXP: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.gold,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressHint: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.card,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.surface,
  },
  paginationDotActive: {
    width: 24,
  },
});
