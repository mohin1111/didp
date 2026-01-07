import { useState, useCallback } from 'react';
import type { ProcessChainStep, SavedProcess } from '../types';
import { INITIAL_SAVED_PROCESSES } from '../data';

export function useProcessState() {
  const [selectedProcess, setSelectedProcess] = useState('eodProcess');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [chainingEnabled, setChainingEnabled] = useState(false);
  const [processChain, setProcessChain] = useState<ProcessChainStep[]>([
    { id: 1, processId: 'eodProcess', config: { tolerance: 'exact', counterparty: 'all' } }
  ]);
  const [currentChainStep, setCurrentChainStep] = useState(0);
  const [expandedChainStep, setExpandedChainStep] = useState<number | null>(1);

  // Saved Processes
  const [savedProcesses, setSavedProcesses] = useState<SavedProcess[]>(INITIAL_SAVED_PROCESSES);
  const [newProcessName, setNewProcessName] = useState('');
  const [newProcessDescription, setNewProcessDescription] = useState('');
  const [processConfig, setProcessConfig] = useState<Record<string, string>>({ tolerance: 'exact', counterparty: 'all' });

  const handleRunProcess = useCallback(() => {
    setIsProcessing(true);
    setProcessComplete(false);
    setCurrentChainStep(0);

    if (chainingEnabled) {
      let step = 1;
      const runStep = () => {
        setCurrentChainStep(step);
        if (step < processChain.length) {
          setTimeout(() => { step++; runStep(); }, 2000);
        } else {
          setTimeout(() => { setIsProcessing(false); setProcessComplete(true); }, 2000);
        }
      };
      runStep();
    } else {
      setTimeout(() => { setIsProcessing(false); setProcessComplete(true); }, 3000);
    }
  }, [chainingEnabled, processChain.length]);

  const addToChain = useCallback((processId: string) => {
    const newId = Math.max(...processChain.map(s => s.id), 0) + 1;
    setProcessChain(prev => [...prev, { id: newId, processId, config: { tolerance: 'exact', counterparty: 'all' } }]);
  }, [processChain]);

  const removeFromChain = useCallback((stepId: number) => {
    if (processChain.length > 1) {
      setProcessChain(prev => prev.filter(s => s.id !== stepId));
    }
  }, [processChain.length]);

  const moveChainStep = useCallback((index: number, direction: 'up' | 'down') => {
    const newChain = [...processChain];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newChain.length) {
      [newChain[index], newChain[newIndex]] = [newChain[newIndex], newChain[index]];
      setProcessChain(newChain);
    }
  }, [processChain]);

  const updateChainStepProcess = useCallback((stepId: number, processId: string) => {
    setProcessChain(prev => prev.map(s => s.id === stepId ? { ...s, processId } : s));
  }, []);

  const updateChainStepConfig = useCallback((stepId: number, config: Record<string, string>) => {
    setProcessChain(prev => prev.map(s => s.id === stepId ? { ...s, config } : s));
  }, []);

  const saveCurrentProcess = useCallback(() => {
    if (newProcessName.trim()) {
      const newProcess: SavedProcess = {
        id: Math.max(...savedProcesses.map(p => p.id), 0) + 1,
        name: newProcessName,
        description: newProcessDescription,
        processId: selectedProcess,
        config: processConfig,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setSavedProcesses(prev => [...prev, newProcess]);
      setNewProcessName('');
      setNewProcessDescription('');
    }
  }, [newProcessName, newProcessDescription, selectedProcess, processConfig, savedProcesses]);

  const loadSavedProcess = useCallback((process: SavedProcess) => {
    setSelectedProcess(process.processId);
    setProcessConfig(process.config);
  }, []);

  const deleteSavedProcess = useCallback((id: number) => {
    setSavedProcesses(prev => prev.filter(p => p.id !== id));
  }, []);

  return {
    selectedProcess, setSelectedProcess,
    isProcessing, setIsProcessing, processComplete, setProcessComplete,
    chainingEnabled, setChainingEnabled,
    processChain, setProcessChain, currentChainStep, setCurrentChainStep,
    expandedChainStep, setExpandedChainStep,
    handleRunProcess, addToChain, removeFromChain, moveChainStep,
    updateChainStepProcess, updateChainStepConfig,
    savedProcesses, setSavedProcesses,
    newProcessName, setNewProcessName, newProcessDescription, setNewProcessDescription,
    processConfig, setProcessConfig,
    saveCurrentProcess, loadSavedProcess, deleteSavedProcess,
  };
}
