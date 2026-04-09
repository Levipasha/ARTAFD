import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Cards from './Cards';
import Shop from './Shop';
import Footer from './Footer';
import { DemoHeroGeometric } from './ui/demo';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <DemoHeroGeometric />
      <Hero />
      <Cards />
      <Shop />
      <Footer />
    </div>
  );
};

export default Home;
