
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OperatingStatementForm } from './OperatingStatementForm';
import { BalanceSheetForm } from './BalanceSheetForm';
import { OutputResults } from './OutputResults';
import { Calculator, Trash2, Download } from 'lucide-react';
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
      // Basic calculations
      const grossSalesTotal = getFieldValue("1. Gross Sales - Total", year);
      const excise = getFieldValue("2. Less Excise Duty/cess if any", year);
      const netSales = grossSalesTotal - excise;
      
      const rentalIncome = getFieldValue("4. Other operating/revenue income - Rental Income", year);
      const otherOpIncome1 = getFieldValue("4. Other operating/revenue income - Other Operating Income 1", year);
      const otherOpIncome2 = getFieldValue("4. Other operating/revenue income - Other Operating Income 2", year);
      const otherOpTotal = rentalIncome + otherOpIncome1 + otherOpIncome2;
      
      const totalOperatingIncome = netSales + otherOpTotal;
      
      const depreciation = getFieldValue("vi. Depreciation", year);
      const amortisation = getFieldValue("vii. Amortisation", year);
      
      const costOfSales = getFieldValue("8. Sub-total (6+7) Cost of sales", year);
      const operatingProfitBeforeInterest = totalOperatingIncome - costOfSales;
      
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
      
      const currentTax = getFieldValue("14. Tax - Provision for taxes", year);
      const deferredTax = getFieldValue("14. Tax - Deferred Tax", year);
      
      // PAT = Profit before Tax – (Current Tax + Deferred Tax)
      const profitAfterTax = profitBeforeTax - (currentTax + deferredTax);
      
      // Cash Profit (GCA) = Profit After Tax + Deferred Tax + Depreciation
      const cashProfits = profitAfterTax + deferredTax + depreciation;
      
      // Capital Structure calculations
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
      
      // Term Debt = Instalments of CAPEX + Term loan
      const termDebt = getFieldValue("5C. Instalments of CAPEX linked Term Loans/Debentures/Preference shares/Deposits/Other debts (due within 1 yr)(including lease liability)(linked to Repayment schedules)", year) + 
                       getFieldValue("9A. Term Loans (excluding installments payable within 1 year and WCTL)", year);
      
      // Working Capital Debt = Short term debt from bank
      const workingCapitalDebt = getFieldValue("1. Short-term finance from banks - Sub-total (A)", year);
      
      // Vehicle Loans = Instalment of Vehicle loan + vehicle loan
      const vehicleLoans = getFieldValue("5A. Instalments of Vehicle loans (due within 1 yr)(including lease liability)(linked to Repayment schedules)", year) + 
                          getFieldValue("9C. Vehicle loans", year);
      
      // Unsecured loans = Unsecured loan – unsecured loan eligible for QE classification
      const unsecuredLoans = getFieldValue("11. Unsecured loans", year) - getFieldValue("Unsecured Loans eligible for QE classification", year);
      
      // Total Debt = Term debt + Working Capital Debt + Vehicle Loan + Unsecured Loans
      const totalDebt = termDebt + workingCapitalDebt + vehicleLoans + unsecuredLoans;
      
      // Capital employed = Tangible networth(TNW) + Total Debt
      const capitalEmployed = tangibleNetWorth + totalDebt;
      
      const cashAndBank = getFieldValue("26. Cash and Bank Balances (unencumbered)", year);
      const totalOutsideLibabilities = getFieldValue("14. Total Outside Liabilities (7 + 13)", year);
      
      // Growth calculations
      let salesGrowth = 0;
      let ebitdaGrowth = 0;
      let pbtGrowth = 0;
      let patGrowth = 0;
      
      if (idx > 0) {
        const prevYear = years[idx - 1];
        const prevSales = newResults["Total Operating Income"]?.[prevYear] || 0;
        const prevEbitda = newResults["EBITDA"]?.[prevYear] || 0;
        const prevPbt = newResults["Profit before tax"]?.[prevYear] || 0;
        const prevPat = newResults["Profit after tax"]?.[prevYear] || 0;
        
        if (prevSales !== 0) salesGrowth = ((totalOperatingIncome - prevSales) / prevSales) * 100;
        if (prevEbitda !== 0) ebitdaGrowth = ((ebitda - prevEbitda) / prevEbitda) * 100;
        if (prevPbt !== 0) pbtGrowth = ((profitBeforeTax - prevPbt) / prevPbt) * 100;
        if (prevPat !== 0) patGrowth = ((profitAfterTax - prevPat) / prevPat) * 100;
      }
      
      // Ratios
      const ebitdaMargin = totalOperatingIncome ? (ebitda / totalOperatingIncome) * 100 : 0;
      const pbtMargin = totalOperatingIncome ? (profitBeforeTax / totalOperatingIncome) * 100 : 0;
      const patMargin = totalOperatingIncome ? (profitAfterTax / totalOperatingIncome) * 100 : 0;
      
      const returnOnCapitalEmployed = capitalEmployed ? (ebitda / capitalEmployed) * 100 : 0;
      const returnOnEquity = tangibleNetWorth ? (profitAfterTax / tangibleNetWorth) * 100 : 0;
      
      // Cash Profit/Debt Repay = Cash Profit(GCA)/(Payment of TL+ Repayment of Vehicle loan+ Repayment of WCTL)
      const repaymentTL = getFieldValue("Repayment of TL", year);
      const repaymentVehicle = getFieldValue("Repayment of Vehicle loans", year);
      const repaymentWCTL = getFieldValue("Repayment of WCTL", year);
      const totalRepayments = repaymentTL + repaymentVehicle + repaymentWCTL;
      const cashProfitsDebtRepay = totalRepayments ? cashProfits / totalRepayments : 0;
      
      const debtEquityRatio = tangibleNetWorth ? totalDebt / tangibleNetWorth : 0;
      // Overall Gearing = Total Debt/Tangible networth(TNW)
      const overallGearing = tangibleNetWorth ? totalDebt / tangibleNetWorth : 0;
      const tolTnwRatio = tangibleNetWorth ? totalOutsideLibabilities / tangibleNetWorth : 0;
      const interestCoverageRatio = totalFinanceCharges ? ebitda / totalFinanceCharges : 0;
      
      const dscr = (cashProfits + totalFinanceCharges) / (totalFinanceCharges + totalRepayments);
      
      // Total debt/Cash profit = Total Debt/Cash Profit (GCA)
      const totalDebtCashProfits = cashProfits ? totalDebt / cashProfits : 0;
      // Term Debt/cash profit = Term Debt/Cash profit(GCA)
      const termDebtCashProfits = cashProfits ? termDebt / cashProfits : 0;
      // Total Debt/EBITDA(Lev.) = Total Debt/ EBITDA
      const totalDebtEbitda = ebitda ? totalDebt / ebitda : 0;
      
      // Current Ratio = Total Current Assets/Total Current Liabilities
      const totalCurrentAssets = getFieldValue("31. Total Current Assets (26 to 30)", year);
      const totalCurrentLiabilities = getFieldValue("7. Total current liabilities (A + B)", year);
      const currentRatio = totalCurrentLiabilities ? totalCurrentAssets / totalCurrentLiabilities : 0;
      
      // Average Debtor(days) = 365/(Total Operating income/(Gross debtor of this year + Gross debtor of previous year)/2)
      const grossDebtors = getFieldValue("28. Sundry Debtors -LESS THAN 6 MONTHS OLD", year);
      let averageDebtorDays = 0;
      if (idx > 0) {
        const prevGrossDebtors = getFieldValue("28. Sundry Debtors -LESS THAN 6 MONTHS OLD", years[idx - 1]);
        const avgDebtors = (grossDebtors + prevGrossDebtors) / 2;
        if (totalOperatingIncome && avgDebtors) {
          averageDebtorDays = Math.round(365 / (totalOperatingIncome / avgDebtors));
        }
      }
      
      // Similar calculations for inventory and payables
      const inventory = getFieldValue("29. Inventory", year);
      let averageInventoryDays = 0;
      if (idx > 0) {
        const prevInventory = getFieldValue("29. Inventory", years[idx - 1]);
        const avgInventory = (inventory + prevInventory) / 2;
        if (costOfSales && avgInventory) {
          averageInventoryDays = Math.round(365 / (costOfSales / avgInventory));
        }
      }
      
      // Average payable(days) = 365/(cost of sale/(Creditor of this year + Creditor of previous year)/2)
      const creditors = getFieldValue("3. Sundry Creditors (Trade)", year);
      // Cost Of sale = Cost of sale – depreciation – amortization
      const adjustedCostOfSale = costOfSales - depreciation - amortisation;
      let averagePayableDays = 0;
      if (idx > 0) {
        const prevCreditors = getFieldValue("3. Sundry Creditors (Trade)", years[idx - 1]);
        const avgCreditors = (creditors + prevCreditors) / 2;
        if (adjustedCostOfSale && avgCreditors) {
          averagePayableDays = Math.round(365 / (adjustedCostOfSale / avgCreditors));
        }
      }
      
      // Operating Cycle(days) = Average Debtor(days)+ Average Inventory(days) - Average Payable(days)
      const operatingCycleDays = averageDebtorDays + averageInventoryDays - averagePayableDays;
      
      // Fixed Assets Turnover Ratio = Total operating income/(Net block of fixed assets of this year+ Net Block of Fixed assets of previous year)/2
      const netBlock = getFieldValue("35. Net Block (32 + 33 - 34)", year);
      let fixedAssetsTurnoverRatio = 0;
      if (idx > 0) {
        const prevNetBlock = getFieldValue("35. Net Block (32 + 33 - 34)", years[idx - 1]);
        const avgNetBlock = (netBlock + prevNetBlock) / 2;
        if (avgNetBlock) {
          fixedAssetsTurnoverRatio = totalOperatingIncome / avgNetBlock;
        }
      }
      
      // Initialize result arrays if they don't exist
      if (!newResults["Total Operating Income"]) {
        [
          "Total Operating Income", "EBITDA", "Depreciation", "Interest", "Other Income", "Extraordinary expense",
          "Profit before tax", "Current Tax", "Deferred Tax", "Profit after tax", "Cash Profits (GCA)", "CFOA", "CFOA/EBITDA",
          "Share Capital", "Tangible networth (TNW)", "Total debt", "- Term debt", "- Working capital debt", "- Vehicle loans", "- Unsecured loans",
          "Capital employed", "Liquidity (Unencumbered)", "Total outside liabilities (TOL)",
          "Sales growth", "EBITDA growth", "PBT growth", "PAT growth",
          "EBITDA Margin", "PBT margin", "PAT Margin",
          "Return on Capital Employed", "Return on Equity",
          "Cash Profits/Debt Repay", "Debt Equity ratio", "Overall gearing", "TOL/TNW", "Interest Coverage Ratio",
          "Debt Service Coverage Ratio", "Total debt/Cash Profits", "Term debt/Cash Profits", "Total debt/EBITDA (Lev.)",
          "Current Ratio", "Average debtor (days)", "Average inventory (days)", "Average payable (days)", "Operating cycle (days)", "Fixed Assets Turnover Ratio",
          "Total current assets", "Total current liabilities", "Gross Debtors", "Inventory", "Creditors", "Cost of goods sold", "Cost of sales",
          "Gross block of Fixed Assets", "Gross Debt availed", "Capex for creditors", "Capex", "Repayment of TL", "Repayment of Vehicle loans",
          "Cash Profits (GCA)", "Add: Interest", "Cash available for debt servicing (A)", "Interest payment", "Principal repayment", "Total debt servicing (B)", "DSCR (A/B)",
          "Incremental capex", "Effect of capex adv. & cred.", "Total term debt availed", "Funded from term debt", "Funded from unsec. loan", "Funded from equity infusion", "Funded from Internal Accruals",
          "Opening debt", "Add: Debt availed-other", "Less: Repayments", "Closing debt"
        ].forEach(metric => {
          if (!newResults[metric]) newResults[metric] = {};
        });
      }
      
      // Store all calculated values
      newResults["Total Operating Income"][year] = totalOperatingIncome;
      newResults["EBITDA"][year] = ebitda;
      newResults["Depreciation"][year] = depreciation;
      newResults["Interest"][year] = totalFinanceCharges;
      newResults["Other Income"][year] = otherIncome;
      newResults["Extraordinary expense"][year] = otherExpenses;
      newResults["Profit before tax"][year] = profitBeforeTax;
      newResults["Current Tax"][year] = currentTax;
      newResults["Deferred Tax"][year] = deferredTax;
      newResults["Profit after tax"][year] = profitAfterTax;
      newResults["Cash Profits (GCA)"][year] = cashProfits;
      newResults["CFOA"][year] = totalOperatingIncome - costOfSales + otherIncome;
      newResults["CFOA/EBITDA"][year] = ebitda ? (totalOperatingIncome - costOfSales + otherIncome) / ebitda : 0;
      
      newResults["Share Capital"][year] = ordinaryShareCapital;
      newResults["Tangible networth (TNW)"][year] = tangibleNetWorth;
      newResults["Total debt"][year] = totalDebt;
      newResults["- Term debt"][year] = termDebt;
      newResults["- Working capital debt"][year] = workingCapitalDebt;
      newResults["- Vehicle loans"][year] = vehicleLoans;
      newResults["- Unsecured loans"][year] = unsecuredLoans;
      newResults["Capital employed"][year] = capitalEmployed;
      newResults["Liquidity (Unencumbered)"][year] = cashAndBank;
      newResults["Total outside liabilities (TOL)"][year] = totalOutsideLibabilities;
      
      newResults["Sales growth"][year] = salesGrowth;
      newResults["EBITDA growth"][year] = ebitdaGrowth;
      newResults["PBT growth"][year] = pbtGrowth;
      newResults["PAT growth"][year] = patGrowth;
      
      newResults["EBITDA Margin"][year] = ebitdaMargin;
      newResults["PBT margin"][year] = pbtMargin;
      newResults["PAT Margin"][year] = patMargin;
      
      newResults["Return on Capital Employed"][year] = returnOnCapitalEmployed;
      newResults["Return on Equity"][year] = returnOnEquity;
      
      newResults["Cash Profits/Debt Repay"][year] = cashProfitsDebtRepay;
      newResults["Debt Equity ratio"][year] = debtEquityRatio;
      newResults["Overall gearing"][year] = overallGearing;
      newResults["TOL/TNW"][year] = tolTnwRatio;
      newResults["Interest Coverage Ratio"][year] = interestCoverageRatio;
      newResults["Debt Service Coverage Ratio"][year] = dscr;
      newResults["Total debt/Cash Profits"][year] = totalDebtCashProfits;
      newResults["Term debt/Cash Profits"][year] = termDebtCashProfits;
      newResults["Total debt/EBITDA (Lev.)"][year] = totalDebtEbitda;
      
      newResults["Current Ratio"][year] = currentRatio;
      newResults["Average debtor (days)"][year] = averageDebtorDays;
      newResults["Average inventory (days)"][year] = averageInventoryDays;
      newResults["Average payable (days)"][year] = averagePayableDays;
      newResults["Operating cycle (days)"][year] = operatingCycleDays;
      newResults["Fixed Assets Turnover Ratio"][year] = fixedAssetsTurnoverRatio;
      
      newResults["Total current assets"][year] = totalCurrentAssets;
      newResults["Total current liabilities"][year] = totalCurrentLiabilities;
      newResults["Gross Debtors"][year] = grossDebtors;
      newResults["Inventory"][year] = inventory;
      newResults["Creditors"][year] = creditors;
      newResults["Cost of goods sold"][year] = adjustedCostOfSale;
      newResults["Cost of sales"][year] = costOfSales;
      newResults["Gross block of Fixed Assets"][year] = getFieldValue("32. Gross Block (land, building, machinery, WIP) Opening", year);
      newResults["Gross Debt availed"][year] = getFieldValue("Add: Debt availed-other", year);
      newResults["Capex for creditors"][year] = getFieldValue("i.Deferred payment Credits (excluding instalments due within 1 year)", year);
      newResults["Capex"][year] = getFieldValue("Capex", year);
      newResults["Repayment of TL"][year] = repaymentTL;
      newResults["Repayment of Vehicle loans"][year] = repaymentVehicle;
      
      // DSCR calculations
      newResults["Cash Profits (GCA)"][year] = cashProfits;
      newResults["Add: Interest"][year] = totalFinanceCharges;
      newResults["Cash available for debt servicing (A)"][year] = cashProfits + totalFinanceCharges;
      newResults["Interest payment"][year] = totalFinanceCharges;
      newResults["Principal repayment"][year] = totalRepayments;
      newResults["Total debt servicing (B)"][year] = totalFinanceCharges + totalRepayments;
      newResults["DSCR (A/B)"][year] = dscr;
      
      // Additional calculations for other sections would go here...
    });
    
    setResults(newResults);
    toast.success("Calculations completed successfully!");
  };

  const downloadExcel = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header row
    csvContent += "Particulars," + years.join(",") + "\n";
    
    // Add data rows
    Object.keys(results).forEach(metric => {
      const row = [metric];
      years.forEach(year => {
        const value = results[metric][year];
        row.push(value !== undefined ? value.toFixed(2) : '0.00');
      });
      csvContent += row.join(",") + "\n";
    });
    
    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "credit_analysis_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Excel file downloaded successfully!");
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
          <Button onClick={downloadExcel} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Excel
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
