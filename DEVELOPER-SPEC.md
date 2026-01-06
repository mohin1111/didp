# CNS DataGrid - Excel-like Database Interface

## Project Overview

Build a web-based application that provides an Excel-like interface for interacting with a SQL database. Users should feel like they're working in Excel but with the power of a relational database backend. The system replaces a legacy WinForms application used for trading back-office operations.

---

## Core Features

### 1. Grid View (Excel-like Spreadsheet)

- **AG-Grid based spreadsheet** with full Excel-like experience
- **Formula bar** showing cell reference (e.g., "A1", "B5") and cell value/formula
- **Frozen columns** support (pin important columns like Client Code, Name)
- **Column resizing, reordering, hiding**
- **Multi-select rows** with Shift+Click, Ctrl+Click
- **Cell editing** with inline validation
- **Conditional formatting** (e.g., negative balances in red, positive in green)
- **Status bar** showing Sum, Average, Count of selected cells
- **Copy/Paste** support (including from Excel)
- **Undo/Redo** functionality
- **Column filters** (text, number, date filters)
- **Sorting** (multi-column)
- **Export to CSV/Excel**

### 2. File Import Wizard (5-Step Process)

#### Step 1 - File Selection:
- Drag-drop file upload area
- Support CSV, XLSX, XLS formats
- Show file name, size after selection

#### Step 2 - File Settings:
- Delimiter selection (comma, semicolon, tab, pipe)
- Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- Number format (1,234.56 vs 1.234,56)
- Encoding (UTF-8, ASCII, ISO-8859-1)
- Has header row checkbox
- Skip rows option
- File preview table (first 5-10 rows)

#### Step 3 - Column Mapping:
- Source column → Target column mapping
- Transform options per column:
  - None, Trim, Uppercase, Lowercase
  - Parse Number, Parse Date
  - Lookup (reference another table)
  - Map Values (e.g., "B" → 1, "S" → 2)
  - Formula (Excel-style formula)
- Required field checkbox
- Save as template / Load template functionality

#### Step 4 - Validation:
- Show validation summary (Valid rows, Errors, Warnings)
- Preview table with row status (✓ valid, ✗ error)
- Highlight error cells in red
- Error list with row number, column, error message
- Error handling options: Skip Row, Reject File, Import Anyway

#### Step 5 - Import Summary:
- Final confirmation before import
- Options: Dry Run, Skip Duplicates, Create Backup
- Start Import button
- Progress bar during import
- Export error log option

### 3. Report Builder

#### Pivot Table Builder:
- Drag-drop field list to zones: Filters, Columns, Rows, Values
- Aggregation options: SUM, COUNT, AVG, MIN, MAX, COUNTIF
- Pivot table preview with Grand Totals
- Save/Load pivot configurations

#### Chart Builder:
- Chart types: Bar, Line, Pie, Area, Scatter
- X-Axis, Y-Axis, Group By selection
- Chart preview
- Export chart as image

#### KPI Dashboard:
- KPI cards with: Title, Value, Change %, Trend arrow
- Formula-based KPI values (e.g., =SUM(Trades[Value]))
- Comparison period (vs Yesterday, Last Week, Last Month)
- Add/Edit/Delete KPI widgets

### 4. Table Joins / Views Builder

#### Visual Join Builder:
- Canvas showing table nodes with columns
- Drag tables onto canvas
- Draw lines between columns to create joins
- Join types: INNER, LEFT, RIGHT, FULL

#### Join Configuration Panel:
- List of joins with dropdowns for tables/columns
- Join type selector
- Add/Remove joins

#### Column Selector:
- Checkbox list of all available columns from joined tables
- Select which columns appear in the view

#### SQL Preview:
- Read-only SQL query preview
- Generated automatically from visual builder

#### Data Preview:
- Table showing first 10-20 rows of joined result
- Save as View functionality

---

## Excel Functions to Implement

The formula engine should support Excel-style syntax: `=FUNCTION(args)` with cell references like `[@ColumnName]` for current row.

### Math & Statistical Functions

