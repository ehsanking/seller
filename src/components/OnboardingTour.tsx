import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, CheckCircle2, Compass, Shield, Zap } from 'lucide-react';

interface OnboardingTourProps {
  onCompleteTour: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  onCompleteTour,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Seller Core AI 🚀',
      description: 'Your next-generation headless e-commerce engine with built-in AI demand forecasting, A/B testing, and customer insight analytics.',
      targetTab: 'dashboard',
      badge: 'Step 1 of 4'
    },
    {
      title: 'AI Demand Forecast Widget 📈',
      description: 'Check out the AI Demand Forecast in your Dashboard. It automatically analyzes sales velocity to predict stockout risks before they happen.',
      targetTab: 'dashboard',
      badge: 'Step 2 of 4'
    },
    {
      title: 'Customer Insight Chat 💬',
      description: 'Explore the Customer Insight tab to view AI-generated buyer personas and cross-sell pitches tailored to individual customer history.',
      targetTab: 'customer_insight',
      badge: 'Step 3 of 4'
    },
    {
      title: 'Smart Alerts & A/B Testing ⚡',
      description: 'Head over to Settings to configure Smart Anomaly Alerts, Store Template A/B Tests, and Automated Data Backups.',
      targetTab: 'settings',
      badge: 'Step 4 of 4'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      onNavigateTab(steps[nextIdx].targetTab);
    } else {
      onCompleteTour();
    }
  };

  const handleSkip = () => {
    onCompleteTour();
  };

  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
              <Compass className="w-5 h-5" />
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-extrabold rounded-full border border-purple-200">
              {activeStep.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            {activeStep.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {activeStep.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 pt-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep ? 'w-8 bg-purple-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Skip Tour
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
