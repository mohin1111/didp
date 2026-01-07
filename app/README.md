# DIDP - Data Integration & Processing Dashboard

A modern React application for trading and settlement operations, featuring a modular architecture with SQL querying, Excel import/export, Python scripting, and data visualization capabilities.

## Features

- **Master Data Management** - Browse and filter 21+ financial data tables (trades, settlements, positions, etc.)
- **SQL Query Editor** - Execute SQL queries against loaded tables with schema browser
- **Python Scripting** - Run Python scripts for data processing (simulated)
- **Excel Integration** - Import from and export to Excel files (.xlsx, .xls, .csv)
- **Data Visualization** - Interactive charts (bar, line, area, pie) with Recharts
- **Process Chaining** - Chain multiple operations together for batch processing
- **Cell Selection & Comparison** - Select cells across tables, compare rows side-by-side
- **Formula Builder** - Excel-like formula support with cell references

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **XLSX** for Excel file handling
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

The application follows a modular architecture with all files under 300 lines for maintainability.

```
src/components/BackofficeOperations/
├── index.tsx                    # Main entry point (100 lines)
├── context/
│   └── BackofficeContext.tsx    # React Context provider (245 lines)
├── hooks/                       # Custom hooks for state management
│   ├── useTableState.ts         # Table selection & expansion
│   ├── useCellState.ts          # Cell selection & comparison
│   ├── useFilterState.ts        # Column filtering
│   ├── useFormulaState.ts       # Formula management
│   ├── useProcessState.ts       # Process execution & chaining
│   ├── useImportState.ts        # Excel import handling
│   ├── useSqlPythonState.ts     # SQL & Python execution
│   ├── useModalState.ts         # Modal visibility
│   ├── useChartState.ts         # Chart configuration
│   └── useExportState.ts        # Excel export functions
├── sections/                    # Main UI panels
│   ├── MasterDataSection.tsx    # Left panel - data sources (34%)
│   ├── ProcessingSection.tsx    # Center panel - operations (36%)
│   └── OutputSection.tsx        # Right panel - results (30%)
├── modals/                      # Modal components
│   ├── FullViewModal.tsx        # Full table view
│   ├── CompareModal.tsx         # Row comparison
│   ├── ChartModal.tsx           # Chart visualization
│   ├── SaveProcessModal.tsx     # Save process config
│   ├── LoadProcessModal.tsx     # Load saved processes
│   ├── SchemaModal.tsx          # SQL schema browser
│   ├── PythonModal.tsx          # Full Python editor
│   └── ImportModal.tsx          # Excel import wizard
├── shared/                      # Reusable components
│   ├── TableRenderer.tsx        # Data table with filtering
│   ├── ChartRenderer.tsx        # Chart component
│   └── StatusBadge.tsx          # Status indicator
├── data/                        # Static data
│   ├── masterTables.ts          # 21 table definitions
│   ├── processes.ts             # 10 process definitions
│   ├── excelFormulas.ts         # Formula reference
│   └── constants.ts             # Colors, chart colors
├── types/                       # TypeScript definitions
│   ├── tables.ts                # Table types
│   ├── cells.ts                 # Cell selection types
│   ├── formulas.ts              # Formula types
│   └── processes.ts             # Process types
└── utils/                       # Utility functions
    ├── sqlUtils.ts              # SQL query execution
    ├── excelUtils.ts            # Excel export functions
    ├── formulaEvaluator.ts      # Formula evaluation
    ├── chartUtils.ts            # Chart data preparation
    └── formatters.ts            # Value formatting
```

## Key Components

### Context & State Management

The app uses React Context with custom hooks for state management:

```tsx
import { useBackoffice } from './context/BackofficeContext';

function MyComponent() {
  const { selectedTables, sqlOutput, executeSqlQuery } = useBackoffice();
  // ...
}
```

### Available Data Tables

| Category | Tables |
|----------|--------|
| Trading | Day Trades, Trade Blotter, Order Book |
| Settlement | Settlements, Failed Trades, Pending Settlements |
| Positions | Positions, Cash Balances |
| Reference | Securities Master, Counterparties, Accounts |
| Corporate Actions | Dividends, Stock Splits, Mergers |
| Compliance | Compliance Alerts, Audit Log |
| Risk | Margin Calls, Collateral |

### Processing Modes

1. **Operations** - Pre-built processes (EOD, reconciliation, matching)
2. **SQL Query** - Write and execute SQL against loaded tables
3. **Python** - Run Python scripts for custom processing
4. **Excel** - Build formulas with cell references

## Development

### File Size Guidelines

All component files are kept under 300 lines for:
- Better readability and maintenance
- Faster Hot Module Replacement (HMR)
- Easier code reviews
- Improved testability

### Adding New Features

1. **New Hook** - Add to `hooks/` directory
2. **New Modal** - Add to `modals/` and export from `modals/index.ts`
3. **New Data Table** - Add definition to `data/masterTables.ts`
4. **New Process** - Add to `data/processes.ts`

## License

MIT
