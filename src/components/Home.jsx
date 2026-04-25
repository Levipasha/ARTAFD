import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Cards from './Cards';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Hero />
      <Cards />
      <Footer />
    </div>
  );
};

export default Home;
