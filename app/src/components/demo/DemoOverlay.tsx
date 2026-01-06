import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play, RotateCcw } from 'lucide-react';
import { useDemo } from './DemoProvider';
import { demoSteps } from './DemoSteps';
import { DemoSpotlight } from './DemoSpotlight';

export function DemoOverlay() {
  const { isActive, currentStep, totalSteps, nextStep, prevStep, endDemo, setTabCallback } = useDemo();

  const step = demoSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Navigate to target tab when step changes
  useEffect(() => {
    if (isActive && step.targetTab && setTabCallback) {
      setTabCallback(step.targetTab);
    }
  }, [isActive, currentStep, step.targetTab, setTabCallback]);

  if (!isActive) return null;

  const Icon = step.icon;

  return (
    <>
      {/* Spotlight overlay with highlighted area */}
      <DemoSpotlight selector={step.highlightSelector || null} padding={12} />

      {/* Demo panel */}
      <div className="fixed bottom-6 right-6 w-[420px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-200">
        {/* Header with progress */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">Step {currentStep + 1} of {totalSteps}</span>
            </div>
            <button
              onClick={endDemo}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Exit tour"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'bg-white flex-grow'
                    : i < currentStep
                      ? 'bg-white/60 w-4'
                      : 'bg-white/30 w-4'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{step.title}</h2>
          <p className="text-sm font-medium text-indigo-600 mb-3">{step.subtitle}</p>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.description}</p>

          {/* Features list */}
          {step.features && step.features.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Features</p>
              <ul className="space-y-2">
                {step.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-5 pb-5 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isFirstStep
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {isLastStep ? (
            <div className="flex gap-2">
              <button
                onClick={() => { endDemo(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
              <button
                onClick={endDemo}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Finish Tour
              </button>
            </div>
          ) : isFirstStep ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Tour
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
