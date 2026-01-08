# DIDP - Data Integration & Processing

[![DIDP Tests](https://github.com/mohin1111/didp/actions/workflows/test.yml/badge.svg)](https://github.com/mohin1111/didp/actions/workflows/test.yml)

A comprehensive data integration and processing application with SQL/Python execution, Excel formula engine, value mappings, and table matching capabilities.

## Features

- **File Import**: Import CSV and Excel files with preview and header detection
- **SQL Query Execution**: Run SQL queries against imported tables with chart visualization
- **Python Execution**: Execute Python scripts with pandas/numpy and 42+ Excel formula functions
- **Value Mappings**: Create source-to-target value transformations
- **Match Configuration**: Configure and run table reconciliation matching
- **Operations Tab**: Process chaining for EOD, MTM, Brokerage, P/L calculations
- **Excel Formula Builder**: Visual formula builder with cell references

## Project Structure

```
DIDP/
├── app/                          # React frontend
│   └── src/
│       └── components/
│           └── BackofficeOperations/
│               ├── api/          # Backend API client
│               ├── context/      # React context
│               ├── hooks/        # Custom hooks
│               ├── modals/       # Modal components
│               ├── sections/     # Main UI sections
│               ├── types/        # TypeScript types
│               └── utils/        # Utility functions
├── backend/                      # FastAPI backend
│   └── app/
│       ├── api/v1/              # API endpoints
│       ├── models/              # Database models
│       ├── schemas/             # Pydantic schemas
│       └── services/            # Business logic
│           └── formula_engine/  # Excel formula functions
├── tests/                       # Test suite
│   ├── data/                    # Test data files
│   └── playwright/              # Playwright tests
└── playwright.config.js         # Playwright configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohin1111/didp.git
   cd didp
   ```

2. **Install frontend dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Install Playwright for testing**
   ```bash
   npm install
   npx playwright install chromium
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend dev server**
   ```bash
   cd app
   npm run dev
   ```

3. **Open the application**
   ```
   http://localhost:5173
   ```

## Testing

### Run All Tests

```bash
# Run all 100 QA tests
npx playwright test

# Run with visible browser
npx playwright test --headed

# Run with list reporter
npx playwright test --reporter=list
```

### Run Specific Categories

```bash
# File Import tests (1-15)
npx playwright test --grep "Category 1"

# SQL Query tests (16-30)
npx playwright test --grep "Category 2"

# Python Execution tests (31-45)
npx playwright test --grep "Category 3"

# Value Mappings tests (46-55)
npx playwright test --grep "Category 4"

# Match Configuration tests (56-65)
npx playwright test --grep "Category 5"

# Match Execution tests (66-75)
npx playwright test --grep "Category 6"

# Operations Tab tests (76-85)
npx playwright test --grep "Category 7"

# Excel Tab tests (86-90)
npx playwright test --grep "Category 8"

# Export Features tests (91-95)
npx playwright test --grep "Category 9"

# UI/UX tests (96-100)
npx playwright test --grep "Category 10"
```

### Generate HTML Report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Test Data Files

Located in `tests/data/`:

| File | Description |
|------|-------------|
| trades.csv | 20 rows of trade data |
| positions.csv | 10 rows of position data |
| settlements.csv | 10 settlement records |
| recon_source.csv | Reconciliation source |
| recon_target.csv | Reconciliation target |
| fx_rates.csv | 8 currency rates |
| products.csv | 10 product catalog items |
| empty.csv | Headers only (edge case) |
| special_chars.csv | Unicode characters |
| large_data.csv | 1000 rows for performance |
| multi_sheet.xlsx | 3-sheet Excel file |
| trades_data.xlsx | Single sheet trades |
| bond_data.xlsx | Bond calculations |

## Excel Formula Functions

The Python executor includes 42+ Excel-compatible functions:

### Basic Functions
- `SUM`, `AVG`, `COUNT`, `MAX`, `MIN`
- `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`
- `SUMIF`, `COUNTIF`, `AVERAGEIF`

### Conditional Functions
- `IF`, `IFS`, `IFERROR`, `IFNA`, `SWITCH`

### Logic Functions
- `AND`, `OR`, `NOT`, `XOR`

### Text Functions
- `LEFT`, `RIGHT`, `MID`, `LEN`, `TRIM`
- `UPPER`, `LOWER`, `PROPER`, `CONCAT`

### Trade Functions
- `gross_value(qty, price)`
- `net_value(qty, price, commission)`
- `commission(value, rate, min_comm, max_comm)`
- `exchange_fee(value, rate)`
- `clearing_fee(value, rate)`

### P&L Functions
- `unrealized_pnl(qty, avg_cost, market_price)`
- `realized_pnl(sell_value, buy_value, costs)`
- `total_pnl(realized, unrealized)`

### Settlement Functions
- `settlement_date(trade_date, days)`
- `accrued_interest(face_value, coupon_rate, days)`
- `settlement_amount(principal, accrued, fees)`

### Reconciliation Functions
- `variance(source, target)`
- `variance_pct(source, target)`
- `is_matched(source, target, tolerance)`
- `match_status(source, target, tolerance)`

### FX Functions
- `fx_convert(amount, rate)`

## API Endpoints

### Tables
- `GET /api/v1/tables/` - List all tables
- `POST /api/v1/tables/` - Create table
- `GET /api/v1/tables/{key}` - Get table data

### SQL
- `POST /api/v1/sql/execute` - Execute SQL query

### Python
- `POST /api/v1/python/execute` - Execute Python script
- `GET /api/v1/python/tables/` - Get tables as DataFrames

### Matching
- `GET /api/v1/match-configs/` - List match configs
- `POST /api/v1/match-configs/` - Create match config
- `POST /api/v1/matching/run/{id}` - Run matching

### Value Mappings
- `GET /api/v1/value-mappings/` - List mappings
- `POST /api/v1/value-mappings/` - Create mapping

## License

MIT
