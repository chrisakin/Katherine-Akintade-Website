import React from 'react';
import AboutHero from '../components/about/AboutHero';
import BackButton from '../components/common/BackButton';

export default function About() {
  return (
    <main className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <BackButton className="mb-8" />
        <AboutHero />
      </div>
    </main>
  );
}