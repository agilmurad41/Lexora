import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGame } from '../contexts/GameContext';
import { theme, shadows } from '../constants/theme';
import { config } from '../constants/config';

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { coins, hints, addCoins, buyHints } = useGame();

  const handleBuyCoins = (amount: number) => {
    addCoins(amount);
  };

  const handleBuyBooster = (boosterId: string, price: number) => {
    if (boosterId === 'hints') {
      buyHints(5, price);
    } else if (boosterId === 'time') {
      if (coins >= price) {
        addCoins(-price);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Vibrant Gradient Background */}
      <LinearGradient
        colors={['#1a0a28', '#0a1028', '#000000']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Orbs */}
      <View style={styles.decorativeOrb1} />
      <View style={styles.decorativeOrb2} />
      <View style={styles.decorativeOrb3} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Mağaza</Text>
          <View style={styles.coinBadge}>
            <LinearGradient
              colors={['rgba(255, 214, 10, 0.2)', 'rgba(255, 159, 10, 0.1)']}
              style={styles.coinBadgeGradient}
            >
              <Ionicons name="wallet" size={16} color={theme.gold} />
              <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
            </LinearGradient>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Title */}
          <View style={styles.premiumHeader}>
            <LinearGradient
              colors={[theme.secondary, theme.primary, theme.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumTitleGradient}
            >
              <Text style={styles.premiumTitle}>Lexora Premium</Text>
            </LinearGradient>
            <Text style={styles.premiumSubtitle}>Sözlərin dünyasında üstünlük qazan</Text>
          </View>

          {/* Mega Pack */}
          <Text style={styles.sectionLabel}>XÜSUSİ TƏKLİF</Text>
          <Pressable style={styles.megaPackCard}>
            <LinearGradient
              colors={[theme.secondary, theme.indigo, theme.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.megaPackGradient}
            >
              <View style={styles.popularBadge}>
                <LinearGradient
                  colors={[theme.accent, theme.teal]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.popularBadgeGradient}
                >
                  <Text style={styles.popularText}>ƏN POPULYAR</Text>
                </LinearGradient>
              </View>
              <View style={styles.megaPackContent}>
                <Text style={styles.megaPackTitle}>Mega Paket</Text>
                <Text style={styles.megaPackDesc}>{config.shop.megaPack.label}</Text>
              </View>
              <View style={styles.megaPackPrice}>
                <LinearGradient
                  colors={[theme.accent, theme.teal]}
                  style={styles.megaPackPriceGradient}
                >
                  <Text style={styles.priceText}>{config.shop.megaPack.price}</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Coin Packages */}
          <Text style={styles.sectionTitle}>Sikkə Paketləri</Text>
          <View style={styles.coinPackages}>
            {config.shop.coinPackages.map((pkg, index) => {
              const gradientColors = [
                ['rgba(0, 122, 255, 0.2)', 'rgba(0, 122, 255, 0.05)'],
                ['rgba(48, 209, 88, 0.2)', 'rgba(48, 209, 88, 0.05)'],
                ['rgba(255, 159, 10, 0.2)', 'rgba(255, 159, 10, 0.05)'],
                ['rgba(191, 90, 242, 0.2)', 'rgba(191, 90, 242, 0.05)'],
              ];
              const iconColors = [theme.primary, theme.accent, theme.tertiary, theme.secondary];
              const buttonGradients = [
                [theme.primary, theme.indigo],
                [theme.accent, theme.teal],
                [theme.tertiary, theme.gold],
                [theme.secondary, theme.pink],
              ];
              
              return (
                <Pressable 
                  key={pkg.id} 
                  style={styles.coinPackage}
                  onPress={() => handleBuyCoins(pkg.coins)}
                >
                  <LinearGradient
                    colors={gradientColors[index] as [string, string]}
                    style={styles.coinPackageGradient}
                  >
                    <View style={[styles.coinIconBg, { backgroundColor: `${iconColors[index]}30` }]}>
                      <Ionicons 
                        name={index === 0 ? 'wallet' : index === 1 ? 'diamond' : index === 2 ? 'cube' : 'trophy'}
                        size={26} 
                        color={iconColors[index]} 
                      />
                    </View>
                    <Text style={styles.coinAmount}>{pkg.coins.toLocaleString()} Sikkə</Text>
                    <Text style={styles.coinLabel}>{pkg.label}</Text>
                    <LinearGradient
                      colors={buttonGradients[index] as [string, string]}
                      style={styles.priceButton}
                    >
                      <Text style={styles.priceButtonText}>{pkg.price}</Text>
                    </LinearGradient>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>

          {/* Boosters */}
          <Text style={styles.sectionTitle}>Gücləndiricilər</Text>
          <View style={styles.boosterList}>
            {config.shop.boosters.map((booster, index) => (
              <Pressable 
                key={booster.id} 
                style={styles.boosterItem}
                onPress={() => handleBuyBooster(booster.id, booster.price)}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                  style={styles.boosterItemGradient}
                >
                  <View style={styles.boosterIcon}>
                    <LinearGradient
                      colors={index === 0 ? [theme.gold, theme.tertiary] : [theme.cyan, theme.primary]}
                      style={styles.boosterIconGradient}
                    >
                      <Ionicons 
                        name={booster.icon as any} 
                        size={22} 
                        color="#000" 
                      />
                    </LinearGradient>
                  </View>
                  <View style={styles.boosterInfo}>
                    <Text style={styles.boosterName}>{booster.name}</Text>
                    <Text style={styles.boosterDesc}>{booster.description}</Text>
                  </View>
                  <Pressable style={styles.boosterPrice}>
                    <LinearGradient
                      colors={['rgba(255, 214, 10, 0.2)', 'rgba(255, 159, 10, 0.1)']}
                      style={styles.boosterPriceGradient}
                    >
                      <Ionicons name="wallet" size={14} color={theme.gold} />
                      <Text style={styles.boosterPriceText}>{booster.price}</Text>
                    </LinearGradient>
                  </Pressable>
                </LinearGradient>
              </Pressable>
            ))}
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
  decorativeOrb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(191, 90, 242, 0.15)',
    top: -100,
    right: -100,
  },
  decorativeOrb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    top: 350,
    left: -80,
  },
  decorativeOrb3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    bottom: 200,
    right: -50,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
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
  content: {
    paddingHorizontal: 20,
  },
  premiumHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  premiumTitleGradient: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    fontStyle: 'italic',
  },
  premiumSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  megaPackCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    ...shadows.glowPurple,
  },
  megaPackGradient: {
    padding: 20,
    minHeight: 170,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  popularBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  megaPackContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  megaPackTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
  },
  megaPackDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  megaPackPrice: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  megaPackPriceGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 16,
  },
  coinPackages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  coinPackage: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  coinPackageGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  coinIconBg: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  coinAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  coinLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 4,
    marginBottom: 14,
  },
  priceButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },
  priceButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  boosterList: {
    gap: 12,
  },
  boosterItem: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  boosterItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  boosterIcon: {
    marginRight: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  boosterIconGradient: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boosterInfo: {
    flex: 1,
  },
  boosterName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  boosterDesc: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  boosterPrice: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  boosterPriceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.2)',
  },
  boosterPriceText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.gold,
  },
});
