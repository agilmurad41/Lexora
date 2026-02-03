import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { theme, shadows } from '../constants/theme';
import { leaderboardData, currentUser, LeaderboardEntry } from '../services/mockData';
import { useGame } from '../contexts/GameContext';

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { totalScore, currentLevel, streak } = useGame();

  // Cari istifadəçini real statistika ilə əlavə et
  const currentUserEntry: LeaderboardEntry = {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    score: totalScore,
    level: currentLevel,
    streak: streak,
    rank: 1,
    weeklyScore: totalScore,
    allTimeScore: totalScore,
  };

  const allPlayers = [currentUserEntry, ...leaderboardData];
  const sortedData = allPlayers.sort((a, b) => b.weeklyScore - a.weeklyScore);
  const hasEnoughPlayers = sortedData.length >= 3;
  const top3 = hasEnoughPlayers ? sortedData.slice(0, 3) : sortedData;
  const rest = hasEnoughPlayers ? sortedData.slice(3) : [];

  const renderRankItem = ({ item, index }: { item: typeof leaderboardData[0]; index: number }) => (
    <View style={styles.rankItem}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
        style={styles.rankItemGradient}
      >
        <View style={styles.rankNumberBg}>
          <Text style={styles.rankNumber}>{index + 4}</Text>
        </View>
        <Image
          source={{ uri: item.avatar }}
          style={styles.rankAvatar}
          contentFit="cover"
        />
        <Text style={styles.rankName}>{item.name}</Text>
        <Text style={styles.rankScore}>
          {item.weeklyScore.toLocaleString()}
          <Text style={styles.rankScoreLabel}> xal</Text>
        </Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Vibrant Background */}
      <LinearGradient
        colors={['#1a1028', '#0a1a28', '#000000']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Orbs */}
      <View style={styles.decorativeOrb1} />
      <View style={styles.decorativeOrb2} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Liderlər</Text>
          <Pressable style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Top 3 Podium - və ya tək oyunçu */}
        {hasEnoughPlayers ? (
          <View style={styles.podium}>
            {/* Second Place */}
            <View style={styles.podiumItem}>
              <View style={styles.silverMedal}>
                <LinearGradient
                  colors={['rgba(192, 192, 192, 0.3)', 'rgba(192, 192, 192, 0.1)']}
                  style={styles.medalGradient}
                >
                  <Image
                    source={{ uri: top3[1]?.avatar }}
                    style={styles.podiumAvatar}
                    contentFit="cover"
                  />
                </LinearGradient>
              </View>
              <Text style={styles.podiumName}>{top3[1]?.name}</Text>
              <Text style={[styles.podiumScore, { color: '#C0C0C0' }]}>
                {top3[1]?.weeklyScore?.toLocaleString()} xal
              </Text>
            </View>

            {/* First Place */}
            <View style={[styles.podiumItem, styles.firstPlace]}>
              <Ionicons name="crown" size={36} color={theme.gold} style={styles.crown} />
              <View style={styles.goldMedal}>
                <LinearGradient
                  colors={[theme.gold, theme.tertiary]}
                  style={styles.firstMedalGradient}
                >
                  <Image
                    source={{ uri: top3[0]?.avatar }}
                    style={[styles.podiumAvatar, styles.firstAvatar]}
                    contentFit="cover"
                  />
                </LinearGradient>
              </View>
              <Text style={[styles.podiumName, styles.firstName]}>{top3[0]?.name}</Text>
              <Text style={[styles.podiumScore, { color: theme.gold }]}>
                {top3[0]?.weeklyScore?.toLocaleString()} xal
              </Text>
            </View>

            {/* Third Place */}
            <View style={styles.podiumItem}>
              <View style={styles.bronzeMedal}>
                <LinearGradient
                  colors={['rgba(205, 127, 50, 0.3)', 'rgba(205, 127, 50, 0.1)']}
                  style={styles.medalGradient}
                >
                  <Image
                    source={{ uri: top3[2]?.avatar }}
                    style={styles.podiumAvatar}
                    contentFit="cover"
                  />
                </LinearGradient>
              </View>
              <Text style={styles.podiumName}>{top3[2]?.name}</Text>
              <Text style={[styles.podiumScore, { color: '#CD7F32' }]}>
                {top3[2]?.weeklyScore?.toLocaleString()} xal
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.singlePlayerPodium}>
            <Ionicons name="crown" size={44} color={theme.gold} style={styles.crown} />
            <View style={styles.goldMedal}>
              <LinearGradient
                colors={[theme.gold, theme.tertiary]}
                style={styles.firstMedalGradient}
              >
                <Image
                  source={{ uri: currentUserEntry.avatar }}
                  style={[styles.podiumAvatar, styles.firstAvatar]}
                  contentFit="cover"
                />
              </LinearGradient>
            </View>
            <Text style={[styles.podiumName, styles.firstName]}>{currentUserEntry.name}</Text>
            <Text style={[styles.podiumScore, { color: theme.gold }]}>
              {totalScore.toLocaleString()} xal
            </Text>
            <View style={styles.emptyStateBox}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.emptyStateGradient}
              >
                <Ionicons name="people-outline" size={32} color={theme.textMuted} />
                <Text style={styles.emptyStateText}>Hələlik başqa oyunçu yoxdur</Text>
                <Text style={styles.emptyStateSubtext}>Backend qoşulduqda digər oyunçular görünəcək</Text>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Rankings Header */}
        {rest.length > 0 && (
          <>
            <View style={styles.rankingsHeader}>
              <Text style={styles.rankingsTitle}>Sıralama</Text>
              <Text style={styles.rankingsCount}>Cəmi {sortedData.length.toLocaleString()} oyunçu</Text>
            </View>

            {/* Rankings List */}
            <View style={styles.listContainer}>
              <FlashList
                data={rest}
                renderItem={renderRankItem}
                estimatedItemSize={70}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 20 }}
              />
            </View>
          </>
        )}

        {/* Current User Position */}
        <View style={[styles.userPosition, { bottom: insets.bottom + 20 }]}>
          <LinearGradient
            colors={[theme.primary, theme.indigo, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.userPositionGradient}
          >
            <Image
              source={{ uri: currentUserEntry.avatar }}
              style={styles.userAvatar}
              contentFit="cover"
            />
            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>SƏNİN YERİN</Text>
              <Text style={styles.userRank}>#1 • Sən (Oyunçu)</Text>
            </View>
            <View style={styles.userScore}>
              <Text style={styles.userScoreValue}>{totalScore.toLocaleString()}</Text>
              <Text style={styles.userScoreLabel}>XAL</Text>
            </View>
          </LinearGradient>
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
    backgroundColor: 'rgba(191, 90, 242, 0.12)',
    top: -50,
    right: -100,
  },
  decorativeOrb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    top: 300,
    left: -80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 16,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  firstPlace: {
    marginBottom: 20,
  },
  crown: {
    marginBottom: -8,
    zIndex: 1,
  },
  podiumAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  firstAvatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  silverMedal: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  medalGradient: {
    padding: 4,
    borderRadius: 40,
  },
  goldMedal: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  firstMedalGradient: {
    padding: 4,
    borderRadius: 50,
  },
  bronzeMedal: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 10,
  },
  firstName: {
    fontSize: 16,
  },
  podiumScore: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
  },
  rankingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  rankingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  rankingsCount: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  listContainer: {
    flex: 1,
  },
  rankItem: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rankItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  rankNumberBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  rankAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  rankName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  rankScore: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  rankScoreLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.textSecondary,
  },
  userPosition: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 22,
    overflow: 'hidden',
    ...shadows.glow,
  },
  userPositionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  userRank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 2,
  },
  userScore: {
    alignItems: 'flex-end',
  },
  userScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  userScoreLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  singlePlayerPodium: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  emptyStateBox: {
    marginTop: 32,
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
