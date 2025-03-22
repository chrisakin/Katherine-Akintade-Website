import React from 'react';
import Hero from '../components/sections/Hero';
import Photography from '../components/sections/Photography';
import Blog from '../components/sections/Blog';
import Shop from '../components/sections/Shop';

export default function Home() {
  return (
    <main>
      <Hero />
      <Photography />
      <Blog />
      <Shop />
    </main>
  );
}