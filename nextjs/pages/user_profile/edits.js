import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useBearStore from "@/store/useBearStore";  // Zustand store

const EditProfile = () => {
  const router = useRouter();

  // Fetch the current values from Zustand store
  const username = useBearStore((state) => state.username);
  const email = useBearStore((state) => state.email);
  const gender = useBearStore((state) => state.gender);
  const phoneNumber = useBearStore((state) => state.phoneNumber);

  // Store the edited values in the local component state
  const [newUsername, setNewUsername] = useState(username || '');
  const [newEmail, setNewEmail] = useState(email || '');
  const [newGender, setNewGender] = useState(gender || '');
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber || '');

  // This effect will run once to populate the state with user data from Zustand
  useEffect(() => {
    setNewUsername(username);
    setNewEmail(email);
    setNewGender(gender);
    setNewPhoneNumber(phoneNumber);
  }, [username, email, gender, phoneNumber]);

  const handleSave = async () => {
    try {
      // Make an API call to save updated profile information
      const response = await fetch('http://127.0.0.1:8000/api/user/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          gender: newGender,
          phone_number: newPhoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update Zustand store with new user information
      useBearStore.setState({
        username: newUsername,
        email: newEmail,
        gender: newGender,
        phoneNumber: newPhoneNumber,
      });

      // Redirect back to the profile page
      router.push('/user_login');

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <div>
        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Gender</label>
        <input
          type="text"
          placeholder="Gender"
          value={newGender}
          onChange={(e) => setNewGender(e.target.value)}
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="text"
          placeholder="Phone Number"
          value={newPhoneNumber}
          onChange={(e) => setNewPhoneNumber(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditProfile;