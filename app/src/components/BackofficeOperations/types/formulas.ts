export interface Formula {
  id: number;
  name: string;
  expression: string;
  result: string | null;
}

export interface ExcelFormulaCategory {
  category: string;
  formulas: {
    name: string;
    syntax: string;
    desc: string;
  }[];
}
