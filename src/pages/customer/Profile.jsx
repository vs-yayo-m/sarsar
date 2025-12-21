// File: src/pages/customer/Profile.jsx
// Customer Profile Page - View and edit personal information

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Save,
  X,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      // Update profile in Firebase/Firestore
      // await updateProfile(profileData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        displayName: user.displayName || user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('Upload profile picture:', file);
      // In production: Upload to Firebase Storage and update user profile
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = profileData.displayName || user?.email || 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate member since
  const getMemberSince = () => {
    if (user?.createdAt) {
      const date = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Recently';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-orange-100">Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-orange-400 to-orange-500 opacity-10" />

            <div className="relative flex flex-col md:flex-row items-center gap-6 p-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-5 h-5 text-orange-600" />
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profileData.displayName || 'User'}
                </h2>
                <p className="text-gray-600 mb-3">{profileData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-orange-100 text-orange-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {getMemberSince()}
                  </Badge>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:pt-3">
                  <User className="w-4 h-4 text-orange-600" />
                  Full Name
                </label>
                {isEditing ? (
                  <div className="md:col-span-2">
                    <Input
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-gray-900 py-2">
                      {profileData.displayName || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:pt-3">
                  <Mail className="w-4 h-4 text-orange-600" />
                  Email Address
                </label>
                <div className="md:col-span-2">
                  <p className="text-gray-900 py-2 flex items-center gap-2">
                    {profileData.email}
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Verified
                    </Badge>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed for security reasons
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:pt-3">
                  <Phone className="w-4 h-4 text-orange-600" />
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="md:col-span-2">
                    <Input
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-gray-900 py-2">
                      {profileData.phone || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:pt-3">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <div className="md:col-span-2">
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-gray-900 py-2">
                      {profileData.dateOfBirth || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:pt-3">
                  <User className="w-4 h-4 text-orange-600" />
                  Gender
                </label>
                {isEditing ? (
                  <div className="md:col-span-2">
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-gray-900 py-2 capitalize">
                      {profileData.gender || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:pt-3">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Bio
                </label>
                {isEditing ? (
                  <div className="md:col-span-2">
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-gray-900 py-2">
                      {profileData.bio || '-'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Account Activity
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600 mb-1">0</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 mb-1">0</p>
                <p className="text-sm text-gray-600">Reviews Written</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-1">0</p>
                <p className="text-sm text-gray-600">Wishlist Items</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600 mb-1">0</p>
                <p className="text-sm text-gray-600">Loyalty Points</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerProfile;