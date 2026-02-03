import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import { theme, shadows } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

const WEEKDAYS = ['B.E', 'Ç.A', 'Ç.', 'C.A', 'C.', 'Ş.', 'B.'];
const MONTHS = [
  'YANVAR', 'FEVRAL', 'MART', 'APREİL', 'MAY', 'İYUN',
  'İYUL', 'AVQUST', 'SENTYABR', 'OKTYABR', 'NOYABR', 'DEKABR'
];

export default function ChallengesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    streak, 
    dailyStreak, 
    dailyCompleted,
    completedDays,
    dailyCompletedDates,
    settings,
    startDailyChallenge,
    isDayCompleted,
  } = useGame();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Check if today's challenge is completed
  const todayString = today.toISOString().split('T')[0];
  const isTodayCompleted = isDayCompleted(todayString);

  // Calculate total diamonds earned this month
  const totalDiamonds = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dailyCompletedDates.includes(dateStr)) {
        count += 10; // 10 diamonds per completed day
      }
    }
    return count;
  }, [dailyCompletedDates, year, month, daysInMonth]);
  
  const handlePrevMonth = () => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    if (settings.vibrationEnabled) {
      Haptics.selectionAsync();
    }
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleStartDaily = () => {
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    startDailyChallenge();
    router.push('/game?daily=true');
  };

  const renderCalendar = () => {
    const cells = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
    }
    
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && 
                      month === today.getMonth() && 
                      year === today.getFullYear();
      const isCompleted = dailyCompletedDates.includes(dateStr) || 
                          (isToday && isTodayCompleted) ||
                          (month === today.getMonth() && year === today.getFullYear() && completedDays.includes(day));
      const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isFuture = new Date(year, month, day) > today;
      
      cells.push(
        <View key={day} style={styles.calendarCell}>
          {isCompleted ? (
            <LinearGradient
              colors={[theme.accent, theme.teal]}
              style={styles.completedDay}
            >
              <Ionicons name="diamond" size={16} color="#FFF" />
            </LinearGradient>
          ) : (
            <View style={[
              styles.dayCircle,
              isToday && styles.todayCircle,
            ]}>
              {isToday ? (
                <LinearGradient
                  colors={[theme.primary, theme.indigo]}
                  style={styles.todayGradient}
                >
                  <Text style={styles.todayText}>{day}</Text>
                </LinearGradient>
              ) : (
                <Text style={[
                  styles.dayText,
                  isPast && !isCompleted && styles.missedText,
                  isFuture && styles.futureText,
                ]}>
                  {day}
                </Text>
              )}
            </View>
          )}
        </View>
      );
    }
    
    return cells;
  };

  return (
    <View style={styles.container}>
      {/* Full Black Background */}
      <View style={StyleSheet.absoluteFill} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Gündəlik Yarış</Text>
            <View style={styles.premiumBadge}>
              <LinearGradient
                colors={[theme.accent, theme.teal]}
                style={styles.premiumBadgeGradient}
              >
                <Ionicons name="flash" size={16} color="#FFF" />
              </LinearGradient>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(48, 209, 88, 0.2)', 'rgba(48, 209, 88, 0.05)']}
                style={styles.statCardGradient}
              >
                <View style={styles.statCardHeader}>
                  <Text style={styles.statCardLabel}>CARİ SERİYA</Text>
                  {dailyStreak > 0 && (
                    <View style={styles.streakBadge}>
                      <Text style={styles.streakBadgeText}>🔥</Text>
                    </View>
                  )}
                </View>
                <View style={styles.statCardValue}>
                  <Ionicons name="flame" size={24} color={theme.tertiary} />
                  <Text style={styles.statNumber}>{dailyStreak} Gün</Text>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(100, 210, 255, 0.2)', 'rgba(100, 210, 255, 0.05)']}
                style={styles.statCardGradient}
              >
                <Text style={styles.statCardLabel}>ÜMUMİ ALMAZLAR</Text>
                <View style={styles.statCardValue}>
                  <Ionicons name="diamond" size={22} color={theme.cyan} />
                  <Text style={styles.statNumber}>{totalDiamonds + 450}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Daily Challenge Card */}
          <View style={styles.challengeCard}>
            <LinearGradient
              colors={['rgba(48, 209, 88, 0.15)', 'rgba(64, 200, 224, 0.08)', 'rgba(0, 0, 0, 0)']}
              style={styles.challengeGradient}
            >
              {/* Letter Wheel Preview */}
              <View style={styles.wheelPreview}>
                <View style={styles.wheelOuter}>
                  {['C', 'R', 'T', 'Ə', 'L', 'Z', 'E', 'K', 'I', 'Y', 'Ğ', 'B', 'E', 'R', 'T', 'Ə'].map((letter, i) => (
                    <Text 
                      key={i} 
                      style={[
                        styles.wheelLetter,
                        { 
                          transform: [
                            { rotate: `${(i * 360 / 16)}deg` },
                            { translateY: -65 }
                          ]
                        }
                      ]}
                    >
                      {letter}
                    </Text>
                  ))}
                </View>
                <LinearGradient
                  colors={isTodayCompleted ? [theme.textMuted, theme.textSecondary] : [theme.accent, theme.teal]}
                  style={styles.wheelCenter}
                >
                  <Text style={styles.wheelCenterText}>
                    {isTodayCompleted ? '✓' : 'LEX'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Challenge Info */}
              <View style={styles.challengeInfo}>
                <View style={styles.challengeLabelRow}>
                  <LinearGradient
                    colors={isTodayCompleted ? [theme.textMuted, theme.textSecondary] : [theme.accent, theme.teal]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.challengeLabelBadge}
                  >
                    <Text style={styles.challengeLabel}>
                      {isTodayCompleted ? 'TAMAMLANDI' : 'GÜNÜN TAPMACASI'}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.challengeRow}>
                  <Text style={styles.challengeTitle}>Səviyyə: Ekspert</Text>
                  <View style={styles.rewardBadge}>
                    <Text style={styles.rewardText}>500 Xal</Text>
                    <Text style={styles.recordText}>REKORD: 1:45</Text>
                  </View>
                </View>
                <View style={styles.durationRow}>
                  <View style={styles.durationIcon}>
                    <Ionicons name="time" size={16} color={theme.cyan} />
                  </View>
                  <Text style={styles.durationText}>Müddət: 02:00 dəqiqə</Text>
                </View>
                
                <Pressable 
                  style={[styles.startButton, isTodayCompleted && styles.startButtonDisabled]} 
                  onPress={handleStartDaily}
                  disabled={isTodayCompleted}
                >
                  <LinearGradient
                    colors={isTodayCompleted ? [theme.textMuted, theme.surfaceLight] : [theme.accent, theme.teal]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startButtonGradient}
                  >
                    <Text style={[styles.startButtonText, isTodayCompleted && { color: theme.textSecondary }]}>
                      {isTodayCompleted ? 'Tamamlandı' : 'Başla'}
                    </Text>
                    {!isTodayCompleted && (
                      <Ionicons name="arrow-forward" size={20} color="#000" />
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          {/* Calendar */}
          <View style={styles.calendarCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.calendarCardGradient}
            >
              {/* Month Navigation */}
              <View style={styles.monthNav}>
                <Pressable onPress={handlePrevMonth} style={styles.navButton}>
                  <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
                </Pressable>
                <Text style={styles.monthText}>{MONTHS[month]} {year}</Text>
                <Pressable onPress={handleNextMonth} style={styles.navButton}>
                  <Ionicons name="chevron-forward" size={20} color={theme.textPrimary} />
                </Pressable>
              </View>
              
              {/* Weekday Headers */}
              <View style={styles.weekdayRow}>
                {WEEKDAYS.map((day, i) => (
                  <Text key={i} style={styles.weekdayText}>{day}</Text>
                ))}
              </View>
              
              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>
              
              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <LinearGradient
                    colors={[theme.accent, theme.teal]}
                    style={styles.legendIcon}
                  >
                    <Ionicons name="diamond" size={10} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.legendText}>TAMAMLANDI</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDot} />
                  <Text style={styles.legendText}>GÖZLƏYİR</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Tip Box */}
          <View style={styles.tipBox}>
            <LinearGradient
              colors={['rgba(255, 214, 10, 0.15)', 'rgba(255, 159, 10, 0.05)']}
              style={styles.tipBoxGradient}
            >
              <Ionicons name="bulb" size={22} color={theme.gold} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Məsləhət</Text>
                <Text style={styles.tipText}>Hər gün oynayaraq seriya bonusu qazanın!</Text>
              </View>
            </LinearGradient>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  premiumBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  premiumBadgeGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  statCardValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  streakBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  streakBadgeText: {
    fontSize: 14,
  },
  challengeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(48, 209, 88, 0.3)',
    ...shadows.glass,
  },
  challengeGradient: {
    padding: 20,
  },
  wheelPreview: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wheelOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(48, 209, 88, 0.3)',
    position: 'absolute',
  },
  wheelLetter: {
    position: 'absolute',
    fontSize: 10,
    color: 'rgba(48, 209, 88, 0.5)',
    fontWeight: '600',
    left: '50%',
    top: '50%',
  },
  wheelCenter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelCenterText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  challengeInfo: {
    alignItems: 'flex-start',
  },
  challengeLabelRow: {
    marginBottom: 10,
  },
  challengeLabelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  challengeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  challengeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  rewardBadge: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.accent,
  },
  recordText: {
    fontSize: 10,
    color: theme.textSecondary,
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  durationIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 210, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  startButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  calendarCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
  },
  calendarCardGradient: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    letterSpacing: 1,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    overflow: 'hidden',
  },
  todayGradient: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  todayText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  missedText: {
    color: theme.textMuted,
  },
  futureText: {
    color: theme.textMuted,
    opacity: 0.5,
  },
  completedDay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: theme.glassBorder,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.textMuted,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  tipBox: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipBoxGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.2)',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.gold,
  },
  tipText: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
});
