import { createContext, useContext, useMemo } from 'react';
import {
  useTableState,
  useCellState,
  useFilterState,
  useFormulaState,
  useProcessState,
  useImportState,
  useSqlPythonState,
  useModalState,
  useChartState,
  useExportState,
  useRelationships,
  useMatchEngine,
} from '../hooks';
import type {
  CellSelection,
  CompareRow,
  Formula,
  SavedProcess,
  DateRange,
  TableDataOverrides,
  ProcessChainStep,
  TableRelationship,
  ValueMapping,
  MatchConfig,
  MatchSummary,
  MasterTablesMap,
} from '../types';
import type { TableSummary, TableDetail } from '../api';

// Context value type
interface BackofficeContextValue {
  // Table State
  selectedDate: DateRange;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateRange>>;
  selectedTables: string[];
  setSelectedTables: React.Dispatch<React.SetStateAction<string[]>>;
  toggleTable: (key: string) => void;
  expandedTable: string | null;
  setExpandedTable: React.Dispatch<React.SetStateAction<string | null>>;
  tablesByCategory: Record<string, string[]>;
  tableDataOverrides: TableDataOverrides;
  setTableDataOverrides: React.Dispatch<React.SetStateAction<TableDataOverrides>>;
  masterTables: MasterTablesMap;
  backendTables: TableSummary[];
  isLoading: boolean;
  refreshTables: () => Promise<void>;
  fetchTableData: (key: string) => Promise<TableDetail | null>;
  deleteTable: (key: string) => Promise<void>;

  // Cell State
  selectedCells: CellSelection[];
  setSelectedCells: React.Dispatch<React.SetStateAction<CellSelection[]>>;
  handleCellClick: (tableKey: string, rowIdx: number, colIdx: number, value: string, column: string, event: React.MouseEvent) => void;
  isCellSelected: (tableKey: string, rowIdx: number, colIdx: number) => boolean;
  clearCellSelection: () => void;
  compareRows: CompareRow[];
  setCompareRows: React.Dispatch<React.SetStateAction<CompareRow[]>>;
  toggleRowForCompare: (tableKey: string, rowIdx: number, data: string[]) => void;
  isRowSelectedForCompare: (tableKey: string, rowIdx: number) => boolean;

  // Filter State
  columnFilters: Record<string, Record<number, string>>;
  setColumnFilters: React.Dispatch<React.SetStateAction<Record<string, Record<number, string>>>>;
  showFilters: Record<string, boolean>;
  setShowFilters: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  updateColumnFilter: (tableKey: string, colIndex: number, value: string) => void;
  clearAllFilters: (tableKey: string) => void;
  toggleFilters: (tableKey: string) => void;
  getActiveFilterCount: (tableKey: string) => number;
  getFilteredData: (tableKey: string, data: string[][]) => string[][];

  // Formula State
  formulas: Formula[];
  setFormulas: React.Dispatch<React.SetStateAction<Formula[]>>;
  activeFormulaId: number;
  setActiveFormulaId: React.Dispatch<React.SetStateAction<number>>;
  updateFormula: (id: number, expression: string) => void;
  addFormula: () => void;
  removeFormula: (id: number) => void;
  insertCellReference: () => void;

  // Process State
  selectedProcess: string;
  setSelectedProcess: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  processComplete: boolean;
  setProcessComplete: React.Dispatch<React.SetStateAction<boolean>>;
  handleRunProcess: () => void;
  chainingEnabled: boolean;
  setChainingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  processChain: ProcessChainStep[];
  setProcessChain: React.Dispatch<React.SetStateAction<ProcessChainStep[]>>;
  currentChainStep: number;
  setCurrentChainStep: React.Dispatch<React.SetStateAction<number>>;
  expandedChainStep: number | null;
  setExpandedChainStep: React.Dispatch<React.SetStateAction<number | null>>;
  addToChain: (processId: string) => void;
  removeFromChain: (stepId: number) => void;
  moveChainStep: (index: number, direction: 'up' | 'down') => void;
  updateChainStepProcess: (stepId: number, processId: string) => void;
  updateChainStepConfig: (stepId: number, config: Record<string, string>) => void;
  savedProcesses: SavedProcess[];
  setSavedProcesses: React.Dispatch<React.SetStateAction<SavedProcess[]>>;
  newProcessName: string;
  setNewProcessName: React.Dispatch<React.SetStateAction<string>>;
  newProcessDescription: string;
  setNewProcessDescription: React.Dispatch<React.SetStateAction<string>>;
  processConfig: Record<string, string>;
  setProcessConfig: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  saveCurrentProcess: () => Promise<void>;
  loadSavedProcess: (process: SavedProcess) => void;
  deleteSavedProcess: (id: number) => Promise<void>;
  isProcessesLoading: boolean;
  loadSavedProcesses: () => Promise<void>;
  saveProcessChain: (name: string, description?: string) => Promise<void>;

