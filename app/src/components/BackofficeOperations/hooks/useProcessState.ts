import { useState, useCallback, useEffect } from 'react';
import type { ProcessChainStep, SavedProcess } from '../types';
import {
  savedProcessesApi,
  processChainsApi,
  type SavedProcessResponse,
  type ProcessChainResponse,
} from '../api';

// Convert backend saved process to frontend type
function toFrontendSavedProcess(backend: SavedProcessResponse): SavedProcess {
  return {
    id: backend.id,
    name: backend.name,
    description: backend.description || '',
    processId: backend.process_type,
    config: backend.config,
    createdAt: backend.created_at.slice(0, 10),
  };
}

// Convert backend process chain to frontend steps
function toFrontendProcessChain(backend: ProcessChainResponse): {
  id: number;
  name: string;
  description: string;
  steps: ProcessChainStep[];
} {
  return {
    id: backend.id,
    name: backend.name,
    description: backend.description || '',
    steps: backend.steps.map(step => ({
      id: step.id,
      processId: step.process_type,
      config: step.config,
    })),
  };
}

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
  const [savedProcesses, setSavedProcesses] = useState<SavedProcess[]>([]);
  const [newProcessName, setNewProcessName] = useState('');
  const [newProcessDescription, setNewProcessDescription] = useState('');
  const [processConfig, setProcessConfig] = useState<Record<string, string>>({ tolerance: 'exact', counterparty: 'all' });
  const [isLoading, setIsLoading] = useState(false);

  // Active chain info (for backend persistence)
  const [activeChainId, setActiveChainId] = useState<number | null>(null);

  // Load saved processes from backend
  const loadSavedProcesses = useCallback(async () => {
    try {
      const data = await savedProcessesApi.list();
      setSavedProcesses(data.map(toFrontendSavedProcess));
    } catch (error) {
      console.error('Error loading saved processes:', error);
    }
  }, []);

  // Load process chains from backend
  const loadProcessChains = useCallback(async () => {
    try {
      const data = await processChainsApi.list();
      // If we have chains, load the first one as active
      if (data.length > 0) {
        const chain = toFrontendProcessChain(data[0]);
        setProcessChain(chain.steps);
        setActiveChainId(chain.id);
      }
    } catch (error) {
      console.error('Error loading process chains:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    Promise.all([loadSavedProcesses(), loadProcessChains()])
      .finally(() => setIsLoading(false));
  }, [loadSavedProcesses, loadProcessChains]);

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

  // Save current process to backend
  const saveCurrentProcess = useCallback(async () => {
    if (!newProcessName.trim()) return;

    try {
      const backendProcess = await savedProcessesApi.create({
        name: newProcessName.trim(),
        description: newProcessDescription.trim() || undefined,
        process_type: selectedProcess,
        config: processConfig,
      });

      const newProcess = toFrontendSavedProcess(backendProcess);
      setSavedProcesses(prev => [...prev, newProcess]);
      setNewProcessName('');
      setNewProcessDescription('');
    } catch (error) {
      console.error('Error saving process:', error);
      throw error;
    }
  }, [newProcessName, newProcessDescription, selectedProcess, processConfig]);

  // Load a saved process into the current state
  const loadSavedProcess = useCallback((process: SavedProcess) => {
    setSelectedProcess(process.processId);
    setProcessConfig(process.config);
  }, []);

  // Delete a saved process from backend
  const deleteSavedProcess = useCallback(async (id: number) => {
    try {
      await savedProcessesApi.delete(id);
      setSavedProcesses(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting process:', error);
      throw error;
    }
  }, []);

  // Save process chain to backend
  const saveProcessChain = useCallback(async (name: string, description?: string) => {
    try {
      const steps = processChain.map(step => ({
        process_type: step.processId,
        config: step.config,
      }));

      if (activeChainId) {
        // Update existing chain
        const updated = await processChainsApi.update(activeChainId, {
          name,
          description,
          steps,
        });
        const chain = toFrontendProcessChain(updated);
        setProcessChain(chain.steps);
      } else {
        // Create new chain
        const created = await processChainsApi.create({
          name,
          description,
          steps,
        });
        const chain = toFrontendProcessChain(created);
        setProcessChain(chain.steps);
        setActiveChainId(chain.id);
      }
    } catch (error) {
      console.error('Error saving process chain:', error);
      throw error;
    }
  }, [processChain, activeChainId]);

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
    isLoading, loadSavedProcesses, saveProcessChain,
  };
}