| Function | Description |
|----------|-------------|
| `SUM(range)` | Sum of values |
| `SUMIF(range, criteria, sum_range)` | Conditional sum |
| `SUMIFS(sum_range, criteria_range1, criteria1, ...)` | Multiple criteria sum |
| `AVERAGE(range)` | Average of values |
| `AVERAGEIF(range, criteria, avg_range)` | Conditional average |
| `AVERAGEIFS(avg_range, criteria_range1, criteria1, ...)` | Multiple criteria average |
| `COUNT(range)` | Count of numbers |
| `COUNTA(range)` | Count of non-empty cells |
| `COUNTBLANK(range)` | Count of empty cells |
| `COUNTIF(range, criteria)` | Conditional count |
| `COUNTIFS(range1, criteria1, ...)` | Multiple criteria count |
| `MIN(range)` | Minimum value |
| `MAX(range)` | Maximum value |
| `MINIFS(range, criteria_range, criteria)` | Conditional minimum |
| `MAXIFS(range, criteria_range, criteria)` | Conditional maximum |
| `ABS(number)` | Absolute value |
| `ROUND(number, decimals)` | Round to decimals |
| `ROUNDUP(number, decimals)` | Round up |
| `ROUNDDOWN(number, decimals)` | Round down |
| `CEILING(number, significance)` | Round up to nearest multiple |
| `FLOOR(number, significance)` | Round down to nearest multiple |
| `MOD(number, divisor)` | Remainder after division |
| `POWER(number, power)` | Raise to power |
| `SQRT(number)` | Square root |
| `PRODUCT(range)` | Multiply all values |
| `SUBTOTAL(function_num, range)` | Subtotal ignoring filtered rows |
| `AGGREGATE(function_num, options, range)` | Aggregate with options |
| `MEDIAN(range)` | Median value |
| `MODE(range)` | Most frequent value |
| `STDEV(range)` | Standard deviation (sample) |
| `STDEVP(range)` | Standard deviation (population) |
| `VAR(range)` | Variance (sample) |
| `VARP(range)` | Variance (population) |
| `PERCENTILE(range, k)` | K-th percentile |
| `QUARTILE(range, quart)` | Quartile value |
| `RANK(number, range, order)` | Rank of number in range |
| `LARGE(range, k)` | K-th largest value |
| `SMALL(range, k)` | K-th smallest value |

### Lookup & Reference Functions

| Function | Description |
|----------|-------------|
| `VLOOKUP(lookup_value, table, col_index, range_lookup)` | Vertical lookup |
| `HLOOKUP(lookup_value, table, row_index, range_lookup)` | Horizontal lookup |
| `INDEX(array, row_num, col_num)` | Value at position |
| `MATCH(lookup_value, range, match_type)` | Position of value |
| `XLOOKUP(lookup, lookup_array, return_array, not_found, match_mode)` | Modern lookup |
| `OFFSET(reference, rows, cols, height, width)` | Offset reference |
| `INDIRECT(ref_text)` | Indirect reference |
| `ROW(reference)` | Row number |
| `COLUMN(reference)` | Column number |
| `ROWS(array)` | Number of rows |
| `COLUMNS(array)` | Number of columns |
| `CHOOSE(index, value1, value2, ...)` | Choose by index |
| `LOOKUP(lookup_value, lookup_vector, result_vector)` | Vector lookup |

### Text Functions

| Function | Description |
|----------|-------------|
| `CONCATENATE(text1, text2, ...)` | Join text |
| `CONCAT(text1, text2, ...)` | Join text (newer) |
| `TEXTJOIN(delimiter, ignore_empty, text1, ...)` | Join with delimiter |
| `LEFT(text, num_chars)` | Left characters |
| `RIGHT(text, num_chars)` | Right characters |
| `MID(text, start, num_chars)` | Middle characters |
| `LEN(text)` | Length of text |
| `TRIM(text)` | Remove extra spaces |
| `CLEAN(text)` | Remove non-printable chars |
| `UPPER(text)` | Convert to uppercase |
| `LOWER(text)` | Convert to lowercase |
| `PROPER(text)` | Capitalize words |
| `SUBSTITUTE(text, old, new, instance)` | Replace text |
| `REPLACE(old_text, start, num_chars, new_text)` | Replace by position |
| `FIND(find_text, within_text, start)` | Find position (case-sensitive) |
| `SEARCH(find_text, within_text, start)` | Find position (case-insensitive) |
| `TEXT(value, format)` | Format as text |
| `VALUE(text)` | Convert text to number |
| `FIXED(number, decimals, no_commas)` | Format number as text |
| `REPT(text, times)` | Repeat text |
| `CHAR(number)` | Character from code |
| `CODE(text)` | Code from character |
| `EXACT(text1, text2)` | Exact comparison |

### Date & Time Functions