  // Modal State
  showCompareModal: boolean;
  setShowCompareModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSaveModal: boolean;
  setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLoadModal: boolean;
  setShowLoadModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSchemaModal: boolean;
  setShowSchemaModal: React.Dispatch<React.SetStateAction<boolean>>;
  showPythonModal: boolean;
  setShowPythonModal: React.Dispatch<React.SetStateAction<boolean>>;
  showChartModal: boolean;
  setShowChartModal: React.Dispatch<React.SetStateAction<boolean>>;
  fullViewTable: string | null;
  setFullViewTable: React.Dispatch<React.SetStateAction<string | null>>;

  // Chart State
  chartType: 'bar' | 'line' | 'pie' | 'area';
  setChartType: React.Dispatch<React.SetStateAction<'bar' | 'line' | 'pie' | 'area'>>;
  chartXAxis: number;
  setChartXAxis: React.Dispatch<React.SetStateAction<number>>;
  chartYAxis: number;
  setChartYAxis: React.Dispatch<React.SetStateAction<number>>;
  outputView: 'table' | 'chart';
  setOutputView: React.Dispatch<React.SetStateAction<'table' | 'chart'>>;
  processingMode: 'operations' | 'matching' | 'excel' | 'python' | 'sql';
  setProcessingMode: React.Dispatch<React.SetStateAction<'operations' | 'matching' | 'excel' | 'python' | 'sql'>>;
  outputTab: string;
  setOutputTab: React.Dispatch<React.SetStateAction<string>>;

  // SQL/Python State
  sqlQuery: string;
  setSqlQuery: React.Dispatch<React.SetStateAction<string>>;
  sqlOutput: string[][];
  setSqlOutput: React.Dispatch<React.SetStateAction<string[][]>>;
  sqlColumns: string[];
  setSqlColumns: React.Dispatch<React.SetStateAction<string[]>>;
  customScript: string;
  setCustomScript: React.Dispatch<React.SetStateAction<string>>;
  pythonOutput: string;
  setPythonOutput: React.Dispatch<React.SetStateAction<string>>;
  pythonError: string;
  setPythonError: React.Dispatch<React.SetStateAction<string>>;
  pythonResultColumns: string[];
  setPythonResultColumns: React.Dispatch<React.SetStateAction<string[]>>;
  pythonResultData: string[][];
  setPythonResultData: React.Dispatch<React.SetStateAction<string[][]>>;
  isExecuting: boolean;
  executeSqlQuery: () => Promise<void>;
  executePythonScript: () => Promise<void>;

  // Import State
  showImportModal: boolean;
  setShowImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  importedData: { columns: string[]; data: string[][]; fileName: string; sheetName: string } | null;
  setImportedData: React.Dispatch<React.SetStateAction<{ columns: string[]; data: string[][]; fileName: string; sheetName: string } | null>>;
  importTargetTable: string;
  setImportTargetTable: React.Dispatch<React.SetStateAction<string>>;
  importSheets: string[];
  setImportSheets: React.Dispatch<React.SetStateAction<string[]>>;
  selectedImportSheet: string;
  setSelectedImportSheet: React.Dispatch<React.SetStateAction<string>>;
  importFileName: string;
  setImportFileName: React.Dispatch<React.SetStateAction<string>>;
  hasHeaders: boolean;
  setHasHeaders: React.Dispatch<React.SetStateAction<boolean>>;
  customColumnNames: string[];
  setCustomColumnNames: React.Dispatch<React.SetStateAction<string[]>>;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSheetChange: (sheetName: string) => void;
  confirmImport: () => void;
  cancelImport: () => void;
  createNewTableFromImport: () => void;
  importAllSheets: () => void;
  toggleHasHeaders: () => void;
  updateColumnName: (index: number, name: string) => void;

  // Export Functions
  exportTableToExcel: (tableKey: string) => Promise<void>;
  exportSqlResultsToExcel: () => Promise<void>;
  exportComparisonToExcel: () => Promise<void>;
  exportAllSelectedTablesToExcel: () => Promise<void>;
  exportMatchResultsToExcel: (resultId: number, includeMatched?: boolean, includeUnmatched?: boolean) => Promise<void>;
  isExporting: boolean;

