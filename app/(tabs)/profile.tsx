import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Platform, Linking, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import { useAlert } from '@/template';
import { theme, shadows } from '../../constants/theme';
import { currentUser } from '../../services/mockData';
import * as Haptics from 'expo-haptics';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
}

function SettingItem({ icon, iconColor, iconBgColor, title, subtitle, rightElement, onPress, showArrow = true }: SettingItemProps) {
  const { settings } = useGame();
  
  const handlePress = () => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    onPress?.();
  };

  return (
    <Pressable 
      style={({ pressed }) => [styles.settingItem, pressed && styles.settingItemPressed]}
      onPress={handlePress}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.settingIconBg, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement ? rightElement : showArrow && onPress && (
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { 
    coins, 
    currentLevel, 
    totalScore, 
    streak, 
    hints,
    settings,
    updateSettings,
    resetProgress,
    addCoins,
  } = useGame();

  const handleToggleSound = (value: boolean) => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    updateSettings({ soundEnabled: value });
  };

  const handleToggleVibration = (value: boolean) => {
    if (value) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    updateSettings({ vibrationEnabled: value });
  };

  const handleToggleNotifications = (value: boolean) => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    updateSettings({ notificationsEnabled: value });
    showAlert(
      value ? 'Bildirişlər Aktiv' : 'Bildirişlər Deaktiv',
      value ? 'Gündəlik xatırlatmalar aktiv edildi.' : 'Bildirişlər söndürüldü.'
    );
  };

  const handleToggleDarkMode = (value: boolean) => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    updateSettings({ darkMode: value });
    showAlert('Tema', 'Qaranlıq rejim ' + (value ? 'aktivdir' : 'deaktivdir'));
  };

  const handleThemePress = () => {
    showAlert('Tema Seçimi', 'Hazırda yalnız Liquid Glass teması mövcuddur. Gələcəkdə yeni temalar əlavə olunacaq.');
  };

  const handleLanguagePress = () => {
    showAlert('Dil Seçimi', 'Hazırda yalnız Azərbaycan dili dəstəklənir.');
  };

  const handleSaveData = () => {
    showAlert(
      'Məlumatları Saxla',
      'Bu funksiya backend qoşulduqda aktiv olacaq. Hazırda bütün məlumatlar cihazınızda saxlanılır.',
      [
        { text: 'Anladım', style: 'default' }
      ]
    );
  };

  const handleRestorePurchases = () => {
    showAlert(
      'Alışları Bərpa Et',
      'Əvvəlki alışlarınız axtarılır...',
      [
        { 
          text: 'Tamam', 
          style: 'default',
          onPress: () => {
            setTimeout(() => {
              showAlert('Nəticə', 'Bərpa ediləcək alış tapılmadı.');
            }, 1000);
          }
        }
      ]
    );
  };

  const handleResetProgress = () => {
    showAlert(
      'Proqresi Sıfırla',
      'Bu əməliyyat bütün oyun proqresinizi siləcək. Səviyyələr, xallar və sikkələr sıfırlanacaq. Davam etmək istəyirsiniz?',
      [
        { text: 'Ləğv et', style: 'cancel' },
        { 
          text: 'Sıfırla', 
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            if (settings.vibrationEnabled) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            showAlert('Uğurlu', 'Proqres sıfırlandı.');
          }
        }
      ]
    );
  };

  const handleHelpCenter = () => {
    showAlert(
      'Kömək Mərkəzi',
      'Necə oynamalı?\n\n1. Dairəvi lövhədəki hərflərə toxunun\n2. Sözlər yaratmaq üçün hərfləri birləşdirin\n3. Düzgün söz avtomatik təsdiqlənir\n4. İpucu üçün lampaya toxunun\n5. Hərfləri qarışdırmaq üçün shuffle düyməsini istifadə edin',
      [{ text: 'Anladım', style: 'default' }]
    );
  };

  const handleContact = () => {
    showAlert(
      'Əlaqə',
      'Bizimlə əlaqə saxlamaq üçün:',
      [
        { text: 'Ləğv et', style: 'cancel' },
        { 
          text: 'E-poçt Göndər', 
          style: 'default',
          onPress: () => {
            Linking.openURL('mailto:support@lexora.az?subject=Lexora Dəstək');
          }
        }
      ]
    );
  };

  const handleRateApp = () => {
    showAlert(
      'Qiymətləndir',
      'Lexora-nı bəyəndiniz? App Store-da qiymətləndirin!',
      [
        { text: 'Sonra', style: 'cancel' },
        { 
          text: 'Qiymətləndir', 
          style: 'default',
          onPress: () => {
            // In production, this would open the app store
            showAlert('Təşəkkürlər!', 'Dəstəyiniz üçün minnətdarıq!');
          }
        }
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Lexora - Azərbaycanca söz tapmaca oyunu! Sənə də tövsiyə edirəm. 🎮🧩',
        title: 'Lexora',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handlePrivacyPolicy = () => {
    showAlert(
      'Məxfilik Siyasəti',
      'Lexora sizin məxfiliyinizə hörmət edir.\n\n• Şəxsi məlumatlarınız toplanmır\n• Oyun məlumatları yalnız cihazınızda saxlanılır\n• Reklam şəbəkələri ilə məlumat paylaşılmır\n\nSuallarınız üçün: privacy@lexora.az',
      [{ text: 'Bağla', style: 'default' }]
    );
  };

  const handleTermsOfUse = () => {
    showAlert(
      'İstifadə Şərtləri',
      'Lexora istifadə şərtləri:\n\n• Oyun yalnız şəxsi istifadə üçündür\n• Hesab paylaşmaq qadağandır\n• Aldatma proqramları istifadəsi qadağandır\n• Şərtləri pozanlara qarşı tədbirlər görülə bilər\n\nSon yenilənmə: Fevral 2026',
      [{ text: 'Qəbul edirəm', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient */}
      <LinearGradient
        colors={['#1a0a2e', '#0a1628', '#000000']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Blurs */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Ayarlar</Text>
          </View>

          {/* Profile Card */}
          <Pressable style={styles.profileCard}>
            <View style={styles.profileCardInner}>
              <View style={styles.avatarContainer}>
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
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{currentLevel}</Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <Text style={styles.userTitle}>Söz Ustası</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </View>
          </Pressable>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <LinearGradient
                colors={['rgba(0, 122, 255, 0.2)', 'rgba(0, 122, 255, 0.05)']}
                style={styles.statBoxGradient}
              >
                <View style={styles.statIconCircle}>
                  <Ionicons name="flame" size={20} color={theme.tertiary} />
                </View>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Seriya</Text>
              </LinearGradient>
            </View>
            <View style={styles.statBox}>
              <LinearGradient
                colors={['rgba(191, 90, 242, 0.2)', 'rgba(191, 90, 242, 0.05)']}
                style={styles.statBoxGradient}
              >
                <View style={[styles.statIconCircle, { backgroundColor: 'rgba(191, 90, 242, 0.3)' }]}>
                  <Ionicons name="star" size={20} color={theme.secondary} />
                </View>
                <Text style={styles.statValue}>{totalScore >= 1000 ? `${(totalScore / 1000).toFixed(1)}k` : totalScore}</Text>
                <Text style={styles.statLabel}>Xal</Text>
              </LinearGradient>
            </View>
            <View style={styles.statBox}>
              <LinearGradient
                colors={['rgba(255, 214, 10, 0.2)', 'rgba(255, 214, 10, 0.05)']}
                style={styles.statBoxGradient}
              >
                <View style={[styles.statIconCircle, { backgroundColor: 'rgba(255, 214, 10, 0.3)' }]}>
                  <Ionicons name="wallet" size={20} color={theme.gold} />
                </View>
                <Text style={styles.statValue}>{coins >= 1000 ? `${(coins / 1000).toFixed(1)}k` : coins}</Text>
                <Text style={styles.statLabel}>Sikkə</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Game Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Oyun Ayarları</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="volume-high"
                iconColor={theme.primary}
                iconBgColor="rgba(0, 122, 255, 0.2)"
                title="Səs Effektləri"
                rightElement={
                  <Switch
                    value={settings.soundEnabled}
                    onValueChange={handleToggleSound}
                    trackColor={{ false: theme.surfaceLight, true: theme.primary }}
                    thumbColor="#FFF"
                  />
                }
                showArrow={false}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="phone-portrait"
                iconColor={theme.secondary}
                iconBgColor="rgba(191, 90, 242, 0.2)"
                title="Vibrasiya"
                rightElement={
                  <Switch
                    value={settings.vibrationEnabled}
                    onValueChange={handleToggleVibration}
                    trackColor={{ false: theme.surfaceLight, true: theme.secondary }}
                    thumbColor="#FFF"
                  />
                }
                showArrow={false}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="notifications"
                iconColor={theme.tertiary}
                iconBgColor="rgba(255, 159, 10, 0.2)"
                title="Bildirişlər"
                subtitle={settings.notificationsEnabled ? 'Aktiv' : 'Deaktiv'}
                rightElement={
                  <Switch
                    value={settings.notificationsEnabled}
                    onValueChange={handleToggleNotifications}
                    trackColor={{ false: theme.surfaceLight, true: theme.tertiary }}
                    thumbColor="#FFF"
                  />
                }
                showArrow={false}
              />
            </View>
          </View>

          {/* Appearance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Görünüş</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="moon"
                iconColor={theme.indigo}
                iconBgColor="rgba(94, 92, 230, 0.2)"
                title="Qaranlıq Rejim"
                rightElement={
                  <Switch
                    value={settings.darkMode}
                    onValueChange={handleToggleDarkMode}
                    trackColor={{ false: theme.surfaceLight, true: theme.indigo }}
                    thumbColor="#FFF"
                  />
                }
                showArrow={false}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="color-palette"
                iconColor={theme.pink}
                iconBgColor="rgba(255, 107, 157, 0.2)"
                title="Tema"
                subtitle="Liquid Glass"
                onPress={handleThemePress}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="language"
                iconColor={theme.cyan}
                iconBgColor="rgba(100, 210, 255, 0.2)"
                title="Dil"
                subtitle="Azərbaycan"
                onPress={handleLanguagePress}
              />
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesab</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="cloud-upload"
                iconColor={theme.accent}
                iconBgColor="rgba(48, 209, 88, 0.2)"
                title="Məlumatları Saxla"
                subtitle="Buludda yedəklə"
                onPress={handleSaveData}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="refresh"
                iconColor={theme.teal}
                iconBgColor="rgba(64, 200, 224, 0.2)"
                title="Alışları Bərpa Et"
                onPress={handleRestorePurchases}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="trash"
                iconColor={theme.error}
                iconBgColor="rgba(255, 69, 58, 0.2)"
                title="Proqresi Sıfırla"
                onPress={handleResetProgress}
              />
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dəstək</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="help-circle"
                iconColor={theme.primary}
                iconBgColor="rgba(0, 122, 255, 0.2)"
                title="Kömək Mərkəzi"
                onPress={handleHelpCenter}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="chatbubble-ellipses"
                iconColor={theme.mint}
                iconBgColor="rgba(99, 230, 190, 0.2)"
                title="Əlaqə"
                subtitle="support@lexora.az"
                onPress={handleContact}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="star"
                iconColor={theme.gold}
                iconBgColor="rgba(255, 214, 10, 0.2)"
                title="Qiymətləndir"
                subtitle="App Store-da"
                onPress={handleRateApp}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="share-social"
                iconColor={theme.coral}
                iconBgColor="rgba(255, 98, 89, 0.2)"
                title="Dostlarla Paylaş"
                onPress={handleShareApp}
              />
            </View>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hüquqi</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="document-text"
                iconColor={theme.textSecondary}
                iconBgColor="rgba(255, 255, 255, 0.1)"
                title="Məxfilik Siyasəti"
                onPress={handlePrivacyPolicy}
              />
              <View style={styles.settingDivider} />
              <SettingItem
                icon="shield-checkmark"
                iconColor={theme.textSecondary}
                iconBgColor="rgba(255, 255, 255, 0.1)"
                title="İstifadə Şərtləri"
                onPress={handleTermsOfUse}
              />
            </View>
          </View>

          {/* Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Lexora v1.0.0</Text>
            <Text style={styles.versionSubtext}>Made with ❤️ in Azerbaijan</Text>
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
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(191, 90, 242, 0.15)',
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    top: 200,
    left: -80,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
    bottom: 100,
    right: -50,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  profileCard: {
    marginBottom: 20,
  },
  profileCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    ...shadows.glass,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.background,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  userTitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statBoxGradient: {
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 16,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 159, 10, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: theme.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    overflow: 'hidden',
    ...shadows.glass,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingItemPressed: {
    backgroundColor: theme.glassActive,
  },
  settingIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 1,
  },
  settingDivider: {
    height: 1,
    backgroundColor: theme.glassBorder,
    marginLeft: 56,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  versionSubtext: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 4,
  },
});
