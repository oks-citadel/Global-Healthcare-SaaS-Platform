import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Card, Button } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by the root layout
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Update your profile details',
      icon: '👤',
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature will be available soon');
      },
    },
    {
      id: 'medical-history',
      title: 'Medical History',
      description: 'View your medical records',
      icon: '📋',
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature will be available soon');
      },
    },
    {
      id: 'change-password',
      title: 'Change Password',
      description: 'Update your password',
      icon: '🔑',
      onPress: () => {
        router.push('/settings/change-password');
      },
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Select your preferred language',
      icon: '🌐',
      onPress: () => {
        router.push('/settings/language');
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: '🔔',
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature will be available soon');
      },
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      icon: '🔒',
      onPress: () => {
        router.push('/settings/privacy');
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: '❓',
      onPress: () => {
        router.push('/settings/help');
      },
    },
    {
      id: 'about',
      title: 'About',
      description: 'App version and information',
      icon: 'ℹ️',
      onPress: () => {
        Alert.alert(
          'UnifiedHealth',
          'Version 1.0.0\n\nA comprehensive healthcare platform for patients and doctors.',
          [{ text: 'OK' }]
        );
      },
    },
  ];

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Card variant="elevated" padding="lg" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{getRoleLabel(user?.role || 'patient')}</Text>
            </View>
          </View>
        </View>

        {user?.phone && (
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{user.phone}</Text>
          </View>
        )}
      </Card>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === 0 && styles.menuItemFirst,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Text style={styles.menuItemIconText}>{item.icon}</Text>
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>
                  {item.description}
                </Text>
              </View>
              <Text style={styles.menuItemChevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    margin: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  roleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  contactLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  contactValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
  },
  menuSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuItemFirst: {
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
  },
  menuItemLast: {
    borderBottomLeftRadius: spacing.md,
    borderBottomRightRadius: spacing.md,
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuItemIconText: {
    fontSize: 20,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  menuItemDescription: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  menuItemChevron: {
    fontSize: 24,
    color: colors.gray[400],
    marginLeft: spacing.sm,
  },
  logoutSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  versionText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
