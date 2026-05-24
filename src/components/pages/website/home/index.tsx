'use client';

import SmartSpeaker from '../speaker/list';
import BrandsLogos from './components/BrandsLogos';
import FAQ from './components/FAQ';
import Features from './components/Features';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import VoiceAssistants from './components/VoiceAssistants';

const Website = () => {
  return (
    <div>
      <Hero />
      <BrandsLogos />
      <Features />
      <VoiceAssistants />
      <SmartSpeaker />
      <VideoSection />
      <FAQ />
    </div>
  );
};

export default Website;
