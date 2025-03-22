
import SEO from '../components/SEO';
import AboutHero from '../components/about/AboutHero';
import BackButton from '../components/common/BackButton';

export default function About() {
  return (
    <main className="py-24">
      <SEO 
        title="About Katherine Ayobola Akintade - Identity Shaper & Creative Entrepreneur"
        description="Learn about Katherine's journey, mission, and passion for empowering teenagers through photography and creative mentoring. Discover how she helps individuals embrace their unique identity."
        type="website"
      />
      <div className="max-w-7xl mx-auto px-4">
        <BackButton className="mb-8" />
        <AboutHero />
      </div>
    </main>
  );
}