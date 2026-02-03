import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import { theme, shadows } from '../../constants/theme';
import { currentUser } from '../../services/mockData';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { coins, currentLevel, totalScore, streak } = useGame();
  
  const playScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500 }),
        withTiming(0.4, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePlayPress = () => {
    playScale.value = withSpring(0.92, {}, () => {
      playScale.value = withSpring(1);
    });
    router.push('/game');
  };

  return (
    <View style={styles.container}>
      {/* Vibrant Gradient Background */}
      <LinearGradient
        colors={['#1a0a2e', '#0f1a2e', '#0a1e1a', '#000000']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Gradient Orbs */}
      <Animated.View style={[styles.glowOrb1, glowStyle]} />
      <Animated.View style={[styles.glowOrb2, glowStyle]} />
      <Animated.View style={[styles.glowOrb3, glowStyle]} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.userInfo}>
              <LinearGradient
                colors={[theme.primary, theme.secondary]}
                style={styles.avatarGradient}
              >
                <Image
                  source={{ uri: currentUser.avatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </LinearGradient>
              <View>
                <Text style={styles.greeting}>Xoş gəldin</Text>
                <Text style={styles.userName}>{currentUser.name}</Text>
              </View>
            </Pressable>
            <Pressable 
              style={styles.coinBadge}
              onPress={() => router.push('/shop')}
            >
              <LinearGradient
                colors={['rgba(255, 214, 10, 0.2)', 'rgba(255, 159, 10, 0.1)']}
                style={styles.coinBadgeGradient}
              >
                <Ionicons name="wallet" size={18} color={theme.gold} />
                <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Logo Section - Liquid Glass Style */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>LEXORA</Text>
              <LinearGradient
                colors={[theme.primary, theme.secondary, theme.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoUnderline}
              />
            </View>
          </View>

          {/* Stats Card - Liquid Glass */}
          <View style={styles.statsCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
              style={styles.statsCardGradient}
            >
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(0, 122, 255, 0.2)' }]}>
                  <Ionicons name="layers" size={20} color={theme.primary} />
                </View>
                <Text style={styles.statValue}>{currentLevel}</Text>
                <Text style={styles.statLabel}>SƏVİYYƏ</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(191, 90, 242, 0.2)' }]}>
                  <Ionicons name="star" size={20} color={theme.secondary} />
                </View>
                <Text style={styles.statValue}>{totalScore >= 1000 ? `${(totalScore / 1000).toFixed(1)}k` : totalScore}</Text>
                <Text style={styles.statLabel}>XALLAR</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(255, 159, 10, 0.2)' }]}>
                  <Ionicons name="flame" size={20} color={theme.tertiary} />
                </View>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>SERİYA</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Daily Task - Liquid Glass */}
          <Pressable style={styles.dailyTask}>
            <LinearGradient
              colors={['rgba(255, 214, 10, 0.15)', 'rgba(255, 159, 10, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dailyTaskGradient}
            >
              <View style={styles.dailyTaskIcon}>
                <LinearGradient
                  colors={[theme.gold, theme.tertiary]}
                  style={styles.dailyTaskIconGradient}
                >
                  <Ionicons name="gift" size={22} color="#000" />
                </LinearGradient>
              </View>
              <View style={styles.dailyTaskLeft}>
                <Text style={styles.dailyTaskTitle}>Günün Tapşırığı</Text>
                <Text style={styles.dailyTaskDesc}>10 söz tap və 50 qızıl qazan!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </LinearGradient>
          </Pressable>

          {/* Action Buttons - Colorful Glass */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => router.push('/leaderboard')}
            >
              <LinearGradient
                colors={['rgba(0, 122, 255, 0.2)', 'rgba(94, 92, 230, 0.1)']}
                style={styles.actionButtonGradient}
              >
                <View style={styles.actionIconContainer}>
                  <LinearGradient
                    colors={[theme.primary, theme.indigo]}
                    style={styles.actionIconGradient}
                  >
                    <Ionicons name="trophy" size={26} color="#FFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.actionLabel}>LİDERLƏR</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable 
              style={styles.actionButton}
              onPress={() => router.push('/shop')}
            >
              <LinearGradient
                colors={['rgba(191, 90, 242, 0.2)', 'rgba(255, 107, 157, 0.1)']}
                style={styles.actionButtonGradient}
              >
                <View style={styles.actionIconContainer}>
                  <LinearGradient
                    colors={[theme.secondary, theme.pink]}
                    style={styles.actionIconGradient}
                  >
                    <Ionicons name="bag" size={26} color="#FFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.actionLabel}>MAĞAZA</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Play Button - Vibrant Liquid Glass */}
          <View style={styles.playButtonWrapper}>
            <Animated.View style={[styles.playButtonGlow, glowStyle]} />
            <AnimatedPressable 
              style={[styles.playButtonContainer, playButtonStyle]}
              onPress={handlePlayPress}
            >
              <LinearGradient
                colors={[theme.primary, theme.indigo, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playButton}
              >
                <View style={styles.playInnerCircle}>
                  <Ionicons name="play" size={42} color="#FFF" />
                </View>
                <Text style={styles.playText}>OYNA</Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>

          {/* Bottom Icons */}
          <View style={styles.bottomIcons}>
            <Pressable style={styles.bottomIcon}>
              <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
            </Pressable>
            <Pressable style={styles.bottomIcon}>
              <Ionicons name="help-circle-outline" size={24} color={theme.textSecondary} />
            </Pressable>
            <Pressable style={styles.bottomIcon}>
              <Ionicons name="share-social-outline" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>
        </ScrollView>
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
  content: {
    paddingHorizontal: 20,
  },
  glowOrb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(191, 90, 242, 0.2)',
    top: -80,
    right: -80,
  },
  glowOrb2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    top: 300,
    left: -100,
  },
  glowOrb3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
    bottom: 150,
    right: -60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 28,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2.5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  greeting: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  coinBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  coinBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
  },
  coinText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.gold,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: '800',
    color: theme.textPrimary,
    letterSpacing: 10,
    textShadowColor: 'rgba(0, 122, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  logoUnderline: {
    width: 80,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
  statsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statsCardGradient: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    ...shadows.glass,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.glassBorder,
    marginVertical: 8,
  },
  dailyTask: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  dailyTaskGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.2)',
  },
  dailyTaskIcon: {
    marginRight: 14,
  },
  dailyTaskIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyTaskLeft: {
    flex: 1,
  },
  dailyTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  dailyTaskDesc: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  actionIconContainer: {
    marginBottom: 10,
  },
  actionIconGradient: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    letterSpacing: 0.5,
  },
  playButtonWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },
  playButtonGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    top: -10,
  },
  playButtonContainer: {
    borderRadius: 80,
    ...shadows.glow,
  },
  playButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playInnerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 3,
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  bottomIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
});