| Function | Description |
|----------|-------------|
| `TODAY()` | Current date |
| `NOW()` | Current date/time |
| `DATE(year, month, day)` | Create date |
| `DATEVALUE(date_text)` | Convert text to date |
| `YEAR(date)` | Extract year |
| `MONTH(date)` | Extract month |
| `DAY(date)` | Extract day |
| `HOUR(time)` | Extract hour |
| `MINUTE(time)` | Extract minute |
| `SECOND(time)` | Extract second |
| `WEEKDAY(date, return_type)` | Day of week (1-7) |
| `WEEKNUM(date, return_type)` | Week number |
| `EOMONTH(start_date, months)` | End of month |
| `EDATE(start_date, months)` | Add months to date |
| `DATEDIF(start, end, unit)` | Difference between dates |
| `NETWORKDAYS(start, end, holidays)` | Working days between dates |
| `WORKDAY(start, days, holidays)` | Add working days |
| `DAYS(end_date, start_date)` | Days between dates |
| `DAYS360(start, end, method)` | Days on 360-day year |
| `TIME(hour, minute, second)` | Create time |
| `TIMEVALUE(time_text)` | Convert text to time |

### Logical Functions

| Function | Description |
|----------|-------------|
| `IF(condition, true_value, false_value)` | Conditional |
| `IFS(condition1, value1, condition2, value2, ...)` | Multiple conditions |
| `AND(logical1, logical2, ...)` | All true |
| `OR(logical1, logical2, ...)` | Any true |
| `NOT(logical)` | Negate |
| `XOR(logical1, logical2, ...)` | Exclusive or |
| `SWITCH(expression, value1, result1, ..., default)` | Switch case |
| `IFERROR(value, value_if_error)` | Handle errors |
| `IFNA(value, value_if_na)` | Handle #N/A |
| `TRUE()` | Boolean true |
| `FALSE()` | Boolean false |

### Information Functions

| Function | Description |
|----------|-------------|
| `ISBLANK(value)` | Is empty |
| `ISNUMBER(value)` | Is number |
| `ISTEXT(value)` | Is text |
| `ISLOGICAL(value)` | Is boolean |
| `ISERROR(value)` | Is any error |
| `ISNA(value)` | Is #N/A error |
| `ISODD(number)` | Is odd |
| `ISEVEN(number)` | Is even |
| `TYPE(value)` | Type of value |
| `N(value)` | Convert to number |
| `NA()` | Return #N/A |
| `ERROR.TYPE(error_val)` | Error type number |

### Financial Functions

| Function | Description |
|----------|-------------|
| `PMT(rate, nper, pv, fv, type)` | Payment |
| `PV(rate, nper, pmt, fv, type)` | Present value |
| `FV(rate, nper, pmt, pv, type)` | Future value |
| `NPV(rate, value1, value2, ...)` | Net present value |
| `IRR(values, guess)` | Internal rate of return |
| `RATE(nper, pmt, pv, fv, type, guess)` | Interest rate |
| `NPER(rate, pmt, pv, fv, type)` | Number of periods |
| `SLN(cost, salvage, life)` | Straight-line depreciation |
| `DB(cost, salvage, life, period, month)` | Declining balance |
| `DDB(cost, salvage, life, period, factor)` | Double declining balance |

### Array Functions

| Function | Description |
|----------|-------------|
| `UNIQUE(array)` | Unique values |
| `SORT(array, sort_index, sort_order)` | Sort array |
| `SORTBY(array, by_array, sort_order)` | Sort by another array |
| `FILTER(array, include, if_empty)` | Filter array |
| `SEQUENCE(rows, cols, start, step)` | Generate sequence |
| `RANDARRAY(rows, cols, min, max, integer)` | Random array |
| `TRANSPOSE(array)` | Transpose array |

---

## Technical Stack (Recommended)

### Frontend:
- React 18+ with TypeScript
- AG-Grid Community (for spreadsheet)
- TailwindCSS or CSS Modules for styling
- React Query for data fetching
- Zustand or Redux for state management

### Backend:
- Node.js with Express OR Python with FastAPI
- PostgreSQL database
- Formula parser library (e.g., hot-formula-parser, formulajs)

### Key Libraries:
- `ag-grid-react` - Spreadsheet grid
- `xlsx` or `exceljs` - Excel file parsing
- `papaparse` - CSV parsing
- `date-fns` or `dayjs` - Date manipulation
- `mathjs` - Math operations

---

## Database Schema Requirements

Each table configuration should support:

