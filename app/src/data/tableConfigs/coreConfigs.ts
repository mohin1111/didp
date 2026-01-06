import { currencyFormatter, percentFormatter, numberFormatter, dateFormatter, type TableConfig } from './formatters';
import { clientsData, brokersData, tradesData, scripsData, positionsData, marginsData, ledgerData, pnlData } from '../mockData';

// Clients table configuration (tbl_ClientMaster)
export const clientsConfig: TableConfig = {
  columns: [
    { field: 's_ClientCode', headerName: 'Client Code', pinned: 'left', width: 100 },
    { field: 's_ClientName', headerName: 'Client Name', width: 200 },
    { field: 's_PAN', headerName: 'PAN', width: 120 },
    { field: 's_Email', headerName: 'Email', width: 180 },
    { field: 's_Mobile', headerName: 'Mobile', width: 110 },
    { field: 'n_Balance', headerName: 'Balance', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Margin', headerName: 'Margin', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Status', headerName: 'Status', width: 90 },
    { field: 'n_BrokerId', headerName: 'Broker ID', width: 90, type: 'numericColumn' },
    { field: 'n_ExchangeId', headerName: 'Exchange ID', width: 100, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 's_DPId', headerName: 'DP ID', width: 100 },
    { field: 's_DematAcc', headerName: 'Demat', width: 160 },
    { field: 's_BankAccount', headerName: 'Bank A/c', width: 150 },
    { field: 's_City', headerName: 'City', width: 100 },
    { field: 's_State', headerName: 'State', width: 120 },
    { field: 'd_StartDate', headerName: 'Start Date', width: 110, valueFormatter: dateFormatter },
    { field: 'd_LastTradeDate', headerName: 'Last Trade', width: 110, valueFormatter: dateFormatter },
    { field: 's_KYCStatus', headerName: 'KYC', width: 90 },
  ],
  data: clientsData as Record<string, unknown>[],
};

// Brokers table configuration (tbl_BrokerMaster)
export const brokersConfig: TableConfig = {
  columns: [
    { field: 's_BrokerCode', headerName: 'Broker Code', pinned: 'left', width: 100 },
    { field: 's_BrokerName', headerName: 'Broker Name', width: 180 },
    { field: 'n_ExchangeId', headerName: 'Exchange ID', width: 100, type: 'numericColumn' },
    { field: 's_SEBIReg', headerName: 'SEBI Reg', width: 120 },
    { field: 'n_Commission', headerName: 'Commission %', width: 110, type: 'numericColumn', valueFormatter: percentFormatter },
    { field: 'n_ActiveClients', headerName: 'Active Clients', width: 110, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_TotalVolume', headerName: 'Total Volume', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_MTDVolume', headerName: 'MTD Volume', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Status', headerName: 'Status', width: 90 },
    { field: 'd_StartDate', headerName: 'Start Date', width: 110, valueFormatter: dateFormatter },
    { field: 's_ContactPerson', headerName: 'Contact', width: 130 },
    { field: 's_Phone', headerName: 'Phone', width: 120 },
    { field: 's_Email', headerName: 'Email', width: 180 },
    { field: 's_Address', headerName: 'Address', width: 150 },
  ],
  data: brokersData as Record<string, unknown>[],
};

// Trades table configuration (tbl_DayTrade)
export const tradesConfig: TableConfig = {
  columns: [
    { field: 's_TradeNo', headerName: 'Trade No', pinned: 'left', width: 130 },
    { field: 'd_TradeDate', headerName: 'Trade Date', width: 100, valueFormatter: dateFormatter },
    { field: 'd_SettlementDate', headerName: 'Settlement', width: 100, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 80 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 120 },
    { field: 'n_BuySell', headerName: 'B/S', width: 60 },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_Price', headerName: 'Price', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Value', headerName: 'Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Brokerage', headerName: 'Brokerage', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_STT', headerName: 'STT', width: 80, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_GST', headerName: 'GST', width: 80, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_TotalCharges', headerName: 'Charges', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_NetValue', headerName: 'Net Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 60, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Seg', width: 60 },
    { field: 's_Status', headerName: 'Status', width: 90 },
    { field: 's_SettlementStatus', headerName: 'Stl Status', width: 100 },
  ],
  data: tradesData as Record<string, unknown>[],
};

