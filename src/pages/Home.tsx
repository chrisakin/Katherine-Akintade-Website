import React from 'react';
import Hero from '../components/sections/Hero';
import Photography from '../components/sections/Photography';
import Blog from '../components/sections/Blog';
import Shop from '../components/sections/Shop';
import Podcast from '../components/sections/Podcast';
export default function Home() {
  return (
    <main>
      <Hero />
      <Photography />
      <Blog />
      <Shop />
      <Podcast />
    </main>
  );
}