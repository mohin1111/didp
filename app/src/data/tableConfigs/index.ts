/**
 * Table Configurations
 * Re-exports all table configs and formatters
 */

// Formatters
export { currencyFormatter, percentFormatter, numberFormatter, dateFormatter } from './formatters';
export type { TableConfig } from './formatters';

// Core table configs
export {
  clientsConfig,
  brokersConfig,
  tradesConfig,
  scripsConfig,
  positionsConfig,
  marginsConfig,
  ledgerConfig,
  pnlConfig,
} from './coreConfigs';

// Workflow table configs
export {
  dayTradeFutConfig,
  dayTradeOptConfig,
  dayTradeCashConfig,
  openPositionsConfig,
  closedPositionsConfig,
  mtmConfig,
  brokerageConfig,
  accountPostingsConfig,
  closingPricesConfig,
  // CNS-specific tables
  exchangeMasterConfig,
  settlementMasterConfig,
  obligationConfig,
  collateralConfig,
} from './workflowConfigs';

// Import configs for getTableConfig lookup
import { clientsConfig, brokersConfig, tradesConfig, scripsConfig, positionsConfig, marginsConfig, ledgerConfig, pnlConfig } from './coreConfigs';
import { dayTradeFutConfig, dayTradeOptConfig, dayTradeCashConfig, openPositionsConfig, closedPositionsConfig, mtmConfig, brokerageConfig, accountPostingsConfig, closingPricesConfig, exchangeMasterConfig, settlementMasterConfig, obligationConfig, collateralConfig } from './workflowConfigs';
import type { TableConfig } from './formatters';

// Get table config by table name
export const getTableConfig = (tableName: string): TableConfig => {
  const configs: Record<string, TableConfig> = {
    clients: clientsConfig,
    brokers: brokersConfig,
    trades: tradesConfig,
    scrips: scripsConfig,
    positions: positionsConfig,
    margins: marginsConfig,
    ledger: ledgerConfig,
    pnl: pnlConfig,
    // Workflow tables
    dayTradeFut: dayTradeFutConfig,
    dayTradeOpt: dayTradeOptConfig,
    dayTradeCash: dayTradeCashConfig,
    openPositions: openPositionsConfig,
    closedPositions: closedPositionsConfig,
    mtm: mtmConfig,
    brokerage: brokerageConfig,
    accountPostings: accountPostingsConfig,
    closingPrices: closingPricesConfig,
    // CNS-specific tables
    exchangeMaster: exchangeMasterConfig,
    settlementMaster: settlementMasterConfig,
    obligation: obligationConfig,
    collateral: collateralConfig,
  };
  return configs[tableName] || clientsConfig;
};