  // Relationship State
  relationships: TableRelationship[];
  setRelationships: React.Dispatch<React.SetStateAction<TableRelationship[]>>;
  valueMappings: ValueMapping[];
  setValueMappings: React.Dispatch<React.SetStateAction<ValueMapping[]>>;
  isRelationshipsLoading: boolean;
  showRelationshipModal: boolean;
  setShowRelationshipModal: React.Dispatch<React.SetStateAction<boolean>>;
  showValueMappingModal: boolean;
  setShowValueMappingModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingRelationship: TableRelationship | null;
  setEditingRelationship: React.Dispatch<React.SetStateAction<TableRelationship | null>>;
  editingValueMapping: ValueMapping | null;
  setEditingValueMapping: React.Dispatch<React.SetStateAction<ValueMapping | null>>;
  addRelationship: (relationship: Omit<TableRelationship, 'id'>) => Promise<TableRelationship>;
  updateRelationship: (id: string, updates: Partial<TableRelationship>) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  getRelationshipsForTable: (tableKey: string) => TableRelationship[];
  addValueMapping: (mapping: Omit<ValueMapping, 'id'>) => Promise<ValueMapping>;
  updateValueMapping: (id: string, updates: Partial<ValueMapping>) => Promise<void>;
  deleteValueMapping: (id: string) => Promise<void>;
  applyValueMapping: (mappingId: string, value: string) => string;
  reverseValueMapping: (mappingId: string, transformedValue: string) => string;
  openEditRelationship: (relationship: TableRelationship) => void;
  openNewRelationship: () => void;
  openEditValueMapping: (mapping: ValueMapping) => void;
  openNewValueMapping: () => void;
  loadRelationships: () => Promise<void>;
  loadValueMappings: () => Promise<void>;

  // Match Engine State
  matchConfigs: MatchConfig[];
  setMatchConfigs: React.Dispatch<React.SetStateAction<MatchConfig[]>>;
  matchResults: MatchSummary[];
  setMatchResults: React.Dispatch<React.SetStateAction<MatchSummary[]>>;
  isMatching: boolean;
  isMatchingLoading: boolean;
  activeMatchResult: MatchSummary | null;
  setActiveMatchResult: React.Dispatch<React.SetStateAction<MatchSummary | null>>;
  showMatchConfigModal: boolean;
  setShowMatchConfigModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingMatchConfig: MatchConfig | null;
  setEditingMatchConfig: React.Dispatch<React.SetStateAction<MatchConfig | null>>;
  runMatch: (config: MatchConfig) => Promise<void>;
  addMatchConfig: (config: Omit<MatchConfig, 'id' | 'createdAt'>) => Promise<MatchConfig>;
  updateMatchConfig: (id: string, updates: Partial<MatchConfig>) => Promise<void>;
  deleteMatchConfig: (id: string) => Promise<void>;
  openNewMatchConfig: () => void;
  openEditMatchConfig: (config: MatchConfig) => void;
  getTableData: (tableKey: string) => { columns: string[]; data: string[][] } | null;
  loadMatchConfigs: () => Promise<void>;
  loadMatchResults: () => Promise<void>;
}

const BackofficeContext = createContext<BackofficeContextValue | null>(null);

export function BackofficeProvider({ children }: { children: React.ReactNode }) {
  // Compose hooks
  const tableState = useTableState();
  const cellState = useCellState();
  const filterState = useFilterState();
  const formulaState = useFormulaState(cellState.selectedCells);
  const processState = useProcessState();
  const modalState = useModalState();
  const chartState = useChartState();

  const sqlPythonState = useSqlPythonState(
    tableState.tableDataOverrides,
    chartState.setChartYAxis
  );

  const importState = useImportState(
    tableState.tableDataOverrides,
    tableState.setTableDataOverrides,
    tableState.selectedTables,
    tableState.setSelectedTables,
    tableState.setExpandedTable,
    sqlPythonState.setPythonError,
    tableState.refreshTables
  );

  const exportState = useExportState(
    tableState.masterTables,
    tableState.tableDataOverrides,
    filterState.getFilteredData,
    sqlPythonState.sqlOutput,
    sqlPythonState.sqlColumns,
    cellState.compareRows,
    tableState.selectedTables
  );

  const relationshipState = useRelationships();

  const matchEngineState = useMatchEngine(
    tableState.tableDataOverrides,
    relationshipState.valueMappings,
    relationshipState.applyValueMapping
  );

  const value = useMemo<BackofficeContextValue>(() => ({
    ...tableState,
    ...cellState,
    ...filterState,
    ...formulaState,
    ...processState,
    ...modalState,
    ...chartState,
    ...sqlPythonState,
    ...importState,
    ...exportState,
    ...relationshipState,
    ...matchEngineState,
    isRelationshipsLoading: relationshipState.isLoading,
    isMatchingLoading: matchEngineState.isLoading,
    isProcessesLoading: processState.isLoading,
  }), [
    tableState, cellState, filterState, formulaState, processState,
    modalState, chartState, sqlPythonState, importState, exportState,
    relationshipState, matchEngineState,
  ]);

  return (
    <BackofficeContext.Provider value={value}>
      {children}
    </BackofficeContext.Provider>
  );
}

export function useBackoffice() {
  const context = useContext(BackofficeContext);
  if (!context) {
    throw new Error('useBackoffice must be used within a BackofficeProvider');
  }
  return context;
}

export default BackofficeContext;
