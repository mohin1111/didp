import { currencyFormatter, numberFormatter, percentFormatter, dateFormatter, type TableConfig } from './formatters';
import {
  dayTradeFutData, dayTradeOptData, dayTradeCashData, openPositionsData, closedPositionsData,
  mtmData, brokerageData, accountPostingsData, closingPricesData,
  exchangeMasterData, settlementMasterData, obligationData, collateralData
} from '../mockData';

// Day Trade Futures table (tbl_DayTradeFut)
export const dayTradeFutConfig: TableConfig = {
  columns: [
    { field: 's_TradeNo', headerName: 'Trade No', pinned: 'left', width: 140 },
    { field: 'd_TradeDate', headerName: 'Trade Date', width: 110, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 150 },
    { field: 'd_ExpiryDate', headerName: 'Expiry', width: 100, valueFormatter: dateFormatter },
    { field: 'n_BuySell', headerName: 'B/S', width: 60 },
    { field: 'n_Lots', headerName: 'Lots', width: 70, type: 'numericColumn' },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_Price', headerName: 'Price', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Value', headerName: 'Value', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 'n_Brokerage', headerName: 'Brokerage', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Status', headerName: 'Status', width: 90 },
    { field: 'b_Validated', headerName: 'Validated', width: 90 },
  ],
  data: dayTradeFutData as Record<string, unknown>[],
};

// Day Trade Options table (tbl_DayTradeOpt)
export const dayTradeOptConfig: TableConfig = {
  columns: [
    { field: 's_TradeNo', headerName: 'Trade No', pinned: 'left', width: 140 },
    { field: 'd_TradeDate', headerName: 'Trade Date', width: 110, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 180 },
    { field: 'd_ExpiryDate', headerName: 'Expiry', width: 100, valueFormatter: dateFormatter },
    { field: 'n_StrikePrice', headerName: 'Strike', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_OptionType', headerName: 'Type', width: 60 },
    { field: 'n_BuySell', headerName: 'B/S', width: 60 },
    { field: 'n_Lots', headerName: 'Lots', width: 70, type: 'numericColumn' },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_Premium', headerName: 'Premium', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Value', headerName: 'Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 'n_Brokerage', headerName: 'Brokerage', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Status', headerName: 'Status', width: 90 },
  ],
  data: dayTradeOptData as Record<string, unknown>[],
};

// Day Trade Cash table (tbl_DayTradeCash)
export const dayTradeCashConfig: TableConfig = {
  columns: [
    { field: 's_TradeNo', headerName: 'Trade No', pinned: 'left', width: 140 },
    { field: 'd_TradeDate', headerName: 'Trade Date', width: 110, valueFormatter: dateFormatter },
    { field: 'd_SettlementDate', headerName: 'Settlement', width: 110, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 110 },
    { field: 's_ISIN', headerName: 'ISIN', width: 130 },
    { field: 'n_BuySell', headerName: 'B/S', width: 60 },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_Price', headerName: 'Price', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Value', headerName: 'Value', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 'n_Brokerage', headerName: 'Brokerage', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Status', headerName: 'Status', width: 90 },
    { field: 's_SettlementNo', headerName: 'Stl No', width: 120 },
  ],
  data: dayTradeCashData as Record<string, unknown>[],
};

// Open Positions table (tbl_OpenPositon)
export const openPositionsConfig: TableConfig = {
  columns: [
    { field: 'n_PositionId', headerName: 'Position ID', pinned: 'left', width: 100, type: 'numericColumn' },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 150 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 'n_BuySell', headerName: 'B/S', width: 60, type: 'numericColumn' },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_AvgPrice', headerName: 'Avg Price', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_CurrentPrice', headerName: 'CMP', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Value', headerName: 'Value', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_UnrealizedPnL', headerName: 'Unrealized P&L', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_VariationMargin', headerName: 'Var Margin', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'd_OpenDate', headerName: 'Open Date', width: 110, valueFormatter: dateFormatter },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: openPositionsData as Record<string, unknown>[],
};

