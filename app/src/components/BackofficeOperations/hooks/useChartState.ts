import { useState } from 'react';

export function useChartState() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [chartXAxis, setChartXAxis] = useState(0);
  const [chartYAxis, setChartYAxis] = useState(1);
  const [outputView, setOutputView] = useState<'table' | 'chart'>('table');
  const [processingMode, setProcessingMode] = useState<'operations' | 'excel' | 'python' | 'sql'>('operations');
  const [outputTab, setOutputTab] = useState('results');

  return {
    chartType, setChartType,
    chartXAxis, setChartXAxis,
    chartYAxis, setChartYAxis,
    outputView, setOutputView,
    processingMode, setProcessingMode,
    outputTab, setOutputTab,
  };
}
