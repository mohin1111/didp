import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type TabId = 'tables' | 'workflow' | 'import' | 'reports' | 'views';

interface DemoContextValue {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  startDemo: () => void;
  endDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setTabCallback: ((tab: TabId) => void) | null;
  registerTabCallback: (callback: (tab: TabId) => void) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export const TOTAL_STEPS = 8;

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tabCallback, setTabCallback] = useState<((tab: TabId) => void) | null>(null);

  const startDemo = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const endDemo = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const registerTabCallback = useCallback((callback: (tab: TabId) => void) => {
    setTabCallback(() => callback);
  }, []);

  return (
    <DemoContext.Provider value={{
      isActive,
      currentStep,
      totalSteps: TOTAL_STEPS,
      startDemo,
      endDemo,
      nextStep,
      prevStep,
      goToStep,
      setTabCallback: tabCallback,
      registerTabCallback,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider');
  }
  return context;
}