// Scrips table configuration (tbl_ScripMaster)
export const scripsConfig: TableConfig = {
  columns: [
    { field: 's_ScripCode', headerName: 'Scrip Code', pinned: 'left', width: 100 },
    { field: 's_ScripName', headerName: 'Scrip Name', width: 220 },
    { field: 's_ISIN', headerName: 'ISIN', width: 130 },
    { field: 'n_ExchangeId', headerName: 'Exchange', width: 80, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 's_Series', headerName: 'Series', width: 70 },
    { field: 'n_LotSize', headerName: 'Lot Size', width: 80, type: 'numericColumn' },
    { field: 'n_LastPrice', headerName: 'LTP', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Change', headerName: 'Change', width: 90, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ChangePercent', headerName: 'Chg %', width: 80, type: 'numericColumn', valueFormatter: percentFormatter },
    { field: 'n_Open', headerName: 'Open', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_High', headerName: 'High', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Low', headerName: 'Low', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_PrevClose', headerName: 'Prev Close', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Volume', headerName: 'Volume', width: 110, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_Value', headerName: 'Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_MarketCap', headerName: 'Mkt Cap (Cr)', width: 110, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: scripsData as Record<string, unknown>[],
};

// Positions table configuration
export const positionsConfig: TableConfig = {
  columns: [
    { field: 's_ClientCode', headerName: 'Client', pinned: 'left', width: 80 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 140 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 60, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Seg', width: 60 },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_AvgPrice', headerName: 'Avg Price', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_CurrentPrice', headerName: 'CMP', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Value', headerName: 'Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_PnL', headerName: 'P&L', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_PnLPercent', headerName: 'P&L %', width: 80, type: 'numericColumn', valueFormatter: percentFormatter },
    { field: 'n_DayPnL', headerName: 'Day P&L', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Type', headerName: 'Type', width: 70 },
  ],
  data: positionsData as Record<string, unknown>[],
};

// Margins table configuration (tbl_DailyMargin)
export const marginsConfig: TableConfig = {
  columns: [
    { field: 's_ClientCode', headerName: 'Client', pinned: 'left', width: 80 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 60, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Seg', width: 60 },
    { field: 'n_CashMargin', headerName: 'Cash Margin', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_CollateralMargin', headerName: 'Collateral', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_TotalMargin', headerName: 'Total Margin', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_UsedMargin', headerName: 'Used Margin', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_AvailableMargin', headerName: 'Available', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_UtilizationPercent', headerName: 'Util %', width: 80, type: 'numericColumn', valueFormatter: percentFormatter },
    { field: 's_Status', headerName: 'Status', width: 80 },
    { field: 'd_LastUpdated', headerName: 'Last Updated', width: 150 },
  ],
  data: marginsData as Record<string, unknown>[],
};

// Ledger table configuration (tbl_Ledger)
export const ledgerConfig: TableConfig = {
  columns: [
    { field: 's_VoucherNo', headerName: 'Voucher No', pinned: 'left', width: 130 },
    { field: 'd_VoucherDate', headerName: 'Date', width: 100, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 80 },
    { field: 's_Particular', headerName: 'Particular', width: 200 },
    { field: 's_VoucherType', headerName: 'Type', width: 80 },
    { field: 'n_Debit', headerName: 'Debit', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Credit', headerName: 'Credit', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Balance', headerName: 'Balance', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Narration', headerName: 'Narration', width: 250 },
    { field: 's_Reference', headerName: 'Reference', width: 120 },
    { field: 's_EntryBy', headerName: 'Entry By', width: 100 },
    { field: 'd_EntryDate', headerName: 'Entry Date', width: 150 },
  ],
  data: ledgerData as Record<string, unknown>[],
};

// P&L table configuration (tbl_ProfitLoss)
export const pnlConfig: TableConfig = {
  columns: [
    { field: 's_ClientCode', headerName: 'Client', pinned: 'left', width: 80 },
    { field: 's_Period', headerName: 'Period', width: 90 },
    { field: 's_Segment', headerName: 'Segment', width: 70 },
    { field: 'n_RealizedPnL', headerName: 'Realized P&L', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_UnrealizedPnL', headerName: 'Unrealized P&L', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_TotalPnL', headerName: 'Total P&L', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Brokerage', headerName: 'Brokerage', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_TotalCharges', headerName: 'Charges', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_NetPnL', headerName: 'Net P&L', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Trades', headerName: 'Trades', width: 70, type: 'numericColumn' },
    { field: 'n_AvgPnLPerTrade', headerName: 'Avg P&L/Trade', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
  ],
  data: pnlData as Record<string, unknown>[],
};
