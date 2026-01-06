# Excel Functions Used by Stored Procedures

This document lists all 110+ Excel functions that the system supports to work with the CNS database stored procedures.

---

## Summary

| Category | Count |
|----------|-------|
| Mathematical | 17 |
| Conditional Aggregation | 8 |
| Logical | 12 |
| Lookup | 7 |
| Text | 17 |
| Date | 17 |
| Financial | 7 |
| Statistical | 9 |
| Array | 6 |
| **Total** | **110+** |

---

## 1. Mathematical Functions (17)

| Function | Syntax | Description |
|----------|--------|-------------|
| `SUM` | `=SUM(values)` | Sum of values |
| `AVERAGE` | `=AVERAGE(values)` | Mean of values |
| `MIN` | `=MIN(values)` | Minimum value |
| `MAX` | `=MAX(values)` | Maximum value |
| `COUNT` | `=COUNT(values)` | Count numbers |
| `COUNTA` | `=COUNTA(values)` | Count non-empty cells |
| `ABS` | `=ABS(number)` | Absolute value |
| `ROUND` | `=ROUND(number, decimals)` | Round to decimals |
| `ROUNDUP` | `=ROUNDUP(number, decimals)` | Round up |
| `ROUNDDOWN` | `=ROUNDDOWN(number, decimals)` | Round down |
| `CEILING` | `=CEILING(number, significance)` | Round up to multiple |
| `FLOOR` | `=FLOOR(number, significance)` | Round down to multiple |
| `MOD` | `=MOD(number, divisor)` | Remainder |
| `POWER` | `=POWER(base, exponent)` | Exponentiation |
| `SQRT` | `=SQRT(number)` | Square root |
| `SIGN` | `=SIGN(number)` | Sign (-1, 0, 1) |
| `PRODUCT` | `=PRODUCT(values)` | Multiply all values |

---

## 2. Conditional Aggregation Functions (8)

| Function | Syntax | Description |
|----------|--------|-------------|
| `SUMIF` | `=SUMIF(range, criteria, sum_range)` | Sum with condition |
| `SUMIFS` | `=SUMIFS(sum_range, range1, criteria1, ...)` | Sum with multiple conditions |
| `COUNTIF` | `=COUNTIF(range, criteria)` | Count with condition |
| `COUNTIFS` | `=COUNTIFS(range1, criteria1, ...)` | Count with multiple conditions |
| `AVERAGEIF` | `=AVERAGEIF(range, criteria, average_range)` | Average with condition |
| `AVERAGEIFS` | `=AVERAGEIFS(average_range, range1, criteria1, ...)` | Average with multiple conditions |
| `MAXIFS` | `=MAXIFS(max_range, range1, criteria1, ...)` | Max with conditions |
| `MINIFS` | `=MINIFS(min_range, range1, criteria1, ...)` | Min with conditions |

---

## 3. Logical Functions (12)

| Function | Syntax | Description |
|----------|--------|-------------|
| `IF` | `=IF(condition, true_value, false_value)` | Conditional |
| `IFS` | `=IFS(cond1, val1, cond2, val2, ...)` | Multiple conditions |
| `AND` | `=AND(condition1, condition2, ...)` | All true |
| `OR` | `=OR(condition1, condition2, ...)` | Any true |
| `NOT` | `=NOT(condition)` | Negate |
| `XOR` | `=XOR(condition1, condition2)` | Exclusive or |
| `SWITCH` | `=SWITCH(value, case1, result1, ...)` | Switch case |
| `IFERROR` | `=IFERROR(value, error_value)` | Handle errors |
| `IFNA` | `=IFNA(value, na_value)` | Handle #N/A |
| `ISBLANK` | `=ISBLANK(value)` | Check empty |
| `ISNUMBER` | `=ISNUMBER(value)` | Check number |
| `ISTEXT` | `=ISTEXT(value)` | Check text |
| `ISERROR` | `=ISERROR(value)` | Check error |

---

## 4. Lookup Functions (7)

| Function | Syntax | Description |
|----------|--------|-------------|
| `VLOOKUP` | `=VLOOKUP(lookup_value, table, return_column)` | Vertical lookup |
| `XLOOKUP` | `=XLOOKUP(lookup, lookup_array, return_array, not_found)` | Modern lookup |
| `INDEX` | `=INDEX(array, row, column)` | Get value by position |
| `MATCH` | `=MATCH(value, array, match_type)` | Find position |
| `LOOKUP` | `=LOOKUP(value, lookup_vector, result_vector)` | Simple lookup |
| `RELATED` | `=RELATED(TableName[Column])` | Get related record |
| `RELATEDTABLE` | `=RELATEDTABLE(TableName)` | Get related rows |

---

## 5. Text Functions (17)

