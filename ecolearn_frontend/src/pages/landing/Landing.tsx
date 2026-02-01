// src/pages/Landing.tsx
import React from 'react';
import { HeroSection } from './HeroSection';
import { StatsSection } from './StatsSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { ChatbotWidget } from '../../components/common/ChatbotWidget';


export const Landing = () => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <ChatbotWidget />
    </div>
  );
};
