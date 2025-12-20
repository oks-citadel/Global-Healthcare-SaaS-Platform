'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { User, Mail, Phone, MapPin, Award, BookOpen, Languages, Save, Edit } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock provider data
  const [providerData, setProviderData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'dr.john.doe@hospital.com',
    phone: '(555) 123-4567',
    npi: '1234567890',
    specialty: 'Internal Medicine',
    licenseNumber: 'MD-12345',
    licenseState: 'NY',
    bio: 'Board-certified internal medicine physician with over 15 years of experience in primary care and preventive medicine.',
    education: [
      {
        degree: 'Doctor of Medicine (MD)',
        institution: 'Harvard Medical School',
        year: 2008,
        field: 'Medicine',
      },
      {
        degree: 'Bachelor of Science',
        institution: 'MIT',
        year: 2004,
        field: 'Biology',
      },
    ],
    certifications: [
      'Board Certified in Internal Medicine',
      'Advanced Cardiac Life Support (ACLS)',
      'Basic Life Support (BLS)',
    ],
    languagesSpoken: ['English', 'Spanish', 'French'],
    acceptingNewPatients: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information</p>
          </div>
          <Button
            variant={isEditing ? 'primary' : 'outline'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card>
          <div className="flex items-start space-x-6">
            <div className="h-32 w-32 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {providerData.firstName[0]}{providerData.lastName[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                Dr. {providerData.firstName} {providerData.lastName}
              </h2>
              <p className="text-lg text-gray-600 mt-1">{providerData.specialty}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="success">
                  {providerData.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting'}
                </Badge>
                <span className="text-sm text-gray-600">NPI: {providerData.npi}</span>
              </div>
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {providerData.email}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {providerData.phone}
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
                value={providerData.firstName}
                onChange={(e) => setProviderData({ ...providerData, firstName: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Last Name"
                value={providerData.lastName}
                onChange={(e) => setProviderData({ ...providerData, lastName: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                type="email"
                value={providerData.email}
                onChange={(e) => setProviderData({ ...providerData, email: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Phone"
                type="tel"
                value={providerData.phone}
                onChange={(e) => setProviderData({ ...providerData, phone: e.target.value })}
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
                value={providerData.npi}
                onChange={(e) => setProviderData({ ...providerData, npi: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Specialty"
                value={providerData.specialty}
                onChange={(e) => setProviderData({ ...providerData, specialty: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="License Number"
                value={providerData.licenseNumber}
                onChange={(e) => setProviderData({ ...providerData, licenseNumber: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="License State"
                value={providerData.licenseState}
                onChange={(e) => setProviderData({ ...providerData, licenseState: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                value={providerData.bio}
                onChange={(e) => setProviderData({ ...providerData, bio: e.target.value })}
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
              {providerData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {edu.field} • Graduated {edu.year}
                  </p>
                </div>
              ))}
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
              {providerData.certifications.map((cert, index) => (
                <Badge key={index} variant="primary" size="lg">
                  {cert}
                </Badge>
              ))}
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
              {providerData.languagesSpoken.map((lang, index) => (
                <Badge key={index} variant="info" size="lg">
                  {lang}
                </Badge>
              ))}
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
                    checked={providerData.acceptingNewPatients}
                    onChange={(e) =>
                      setProviderData({ ...providerData, acceptingNewPatients: e.target.checked })
                    }
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