| Function | Syntax | Description |
|----------|--------|-------------|
| `CONCAT` | `=CONCAT(text1, text2, ...)` | Join text |
| `CONCATENATE` | `=CONCATENATE(text1, text2, ...)` | Join text (legacy) |
| `LEFT` | `=LEFT(text, num_chars)` | Left characters |
| `RIGHT` | `=RIGHT(text, num_chars)` | Right characters |
| `MID` | `=MID(text, start, num_chars)` | Middle characters |
| `LEN` | `=LEN(text)` | Length |
| `UPPER` | `=UPPER(text)` | Uppercase |
| `LOWER` | `=LOWER(text)` | Lowercase |
| `PROPER` | `=PROPER(text)` | Title case |
| `TRIM` | `=TRIM(text)` | Remove extra spaces |
| `SUBSTITUTE` | `=SUBSTITUTE(text, old, new)` | Replace text |
| `REPLACE` | `=REPLACE(text, start, num, new)` | Replace by position |
| `FIND` | `=FIND(find_text, within_text)` | Find position (case-sensitive) |
| `SEARCH` | `=SEARCH(find_text, within_text)` | Find position (case-insensitive) |
| `TEXT` | `=TEXT(value, format)` | Format as text |
| `VALUE` | `=VALUE(text)` | Text to number |
| `TEXTJOIN` | `=TEXTJOIN(delimiter, ignore_empty, values)` | Join with delimiter |

---

## 6. Date Functions (17)

| Function | Syntax | Description |
|----------|--------|-------------|
| `TODAY` | `=TODAY()` | Current date |
| `NOW` | `=NOW()` | Current datetime |
| `DATE` | `=DATE(year, month, day)` | Create date |
| `YEAR` | `=YEAR(date)` | Extract year |
| `MONTH` | `=MONTH(date)` | Extract month |
| `DAY` | `=DAY(date)` | Extract day |
| `WEEKDAY` | `=WEEKDAY(date)` | Day of week (1-7) |
| `WEEKNUM` | `=WEEKNUM(date)` | Week number |
| `DATEDIF` | `=DATEDIF(start, end, unit)` | Difference in units |
| `DATEADD` | `=DATEADD(date, number, unit)` | Add to date |
| `EOMONTH` | `=EOMONTH(date, months)` | End of month |
| `EDATE` | `=EDATE(date, months)` | Add months |
| `NETWORKDAYS` | `=NETWORKDAYS(start, end)` | Working days |
| `WORKDAY` | `=WORKDAY(start, days)` | Add working days |
| `HOUR` | `=HOUR(datetime)` | Extract hour |
| `MINUTE` | `=MINUTE(datetime)` | Extract minute |
| `SECOND` | `=SECOND(datetime)` | Extract second |

---

## 7. Financial Functions (7)

| Function | Syntax | Description |
|----------|--------|-------------|
| `PMT` | `=PMT(rate, nper, pv)` | Loan payment |
| `PV` | `=PV(rate, nper, pmt)` | Present value |
| `FV` | `=FV(rate, nper, pmt)` | Future value |
| `NPV` | `=NPV(rate, values)` | Net present value |
| `IRR` | `=IRR(values)` | Internal rate of return |
| `RATE` | `=RATE(nper, pmt, pv)` | Interest rate |
| `NPER` | `=NPER(rate, pmt, pv)` | Number of periods |

---

## 8. Statistical Functions (9)

| Function | Syntax | Description |
|----------|--------|-------------|
| `MEDIAN` | `=MEDIAN(values)` | Median value |
| `MODE` | `=MODE(values)` | Most frequent |
| `STDEV` | `=STDEV(values)` | Standard deviation |
| `VAR` | `=VAR(values)` | Variance |
| `LARGE` | `=LARGE(array, k)` | Kth largest |
| `SMALL` | `=SMALL(array, k)` | Kth smallest |
| `RANK` | `=RANK(number, array)` | Rank in array |
| `PERCENTILE` | `=PERCENTILE(array, k)` | Kth percentile |
| `QUARTILE` | `=QUARTILE(array, quart)` | Quartile value |

---

## 9. Array Functions (6)

| Function | Syntax | Description |
|----------|--------|-------------|
| `FILTER` | `=FILTER(array, condition)` | Filter rows |
| `SORT` | `=SORT(array, sort_index, order)` | Sort array |
| `UNIQUE` | `=UNIQUE(array)` | Unique values |
| `SEQUENCE` | `=SEQUENCE(rows, cols, start, step)` | Generate sequence |
| `CHOOSECOLS` | `=CHOOSECOLS(array, col_nums)` | Select columns |
| `CHOOSEROWS` | `=CHOOSEROWS(array, row_nums)` | Select rows |

---

## SP to Excel Function Mapping

These Excel functions map to operations performed by the 662 stored procedures in the CNS database:

| SP Operation | Excel Equivalent |
|--------------|------------------|
| Trade value calculations | `SUM`, `SUMIF`, `SUMIFS` |
| Position counting | `COUNT`, `COUNTIF`, `COUNTIFS` |
| MTM calculations | `SUM`, `PRODUCT`, `IF` |
| Brokerage calculations | `VLOOKUP`, `IF`, `ROUND` |
| Date processing | `DATEDIF`, `EOMONTH`, `WORKDAY` |
| Client lookups | `VLOOKUP`, `XLOOKUP`, `INDEX/MATCH` |
| Margin calculations | `SUM`, `MAX`, `IF` |
| P&L reports | `SUMIF`, `IF`, `ABS` |
| Aging analysis | `DATEDIF`, `IFS`, `IF` |
| Statistical analysis | `AVERAGE`, `STDEV`, `PERCENTILE` |

---

## Related Documentation

- [Formula Engine](./05-FORMULA-ENGINE.md) - Full formula engine documentation
- [Grid View](./01-GRID-VIEW.md) - Spreadsheet interface
- [Report Builder](./03-REPORT-BUILDER.md) - Report generation with formulas
