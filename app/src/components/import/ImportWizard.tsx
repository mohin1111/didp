import { useState, useCallback } from 'react';
import { Check, ArrowRight, ArrowLeft, Play, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '../Toast';
import type { ImportState } from '../../types';
import { ImportStep1, ImportStep2, ImportStep3, ImportStep4, ImportStep5 } from './ImportSteps';

interface ImportWizardProps {
  step: number;
  setStep: (step: number) => void;
}

export function ImportWizard({ step, setStep }: ImportWizardProps) {
  const { addToast } = useToast();
  const [importState, setImportState] = useState<ImportState>({
    file: null,
    targetTable: '',
    delimiter: 'comma',
    dateFormat: 'dd/mm/yyyy',
    hasHeader: true,
    mappings: [
      { source: 'Trade Date', target: 'd_TradeDate', transform: 'Parse Date', required: true },
      { source: 'Client Code', target: 'n_ClientId', transform: 'Lookup', required: true },
      { source: 'Scrip', target: 's_ScripCode', transform: 'None', required: true },
      { source: 'Qty', target: 'n_Quantity', transform: 'Parse Number', required: true },
      { source: 'Rate', target: 'n_Rate', transform: 'Parse Number', required: true },
      { source: 'Value', target: 'n_Value', transform: 'Parse Number', required: false },
    ],
    validationResults: { total: 15432, valid: 15430, errors: 2, warnings: 0 },
    importProgress: 0,
    importStatus: 'idle',
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(() => {
    const mockFile = { name: 'NSE_Trades_20240115.csv', size: '2.4 MB', rows: 15432 };
    setImportState(prev => ({ ...prev, file: mockFile }));
    addToast('File selected successfully', 'success');
  }, [addToast]);

  const handleRemoveFile = useCallback(() => {
    setImportState(prev => ({ ...prev, file: null }));
    addToast('File removed', 'info');
  }, [addToast]);

  const handleStartImport = useCallback(() => {
    setImportState(prev => ({ ...prev, importStatus: 'importing', importProgress: 0 }));
    const interval = setInterval(() => {
      setImportState(prev => {
        if (prev.importProgress >= 100) {
          clearInterval(interval);
          addToast('Import completed successfully! 15,430 rows imported.', 'success');
          return { ...prev, importStatus: 'completed', importProgress: 100 };
        }
        return { ...prev, importProgress: prev.importProgress + 5 };
      });
    }, 150);
  }, [addToast]);

  const handleNextStep = useCallback(() => {
    if (step === 1 && !importState.file) { addToast('Please select a file first', 'warning'); return; }
    if (step === 1 && !importState.targetTable) { addToast('Please select a target table', 'warning'); return; }
    if (step === 5) { handleStartImport(); return; }
    setStep(Math.min(5, step + 1));
    if (step === 3) addToast('Validation completed', 'success');
  }, [step, importState.file, importState.targetTable, setStep, addToast, handleStartImport]);

  const steps = [{ num: 1, title: 'Select File' }, { num: 2, title: 'Settings' }, { num: 3, title: 'Mapping' }, { num: 4, title: 'Validation' }, { num: 5, title: 'Import' }];

  return (
    <div className="flex-1 flex flex-col bg-slate-50" data-demo="import-wizard">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <h1 className="text-xl font-bold text-slate-800 mb-6">File Import Wizard</h1>
        <div className="flex items-center justify-between max-w-3xl">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step === s.num ? 'bg-indigo-600 text-white' : step > s.num ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-sm font-medium ${step === s.num ? 'text-indigo-600' : 'text-slate-700'}`}>{s.title}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-1 mx-4 rounded min-w-12 ${step > s.num ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        {step === 1 && <ImportStep1 file={importState.file} targetTable={importState.targetTable} onFileSelect={handleFileSelect} onRemoveFile={handleRemoveFile} onTableSelect={(table) => setImportState(prev => ({ ...prev, targetTable: table }))} isDragging={isDragging} setIsDragging={setIsDragging} />}
        {step === 2 && <ImportStep2 delimiter={importState.delimiter} dateFormat={importState.dateFormat} hasHeader={importState.hasHeader} onDelimiterChange={(d) => setImportState(prev => ({ ...prev, delimiter: d }))} onDateFormatChange={(f) => setImportState(prev => ({ ...prev, dateFormat: f }))} onHasHeaderChange={(h) => setImportState(prev => ({ ...prev, hasHeader: h }))} />}
        {step === 3 && <ImportStep3 mappings={importState.mappings} onMappingChange={(idx, field, value) => { setImportState(prev => ({ ...prev, mappings: prev.mappings.map((m, i) => i === idx ? { ...m, [field]: value } : m) })); }} />}
        {step === 4 && <ImportStep4 results={importState.validationResults} />}
        {step === 5 && <ImportStep5 file={importState.file} targetTable={importState.targetTable} validationResults={importState.validationResults} importProgress={importState.importProgress} importStatus={importState.importStatus} />}
      </div>
      <div className="bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between">
        <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1 || importState.importStatus === 'importing'} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />Back
        </button>
        <button onClick={handleNextStep} disabled={importState.importStatus === 'importing' || importState.importStatus === 'completed'} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50">
          {importState.importStatus === 'importing' ? <><Loader2 className="w-4 h-4 animate-spin" />Importing...</> : importState.importStatus === 'completed' ? <><CheckCircle className="w-4 h-4" />Completed</> : step === 5 ? <><Play className="w-4 h-4" />Start Import</> : <>Next<ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
