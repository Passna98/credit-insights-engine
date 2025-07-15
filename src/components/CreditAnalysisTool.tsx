
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OperatingStatementForm } from './OperatingStatementForm';
import { BalanceSheetForm } from './BalanceSheetForm';
import { OutputResults } from './OutputResults';
import { Calculator, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface FormData {
  [key: string]: { [year: string]: number };
}

export const CreditAnalysisTool: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [results, setResults] = useState<FormData>({});
  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'];

  const updateFormData = (field: string, year: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [year]: value || 0
      }
    }));
  };

  const getFieldValue = (field: string, year: string): number => {
    return formData[field]?.[year] || 0;
  };

  const calculateResults = () => {
    const newResults: FormData = {};
    
    years.forEach((year, idx) => {
      // 1. FINANCIAL PERFORMANCE
      const grossSalesTotal = getFieldValue("1. Gross Sales - Total", year);
      const excise = getFieldValue("2. Less Excise Duty/cess if any", year);
      const netSales = grossSalesTotal - excise;
      
      const rentalIncome = getFieldValue("4. Other operating/revenue income - Rental Income", year);
      const otherOpIncome1 = getFieldValue("4. Other operating/revenue income - Other Operating Income 1", year);
      const otherOpIncome2 = getFieldValue("4. Other operating/revenue income - Other Operating Income 2", year);
      const otherOpTotal = rentalIncome + otherOpIncome1 + otherOpIncome2;
      
      const netOperIncome = netSales + otherOpTotal;
      
      const depreciation = getFieldValue("vi. Depreciation", year);
      const amortisation = getFieldValue("vii. Amortisation", year);
      
      const costOfSales = getFieldValue("8. Sub-total (6+7) Cost of sales", year);
      const operatingProfitBeforeInterest = netOperIncome - costOfSales;
      
      const totalFinanceCharges = [
        "10. Finance Charges - Interest on Term Loans",
        "10. Finance Charges - Interest on WCTL and DLOD", 
        "10. Finance Charges - Interest on CC",
        "10. Finance Charges - Interest vehicle loans",
        "10. Finance Charges - Bank Charges/Others"
      ].reduce((sum, field) => sum + getFieldValue(field, year), 0);
      
      const ebitda = operatingProfitBeforeInterest + depreciation + amortisation;
      
      const otherIncome = [
        "12. Other non-operating Income - Dividends received",
        "12. Other non-operating Income - Extraordinary gains",
        "12. Other non-operating Income - Profit on sale of fixed assets / Investments",
        "12. Other non-operating Income - Gain on Exchange Fluctuations",
        "12. Other non-operating Income - Misc. income/ Write backs etc",
        "12. Other non-operating Income - Interest from subsidiary",
        "12. Other non-operating Income - Other Income",
        "12. Other non-operating Income - Rental Income"
      ].reduce((sum, field) => sum + getFieldValue(field, year), 0);
      
      const otherExpenses = [
        "12. Other non-operating expenses - Prior Period Items",
        "12. Other non-operating expenses - Extraordinary Losses",
        "12. Other non-operating expenses - Loss on sale of fixed assets",
        "12. Other non-operating expenses - Loss on Exchange Fluctuations",
        "12. Other non-operating expenses - Write Offs/ Misc expenses write offs",
        "12. Other non-operating expenses - Stock Writeoff on account of Covid",
        "12. Other non-operating expenses - Exceptional Items",
        "12. Other non-operating expenses - Others"
      ].reduce((sum, field) => sum + getFieldValue(field, year), 0);
      
      const profitBeforeTax = operatingProfitBeforeInterest - totalFinanceCharges + otherIncome - otherExpenses;
      
      const totalTax = [
        "14. Tax - Provision for taxes",
        "14. Tax - Deferred Tax", 
        "14. Tax - Previous year adjustments"
      ].reduce((sum, field) => sum + getFieldValue(field, year), 0);
      
      const profitAfterTax = profitBeforeTax - totalTax;
      const cashProfits = profitAfterTax + depreciation + amortisation;
      
      // 2. CAPITAL STRUCTURE
      const ordinaryShareCapital = getFieldValue("15. Ordinary Share Capital (including premium)", year);
      const shareWarrants = getFieldValue("16. Share Warrants", year);
      const sharePremiumClosing = getFieldValue("Closing", year);
      const generalReserveClosing = getFieldValue("18. General Reserve - Closing", year);
      const capitalReserveClosing = getFieldValue("19. Capital Reserve - Closing", year);
      const otherReserves = getFieldValue("20. Other Reserves (Ind AS adjustments)", year);
      const surplusPL = getFieldValue("21. Surplus (+) or deficit (-) in Profit & Loss account", year);
      const deferredTaxLiab = getFieldValue("22. Deferred Tax Liability (net)", year);
      
      const tangibleNetWorth = ordinaryShareCapital + shareWarrants + sharePremiumClosing + 
                              generalReserveClosing + capitalReserveClosing + otherReserves + 
                              surplusPL + deferredTaxLiab;
      
      const totalDebt = [
        "9A. Term Loans (excluding installments payable within 1 year and WCTL)",
        "9B. WCTL and DLOD",
        "9C. Vehicle loans",
        "11. Unsecured loans"
      ].reduce((sum, field) => sum + getFieldValue(field, year), 0);
      
      const capitalEmployed = tangibleNetWorth + totalDebt;
      const cashAndBank = getFieldValue("26. Cash and Bank Balances (unencumbered)", year);
      
      // Calculate growth rates
      let salesGrowth = 0;
      if (idx > 0) {
        const prevSales = newResults["Total Operating Income"]?.[years[idx - 1]] || 0;
        if (prevSales !== 0) {
          salesGrowth = ((netOperIncome - prevSales) / prevSales) * 100;
        }
      }
      
      // Store results
      if (!newResults["Total Operating Income"]) newResults["Total Operating Income"] = {};
      if (!newResults["EBITDA"]) newResults["EBITDA"] = {};
      if (!newResults["Depreciation"]) newResults["Depreciation"] = {};
      if (!newResults["Interest"]) newResults["Interest"] = {};
      if (!newResults["Other Income"]) newResults["Other Income"] = {};
      if (!newResults["Extraordinary expense"]) newResults["Extraordinary expense"] = {};
      if (!newResults["Profit before tax"]) newResults["Profit before tax"] = {};
      if (!newResults["Profit after tax"]) newResults["Profit after tax"] = {};
      if (!newResults["Cash Profits (GCA)"]) newResults["Cash Profits (GCA)"] = {};
      if (!newResults["Tangible networth (TNW)"]) newResults["Tangible networth (TNW)"] = {};
      if (!newResults["Total debt"]) newResults["Total debt"] = {};
      if (!newResults["Capital employed"]) newResults["Capital employed"] = {};
      if (!newResults["Liquidity (Unencumbered)"]) newResults["Liquidity (Unencumbered)"] = {};
      if (!newResults["Sales growth"]) newResults["Sales growth"] = {};
      if (!newResults["EBITDA Margin"]) newResults["EBITDA Margin"] = {};
      if (!newResults["PAT Margin"]) newResults["PAT Margin"] = {};
      if (!newResults["Return on Capital Employed"]) newResults["Return on Capital Employed"] = {};
      if (!newResults["Debt Equity ratio"]) newResults["Debt Equity ratio"] = {};
      if (!newResults["Interest Coverage Ratio"]) newResults["Interest Coverage Ratio"] = {};
      
      newResults["Total Operating Income"][year] = netOperIncome;
      newResults["EBITDA"][year] = ebitda;
      newResults["Depreciation"][year] = depreciation;
      newResults["Interest"][year] = totalFinanceCharges;
      newResults["Other Income"][year] = otherIncome;
      newResults["Extraordinary expense"][year] = otherExpenses;
      newResults["Profit before tax"][year] = profitBeforeTax;
      newResults["Profit after tax"][year] = profitAfterTax;
      newResults["Cash Profits (GCA)"][year] = cashProfits;
      newResults["Tangible networth (TNW)"][year] = tangibleNetWorth;
      newResults["Total debt"][year] = totalDebt;
      newResults["Capital employed"][year] = capitalEmployed;
      newResults["Liquidity (Unencumbered)"][year] = cashAndBank;
      newResults["Sales growth"][year] = salesGrowth;
      newResults["EBITDA Margin"][year] = netOperIncome ? (ebitda / netOperIncome) * 100 : 0;
      newResults["PAT Margin"][year] = netOperIncome ? (profitAfterTax / netOperIncome) * 100 : 0;
      newResults["Return on Capital Employed"][year] = capitalEmployed ? (ebitda / capitalEmployed) * 100 : 0;
      newResults["Debt Equity ratio"][year] = tangibleNetWorth ? totalDebt / tangibleNetWorth : 0;
      newResults["Interest Coverage Ratio"][year] = totalFinanceCharges ? ebitda / totalFinanceCharges : 0;
    });
    
    setResults(newResults);
    toast.success("Calculations completed successfully!");
  };

  const clearInputs = () => {
    setFormData({});
    setResults({});
    toast.success("All inputs cleared!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Credit Analysis Tool - Excel Like Interface
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="operating" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="operating">Form II - Operating Statement</TabsTrigger>
            <TabsTrigger value="balance">Form III - Balance Sheet</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="operating">
            <OperatingStatementForm 
              years={years}
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="balance">
            <BalanceSheetForm 
              years={years}
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="output">
            <OutputResults years={years} results={results} />
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-6 justify-center">
          <Button onClick={calculateResults} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate Output
          </Button>
          <Button onClick={clearInputs} variant="outline" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Clear Inputs
          </Button>
        </div>
      </div>
    </div>
  );
};
