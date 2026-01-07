// Table relationship types for data integration

export interface TableRelationship {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  type: 'lookup' | 'foreignKey' | 'match';
  name?: string;
}

export interface ValueMapping {
  id: string;
  name: string;
  description?: string;
  mappings: Record<string, string>;
}

export interface MatchColumn {
  sourceColumn: string;
  targetColumn: string;
  valueMapping?: string; // ID of ValueMapping to apply
  caseSensitive?: boolean;
}

export interface MatchConfig {
  id: string;
  name: string;
  sourceTable: string;
  targetTable: string;
  matchColumns: MatchColumn[];
  createdAt: number;
}

export interface MatchResult {
  matchedCount: number;
  unmatchedSourceCount: number;
  unmatchedTargetCount: number;
  matchedPairs: Array<{
    sourceRowIndex: number;
    targetRowIndex: number;
    sourceRow: string[];
    targetRow: string[];
  }>;
  unmatchedSource: Array<{
    rowIndex: number;
    row: string[];
  }>;
  unmatchedTarget: Array<{
    rowIndex: number;
    row: string[];
  }>;
}

export interface MatchSummary {
  configId: string;
  configName: string;
  sourceTable: string;
  targetTable: string;
  runAt: number;
  result: MatchResult;
}
