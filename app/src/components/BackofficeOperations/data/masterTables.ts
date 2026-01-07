import { TrendingUp, FileText, RefreshCw, Database, CheckCircle, Briefcase, Users, Calculator, Clock, AlertTriangle, Building2 } from 'lucide-react';
import type { MasterTablesMap } from '../types';

export const masterTables: MasterTablesMap = {
  // TRADE DATA TABLES
  dayTrade: {
    icon: TrendingUp,
    label: 'Day Trades',
    count: 2847,
    category: 'Trade Data',
    columns: ['Trade ID', 'Company', 'Broker', 'Exchange', 'Contract', 'Client', 'Buy/Sell', 'Qty', 'Price', 'Value', 'Trader', 'Trade Date', 'Status'],
    data: [
      ['100147', 'CNS Ltd', 'ICICI Sec', 'NSE', 'NIFTY-FUT-JAN', 'CLI-1001', 'BUY', '500', '21,450.00', '10,725,000', 'J.SHARMA', '2026-01-07 10:15:23', 'MATCHED'],
      ['100146', 'CNS Ltd', 'HDFC Sec', 'NSE', 'BANKNIFTY-FUT', 'CLI-1002', 'SELL', '200', '48,250.50', '9,650,100', 'R.PATEL', '2026-01-07 10:12:45', 'SETTLED'],
      ['100145', 'CNS Ltd', 'Kotak Sec', 'BSE', 'RELIANCE-EQ', 'CLI-1003', 'BUY', '1,000', '2,485.75', '2,485,750', 'A.KUMAR', '2026-01-07 09:58:12', 'PENDING'],
      ['100144', 'CNS Ltd', 'Zerodha', 'MCX', 'GOLD-FEB', 'CLI-1004', 'SELL', '50', '62,450.00', '3,122,500', 'S.GUPTA', '2026-01-07 09:45:33', 'MATCHED'],
      ['100143', 'CNS Ltd', 'Angel One', 'NSE', 'TCS-EQ', 'CLI-1005', 'BUY', '2,500', '3,892.40', '9,731,000', 'M.VERMA', '2026-01-06 15:22:18', 'FAILED'],
    ]
  },
  trade: {
    icon: FileText,
    label: 'Archived Trades',
    count: 125847,
    category: 'Trade Data',
    columns: ['Trade ID', 'Company', 'Broker', 'Exchange', 'Contract', 'Client', 'Buy/Sell', 'Qty', 'Price', 'Value', 'Process Date'],
    data: [
      ['98542', 'CNS Ltd', 'ICICI Sec', 'NSE', 'NIFTY-FUT-DEC', 'CLI-1001', 'SELL', '300', '21,125.00', '6,337,500', '2026-01-05'],
      ['98541', 'CNS Ltd', 'HDFC Sec', 'BSE', 'INFY-EQ', 'CLI-1002', 'BUY', '5,000', '1,485.25', '7,426,250', '2026-01-05'],
      ['98540', 'CNS Ltd', 'Kotak Sec', 'MCX', 'SILVER-JAN', 'CLI-1003', 'SELL', '100', '74,250.00', '7,425,000', '2026-01-05'],
      ['98539', 'CNS Ltd', 'Zerodha', 'NSE', 'HDFC-EQ', 'CLI-1004', 'BUY', '800', '1,625.50', '1,300,400', '2026-01-04'],
    ]
  },
  ttDayTrade: {
    icon: RefreshCw,
    label: 'Transfer Trades',
    count: 156,
    category: 'Trade Data',
    columns: ['Trade ID', 'Company', 'Broker', 'Exchange', 'Contract', 'Client', 'Buy/Sell', 'Qty', 'Price', 'Transfer ID', 'Trade Date'],
    data: [
      ['TT-0025', 'CNS Ltd', 'ICICI Sec', 'NSE', 'NIFTY-FUT-JAN', 'CLI-1010', 'BUY', '100', '21,420.00', 'TRF-445', '2026-01-07'],
      ['TT-0024', 'CNS Ltd', 'HDFC Sec', 'BSE', 'SBIN-EQ', 'CLI-1011', 'SELL', '2,000', '752.80', 'TRF-444', '2026-01-06'],
      ['TT-0023', 'CNS Ltd', 'Zerodha', 'NSE', 'BANKNIFTY-FUT', 'CLI-1012', 'BUY', '50', '48,150.25', 'TRF-443', '2026-01-06'],
    ]
  },
  // POSITION TABLES
  openPosition: {
    icon: Database,
    label: 'Open Positions (Futures)',
    count: 1542,
    category: 'Positions',
    columns: ['Position ID', 'Position Date', 'Trade ID', 'Broker', 'Client', 'Exchange', 'Contract', 'Buy/Sell', 'Qty', 'Price', 'MTM', 'MTM Closing'],
    data: [
      ['OP-45821', '2026-01-07', '100147', 'ICICI Sec', 'CLI-1001', 'NSE', 'NIFTY-FUT-JAN', 'BUY', '500', '21,450.00', '+125,000', '+118,500'],
      ['OP-45820', '2026-01-07', '100142', 'HDFC Sec', 'CLI-1002', 'NSE', 'BANKNIFTY-FUT', 'SELL', '150', '48,125.00', '-45,750', '-42,300'],
      ['OP-45819', '2026-01-07', '100140', 'Kotak Sec', 'CLI-1003', 'MCX', 'GOLD-FEB', 'BUY', '25', '62,380.00', '+17,500', '+15,250'],
      ['OP-45818', '2026-01-06', '100138', 'Zerodha', 'CLI-1004', 'NSE', 'NIFTY-FUT-JAN', 'SELL', '200', '21,380.00', '-28,000', '-25,400'],
    ]
  },
  closePosition: {
    icon: CheckCircle,
    label: 'Closed Positions (Futures)',
    count: 8942,
    category: 'Positions',
    columns: ['Close ID', 'Close Date', 'Broker', 'Client', 'Exchange', 'Contract', 'Buy Trade', 'Sell Trade', 'Qty', 'Buy Price', 'Sell Price', 'P/L'],
    data: [
      ['CP-12458', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'NIFTY-FUT-DEC', '98542', '100145', '300', '21,125.00', '21,450.00', '+97,500'],
      ['CP-12457', '2026-01-06', 'HDFC Sec', 'CLI-1002', 'NSE', 'BANKNIFTY-FUT', '98500', '100140', '100', '47,850.00', '48,250.00', '+40,000'],
      ['CP-12456', '2026-01-06', 'Zerodha', 'CLI-1004', 'MCX', 'SILVER-JAN', '98480', '100135', '50', '73,800.00', '74,150.00', '+17,500'],
    ]
  },
  netPosition: {
    icon: TrendingUp,
    label: 'Net Positions',
    count: 3847,
    category: 'Positions',
    columns: ['Position ID', 'Date', 'Broker', 'Client', 'Exchange', 'Contract', 'Buy Qty', 'Buy Avg', 'Sell Qty', 'Sell Avg', 'Net Qty', 'Net Value'],
    data: [
      ['NP-8845', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'NIFTY-FUT-JAN', '500', '21,450.00', '200', '21,480.00', '300', '6,435,000'],
      ['NP-8844', '2026-01-07', 'HDFC Sec', 'CLI-1002', 'NSE', 'BANKNIFTY-FUT', '150', '48,125.00', '200', '48,250.00', '-50', '-2,412,500'],
      ['NP-8843', '2026-01-07', 'Kotak Sec', 'CLI-1003', 'MCX', 'GOLD-FEB', '75', '62,380.00', '50', '62,450.00', '25', '1,559,500'],
    ]
  },
  // EQUITY POSITION TABLES
  equityOpenPosition: {
    icon: Briefcase,
    label: 'Equity Open Positions',
    count: 4521,
    category: 'Equity',
    columns: ['Position ID', 'Position Date', 'Trade ID', 'Broker', 'Client', 'Exchange', 'Contract', 'Buy/Sell', 'Qty', 'Price'],
    data: [
      ['EOP-22145', '2026-01-07', '100145', 'Kotak Sec', 'CLI-1003', 'BSE', 'RELIANCE-EQ', 'BUY', '1,000', '2,485.75'],
      ['EOP-22144', '2026-01-07', '100143', 'Angel One', 'CLI-1005', 'NSE', 'TCS-EQ', 'BUY', '2,500', '3,892.40'],
      ['EOP-22143', '2026-01-06', '100138', 'HDFC Sec', 'CLI-1002', 'NSE', 'INFY-EQ', 'SELL', '3,000', '1,485.25'],
      ['EOP-22142', '2026-01-06', '100135', 'Zerodha', 'CLI-1004', 'BSE', 'HDFC-EQ', 'BUY', '500', '1,625.50'],
    ]
  },
  equityNetPosition: {
    icon: Users,
    label: 'Equity Net Positions',
    count: 2156,
    category: 'Equity',
    columns: ['Position ID', 'Date', 'Broker', 'Client', 'Exchange', 'Contract', 'Buy Qty', 'Buy Value', 'Sell Qty', 'Sell Value', 'Net Qty', 'Contract Value'],
    data: [
      ['ENP-5524', '2026-01-07', 'Kotak Sec', 'CLI-1003', 'BSE', 'RELIANCE-EQ', '2,500', '6,214,375', '1,500', '3,728,625', '1,000', '2,485,750'],
      ['ENP-5523', '2026-01-07', 'Angel One', 'CLI-1005', 'NSE', 'TCS-EQ', '4,000', '15,569,600', '1,500', '5,838,600', '2,500', '9,731,000'],
      ['ENP-5522', '2026-01-07', 'HDFC Sec', 'CLI-1002', 'NSE', 'INFY-EQ', '5,000', '7,426,250', '3,000', '4,455,750', '2,000', '2,970,500'],
    ]
  },
  // OPTION TABLES
  optionOpenPosition: {
    icon: TrendingUp,
    label: 'Option Open Positions',
    count: 892,
    category: 'Options',
    columns: ['Position ID', 'Position Date', 'Trade ID', 'Broker', 'Client', 'Exchange', 'Contract', 'Buy/Sell', 'Qty', 'Premium', 'MTM'],
    data: [
      ['OOP-4521', '2026-01-07', '100150', 'ICICI Sec', 'CLI-1001', 'NSE', 'NIFTY-21500-CE-JAN', 'BUY', '1,000', '185.50', '+12,500'],
      ['OOP-4520', '2026-01-07', '100148', 'HDFC Sec', 'CLI-1002', 'NSE', 'BANKNIFTY-48000-PE-JAN', 'SELL', '500', '425.75', '-8,250'],
      ['OOP-4519', '2026-01-06', '100145', 'Zerodha', 'CLI-1004', 'NSE', 'NIFTY-21400-PE-JAN', 'BUY', '750', '145.25', '+5,625'],
    ]
  },
  optionPremium: {
    icon: Calculator,
    label: 'Option Premiums',
    count: 1247,
    category: 'Options',
    columns: ['Premium ID', 'Date', 'Broker', 'Client', 'Exchange', 'Contract', 'Premium Amt', 'Qty', 'Currency', 'Dr/Cr'],
    data: [
      ['OPM-8842', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'NIFTY-21500-CE-JAN', '185,500', '1,000', 'INR', 'DR'],
      ['OPM-8841', '2026-01-07', 'HDFC Sec', 'CLI-1002', 'NSE', 'BANKNIFTY-48000-PE-JAN', '212,875', '500', 'INR', 'CR'],
      ['OPM-8840', '2026-01-06', 'Zerodha', 'CLI-1004', 'NSE', 'NIFTY-21400-PE-JAN', '108,937', '750', 'INR', 'DR'],
    ]
  },
  // CLOSING PRICES
  closingPrice: {
    icon: Clock,
    label: 'Closing Prices',
    count: 15847,
    category: 'Prices',
    columns: ['Price ID', 'Close Date', 'Contract', 'Settlement Date', 'Broker', 'Close Price', 'Manual', 'Modified By'],
    data: [
      ['CLP-45821', '2026-01-07', 'NIFTY-FUT-JAN', '2026-01-30', 'ICICI Sec', '21,485.50', 'No', 'SYSTEM'],
      ['CLP-45820', '2026-01-07', 'BANKNIFTY-FUT-JAN', '2026-01-30', 'HDFC Sec', '48,312.75', 'No', 'SYSTEM'],
      ['CLP-45819', '2026-01-07', 'GOLD-FEB', '2026-02-05', 'Kotak Sec', '62,520.00', 'No', 'SYSTEM'],
      ['CLP-45818', '2026-01-07', 'RELIANCE-EQ', '2026-01-09', 'Angel One', '2,492.40', 'Yes', 'ADMIN'],
    ]
  },
  // MTM & P/L
  markToMarket: {
    icon: TrendingUp,
    label: 'Mark-to-Market',
    count: 8547,
    category: 'MTM & P/L',
    columns: ['MTM ID', 'Date', 'Broker', 'Client', 'Exchange', 'Market Type', 'Contract', 'MTM', 'MTM Closing', 'Currency'],
    data: [
      ['MTM-12458', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'Futures', 'NIFTY-FUT-JAN', '+125,000', '+118,500', 'INR'],
      ['MTM-12457', '2026-01-07', 'HDFC Sec', 'CLI-1002', 'NSE', 'Futures', 'BANKNIFTY-FUT', '-45,750', '-42,300', 'INR'],
      ['MTM-12456', '2026-01-07', 'Kotak Sec', 'CLI-1003', 'MCX', 'Commodity', 'GOLD-FEB', '+17,500', '+15,250', 'INR'],
      ['MTM-12455', '2026-01-06', 'Zerodha', 'CLI-1004', 'NSE', 'Futures', 'NIFTY-FUT-JAN', '-28,000', '-25,400', 'INR'],
    ]
  },
  profitLoss: {
    icon: TrendingUp,
    label: 'Realized P/L',
    count: 6842,
    category: 'MTM & P/L',
    columns: ['P/L ID', 'Date', 'Broker', 'Client', 'Exchange', 'Market Type', 'Contract', 'Amount', 'Currency'],
    data: [
      ['PL-8845', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'Futures', 'NIFTY-FUT-DEC', '+97,500', 'INR'],
      ['PL-8844', '2026-01-06', 'HDFC Sec', 'CLI-1002', 'NSE', 'Futures', 'BANKNIFTY-FUT', '+40,000', 'INR'],
      ['PL-8843', '2026-01-06', 'Zerodha', 'CLI-1004', 'MCX', 'Commodity', 'SILVER-JAN', '+17,500', 'INR'],
      ['PL-8842', '2026-01-05', 'Kotak Sec', 'CLI-1003', 'NSE', 'Options', 'NIFTY-21400-CE', '-12,250', 'INR'],
    ]
  },
  // MARGIN & EXPENSES
  dailyMargin: {
    icon: AlertTriangle,
    label: 'Daily Margins',
    count: 4521,
    category: 'Margins',
    columns: ['Margin ID', 'Margin Date', 'Broker', 'Client', 'Margin Amount', 'Currency', 'Modified By', 'Modified Date'],
    data: [
      ['DM-15842', '2026-01-07', 'ICICI Sec', 'CLI-1001', '2,145,000', 'INR', 'SYSTEM', '2026-01-07 18:30:00'],
      ['DM-15841', '2026-01-07', 'HDFC Sec', 'CLI-1002', '1,925,000', 'INR', 'SYSTEM', '2026-01-07 18:30:00'],
      ['DM-15840', '2026-01-07', 'Kotak Sec', 'CLI-1003', '1,247,500', 'INR', 'SYSTEM', '2026-01-07 18:30:00'],
      ['DM-15839', '2026-01-07', 'Zerodha', 'CLI-1004', '856,250', 'INR', 'SYSTEM', '2026-01-07 18:30:00'],
    ]
  },
  clientExpense: {
    icon: FileText,
    label: 'Client Expenses',
    count: 12847,
    category: 'Margins',
    columns: ['Expense ID', 'Date', 'Broker', 'Client', 'Exchange', 'Market', 'Buy Turnover', 'Sell Turnover', 'Trans Charges', 'Brokerage', 'STT/CTT'],
    data: [
      ['CE-25841', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'Futures', '10,725,000', '4,296,000', '1,502', '5,360', '0'],
      ['CE-25840', '2026-01-07', 'HDFC Sec', 'CLI-1002', 'NSE', 'Futures', '9,650,100', '7,218,750', '1,687', '4,217', '0'],
      ['CE-25839', '2026-01-07', 'Kotak Sec', 'CLI-1003', 'BSE', 'Equity', '2,485,750', '0', '248', '1,243', '2,486'],
      ['CE-25838', '2026-01-07', 'Zerodha', 'CLI-1004', 'MCX', 'Commodity', '3,122,500', '1,561,250', '468', '1,171', '0'],
    ]
  },
  dailyBrokerage: {
    icon: Building2,
    label: 'Daily Brokerage',
    count: 8542,
    category: 'Margins',
    columns: ['Brokerage ID', 'Date', 'Broker', 'Client', 'Exchange', 'Market Type', 'Brokerage Amt', 'Net Brokerage', 'Service Tax'],
    data: [
      ['DB-12458', '2026-01-07', 'ICICI Sec', 'CLI-1001', 'NSE', 'Futures', '5,360', '4,545', '815'],
      ['DB-12457', '2026-01-07', 'HDFC Sec', 'CLI-1002', 'NSE', 'Futures', '4,217', '3,576', '641'],
      ['DB-12456', '2026-01-07', 'Kotak Sec', 'CLI-1003', 'BSE', 'Equity', '1,243', '1,054', '189'],
      ['DB-12455', '2026-01-07', 'Zerodha', 'CLI-1004', 'MCX', 'Commodity', '1,171', '993', '178'],
    ]
  },
  // ACCOUNTING
  accountPosting: {
    icon: FileText,
    label: 'Account Postings',
    count: 45821,
    category: 'Accounting',
    columns: ['Posting ID', 'Journal No', 'Posting Date', 'GL Account', 'Amount', 'Currency', 'Dr/Cr', 'Narration', 'Type'],
    data: [
      ['AP-125847', '45821', '2026-01-07', 'ACC-MTM-001', '125,000', 'INR', 'CR', 'MTM Credit - NIFTY-FUT', 'MTM'],
      ['AP-125846', '45820', '2026-01-07', 'ACC-BRK-002', '5,360', 'INR', 'DR', 'Brokerage Expense - NSE', 'Expense'],
      ['AP-125845', '45819', '2026-01-07', 'ACC-CLI-1001', '2,145,000', 'INR', 'DR', 'Margin Collected', 'Margin'],
      ['AP-125844', '45818', '2026-01-06', 'ACC-PL-001', '97,500', 'INR', 'CR', 'Realized P/L - Futures', 'P/L'],
    ]
  },
  openingBalance: {
    icon: Database,
    label: 'Opening Balances',
    count: 1542,
    category: 'Accounting',
    columns: ['OB ID', 'OB Date', 'GL Account', 'Type', 'Sub Type', 'Exchange', 'Opening Balance', 'Dr/Cr', 'Currency'],
    data: [
      ['OB-542', '2026-01-01', 'ACC-CLI-1001', 'Client', 'Ledger', 'NSE', '5,425,000', 'CR', 'INR'],
      ['OB-541', '2026-01-01', 'ACC-CLI-1002', 'Client', 'Ledger', 'NSE', '3,892,500', 'CR', 'INR'],
      ['OB-540', '2026-01-01', 'ACC-BRK-001', 'Broker', 'Expense', 'NSE', '125,450', 'DR', 'INR'],
      ['OB-539', '2026-01-01', 'ACC-MTM-001', 'MTM', 'P&L', 'NSE', '845,250', 'CR', 'INR'],
    ]
  },
  // CORPORATE ACTIONS
  corporateAction: {
    icon: FileText,
    label: 'Corporate Actions',
    count: 89,
    category: 'Corporate Actions',
    columns: ['Action ID', 'Underlying', 'Ex-Date', 'Action Type', 'Numerator', 'Denominator', 'Adj Factor', 'Remarks'],
    data: [
      ['CA-089', 'RELIANCE', '2026-01-15', 'DIVIDEND', '-', '-', '-', 'Rs. 8/share Interim Dividend'],
      ['CA-088', 'TCS', '2026-01-20', 'BONUS', '1', '1', '2.00', '1:1 Bonus Issue'],
      ['CA-087', 'INFY', '2026-02-01', 'SPLIT', '1', '2', '0.50', '1:2 Stock Split'],
      ['CA-086', 'HDFC', '2025-12-15', 'DIVIDEND', '-', '-', '-', 'Rs. 5/share Final Dividend'],
    ]
  },
  // ACTIVITY & AUDIT
  activity: {
    icon: Clock,
    label: 'Activity Log',
    count: 125847,
    category: 'Audit',
    columns: ['Activity ID', 'Activity Date', 'Status', 'Description', 'User'],
    data: [
      ['ACT-125847', '2026-01-07', 'SUCCESS', 'EOD Processing Completed - 2847 trades processed', 'SYSTEM'],
      ['ACT-125846', '2026-01-07', 'SUCCESS', 'MTM Calculation Completed - All positions marked', 'SYSTEM'],
      ['ACT-125845', '2026-01-07', 'WARNING', 'Margin Shortfall Alert - CLI-1005', 'SYSTEM'],
      ['ACT-125844', '2026-01-07', 'SUCCESS', 'Closing Price Import - NSE/BSE/MCX', 'ADMIN'],
      ['ACT-125843', '2026-01-06', 'FAILED', 'Trade Upload Failed - Invalid format', 'J.SHARMA'],
    ]
  },
  runningProcess: {
    icon: RefreshCw,
    label: 'Running Processes',
    count: 5,
    category: 'Audit',
    columns: ['Process Name', 'Status', 'User', 'Company', 'Start Time'],
    data: [
      ['EOD_POSITION_CALC', 'RUNNING', 'SYSTEM', 'CNS Ltd', '2026-01-07 18:30:00'],
      ['MTM_CALCULATION', 'COMPLETED', 'SYSTEM', 'CNS Ltd', '2026-01-07 18:25:00'],
      ['CLOSING_PRICE_IMPORT', 'COMPLETED', 'ADMIN', 'CNS Ltd', '2026-01-07 18:15:00'],
      ['MARGIN_CALCULATION', 'PENDING', 'SYSTEM', 'CNS Ltd', '2026-01-07 18:35:00'],
    ]
  },
};
