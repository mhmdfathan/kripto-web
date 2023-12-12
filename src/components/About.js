// src/components/About.js
import React from 'react';
import './About.css'; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">Tentang Aplikasi Ini</h2>
      <div className="about-info">
        {/* Add information about the application here */}
        <p>Nama: Muhammad Fathan Mubiina</p>
        <p>NIM: 21120121140164</p>
        <p>Kelas: Kriptografi A</p>
        <p>Website Playfair Cypher ini dibuat untuk memenuhi Tugas Remidi UTS Kriptografi</p>
        <p>Mungkin masih terdapat beberapa kekurangan dalam situs web ini, tetapi saya berharap bahwa isinya bermanfaat :)</p>
        {/* Add more information as needed */}
      </div>
    </div>
  );
};

export default About;
