'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import apiClient, { getErrorMessage } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { PatientProfile, EmergencyContact } from '@/types';

// Validation schemas
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  bloodType: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      relationship: z.string(),
      phoneNumber: z.string(),
      email: z.string().email().optional(),
    })
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// API functions
const profileApi = {
  getProfile: async (): Promise<PatientProfile> => {
    const response = await apiClient.get<PatientProfile>('/patients/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<ProfileFormData>): Promise<PatientProfile> => {
    const response = await apiClient.put<PatientProfile>('/patients/profile', data);
    return response.data;
  },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          bloodType: profile.bloodType,
          height: profile.height,
          weight: profile.weight,
          address: profile.address,
          emergencyContact: profile.emergencyContact,
        }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to update profile:', getErrorMessage(error));
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                {...register('firstName')}
                disabled={!isEditing}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed',
                  errors.firstName && 'border-red-300'
                )}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                {...register('lastName')}
                disabled={!isEditing}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed',
                  errors.lastName && 'border-red-300'
                )}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                disabled={!isEditing}
                type="email"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed',
                  errors.email && 'border-red-300'
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                {...register('phoneNumber')}
                disabled={!isEditing}
                type="tel"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed',
                  errors.phoneNumber && 'border-red-300'
                )}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                {...register('dateOfBirth')}
                disabled={!isEditing}
                type="date"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                {...register('gender')}
                disabled={!isEditing}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Medical Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <input
                {...register('bloodType')}
                disabled={!isEditing}
                placeholder="e.g., A+"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                {...register('height', { valueAsNumber: true })}
                disabled={!isEditing}
                type="number"
                placeholder="170"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                {...register('weight', { valueAsNumber: true })}
                disabled={!isEditing}
                type="number"
                placeholder="70"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Address</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                {...register('address.street')}
                disabled={!isEditing}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  {...register('address.city')}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    !isEditing && 'bg-gray-50 cursor-not-allowed'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  {...register('address.state')}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    !isEditing && 'bg-gray-50 cursor-not-allowed'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  {...register('address.zipCode')}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    !isEditing && 'bg-gray-50 cursor-not-allowed'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  {...register('address.country')}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    !isEditing && 'bg-gray-50 cursor-not-allowed'
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Emergency Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                {...register('emergencyContact.name')}
                disabled={!isEditing}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <input
                {...register('emergencyContact.relationship')}
                disabled={!isEditing}
                placeholder="e.g., Spouse, Parent"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                {...register('emergencyContact.phoneNumber')}
                disabled={!isEditing}
                type="tel"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('emergencyContact.email')}
                disabled={!isEditing}
                type="email"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  !isEditing && 'bg-gray-50 cursor-not-allowed'
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={cn(
                'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors',
                updateMutation.isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Success/Error Messages */}
        {updateMutation.isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Profile updated successfully!
            </p>
          </div>
        )}

        {updateMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {getErrorMessage(updateMutation.error)}
            </p>
          </div>
        )}
      </form>

      {/* Medical History & Allergies */}
      {profile && !isEditing && (
        <>
          {/* Medical History */}
          {profile.medicalHistory && profile.medicalHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Medical History
              </h2>
              <div className="space-y-4">
                {profile.medicalHistory.map((history) => (
                  <div
                    key={history.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {history.condition}
                      </h3>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium',
                          history.status === 'active'
                            ? 'bg-red-100 text-red-800'
                            : history.status === 'chronic'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        )}
                      >
                        {history.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Diagnosed: {formatDate(history.diagnosedDate)}
                    </p>
                    {history.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {history.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {profile.allergies && profile.allergies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Allergies
              </h2>
              <div className="space-y-4">
                {profile.allergies.map((allergy) => (
                  <div
                    key={allergy.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {allergy.allergen}
                      </h3>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium',
                          allergy.severity === 'severe'
                            ? 'bg-red-100 text-red-800'
                            : allergy.severity === 'moderate'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {allergy.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Reaction: {allergy.reaction}
                    </p>
                    {allergy.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {allergy.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