```json
{
  "tableName": "tbl_ClientMaster",
  "displayName": "Clients",
  "primaryKey": "n_ClientId",
  "columns": [
    {
      "field": "s_ClientCode",
      "header": "Client Code",
      "type": "text|number|date|boolean|currency|lookup",
      "width": 120,
      "editable": true,
      "required": true,
      "frozen": true,
      "validation": {
        "pattern": "^[A-Z]{3}[0-9]{3,6}$",
        "errorMessage": "Client code must be 3 uppercase letters followed by 3-6 digits"
      },
      "lookup": {
        "table": "tbl_StateMaster",
        "valueColumn": "n_StateId",
        "displayColumn": "s_StateName"
      },
      "formula": "=SUMIF(Ledger[ClientId], [@ClientId], Ledger[Amount])",
      "conditionalFormatting": [
        {
          "condition": "[@Balance] < 0",
          "style": { "backgroundColor": "#FFEBEE", "color": "#C62828" }
        }
      ]
    }
  ],
  "relationships": [
    {
      "name": "ClientTrades",
      "foreignKey": "n_ClientId",
      "referencedTable": "tbl_DayTrade",
      "referencedColumn": "n_ClientId",
      "type": "one-to-many"
    }
  ],
  "defaultSort": { "column": "s_ClientName", "direction": "ASC" },
  "defaultFilters": [
    { "column": "b_IsActive", "operator": "=", "value": true }
  ]
}
```

---

## Import Template Schema

```json
{
  "templateId": "uuid",
  "templateName": "NSE Trade File",
  "fileSettings": {
    "fileType": "csv",
    "delimiter": ",",
    "hasHeader": true,
    "dateFormat": "DD/MM/YYYY",
    "encoding": "UTF-8"
  },
  "targetTable": "tbl_DayTrade",
  "columnMappings": [
    {
      "sourceColumn": "Client Code",
      "targetColumn": "n_ClientId",
      "transform": {
        "type": "lookup",
        "lookupConfig": {
          "table": "tbl_ClientMaster",
          "matchColumn": "s_ClientCode",
          "returnColumn": "n_ClientId",
          "onNotFound": "reject"
        }
      },
      "required": true
    }
  ],
  "validationRules": [
    {
      "name": "Positive Quantity",
      "formula": "=[@Quantity] > 0",
      "errorMessage": "Quantity must be greater than 0",
      "severity": "error"
    }
  ],
  "onDuplicate": "skip",
  "duplicateCheckColumns": ["s_TradeNo"]
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo    [Tables] [Import] [Reports] [Views]         User ▼    │  <- Header
├────────────┬────────────────────────────────────────────────────┤
│            │  Toolbar: [+Add] [Delete] [Copy] [Export] [Save]  │
│  Sidebar   ├────────────────────────────────────────────────────┤
│            │  [A1 ▼] [fx] =SUMIF(Trades[Value],[@Client])      │  <- Formula Bar
│  - Tables  ├────────────────────────────────────────────────────┤
│    • Clients│                                                   │
│    • Trades │              AG-Grid Spreadsheet                  │
│    • Scrips │                                                   │
│    • etc   │                                                    │
│            │                                                    │
│            ├────────────────────────────────────────────────────┤
│            │  Ready            Sum: ₹1,234  Avg: ₹617  Cnt: 2  │  <- Status Bar
└────────────┴────────────────────────────────────────────────────┘
```

---

## Sample Data Context (Trading Domain)

| Table | Description |
|-------|-------------|
| **Clients** | Trading account holders (Client Code, Name, PAN, Balance) |
| **Brokers** | Sub-brokers/dealers |
| **Exchanges** | NSE, BSE, MCX |
| **Scrips** | Stock symbols/instruments |
| **Trades** | Daily trade transactions |
| **Positions** | Current holdings |
| **Margins** | Margin requirements and availability |
| **Ledger** | Account postings (debit/credit) |
| **P&L** | Profit and loss statements |

---

## Key Differentiators

1. **Excel-like Formula Engine** - Users can write formulas like `=SUMIF(Trades[Value], [@ClientId], Trades[ClientId])` directly in cells
2. **Familiar Spreadsheet UX** - Copy/paste, multi-select, keyboard navigation just like Excel
3. **Database Backend** - Data persisted in PostgreSQL with proper relationships
4. **Import with Validation** - Smart file import with lookups, transformations, and validation
5. **Visual Join Builder** - Non-technical users can create complex queries visually

---

## Mock Frontend Reference

A React mock frontend exists at `/excel/frontend/` showing the UI design:
- Run with `npm run dev`
- Uses AG-Grid for the spreadsheet
- Shows all 4 main views (Tables, Import, Reports, Views)

---

## Priority Order for Implementation

1. **Phase 1 - Core Grid**
   - AG-Grid setup with table switching
   - Basic CRUD operations
   - Column configuration from JSON
   - Conditional formatting

2. **Phase 2 - Formula Engine**
   - Implement core functions (SUM, SUMIF, VLOOKUP, IF, etc.)
   - Formula bar integration
   - Cell reference syntax

3. **Phase 3 - File Import**
   - CSV/Excel parsing
   - Column mapping UI
   - Validation engine
   - Template save/load

4. **Phase 4 - Reports & Views**
   - Pivot table builder
   - Chart integration
   - Visual join builder
   - SQL generation
