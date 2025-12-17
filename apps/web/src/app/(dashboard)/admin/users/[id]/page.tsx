'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useUpdateUser, useDeleteUser } from '@/hooks/useAdmin';
import { UpdateUserRequest } from '@/types/admin';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const { data: user, isLoading } = useUser(userId);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({});

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({ id: userId, data: formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      try {
        await deleteUser.mutateAsync(userId);
        router.push('/admin/users');
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <button
          onClick={() => router.push('/admin/users')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
        <div className="flex gap-3">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit User
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteUser.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Delete User
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phoneNumber || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.role || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as 'patient' | 'doctor' | 'admin',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'doctor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.status || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | 'active'
                            | 'inactive'
                            | 'suspended',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Verified
                  </label>
                  <span
                    className={`inline-block font-medium ${
                      user.emailVerified ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Login
                  </label>
                  <p className="text-gray-900">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {user.metadata && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Login Count
                    </label>
                    <p className="text-gray-900">{user.metadata.loginCount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Failed Login Attempts
                    </label>
                    <p className="text-gray-900">
                      {user.metadata.failedLoginAttempts}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Updated At
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    status: user.status,
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateUser.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
