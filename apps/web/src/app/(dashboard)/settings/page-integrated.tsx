'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import {
  useUserProfile,
  useUpdateProfile,
  useChangePassword,
  useNotificationSettings,
  useUpdateNotificationSettings,
  usePrivacySettings,
  useUpdatePrivacySettings,
  useAccountSettings,
  useUpdateAccountSettings,
  useDeleteAccount,
  useRequestDataExport,
} from '@/hooks/useSettings';
import toast from '@/lib/toast';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  // Fetch data
  const { data: profileData, isLoading: loadingProfile } = useUserProfile();
  const { data: notificationSettings } = useNotificationSettings();
  const { data: privacySettings } = usePrivacySettings();
  const { data: accountSettings } = useAccountSettings();

  // Mutations
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const updateNotifications = useUpdateNotificationSettings();
  const updatePrivacy = useUpdatePrivacySettings();
  const updateAccount = useUpdateAccountSettings();
  const deleteAccount = useDeleteAccount();
  const requestExport = useRequestDataExport();

  // Forms
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema as any),
    defaultValues: profileData,
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema as any),
  });

  // Update form when data loads
  useEffect(() => {
    if (profileData) {
      profileForm.reset(profileData);
    }
  }, [profileData]);

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const onProfileSubmit = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync(data);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await changePassword.mutateAsync(data);
    passwordForm.reset();
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    await updateNotifications.mutateAsync({ [key]: value });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      const password = window.prompt('Please enter your password to confirm:');
      if (password) {
        await deleteAccount.mutateAsync(password);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Profile Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                {loadingProfile ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        {...profileForm.register('email')}
                        type="email"
                        className={cn(
                          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                          profileForm.formState.errors.email && 'border-red-300'
                        )}
                      />
                      {profileForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          {...profileForm.register('firstName')}
                          type="text"
                          className={cn(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            profileForm.formState.errors.firstName && 'border-red-300'
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          {...profileForm.register('lastName')}
                          type="text"
                          className={cn(
                            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            profileForm.formState.errors.lastName && 'border-red-300'
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        {...profileForm.register('phoneNumber')}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Password Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      {...passwordForm.register('currentPassword')}
                      type="password"
                      className={cn(
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        passwordForm.formState.errors.currentPassword && 'border-red-300'
                      )}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      {...passwordForm.register('newPassword')}
                      type="password"
                      className={cn(
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        passwordForm.formState.errors.newPassword && 'border-red-300'
                      )}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      {...passwordForm.register('confirmPassword')}
                      type="password"
                      className={cn(
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        passwordForm.formState.errors.confirmPassword && 'border-red-300'
                      )}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={changePassword.isPending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {changePassword.isPending ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>

              <div className="space-y-4">
                {notificationSettings && Object.entries(notificationSettings).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled as boolean}
                        onChange={(e) => handleNotificationToggle(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900">Request Data Export</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Download a copy of your health records
                  </p>
                  <button
                    onClick={() => requestExport.mutate()}
                    disabled={requestExport.isPending}
                    className="mt-3 text-blue-600 hover:text-blue-500 text-sm font-medium disabled:opacity-50"
                  >
                    {requestExport.isPending ? 'Requesting...' : 'Request Data Export'}
                  </button>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-800">Delete Account</h3>
                  <p className="text-sm text-red-600 mt-1">
                    Permanently delete your account and all associated data
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteAccount.isPending}
                    className="mt-3 text-red-600 hover:text-red-500 text-sm font-medium disabled:opacity-50"
                  >
                    {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && accountSettings && (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={accountSettings.language}
                    onChange={(e) => updateAccount.mutate({ language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    value={accountSettings.timezone}
                    onChange={(e) => updateAccount.mutate({ timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={accountSettings.dateFormat}
                    onChange={(e) => updateAccount.mutate({ dateFormat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
