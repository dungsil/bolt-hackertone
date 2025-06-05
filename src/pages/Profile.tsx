import React, { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { currentUser } from '../data/mockData';

const Profile: React.FC = () => {
  const [user, setUser] = useState({
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <div className="card flex flex-col items-center justify-center p-8 text-center md:col-span-1">
          <div className="relative mb-4">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-600">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-1.5 text-white hover:bg-primary-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          
          <div className="mt-6 w-full">
            <button
              className="btn btn-primary w-full"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="card md:col-span-2">
          <h2 className="mb-6 text-xl font-semibold">
            {isEditing ? 'Edit Profile' : 'Profile Information'}
          </h2>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full pl-9"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input w-full pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1">{user.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="mt-1">{user.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                <p className="mt-1">January 1, 2023</p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-medium">Security</h3>
                
                <button className="btn btn-outline">
                  Change Password
                </button>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-medium text-red-600">Danger Zone</h3>
                
                <button className="btn border-red-300 bg-white text-red-600 hover:bg-red-50">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;