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
    console.log('Starting calculations with formData:', formData);
    const newResults: FormData = {};
    
    // Initialize all metrics
    const allMetrics = [
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
      "Cash available for debt servicing (A)", "Interest payment", "Principal repayment", "Total debt servicing (B)", "DSCR (A/B)",
      "Incremental capex", "Effect of capex adv. & cred.", "Total term debt availed", "Funded from term debt", "Funded from unsec. loan", "Funded from equity infusion", "Funded from Internal Accruals",
      "Opening debt", "Add: Debt availed-other", "Less: Repayments", "Closing debt"
    ];

    allMetrics.forEach(metric => {
      newResults[metric] = {};
    });
    
    years.forEach((year, idx) => {
      console.log(`Calculating for year ${year}:`);
      
      // Basic P&L calculations using correct field names
      const grossSalesTotal = getFieldValue("1. Gross Sales - Total", year);
      const exciseDuty = getFieldValue("2. Less Excise Duty/cess if any", year);
      const netSales = grossSalesTotal - exciseDuty;
      console.log(`Net Sales for ${year}:`, netSales);
      
      // Other operating income
      const rentalIncome = getFieldValue("4. Other operating/revenue income - i. Rental Income", year);
      const otherOpIncome1 = getFieldValue("4. Other operating/revenue income - ii. Other Operating Income (Pls specify)", year);
      const otherOpIncome2 = getFieldValue("4. Other operating/revenue income - iii. Other Operating Income (Pls specify)", year);
      const otherOpIncomeTotal = getFieldValue("4. Other operating/revenue income - Total", year) || (rentalIncome + otherOpIncome1 + otherOpIncome2);
      
      // Total Operating Income = Net Sales + Other Operating Income
      const totalOperatingIncome = netSales + otherOpIncomeTotal;
      console.log(`Total Operating Income for ${year}:`, totalOperatingIncome);
      
      // Cost of sales calculation
      const costOfSales = getFieldValue("8. Sub-total (6+7) Cost of sales", year);
      console.log(`Cost of Sales for ${year}:`, costOfSales);
      
      // Operating Profit before Interest = Total Operating Income - Cost of Sales
      const operatingProfitBeforeInterest = totalOperatingIncome - costOfSales;
      console.log(`Operating Profit before Interest for ${year}:`, operatingProfitBeforeInterest);
      
      // Depreciation and Amortization
      const depreciation = getFieldValue("6. vi. Depreciation", year);
      const amortisation = getFieldValue("6. vii. Amortisation", year);
      
      // EBITDA = Operating Profit + Depreciation + Amortization
      const ebitda = operatingProfitBeforeInterest + depreciation + amortisation;
      console.log(`EBITDA for ${year}:`, ebitda);
      
      // Interest calculation
      const interestTL = getFieldValue("10. i. Interest on Term Loans(Link from Repay Sch)", year);
      const interestWCTL = getFieldValue("10. ii. Interest on WCTL and DLOD", year);  
      const interestCC = getFieldValue("10. iii. Interest on CC", year);
      const interestVehicle = getFieldValue("10. iv. Interest on vehicle loans", year);
      const bankCharges = getFieldValue("10. v. Bank Charges/Others", year);
      const totalInterest = interestTL + interestWCTL + interestCC + interestVehicle + bankCharges;
      console.log(`Total Interest for ${year}:`, totalInterest);
      
      // Other Income
      const dividendsReceived = getFieldValue("12. i. Dividends received", year);
      const extraordinaryGains = getFieldValue("12. ii. Extraordinary gains", year);
      const profitOnSale = getFieldValue("12. iii. Profit on sale of fixed assets / Investments", year);
      const gainExchange = getFieldValue("12. iv. Gain on Exchange Fluctuations", year);
      const miscIncome = getFieldValue("12. v. Misc. income/ Write backs etc", year);
      const interestSubsidiary = getFieldValue("12. vi. Interest from subsidiary", year);
      const otherIncome = getFieldValue("12. vii. Other Income", year);
      const rentalIncomeNonOp = getFieldValue("12. viii. Rental Income", year);
      const totalOtherIncome = dividendsReceived + extraordinaryGains + profitOnSale + gainExchange + miscIncome + interestSubsidiary + otherIncome + rentalIncomeNonOp;
      console.log(`Total Other Income for ${year}:`, totalOtherIncome);
      
      // Other Expenses
      const priorPeriodItems = getFieldValue("12. i. Prior Period Items", year);
      const extraordinaryLosses = getFieldValue("12. ii. Extraordinary Losses", year);
      const lossOnSale = getFieldValue("12. iii. Loss on sale of fixed assets", year);
      const lossExchange = getFieldValue("12. iv. Loss on Exchange Fluctuations", year);
      const writeOffs = getFieldValue("12. v. Write Offs/ Misc expenses write offs", year);
      const stockWriteoff = getFieldValue("12. vi. Stock Writeoff on account of Covid", year);
      const exceptionalItems = getFieldValue("12. vii. Exceptional Items", year);
      const otherExpenses = getFieldValue("12. viii. Others (Pls specify)", year);
      const totalOtherExpenses = priorPeriodItems + extraordinaryLosses + lossOnSale + lossExchange + writeOffs + stockWriteoff + exceptionalItems + otherExpenses;
      console.log(`Total Other Expenses for ${year}:`, totalOtherExpenses);
      
      // Profit before tax = Operating Profit - Interest + Other Income - Other Expenses
      const profitBeforeTax = operatingProfitBeforeInterest - totalInterest + totalOtherIncome - totalOtherExpenses;
      console.log(`Profit before tax for ${year}:`, profitBeforeTax);
      
      // Tax calculations
      const currentTax = getFieldValue("14. i. Provision for taxes", year);
      const deferredTax = getFieldValue("14. ii. Deferred Tax", year);
      const previousYearAdj = getFieldValue("14. iii. Previous year adjustments", year);
      const totalTax = currentTax + deferredTax + previousYearAdj;
      
      // PAT = PBT - Total Tax
      const profitAfterTax = profitBeforeTax - totalTax;
      console.log(`PAT for ${year}:`, profitAfterTax);
      
      // Cash Profit (GCA) = PAT + Depreciation + Amortization + Deferred Tax
      const cashProfits = profitAfterTax + depreciation + amortisation + deferredTax;
      console.log(`Cash Profits (GCA) for ${year}:`, cashProfits);
      
      // Balance Sheet calculations
      const ordinaryShareCapital = getFieldValue("15. Ordinary Share Capital (including premium)", year);
      const shareWarrants = getFieldValue("16. Share Warrants", year);
      const sharePremiumClosing = getFieldValue("17. Closing", year);
      const generalReserveClosing = getFieldValue("18. Closing", year);
      const capitalReserveClosing = getFieldValue("19. Closing", year);
      const otherReserves = getFieldValue("20. Other Reserves (Ind AS Adjustment)", year);
      const surplusPL = getFieldValue("21. Surplus (+) or deficit (-) in Profit & Loss a/c", year);
      const deferredTaxLiab = getFieldValue("22. Deferred Tax Liability (Net)", year);
      const capitalSubsidy = getFieldValue("23. i. Capital Subsidy", year);
      const shareApplicationMoney = getFieldValue("23. ii. Share Application Money", year);
      const shareSuspense = getFieldValue("23. iv. Share Suspense", year);
      
      // Tangible Net Worth = Sum of all equity components (excluding intangible assets)
      const tangibleNetWorth = ordinaryShareCapital + shareWarrants + sharePremiumClosing + 
                              generalReserveClosing + capitalReserveClosing + otherReserves + 
                              surplusPL + deferredTaxLiab + capitalSubsidy + shareApplicationMoney + shareSuspense;
      console.log(`TNW for ${year}:`, tangibleNetWorth);
      
      // Debt calculations
      // Term Debt = Term Loans + Installments of Term Loans due within 1 year
      const termLoansLT = getFieldValue("9A. Term Loans (excluding instalments payable within 1 year and WCTL)", year);
      const termLoanInstallments = getFieldValue("5C. Instalments of CAPEX linked Term Loans/ Debentures/ Preference Shares/ Deposits/ Other debts (due within 1 yr) (including lease liability) (Linked to Repayment schedules)", year);
      const termDebt = termLoansLT + termLoanInstallments;
      
      // Working Capital Debt = Short term finance from banks
      const workingCapitalDebt = getFieldValue("1. Sub-total [i + iii] (A)", year);
      
      // Vehicle Loans = Vehicle loans LT + Vehicle loan installments
      const vehicleLoansLT = getFieldValue("9C. Vehicle loans", year);
      const vehicleLoanInstallments = getFieldValue("5A. Instalments of Vehicle loans (due within 1 yr) (including lease liability) (Linked to Repayment schedules)", year);
      const vehicleLoans = vehicleLoansLT + vehicleLoanInstallments;
      
      // Unsecured loans
      const unsecuredLoans = getFieldValue("11. Unsecured loans", year);
      
      // Total Debt = Term Debt + Working Capital Debt + Vehicle Loans + Unsecured Loans
      const totalDebt = termDebt + workingCapitalDebt + vehicleLoans + unsecuredLoans;
      console.log(`Total Debt for ${year}:`, totalDebt);
      
      // Capital employed = TNW + Total Debt
      const capitalEmployed = tangibleNetWorth + totalDebt;
      
      // Other values
      const cashAndBank = getFieldValue("26. Cash and Bank Balances (unencumbered)", year);
      const totalOutsideLibabilities = getFieldValue("14. Total Outside Liabilities [7+13]", year);
      const totalCurrentAssets = getFieldValue("31. Total Current Assets (26 to 30)", year);
      const totalCurrentLiabilities = getFieldValue("7. Total current liabilities [A + B]", year);
      
      // Repayment calculations
      const repaymentTL = getFieldValue("Repayment of TL", year);
      const repaymentVehicle = getFieldValue("Repayment of Vehicle loans", year);
      const repaymentWCTL = getFieldValue("Repayment of WCTL", year);
      const totalRepayments = repaymentTL + repaymentVehicle + repaymentWCTL;
      
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
      const ebitdaMargin = totalOperatingIncome !== 0 ? (ebitda / totalOperatingIncome) * 100 : 0;
      const pbtMargin = totalOperatingIncome !== 0 ? (profitBeforeTax / totalOperatingIncome) * 100 : 0;
      const patMargin = totalOperatingIncome !== 0 ? (profitAfterTax / totalOperatingIncome) * 100 : 0;
      
      const returnOnCapitalEmployed = capitalEmployed !== 0 ? (ebitda / capitalEmployed) * 100 : 0;
      const returnOnEquity = tangibleNetWorth !== 0 ? (profitAfterTax / tangibleNetWorth) * 100 : 0;
      
      // Cash Profit/Debt Repay (C48) = C15/(C88+C89+C90)
      const cashProfitsDebtRepay = totalRepayments ? cashProfits / totalRepayments : 0;
      
      const debtEquityRatio = tangibleNetWorth !== 0 ? totalDebt / tangibleNetWorth : 0;
      const overallGearing = tangibleNetWorth !== 0 ? totalDebt / tangibleNetWorth : 0;
      const tolTnwRatio = tangibleNetWorth !== 0 ? totalOutsideLibabilities / tangibleNetWorth : 0;
      const interestCoverageRatio = totalInterest !== 0 ? ebitda / totalInterest : 0;
      
      const dscr = (cashProfits + totalInterest) / (totalInterest + totalRepayments);
      
      const currentRatio = totalCurrentLiabilities !== 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
      
      const totalDebtCashProfits = cashProfits !== 0 ? totalDebt / cashProfits : 0;
      const termDebtCashProfits = cashProfits !== 0 ? termDebt / cashProfits : 0;
      const totalDebtEbitda = ebitda !== 0 ? totalDebt / ebitda : 0;
      
      // Average Debtor(days) (C62) = ROUND(365/(C5/((B74+C74)/2)),0)
      const grossDebtors = getFieldValue("28. Sundry Debtors- LESS THAN 6 MONTHS OLD", year);
      let averageDebtorDays = 0;
      if (idx > 0) {
        const prevGrossDebtors = getFieldValue("28. Sundry Debtors- LESS THAN 6 MONTHS OLD", years[idx - 1]);
        const avgDebtors = (grossDebtors + prevGrossDebtors) / 2;
        if (totalOperatingIncome && avgDebtors) {
          averageDebtorDays = Math.round(365 / (totalOperatingIncome / avgDebtors));
        }
      }
      
      // Similar calculations for inventory
      const inventory = getFieldValue("29. Inventory:", year);
      let averageInventoryDays = 0;
      if (idx > 0) {
        const prevInventory = getFieldValue("29. Inventory:", years[idx - 1]);
        const avgInventory = (inventory + prevInventory) / 2;
        if (costOfSales && avgInventory) {
          averageInventoryDays = Math.round(365 / (costOfSales / avgInventory));
        }
      }
      
      // Average payable(days) (C64) = ROUND(365/(C80/((B77+C77)/2)),0)
      const creditors = getFieldValue("3. Sundry Creditors (Trade)", year);
      // Cost Of sale (C80) = Cost of sale – depreciation – amortization
      const adjustedCostOfSale = costOfSales - depreciation - amortisation;
      let averagePayableDays = 0;
      if (idx > 0) {
        const prevCreditors = getFieldValue("3. Sundry Creditors (Trade)", years[idx - 1]);
        const avgCreditors = (creditors + prevCreditors) / 2;
        if (adjustedCostOfSale && avgCreditors) {
          averagePayableDays = Math.round(365 / (adjustedCostOfSale / avgCreditors));
        }
      }
      
      // Operating Cycle(days) (C65) = C62+C63-C64
      const operatingCycleDays = averageDebtorDays + averageInventoryDays - averagePayableDays;
      
      // Fixed Assets Turnover Ratio (C70) = C5/((B87+C87)/2)
      const netBlock = getFieldValue("35. Net Block (32+33-34)", year);
      let fixedAssetsTurnoverRatio = 0;
      if (idx > 0) {
        const prevNetBlock = getFieldValue("35. Net Block (32+33-34)", years[idx - 1]);
        const avgNetBlock = (netBlock + prevNetBlock) / 2;
        if (avgNetBlock) {
          fixedAssetsTurnoverRatio = totalOperatingIncome / avgNetBlock;
        }
      }
      
      // Store all calculated values
      newResults["Total Operating Income"][year] = totalOperatingIncome;
      newResults["EBITDA"][year] = ebitda;
      newResults["Depreciation"][year] = depreciation;
      newResults["Interest"][year] = totalInterest;
      newResults["Other Income"][year] = totalOtherIncome;
      newResults["Extraordinary expense"][year] = totalOtherExpenses;
      newResults["Profit before tax"][year] = profitBeforeTax;
      newResults["Current Tax"][year] = currentTax;
      newResults["Deferred Tax"][year] = deferredTax;
      newResults["Profit after tax"][year] = profitAfterTax;
      newResults["Cash Profits (GCA)"][year] = cashProfits;
      newResults["CFOA"][year] = totalOperatingIncome - costOfSales + totalOtherIncome;
      newResults["CFOA/EBITDA"][year] = ebitda ? (totalOperatingIncome - costOfSales + totalOtherIncome) / ebitda : 0;
      
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
      newResults["Capex for creditors"][year] = getFieldValue("12. i. Deferred Payment Credits (excluding instalments due within 1 year)", year);
      newResults["Capex"][year] = getFieldValue("Capex", year);
      newResults["Repayment of TL"][year] = repaymentTL;
      newResults["Repayment of Vehicle loans"][year] = repaymentVehicle;
      
      // DSCR calculations
      newResults["Cash available for debt servicing (A)"][year] = cashProfits + totalInterest;
      newResults["Interest payment"][year] = totalInterest;
      newResults["Principal repayment"][year] = totalRepayments;
      newResults["Total debt servicing (B)"][year] = totalInterest + totalRepayments;
      newResults["DSCR (A/B)"][year] = dscr;
      
      // Additional calculations for other sections
      newResults["Incremental capex"][year] = getFieldValue("Incremental capex", year);
      newResults["Effect of capex adv. & cred."][year] = getFieldValue("Effect of capex adv. & cred.", year);
      newResults["Total term debt availed"][year] = getFieldValue("Total term debt availed", year);
      newResults["Funded from term debt"][year] = getFieldValue("Funded from term debt", year);
      newResults["Funded from unsec. loan"][year] = getFieldValue("Funded from unsec. loan", year);
      newResults["Funded from equity infusion"][year] = getFieldValue("Funded from equity infusion", year);
      newResults["Funded from Internal Accruals"][year] = getFieldValue("Funded from Internal Accruals", year);
      
      newResults["Opening debt"][year] = getFieldValue("Opening debt", year);
      newResults["Add: Debt availed-other"][year] = getFieldValue("Add: Debt availed-other", year);
      newResults["Less: Repayments"][year] = getFieldValue("Less: Repayments", year);
      newResults["Closing debt"][year] = getFieldValue("Closing debt", year);
    });
    
    console.log('Final results:', newResults);
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
