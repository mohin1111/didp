import { Sparkles, Upload, Package, TrendingUp, Calculator, Receipt, BookOpen, CheckCircle } from 'lucide-react';
import type { TabId } from './DemoProvider';

export interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetTab: TabId | null;
  icon: typeof Sparkles;
  features?: string[];
  highlightSelector?: string | null;
  workflowStep?: number; // CNS workflow step 1-6
}

// Trade Lifecycle Workflow Demo - Following CNS 6-step process
export const demoSteps: DemoStep[] = [
  {
    id: 0,
    title: 'CNS Trade Lifecycle',
    subtitle: 'End-to-End Trade Processing Automation',
    description: 'Welcome to the CNS Trade Lifecycle demo. We\'ll walk you through how a trade flows through the system - from initial upload to final GL posting. This is the core workflow that powers broking back-office operations.',
    targetTab: 'workflow',
    icon: Sparkles,
    highlightSelector: null,
    features: [
      '6-step automated trade processing',
      'Real-time position management',
      'Automated MTM & brokerage calculation',
      'Complete audit trail with GL entries',
    ],
  },
  {
    id: 1,
    title: 'Step 1: Trade Upload',
    subtitle: 'usp_SaveTrade - Import & Validate Trades',
    description: 'Trades are received from exchanges (NSE, BSE, MCX) via files or APIs. The system validates each trade against client masters, scrip masters, and business rules before saving to the appropriate table based on market type.',
    targetTab: 'workflow',
    icon: Upload,
    highlightSelector: '[data-demo="workflow-step-1"]',
    workflowStep: 1,
    features: [
      'Supports Futures, Options, and Cash trades',
      'Auto-validation against master data',
      'Duplicate trade detection',
      'Tables: tbl_DayTradeFut, tbl_DayTradeOpt, tbl_DayTradeCash',
    ],
  },
  {
    id: 2,
    title: 'Step 2: Position Management',
    subtitle: 'usp_ManageTradePosition - FIFO/LIFO Matching',
    description: 'After trades are saved, positions are automatically created or updated. Buy trades create/add to positions, sell trades close positions using FIFO or LIFO matching. The system tracks both open and closed positions.',
    targetTab: 'workflow',
    icon: Package,
    highlightSelector: '[data-demo="workflow-step-2"]',
    workflowStep: 2,
    features: [
      'Automatic position netting',
      'FIFO/LIFO trade matching',
      'Tracks average buy/sell prices',
      'Tables: tbl_OpenPositon, tbl_ClosePositon',
    ],
  },
  {
    id: 3,
    title: 'Step 3: Mark-to-Market',
    subtitle: 'usp_ManageMTM - Daily Valuation',
    description: 'Every day, open positions are marked to market using closing prices from exchanges. The system calculates unrealized P&L and variation margin requirements for F&O positions.',
    targetTab: 'workflow',
    icon: TrendingUp,
    highlightSelector: '[data-demo="workflow-step-3"]',
    workflowStep: 3,
    features: [
      'MTM = (ClosePrice - AvgPrice) × Qty × Multiplier',
      'Daily variation margin calculation',
      'Uses exchange closing prices',
      'Tables: tbl_MarkToMarket, tbl_ClosingPrice',
    ],
  },
  {
    id: 4,
    title: 'Step 4: Brokerage Calculation',
    subtitle: 'usp_CalculateBrokerage - Commission Processing',
    description: 'Brokerage is calculated based on predefined slabs - either as a percentage of trade value or per-lot for F&O. The system splits commission between broker and client as per agreements.',
    targetTab: 'workflow',
    icon: Calculator,
    highlightSelector: '[data-demo="workflow-step-4"]',
    workflowStep: 4,
    features: [
      'Percentage or per-lot calculation',
      'Slab-based rate structures',
      'Broker/Client share splitting',
      'Tables: tbl_BrokerCommission, tbl_ClientCommission',
    ],
  },
  {
    id: 5,
    title: 'Step 5: P&L Posting',
    subtitle: 'usp_BillPostingPL - Realize Profits/Losses',
    description: 'When positions are closed, realized P&L is calculated and posted. This includes the difference between buy and sell values, minus all charges. The system maintains complete P&L records per client.',
    targetTab: 'workflow',
    icon: Receipt,
    highlightSelector: '[data-demo="workflow-step-5"]',
    workflowStep: 5,
    features: [
      'Realized P&L on position closure',
      'Net P&L after all charges',
      'Client-wise P&L tracking',
      'Tables: tbl_ClosePositon, tbl_ProfitLoss',
    ],
  },
  {
    id: 6,
    title: 'Step 6: GL Journal Entries',
    subtitle: 'usp_PostAccountEntry - Double-Entry Accounting',
    description: 'Finally, all financial transactions are posted to the General Ledger as double-entry journal vouchers. This creates a complete audit trail for trade settlements, MTM, brokerage, and P&L.',
    targetTab: 'workflow',
    icon: BookOpen,
    highlightSelector: '[data-demo="workflow-step-6"]',
    workflowStep: 6,
    features: [
      'Automatic journal entry creation',
      'Double-entry accounting compliance',
      'Complete audit trail',
      'Table: tbl_AccountPosting',
    ],
  },
  {
    id: 7,
    title: 'Workflow Complete!',
    subtitle: 'Fully Automated Trade Processing',
    description: 'You\'ve seen the complete CNS trade lifecycle - from trade upload to GL posting. This entire workflow runs automatically, ensuring accurate and timely processing of thousands of trades daily.',
    targetTab: 'workflow',
    icon: CheckCircle,
    highlightSelector: '[data-demo="workflow-steps"]',
    features: [
      'Process 50,000+ trades daily',
      'Real-time position & MTM updates',
      'Complete regulatory compliance',
      'Full audit trail for every transaction',
    ],
  },
];
