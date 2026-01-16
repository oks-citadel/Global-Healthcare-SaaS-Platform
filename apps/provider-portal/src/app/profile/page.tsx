'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { User, Mail, Phone, MapPin, Award, BookOpen, Languages, Save, Edit, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Provider } from '@/types';
import { authApi } from '@/lib/api';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // API state
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Editable form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    npi: '',
    specialty: '',
    licenseNumber: '',
    licenseState: '',
    bio: '',
    acceptingNewPatients: true,
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = await authApi.getCurrentProvider();
      setProviderData(provider);
      setFormData({
        firstName: provider.firstName,
        lastName: provider.lastName,
        email: provider.email,
        phone: provider.phone,
        npi: provider.npi,
        specialty: provider.specialty,
        licenseNumber: provider.licenseNumber,
        licenseState: provider.licenseState,
        bio: provider.bio || '',
        acceptingNewPatients: provider.acceptingNewPatients,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRetry = () => {
    fetchProfile();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Note: In a real implementation, you would call an update profile API
      // For now, we'll just toggle edit mode
      // await profileApi.updateProfile(formData);
      setIsEditing(false);
      // Re-fetch to get updated data
      // fetchProfile();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (providerData) {
      setFormData({
        firstName: providerData.firstName,
        lastName: providerData.lastName,
        email: providerData.email,
        phone: providerData.phone,
        npi: providerData.npi,
        specialty: providerData.specialty,
        licenseNumber: providerData.licenseNumber,
        licenseState: providerData.licenseState,
        bio: providerData.bio || '',
        acceptingNewPatients: providerData.acceptingNewPatients,
      });
    }
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information</p>
          </div>
          {!loading && !error && (
            isEditing ? (
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
            )
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && providerData && (
          <>
            {/* Profile Header Card */}
            <Card>
              <div className="flex items-start space-x-6">
                <div className="h-32 w-32 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {formData.firstName[0]}{formData.lastName[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dr. {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-lg text-gray-600 mt-1">{formData.specialty}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge variant="success">
                      {formData.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting'}
                    </Badge>
                    <span className="text-sm text-gray-600">NPI: {formData.npi}</span>
                  </div>
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {formData.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {formData.phone}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="NPI Number"
                    value={formData.npi}
                    onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="License State"
                    value={formData.licenseState}
                    onChange={(e) => setFormData({ ...formData, licenseState: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Education
                  </CardTitle>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Education
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providerData.education && providerData.education.length > 0 ? (
                    providerData.education.map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {edu.field} - Graduated {edu.year}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No education records found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Certifications
                  </CardTitle>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Certification
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {providerData.certifications && providerData.certifications.length > 0 ? (
                    providerData.certifications.map((cert, index) => (
                      <Badge key={index} variant="primary" size="lg">
                        {cert}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No certifications found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Languages Spoken
                  </CardTitle>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Language
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {providerData.languagesSpoken && providerData.languagesSpoken.length > 0 ? (
                    providerData.languagesSpoken.map((lang, index) => (
                      <Badge key={index} variant="info" size="lg">
                        {lang}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No languages specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Accepting New Patients</h4>
                      <p className="text-sm text-gray-600">Allow new patients to schedule appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.acceptingNewPatients}
                        onChange={(e) =>
                          setFormData({ ...formData, acceptingNewPatients: e.target.checked })
                        }
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