// Closed Positions table (tbl_ClosePositon)
export const closedPositionsConfig: TableConfig = {
  columns: [
    { field: 'n_PositionId', headerName: 'Position ID', pinned: 'left', width: 100, type: 'numericColumn' },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 150 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_AvgBuyPrice', headerName: 'Buy Price', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_AvgSellPrice', headerName: 'Sell Price', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_BuyValue', headerName: 'Buy Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_SellValue', headerName: 'Sell Value', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_RealizedPnL', headerName: 'Realized P&L', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_NetPnL', headerName: 'Net P&L', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'd_OpenDate', headerName: 'Open Date', width: 100, valueFormatter: dateFormatter },
    { field: 'd_CloseDate', headerName: 'Close Date', width: 100, valueFormatter: dateFormatter },
    { field: 'n_HoldingDays', headerName: 'Days', width: 70, type: 'numericColumn' },
    { field: 's_FIFOMethod', headerName: 'Method', width: 80 },
  ],
  data: closedPositionsData as Record<string, unknown>[],
};

// MTM (Mark to Market) table (tbl_MarkToMarket)
export const mtmConfig: TableConfig = {
  columns: [
    { field: 'n_MTMId', headerName: 'MTM ID', pinned: 'left', width: 100, type: 'numericColumn' },
    { field: 'd_MTMDate', headerName: 'Date', width: 100, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_ScripCode', headerName: 'Scrip', width: 150 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 'n_Quantity', headerName: 'Qty', width: 80, type: 'numericColumn', valueFormatter: numberFormatter },
    { field: 'n_AvgPrice', headerName: 'Avg Price', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ClosingPrice', headerName: 'Close Price', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_PreviousClose', headerName: 'Prev Close', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_MTMPnL', headerName: 'MTM P&L', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_DailyMTM', headerName: 'Daily MTM', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_VariationMargin', headerName: 'Var Margin', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'b_MarginPosted', headerName: 'Posted', width: 80 },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: mtmData as Record<string, unknown>[],
};

// Brokerage table (tbl_BrokerCommission / tbl_ClientCommission)
export const brokerageConfig: TableConfig = {
  columns: [
    { field: 'n_BrokerageId', headerName: 'Brokerage ID', pinned: 'left', width: 110, type: 'numericColumn' },
    { field: 'd_TradeDate', headerName: 'Trade Date', width: 100, valueFormatter: dateFormatter },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 'n_TradeId', headerName: 'Trade ID', width: 100, type: 'numericColumn' },
    { field: 's_ScripCode', headerName: 'Scrip', width: 150 },
    { field: 'n_TradeValue', headerName: 'Trade Value', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_BrokerageRate', headerName: 'Rate %', width: 80, type: 'numericColumn' },
    { field: 'n_BrokerageAmt', headerName: 'Brokerage', width: 100, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_BrokerageType', headerName: 'Type', width: 80 },
    { field: 's_MarketType', headerName: 'Market', width: 80 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 'n_BrokerShare', headerName: 'Broker Share', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ClientShare', headerName: 'Client Share', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Status', headerName: 'Status', width: 90 },
  ],
  data: brokerageData as Record<string, unknown>[],
};

// Account Postings (Journal Entries) table (tbl_AccountPosting)
export const accountPostingsConfig: TableConfig = {
  columns: [
    { field: 'n_PostingId', headerName: 'Posting ID', pinned: 'left', width: 100, type: 'numericColumn' },
    { field: 'd_PostingDate', headerName: 'Date', width: 100, valueFormatter: dateFormatter },
    { field: 's_VoucherType', headerName: 'Type', width: 90 },
    { field: 'n_TradeId', headerName: 'Trade ID', width: 100, type: 'numericColumn' },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 's_AccountHead', headerName: 'Account Head', width: 180 },
    { field: 's_DebitCredit', headerName: 'Dr/Cr', width: 60 },
    { field: 'n_Amount', headerName: 'Amount', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_Narration', headerName: 'Narration', width: 280 },
    { field: 's_Reference', headerName: 'Reference', width: 140 },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: accountPostingsData as Record<string, unknown>[],
};

// Closing Prices table (tbl_ClosingPrice)
export const closingPricesConfig: TableConfig = {
  columns: [
    { field: 'd_PriceDate', headerName: 'Date', pinned: 'left', width: 100, valueFormatter: dateFormatter },
    { field: 's_ScripCode', headerName: 'Scrip', pinned: 'left', width: 150 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 'n_ClosingPrice', headerName: 'Closing Price', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_PreviousClose', headerName: 'Prev Close', width: 110, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_Change', headerName: 'Change', width: 90, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_ChangePercent', headerName: 'Chg %', width: 80, type: 'numericColumn', valueFormatter: percentFormatter },
    { field: 'n_SettlementPrice', headerName: 'Settlement', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_OpenInterest', headerName: 'Open Interest', width: 130, type: 'numericColumn', valueFormatter: numberFormatter },
  ],
  data: closingPricesData as Record<string, unknown>[],
};

// ==================== CNS-SPECIFIC TABLES ====================

// Exchange Master table (tbl_ExchangeMaster)
export const exchangeMasterConfig: TableConfig = {
  columns: [
    { field: 'n_ExchangeId', headerName: 'Exchange ID', pinned: 'left', width: 100, type: 'numericColumn' },
    { field: 's_ExchangeCode', headerName: 'Code', width: 80 },
    { field: 's_ExchangeName', headerName: 'Exchange Name', width: 220 },
    { field: 's_Country', headerName: 'Country', width: 100 },
    { field: 'b_IsActive', headerName: 'Active', width: 80 },
  ],
  data: exchangeMasterData as Record<string, unknown>[],
};

// Settlement Master table (tbl_SettlementMaster)
export const settlementMasterConfig: TableConfig = {
  columns: [
    { field: 'n_SettlementId', headerName: 'Settlement ID', pinned: 'left', width: 110, type: 'numericColumn' },
    { field: 's_SettlementNo', headerName: 'Settlement No', width: 130 },
    { field: 'd_TradeDate', headerName: 'Trade Date', width: 100, valueFormatter: dateFormatter },
    { field: 'd_SettlementDate', headerName: 'Settlement Date', width: 120, valueFormatter: dateFormatter },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 's_SettlementType', headerName: 'Type', width: 90 },
    { field: 'd_PayInDate', headerName: 'Pay-In Date', width: 110, valueFormatter: dateFormatter },
    { field: 'd_PayOutDate', headerName: 'Pay-Out Date', width: 110, valueFormatter: dateFormatter },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: settlementMasterData as Record<string, unknown>[],
};

// Obligation table (tbl_Obligation)
export const obligationConfig: TableConfig = {
  columns: [
    { field: 'n_ObligationId', headerName: 'Obligation ID', pinned: 'left', width: 110, type: 'numericColumn' },
    { field: 's_SettlementNo', headerName: 'Settlement No', width: 130 },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 'n_PayInAmt', headerName: 'Pay-In Amt', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_PayOutAmt', headerName: 'Pay-Out Amt', width: 120, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'n_NetAmount', headerName: 'Net Amount', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 's_FundsStatus', headerName: 'Funds Status', width: 110 },
    { field: 's_SecuritiesStatus', headerName: 'Securities Status', width: 130 },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: obligationData as Record<string, unknown>[],
};

// Collateral table (tbl_Collateral)
export const collateralConfig: TableConfig = {
  columns: [
    { field: 'n_CollateralId', headerName: 'Collateral ID', pinned: 'left', width: 110, type: 'numericColumn' },
    { field: 's_ClientCode', headerName: 'Client', width: 90 },
    { field: 'n_ExchangeId', headerName: 'Exch', width: 70, type: 'numericColumn' },
    { field: 's_Segment', headerName: 'Segment', width: 80 },
    { field: 's_CollateralType', headerName: 'Type', width: 100 },
    { field: 'n_Amount', headerName: 'Amount', width: 130, type: 'numericColumn', valueFormatter: currencyFormatter },
    { field: 'd_DepositDate', headerName: 'Deposit Date', width: 110, valueFormatter: dateFormatter },
    { field: 'd_ExpiryDate', headerName: 'Expiry Date', width: 110, valueFormatter: dateFormatter },
    { field: 's_Status', headerName: 'Status', width: 80 },
  ],
  data: collateralData as Record<string, unknown>[],
};
