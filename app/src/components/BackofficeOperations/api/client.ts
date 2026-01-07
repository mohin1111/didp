const API_BASE = 'http://localhost:8000/api/v1';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Ensure trailing slash for FastAPI
  if (!url.includes('?') && !url.endsWith('/')) {
    url += '/';
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============ Tables API ============

export interface TableSummary {
  id: number;
  key: string;
  name: string;
  category: string | null;
  source_type: string;
  row_count: number;
  column_count: number;
  created_at: string;
  updated_at: string;
}

export interface TableDetail {
  id: number;
  key: string;
  name: string;
  category: string | null;
  source_type: string;
  file_name: string | null;
  sheet_name: string | null;
  columns: string[];
  data: string[][];
  row_count: number;
  created_at: string;
  updated_at: string;
}

export interface TableListResponse {
  tables: TableSummary[];
  total: number;
}

export const tablesApi = {
  list: () => fetchApi<TableListResponse>('/tables'),

  get: (key: string) => fetchApi<TableDetail>(`/tables/${key}`),

  create: (data: { key: string; name: string; category?: string; columns: string[]; data: string[][] }) =>
    fetchApi<TableDetail>('/tables', { method: 'POST', body: JSON.stringify(data) }),

  update: (key: string, data: { name?: string; category?: string; columns?: string[]; data?: string[][] }) =>
    fetchApi<TableDetail>(`/tables/${key}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateData: (key: string, data: { columns: string[]; data: string[][] }) =>
    fetchApi<TableDetail>(`/tables/${key}/data`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (key: string) => fetchApi<void>(`/tables/${key}`, { method: 'DELETE' }),
};

// ============ Import API ============

export interface UploadResponse {
  file_id: string;
  filename: string;
  sheets: string[] | null;
  columns: string[];
  preview: string[][];
  has_headers: boolean;
  row_count: number;
}

export interface PreviewResponse {
  columns: string[];
  preview: string[][];
  row_count: number;
}

export const importsApi = {
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/imports/upload/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  },

  preview: async (fileId: string, sheetName?: string, hasHeaders: boolean = true): Promise<PreviewResponse> => {
    const formData = new FormData();
    formData.append('file_id', fileId);
    if (sheetName) formData.append('sheet_name', sheetName);
    formData.append('has_headers', String(hasHeaders));

    const response = await fetch(`${API_BASE}/imports/preview/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Preview failed' }));
      throw new Error(error.detail || 'Preview failed');
    }

    return response.json();
  },

  confirm: async (params: {
    fileId: string;
    tableKey: string;
    tableName: string;
    sheetName?: string;
    hasHeaders: boolean;
    category?: string;
  }): Promise<TableDetail> => {
    const formData = new FormData();
    formData.append('file_id', params.fileId);
    formData.append('table_key', params.tableKey);
    formData.append('table_name', params.tableName);
    if (params.sheetName) formData.append('sheet_name', params.sheetName);
    formData.append('has_headers', String(params.hasHeaders));
    if (params.category) formData.append('category', params.category);

    const response = await fetch(`${API_BASE}/imports/confirm/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Import failed' }));
      throw new Error(error.detail || 'Import failed');
    }

    return response.json();
  },
};

// ============ Relationships API ============

export interface TableRelationshipResponse {
  id: number;
  name: string | null;
  source_table_key: string;
  source_column: string;
  target_table_key: string;
  target_column: string;
  relationship_type: string;
  created_at: string;
}

export const relationshipsApi = {
  list: (tableKey?: string) =>
    fetchApi<TableRelationshipResponse[]>('/relationships', {
      params: tableKey ? { table_key: tableKey } : undefined
    }),

  create: (data: {
    name?: string;
    source_table_key: string;
    source_column: string;
    target_table_key: string;
    target_column: string;
    relationship_type: string;
  }) => fetchApi<TableRelationshipResponse>('/relationships', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: {
    name?: string;
    source_column?: string;
    target_column?: string;
    relationship_type?: string;
  }) => fetchApi<TableRelationshipResponse>(`/relationships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) => fetchApi<void>(`/relationships/${id}`, { method: 'DELETE' }),
};

// ============ Value Mappings API ============

export interface ValueMappingResponse {
  id: number;
  name: string;
  description: string | null;
  mappings: Record<string, string>;
  created_at: string;
}

export const valueMappingsApi = {
  list: () => fetchApi<ValueMappingResponse[]>('/value-mappings'),

  get: (id: number) => fetchApi<ValueMappingResponse>(`/value-mappings/${id}`),

  create: (data: { name: string; description?: string; mappings: Record<string, string> }) =>
    fetchApi<ValueMappingResponse>('/value-mappings', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: { name?: string; description?: string; mappings?: Record<string, string> }) =>
    fetchApi<ValueMappingResponse>(`/value-mappings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) => fetchApi<void>(`/value-mappings/${id}`, { method: 'DELETE' }),

  apply: (id: number, value: string) =>
    fetchApi<{ original: string; transformed: string }>(`/value-mappings/${id}/apply`, {
      method: 'POST',
      params: { value }
    }),
};

// ============ Match Configs API ============

export interface MatchColumnResponse {
  id: number;
  source_column: string;
  target_column: string;
  value_mapping_id: number | null;
  case_sensitive: boolean;
}

export interface MatchConfigResponse {
  id: number;
  name: string;
  source_table_key: string;
  target_table_key: string;
  match_columns: MatchColumnResponse[];
  created_at: string;
}

export const matchConfigsApi = {
  list: () => fetchApi<MatchConfigResponse[]>('/match-configs'),

  get: (id: number) => fetchApi<MatchConfigResponse>(`/match-configs/${id}`),

  create: (data: {
    name: string;
    source_table_key: string;
    target_table_key: string;
    match_columns: Array<{
      source_column: string;
      target_column: string;
      value_mapping_id?: number;
      case_sensitive?: boolean;
    }>;
  }) => fetchApi<MatchConfigResponse>('/match-configs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: {
    name?: string;
    match_columns?: Array<{
      source_column: string;
      target_column: string;
      value_mapping_id?: number;
      case_sensitive?: boolean;
    }>;
  }) => fetchApi<MatchConfigResponse>(`/match-configs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) => fetchApi<void>(`/match-configs/${id}`, { method: 'DELETE' }),
};

// ============ Matching Execution API ============

export interface MatchedPair {
  source_row_index: number;
  target_row_index: number;
  source_row: string[];
  target_row: string[];
}

export interface UnmatchedRow {
  row_index: number;
  row: string[];
}

export interface MatchResultResponse {
  id: number;
  config_id: number;
  config_name: string;
  source_table_key: string;
  target_table_key: string;
  matched_count: number;
  unmatched_source_count: number;
  unmatched_target_count: number;
  matched_pairs: MatchedPair[];
  unmatched_source: UnmatchedRow[];
  unmatched_target: UnmatchedRow[];
  created_at: string;
}

export const matchingApi = {
  execute: (configId: number) =>
    fetchApi<MatchResultResponse>('/matching/execute', {
      method: 'POST',
      body: JSON.stringify({ config_id: configId })
    }),

  listResults: (configId?: number, limit: number = 10) =>
    fetchApi<MatchResultResponse[]>('/matching/results', {
      params: {
        ...(configId ? { config_id: String(configId) } : {}),
        limit: String(limit),
      },
    }),

  getResult: (id: number) => fetchApi<MatchResultResponse>(`/matching/results/${id}`),

  deleteResult: (id: number) => fetchApi<void>(`/matching/results/${id}`, { method: 'DELETE' }),
};

// ============ SQL Execution API ============

export interface SqlExecuteResponse {
  columns: string[];
  data: string[][];
  row_count: number;
  execution_time_ms: number;
  error: string | null;
}

export const sqlApi = {
  execute: (query: string, tableKeys?: string[]) =>
    fetchApi<SqlExecuteResponse>('/sql/execute', {
      method: 'POST',
      body: JSON.stringify({ query, table_keys: tableKeys }),
    }),

  getSchema: () => fetchApi<{ schema: string }>('/sql/schema'),
};

// ============ Python Execution API ============

export interface PythonExecuteResponse {
  output: string;
  error: string | null;
  execution_time_ms: number;
  result_columns: string[] | null;
  result_data: string[][] | null;
}

export interface PythonTableInfo {
  key: string;
  name: string;
  columns: string[];
  row_count: number;
}

export const pythonApi = {
  execute: (script: string, tableKeys?: string[]) =>
    fetchApi<PythonExecuteResponse>('/python/execute', {
      method: 'POST',
      body: JSON.stringify({ script, table_keys: tableKeys }),
    }),

  getTables: () => fetchApi<PythonTableInfo[]>('/python/tables'),
};

// ============ Export API ============

export const exportsApi = {
  exportTables: async (tableKeys: string[], includeHeaders: boolean = true): Promise<Blob> => {
    const response = await fetch(`${API_BASE}/exports/excel/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table_keys: tableKeys, format: 'xlsx', include_headers: includeHeaders }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  exportMatchResults: async (resultId: number, includeMatched: boolean = true, includeUnmatched: boolean = true): Promise<Blob> => {
    const params = new URLSearchParams({
      include_matched: String(includeMatched),
      include_unmatched: String(includeUnmatched),
    });

    const response = await fetch(`${API_BASE}/exports/match-results/${resultId}/?${params}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  exportSqlResults: async (columns: string[], data: string[][]): Promise<Blob> => {
    const response = await fetch(`${API_BASE}/exports/sql-results/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columns, data }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  exportComparison: async (
    rows: Array<{ table_key: string; row_index: number; data: string[] }>,
    tableNames: Record<string, string>
  ): Promise<Blob> => {
    const response = await fetch(`${API_BASE}/exports/comparison/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, table_names: tableNames }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },
};

// ============ Saved Processes API ============

export interface SavedProcessResponse {
  id: number;
  name: string;
  description: string | null;
  process_type: string;
  config: Record<string, string>;
  created_at: string;
}

export const savedProcessesApi = {
  list: () => fetchApi<SavedProcessResponse[]>('/processes'),

  get: (id: number) => fetchApi<SavedProcessResponse>(`/processes/${id}`),

  create: (data: {
    name: string;
    description?: string;
    process_type: string;
    config: Record<string, string>;
  }) => fetchApi<SavedProcessResponse>('/processes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: {
    name?: string;
    description?: string;
    config?: Record<string, string>;
  }) => fetchApi<SavedProcessResponse>(`/processes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) => fetchApi<void>(`/processes/${id}`, { method: 'DELETE' }),
};

// ============ Process Chains API ============

export interface ProcessChainStepResponse {
  id: number;
  order: number;
  process_type: string;
  config: Record<string, string>;
}

export interface ProcessChainResponse {
  id: number;
  name: string;
  description: string | null;
  steps: ProcessChainStepResponse[];
  created_at: string;
}

export const processChainsApi = {
  list: () => fetchApi<ProcessChainResponse[]>('/processes/chains'),

  get: (id: number) => fetchApi<ProcessChainResponse>(`/processes/chains/${id}`),

  create: (data: {
    name: string;
    description?: string;
    steps: Array<{ process_type: string; config: Record<string, string> }>;
  }) => fetchApi<ProcessChainResponse>('/processes/chains', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: {
    name: string;
    description?: string;
    steps: Array<{ process_type: string; config: Record<string, string> }>;
  }) => fetchApi<ProcessChainResponse>(`/processes/chains/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) => fetchApi<void>(`/processes/chains/${id}`, { method: 'DELETE' }),
};
