import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/mhmdfathan');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-container">
      <h2>Profile Penulis</h2>
      <div className="profile-info">
        <img
          src={userData?.avatar_url || 'https://via.placeholder.com/150'}
          alt="User Profile"
          className="profile-image"
        />
        <p>Name: {userData?.name || 'N/A'}</p>
        <p>Followers: {userData?.followers || 'N/A'}</p>
        <a href={userData?.html_url} target="_blank" rel="noopener noreferrer">
          GitHub Profile
        </a>
        {/* Add more user information as needed */}
      </div>
    </div>
  );
};

export default Profile;
