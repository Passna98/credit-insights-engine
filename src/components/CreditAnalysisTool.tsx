import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OperatingStatementForm } from './OperatingStatementForm';
import { BalanceSheetForm } from './BalanceSheetForm';
import { OutputResults } from './OutputResults';
import { Calculator, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorBoundary } from './ErrorBoundary';
import { safeDivide } from '@/lib/validation';

export interface FormData {
  [key: string]: { [year: string]: number };
}

export const CreditAnalysisTool: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [results, setResults] = useState<FormData>({});
  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'];

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
    const value = formData[field]?.[year] || 0;
    return isFinite(value) ? value : 0;
  };

  const calculateCreditAnalysis = (fII: any[], fIII: any[]) => {
    return fII.map((row: any, idx: number) => {
      const balance = fIII[idx] || {};
      const prevBalance = fIII[idx - 1] || {};
      const prevRow = fII[idx - 1] || {};

      // ==========================
      // FINANCIAL PERFORMANCE
      // ==========================
      // Total Operating Income = Net Operating Income (3+4) of F-II
      const totalOperatingIncome = (row["Net Operating Income"] || 0);
      
      // EBITDA = Operating Profit before Interest + Depreciation + Amortisation  
      const operatingProfit = row["Operating Profit before Interest"] || 0;
      const depreciationAmount = row["Depreciation"] || 0;
      const amortisationAmount = row["Amortisation"] || 0;
      const ebitda = operatingProfit + depreciationAmount + amortisationAmount;
      
      // Depreciation = Depreciation + Amortisation of F-II
      const depreciation = depreciationAmount + amortisationAmount;
      
      // Interest = Finance Charges of F-II
      const interest = row["Finance Charges"] || 0;
      
      // Other Income = Sub-total (Income) of F-II
      const otherIncome = row["Sub-total (Income)"] || 0;
      
      // Other expense = Sub-total (Expenses) of F-II
      const otherExpense = row["Sub-total (Expenses)"] || 0;
      
      // Profit before tax = EBITDA - Depreciation - Interest + Other Income - Other expense
      const profitBeforeTax = ebitda - depreciation - interest + otherIncome - otherExpense;
      
      // Current Tax = Provision for taxes + Previous year adjustments of F-II
      const currentTax = (row["Provision for taxes"] || 0) + (row["Previous year adjustments"] || 0);
      
      // Deferred Tax = Deferred Tax of F-II
      const deferredTax = row["Deferred Tax"] || 0;
      
      // Profit after tax = Profit before tax - Current Tax - Deferred Tax
      const profitAfterTax = profitBeforeTax - currentTax - deferredTax;
      
      // Cash Profits (GCA) = Profit after tax + Deferred Tax + Depreciation
      const cashProfitsGCA = profitAfterTax + deferredTax + depreciation;

      // ==========================
      // CAPITAL STRUCTURE
      // ==========================
      // Share Capital = Ordinary Share Capital (including premium) of F-III
      const shareCapital = balance["Ordinary Share Capital (including premium)"] || 0;
      
      // Tangible Net Worth (TNW) = Adjusted TNW (TNW+Quasi equity) of F-III
      const tangibleNetWorth = balance["Adjusted TNW (TNW+Quasi equity)"] || 0;
      
      // Unsecured loan (Quasi eq.) = Unsecured Loans eligible for QE classification of F-III
      const unsecuredLoanQuasiEq = balance["Unsecured Loans eligible for QE classification"] || 0;
      
      // Term debt = Combined term debt components
      const termDebt = (balance["Instalments of CAPEX linked Term Loans due within 1 yr"] || 0) + 
                       (balance["Term Loans (excluding instalments payable within 1 year and WCTL)"] || 0);
      
      // WCTL = Combined WCTL components
      const wctl = (balance["Instalments of WCTL and DLOD due within 1 yr"] || 0) + 
                   (balance["Deferred Payment Credits (excluding instalments due within 1 year)"] || 0);
      
      // Working capital debt = Sub-total [i + iii] (A) of F-III
      const workingCapitalDebt = balance["Sub-total [i + iii] (A)"] || 0;
      
      // Vehicle loans = Combined vehicle loan components
      const vehicleLoans = (balance["Instalments of Vehicle loans due within 1 yr"] || 0) + 
                           (balance["Vehicle loans"] || 0);
      
      // Unsecured loans = Others components
      const unsecuredLoans = (balance["Others (pls specify)"] || 0) - (balance["Others (pls specify)"] || 0);
      
      // SBLC/BG = SBLC + BG of F-III
      const sblcBg = (balance["SBLC"] || 0) + (balance["BG"] || 0);
      
      // Capital employed = Tangible Net Worth (TNW) + Working capital debt
      const capitalEmployed = tangibleNetWorth + workingCapitalDebt;
      
      // Liquidity (Unencumbered) = Combined unencumbered liquidity
      const liquidityUnencumbered = (balance["Cash and Bank Balances (unencumbered)"] || 0) + 
                                    (balance["Cash at Bank (Pending for strategic investment)"] || 0) + 
                                    (balance["Govt. and other trustee securities- short term"] || 0);
      
      // Liquidity (Encumbered) = Encumbered + Others- FD lodged with authorities/ margin money
      const liquidityEncumbered = (balance["Encumbered"] || 0) + 
                                  (balance["Others- FD lodged with authorities/ margin money"] || 0);
      
      // Group companies = Loans & Investments in Group companies/ subsidiaries of F-III
      const groupCompanies = balance["Loans & Investments in Group companies/ subsidiaries"] || 0;
      
      // Others = Investment in New Business + Non current Investment of F-III
      const others = (balance["Investment in New Business"] || 0) + (balance["Non current Investment"] || 0);
      
      // Investments = Group companies + Others
      const investments = groupCompanies + others;
      
      // Total outside liabilities (TOL) = Total Outside Liabilities [7+13] of F-III
      const totalOutsideLibabilities = balance["Total Outside Liabilities [7+13]"] || 0;

      // ==========================
      // GROWTH RATIOS
      // ==========================
      const salesGrowth = safeDivide(
        totalOperatingIncome - (prevRow["Total Operating Income"] || 0),
        Math.abs(prevRow["Total Operating Income"] || 1)
      ) * 100;
      
      const ebitdaGrowth = safeDivide(
        ebitda - (prevRow["EBITDA"] || 0),
        Math.abs(prevRow["EBITDA"] || 1)
      ) * 100;
      
      const pbtGrowth = safeDivide(
        profitBeforeTax - (prevRow["Profit before tax"] || 0),
        Math.abs(prevRow["Profit before tax"] || 1)
      ) * 100;
      
      const patGrowth = safeDivide(
        profitAfterTax - (prevRow["Profit after tax"] || 0),
        Math.abs(prevRow["Profit after tax"] || 1)
      ) * 100;

      // ==========================
      // PROFITABILITY RATIOS
      // ==========================
      const ebitdaMargin = safeDivide(ebitda, totalOperatingIncome) * 100;
      const pbtMargin = safeDivide(profitBeforeTax, totalOperatingIncome) * 100;
      const patMargin = safeDivide(profitAfterTax, totalOperatingIncome) * 100;

      // ==========================
      // RETURN RATIOS
      // ==========================
      const avgCapitalEmployed = prevBalance["Capital employed"] ? 
        (capitalEmployed + prevBalance["Capital employed"]) / 2 : capitalEmployed;
      const returnOnCapitalEmployed = avgCapitalEmployed ? 
        ((prevRow["EBITDA"] - ebitda) / avgCapitalEmployed) * 100 : 0;
      
      const avgTangibleNetWorth = prevBalance["Tangible Net Worth (TNW)"] ? 
        (tangibleNetWorth + prevBalance["Tangible Net Worth (TNW)"]) / 2 : tangibleNetWorth;
      const returnOnEquity = avgTangibleNetWorth ? (profitAfterTax / avgTangibleNetWorth) * 100 : 0;

      // ==========================
      // SOLVENCY RATIOS/COVERAGE RATIOS
      // ==========================
      const avgWorkingCapitalDebt = prevBalance["Working capital debt"] ? 
        (workingCapitalDebt + prevBalance["Working capital debt"]) / 2 : workingCapitalDebt;
      const avgCostOfBorrowing = avgWorkingCapitalDebt ? (interest / avgWorkingCapitalDebt) * 100 : 0;
      
      const repaymentTL = balance["Repayment of TL"] || 0;
      const repaymentVehicle = balance["Repayment of Vehicle loans"] || 0;
      const repaymentWCTL = balance["Repayment of WCTL"] || 0;
      const totalRepayments = repaymentTL + repaymentVehicle + repaymentWCTL;
      const cashProfitsDebtRepay = (cashProfitsGCA + totalRepayments) ? 
        cashProfitsGCA / (cashProfitsGCA + totalRepayments) : 0;
      
      const debtEquityRatio = tangibleNetWorth ? termDebt / tangibleNetWorth : 0;
      const overallGearing = tangibleNetWorth ? workingCapitalDebt / tangibleNetWorth : 0;
      const tolTnw = tangibleNetWorth ? totalOutsideLibabilities / tangibleNetWorth : 0;
      const interestCoverageRatio = interest ? ebitda / interest : 0;
      
      // DSCR calculation
      const internalAccruals = Math.max(0, balance["Funded from Internal Accruals"] || 0);
      const cashAvailableForDebtServicing = cashProfitsGCA + interest - internalAccruals;
      const interestPayment = interest;
      const principalRepayment = totalRepayments;
      const totalDebtServicing = interestPayment + principalRepayment;
      const dscr = totalDebtServicing ? cashAvailableForDebtServicing / totalDebtServicing : 0;
      
      const totalDebtCashProfits = cashProfitsGCA ? workingCapitalDebt / cashProfitsGCA : 0;
      const termDebtCashProfits = cashProfitsGCA ? termDebt / cashProfitsGCA : 0;
      const totalDebtEbitda = ebitda ? workingCapitalDebt / ebitda : 0;

      // ==========================
      // LIQUIDITY RATIOS / TURNOVER RATIOS
      // ==========================
      const salesWcDebt = workingCapitalDebt ? totalOperatingIncome / workingCapitalDebt : 0;
      
      const totalCurrentAssets = balance["Total Current Assets (26 to 30)"] || 0;
      const totalCurrentLiabilities = balance["Total current liabilities [A + B]"] || 0;
      const currentRatio = totalCurrentLiabilities ? totalCurrentAssets / totalCurrentLiabilities : 0;
      
      const grossDebtors = (balance["Sundry Debtors- LESS THAN 6 MONTHS OLD"] || 0) + 
                           (balance["Debtors More Than 6 Months (net of provisions)"] || 0);
      const inventory = balance["Inventory"] || 0;
      const creditors = balance["Sundry Creditors (Trade)"] || 0;
      const advanceToSuppliers = balance["Advances to suppliers of raw material/spares"] || 0;
      const advanceFromCustomers = balance["Advance payments from customers /deposits from dealers"] || 0;
      
      const avgGrossDebtors = prevBalance["Gross Debtors"] ? 
        (grossDebtors + prevBalance["Gross Debtors"]) / 2 : grossDebtors;
      const debtorDays = totalOperatingIncome && avgGrossDebtors ? 
        Math.round(365 / (totalOperatingIncome / avgGrossDebtors)) : 0;
      
      const costOfGoodsSold = row["Cost of Goods Sold"] || 0;
      const avgInventory = prevBalance["Inventory"] ? 
        (inventory + prevBalance["Inventory"]) / 2 : inventory;
      const inventoryDays = costOfGoodsSold && avgInventory ? 
        Math.round(365 / (costOfGoodsSold / avgInventory)) : 0;
      
      const costOfSales = (row["Sub-total (6+7) Cost of sales"] || 0) - depreciation;
      const avgCreditors = prevBalance["Creditors"] ? 
        (creditors + prevBalance["Creditors"]) / 2 : creditors;
      const payableDays = costOfSales && avgCreditors ? 
        Math.round(365 / (costOfSales / avgCreditors)) : 0;
      
      const operatingCycleDays = debtorDays + inventoryDays - payableDays;
      
      const avgAdjDebtors = prevBalance["Gross Debtors"] && prevBalance["Advance to Suppliers"] ? 
        ((grossDebtors + advanceToSuppliers) + (prevBalance["Gross Debtors"] + prevBalance["Advance to Suppliers"])) / 2 : 
        grossDebtors + advanceToSuppliers;
      const adjDebtorDays = totalOperatingIncome && avgAdjDebtors ? 
        Math.round(365 / (totalOperatingIncome / avgAdjDebtors)) : 0;
      
      const avgAdjCreditors = prevBalance["Creditors"] && prevBalance["Advance from Customers"] ? 
        ((creditors + advanceFromCustomers) + (prevBalance["Creditors"] + prevBalance["Advance from Customers"])) / 2 : 
        creditors + advanceFromCustomers;
      const adjPayableDays = costOfSales && avgAdjCreditors ? 
        Math.round(365 / (costOfSales / avgAdjCreditors)) : 0;
      
      const adjOperatingCycleDays = adjDebtorDays + inventoryDays - adjPayableDays;
      
      const tcaExceptFreeLiquidity = totalCurrentAssets - liquidityUnencumbered;
      const avgTcaExceptFreeLiquidity = prevBalance["Total current assets"] && prevBalance["Liquidity (Unencumbered)"] ? 
        ((tcaExceptFreeLiquidity) + (prevBalance["Total current assets"] - prevBalance["Liquidity (Unencumbered)"])) / 2 : 
        tcaExceptFreeLiquidity;
      const grossCurrentAssetDays = totalOperatingIncome && avgTcaExceptFreeLiquidity ? 
        Math.round(365 / (totalOperatingIncome / avgTcaExceptFreeLiquidity)) : 0;
      
      const netBlockFixedAssets = balance["Net Block (32+33-34)"] || 0;
      const avgNetBlockFixedAssets = prevBalance["Net block of Fixed Assets"] ? 
        (netBlockFixedAssets + prevBalance["Net block of Fixed Assets"]) / 2 : netBlockFixedAssets;
      const fixedAssetsTurnoverRatio = avgNetBlockFixedAssets ? totalOperatingIncome / avgNetBlockFixedAssets : 0;

      // ==========================
      // OTHER DETAILS
      // ==========================
      const tclExceptFinLiab = balance["Sub total-Other Current Liabilities other than Bank Finance [2to6] (B)"] || 0;
      const netWc = tcaExceptFreeLiquidity - tclExceptFinLiab;
      
      // CAPEX calculations
      const grossFaInclCwip = (balance["Closing"] || 0) + (balance["Capital work in process"] || 0);
      const capexAdvance = balance["Advances for capital goods/ contractors"] || 0;
      const creditorsForCapex = balance["Creditors for Capex"] || 0;
      const prevGrossFaInclCwip = (prevBalance["Closing"] || 0) + (prevBalance["Capital work in process"] || 0);
      const prevCapexAdvance = prevBalance["Advances for capital goods/ contractors"] || 0;
      const prevCreditorsForCapex = prevBalance["Creditors for Capex"] || 0;
      
      const capex = grossFaInclCwip + capexAdvance - creditorsForCapex - 
                    prevGrossFaInclCwip - prevCapexAdvance + prevCreditorsForCapex;
      
      // Debt movements
      const openingDebt = prevBalance["Term debt"] || 0;
      const closingDebt = termDebt;
      const debtAvailed = closingDebt + repaymentTL - openingDebt;
      
      const fundedFromTermDebt = debtAvailed;
      const fundedFromUnsecLoan = (balance["Unsecured loans"] || 0) - (prevBalance["Unsecured loans"] || 0);
      const fundedFromInternalAccruals = openingDebt - fundedFromTermDebt - fundedFromUnsecLoan;

      // ==========================
      // RETURN RESULT
      // ==========================
      return {
        Year: row["Year"],
        "Total Operating Income": totalOperatingIncome.toFixed(2),
        "EBITDA": ebitda.toFixed(2),
        "Depreciation": depreciation.toFixed(2),
        "Interest": interest.toFixed(2),
        "Other Income": otherIncome.toFixed(2),
        "Other expense": otherExpense.toFixed(2),
        "Profit before tax": profitBeforeTax.toFixed(2),
        "Current Tax": currentTax.toFixed(2),
        "Deferred Tax": deferredTax.toFixed(2),
        "Profit after tax": profitAfterTax.toFixed(2),
        "Cash Profits (GCA)": cashProfitsGCA.toFixed(2),
        "Share Capital": shareCapital.toFixed(2),
        "Tangible Net Worth (TNW)": tangibleNetWorth.toFixed(2),
        "Unsecured loan (Quasi eq.)": unsecuredLoanQuasiEq.toFixed(2),
        "Total debt": (termDebt + workingCapitalDebt + vehicleLoans + unsecuredLoans).toFixed(2),
        "Term debt": termDebt.toFixed(2),
        "WCTL": wctl.toFixed(2),
        "Working capital debt": workingCapitalDebt.toFixed(2),
        "Vehicle loans": vehicleLoans.toFixed(2),
        "Unsecured loans": unsecuredLoans.toFixed(2),
        "SBLC/BG": sblcBg.toFixed(2),
        "Capital employed": capitalEmployed.toFixed(2),
        "Liquidity (Unencumbered)": liquidityUnencumbered.toFixed(2),
        "Liquidity (Encumbered)": liquidityEncumbered.toFixed(2),
        "Investments": investments.toFixed(2),
        "Group companies": groupCompanies.toFixed(2),
        "Others": others.toFixed(2),
        "Total outside liabilities (TOL)": totalOutsideLibabilities.toFixed(2),
        "Sales growth": salesGrowth.toFixed(2),
        "EBITDA growth": ebitdaGrowth.toFixed(2),
        "PBT growth": pbtGrowth.toFixed(2),
        "PAT growth": patGrowth.toFixed(2),
        "EBITDA Margin": ebitdaMargin.toFixed(2),
        "PBT Margin": pbtMargin.toFixed(2),
        "PAT Margin": patMargin.toFixed(2),
        "Return on Capital Employed": returnOnCapitalEmployed.toFixed(2),
        "Return on Equity": returnOnEquity.toFixed(2),
        "Average cost of borrowing": avgCostOfBorrowing.toFixed(2),
        "Cash Profits/Debt Repay": cashProfitsDebtRepay.toFixed(2),
        "Debt Equity ratio": debtEquityRatio.toFixed(2),
        "Overall gearing": overallGearing.toFixed(2),
        "TOL/TNW": tolTnw.toFixed(2),
        "Interest Coverage Ratio": interestCoverageRatio.toFixed(2),
        "Debt Service Coverage Ratio": dscr.toFixed(2),
        "Total debt/Cash Profits": totalDebtCashProfits.toFixed(2),
        "Term debt/Cash Profits": termDebtCashProfits.toFixed(2),
        "Total debt/EBITDA (Lev.)": totalDebtEbitda.toFixed(2),
        "Sales/WC debt": salesWcDebt.toFixed(2),
        "Current Ratio": currentRatio.toFixed(2),
        "Debtor (days)": debtorDays.toString(),
        "Inventory (days)": inventoryDays.toString(),
        "Payable (days)": payableDays.toString(),
        "Operating cycle (days)": operatingCycleDays.toString(),
        "Adj. Debtor (days) (incl adv to supp)": adjDebtorDays.toString(),
        "Adj. payable (days) (incl adv from cust)": adjPayableDays.toString(),
        "Adj. operating cycle (days)": adjOperatingCycleDays.toString(),
        "Gross Current Asset (days)": grossCurrentAssetDays.toString(),
        "Fixed Assets Turnover Ratio": fixedAssetsTurnoverRatio.toFixed(2),
        "Total current assets": totalCurrentAssets.toFixed(2),
        "TCA except free liquidity": tcaExceptFreeLiquidity.toFixed(2),
        "Total current liabilities": totalCurrentLiabilities.toFixed(2),
        "TCL except fin liab": tclExceptFinLiab.toFixed(2),
        "Net WC": netWc.toFixed(2),
        "Gross Debtors": grossDebtors.toFixed(2),
        "Advance to Suppliers": advanceToSuppliers.toFixed(2),
        "Inventory": inventory.toFixed(2),
        "Creditors": creditors.toFixed(2),
        "Advance from Customers": advanceFromCustomers.toFixed(2),
        "Cost of goods sold": costOfGoodsSold.toFixed(2),
        "Cost of sales": costOfSales.toFixed(2),
        "A Gross FA incl CWIP": grossFaInclCwip.toFixed(2),
        "B Capex advance": capexAdvance.toFixed(2),
        "C Creditors for capex": creditorsForCapex.toFixed(2),
        "Capex (A1+B1+C1-A0-B0-C0)": capex.toFixed(2),
        "Gross Debt availed": debtAvailed.toFixed(2),
        "Net block of Fixed Assets": netBlockFixedAssets.toFixed(2),
        "Repayment of TL": repaymentTL.toFixed(2),
        "Repayment of Vehicle loans": repaymentVehicle.toFixed(2),
        "Repayment of WCTL": repaymentWCTL.toFixed(2),
        "Add: Interest": interest.toFixed(2),
        "Less: Internal Accruals": internalAccruals.toFixed(2),
        "Cash available for debt servicing (A)": cashAvailableForDebtServicing.toFixed(2),
        "Interest payment": interestPayment.toFixed(2),
        "Principal repayment": principalRepayment.toFixed(2),
        "Total debt servicing (B)": totalDebtServicing.toFixed(2),
        "DSCR (A/B)": dscr.toFixed(2),
        "FATR to compare with capex": fixedAssetsTurnoverRatio.toFixed(2),
        "Incremental capex": capex.toFixed(2),
        "Total term debt availed": debtAvailed.toFixed(2),
        "Funded from term debt": fundedFromTermDebt.toFixed(2),
        "Funded from unsec. loan": fundedFromUnsecLoan.toFixed(2),
        "Funded from Internal Accruals": fundedFromInternalAccruals.toFixed(2),
        "Opening debt": openingDebt.toFixed(2),
        "Add: Debt availed-other": debtAvailed.toFixed(2),
        "Less: Repayments": repaymentTL.toFixed(2),
        "Closing debt": closingDebt.toFixed(2)
      };
    });
  };

  const calculateResults = () => {
    console.log('=== CALCULATE RESULTS CLICKED ===');
    console.log('Current formData:', formData);
    console.log('FormData keys count:', Object.keys(formData).length);
    console.log('FormData keys:', Object.keys(formData));
    
    // Check specific fields we know should have data
    console.log('Sample field checks:');
    console.log('- formData["1. Gross Sales - Total"]:', formData["1. Gross Sales - Total"]);
    console.log('- formData["Net Sales"]:', formData["Net Sales"]);
    console.log('- formData["Cost of Sales"]:', formData["Cost of Sales"]);
    
    if (Object.keys(formData).length === 0) {
      alert('No data found in formData. Please check if form inputs are working.');
      return;
    }
    
    const newResults: FormData = {};
    
    // Initialize all metrics
    const allMetrics = [
      // FINANCIAL PERFORMANCE
      "Net Sales", "Total Operating Income", "EBITDA", "Depreciation", "Interest", "Other Income", "Extraordinary expense", "Profit before tax", "Current Tax", "Deferred Tax", "Profit after tax", "Cash Profits (GCA)", "CFOA", "CFOA/EBITDA",
      // CAPITAL STRUCTURE
      "Share Capital", "Tangible networth (TNW)", "Unsecured loan (Quasi eq.)", "Total debt", "- Term debt", "- WCTL", "- Working capital debt", "- Vehicle loans", "- Unsecured loans", "SBLC/BG", "Capital employed", "Liquidity (Unencumbered)", "Liquidity (Encumbered)", "Investments", "- Group companies", "- Others", "Total outside liabilities (TOL)",
      // KEY RATIOS
      "Sales growth", "EBITDA growth", "PBT growth", "PAT growth",
      // PROFITABILITY RATIOS
      "EBITDA Margin", "PBT Margin", "PAT Margin",
      // RETURN RATIOS
      "Return on Capital Employed", "Return on Equity",
      // SOLVENCY RATIOS/COVERAGE RATIOS
      "Average cost of borrowing", "Cash Profits/Debt Repay", "Debt Equity ratio", "Overall gearing", "TOL/TNW", "Interest Coverage Ratio", "Debt Service Coverage Ratio", "Total debt/Cash Profits", "Term debt/Cash Profits", "Total debt/EBITDA (Lev.)", "Sales/WC debt",
      // LIQUIDITY RATIOS / TURNOVER RATIOS
      "Avg WC Utilisation", "Current Ratio", "Debtor (days)", "Inventory (days)", "Payable (days)", "Operating cycle (days)", "Adj. Debtor (days) (incl adv to supp)", "Adj. payable (days) (incl adv from cust)", "Adj. operating cycle (days)", "Gross Current Asset (days)", "Fixed Assets Turnover Ratio",
      // OTHER DETAILS
      "Total current assets", "TCA except free liquidity", "Total current liabilities", "TCL except fin liab", "Net WC", "Gross Debtors", "Advance to Suppliers", "Inventory", "Creditors", "Advance from Customers", "Cost of goods sold", "Cost of sales", "A Gross FA incl CWIP", "B Capex advance", "C Creditors for capex", "Capex (A1+B1+C1-A0-B0-C0)", "Gross Debt availed", "Net block of Fixed Assets", "Repayment of TL", "Repayment of Vehicle loans", "Repayment of WCTL",
      // DSCR
      "Add: Interest", "Less: Internal Accruals", "Cash available for debt servicing (A)", "Interest payment", "Principal repayment", "Total debt servicing (B)", "DSCR (A/B)",
      // CAPEX AND ITS FINANCING
      "FATR to compare with capex", "% TL to capex", "Incremental capex", "Total term debt availed", "Funded from term debt", "Funded from unsec. loan", "Funded from other source (Specify)", "Funded from Internal Accruals",
      // DETAILS OF TERM DEBT
      "Opening debt", "Add: Debt availed-other", "Less: Repayments", "Closing debt",
      // DETAILS OF VEHICLE LOANS
      // (same as above, can be split if needed)
      // DETAILS OF WCTL
      "WCTL Opening debt", "WCTL Add: Debt availed-other", "WCTL Less: Repayments", "WCTL Closing debt"
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
      newResults["PBT Margin"][year] = pbtMargin;
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

      // Add calculations for new metrics below
      // Placeholders for new metrics (replace with real formulas as needed)
      newResults["Other expense"][year] = newResults["Extraordinary expense"]?.[year] || 0;
      newResults["Tangible Net Worth (TNW)"][year] = newResults["Tangible networth (TNW)"]?.[year] || 0;
      newResults["Unsecured loan (Quasi eq.)"][year] = getFieldValue("40. Unsecured Loans eligible for QE classification", year);
      newResults["Term debt"][year] = newResults["- Term debt"]?.[year] || 0;
      newResults["WCTL"][year] = getFieldValue("9B. WCTL and DLOD", year);
      newResults["SBLC/BG"][year] = getFieldValue("# SBLC", year) + getFieldValue("$ BG (EPC)", year);
      newResults["Liquidity (Encumbered)"][year] = getFieldValue("27. ii. Encumbered", year);
      newResults["Investments"][year] = getFieldValue("27. Investments (other than long term)", year);
      newResults["Investments - Group companies"][year] = getFieldValue("36. ii. Loans & Investments in Group companies/ subsidiaries", year);
      newResults["Investments - Others"][year] = getFieldValue("36. iii. Non current Investment", year);
      newResults["Working capital debt"][year] = newResults["- Working capital debt"]?.[year] || 0;
      newResults["Vehicle loans"][year] = newResults["- Vehicle loans"]?.[year] || 0;
      newResults["Unsecured loans"][year] = newResults["- Unsecured loans"]?.[year] || 0;
      newResults["Advance to Suppliers"][year] = getFieldValue("30. i. Advances to suppliers of raw material/spares", year);
      newResults["Advance from Customers"][year] = getFieldValue("4. Advance payments from customers /deposits from dealers", year);
      newResults["A Gross FA incl CWIP"][year] = getFieldValue("32. Gross Block (land, building, machinery, WIP) Opening", year);
      newResults["B Capex advance"][year] = getFieldValue("36. iv. Advances for capital goods/ contractors", year);
      newResults["C Creditors for capex"][year] = getFieldValue("8. Creditors for Capex", year);
      newResults["Capex (A1+B1+C1-A0-B0-C0)"][year] = 0; // Placeholder, needs period-over-period calculation
      newResults["Net block of Fixed Assets"][year] = getFieldValue("35. Net Block (32+33-34)", year);
      newResults["Repayment of WCTL"][year] = getFieldValue("Repayment of WCTL", year);
      newResults["TCA except free liquidity"][year] = newResults["Total current assets"]?.[year] - newResults["Liquidity (Unencumbered)"]?.[year];
      newResults["TCL except fin liab"][year] = newResults["Total current liabilities"]?.[year]; // Placeholder, adjust as needed
      newResults["Net WC"][year] = newResults["Total current assets"]?.[year] - newResults["Total current liabilities"]?.[year];
      newResults["Add: Interest"][year] = newResults["Interest"]?.[year] || 0;
      newResults["Less: Internal Accruals"][year] = 0; // Placeholder, needs user input or further logic
      newResults["FATR to compare with capex"][year] = 0; // Placeholder, needs formula
      newResults["% TL to capex"][year] = 0; // Placeholder, needs formula
      newResults["Funded from other source (Specify)"][year] = 0; // Placeholder, needs user input
      // DETAILS OF WCTL
      newResults["WCTL Opening debt"][year] = 0; // Placeholder, needs logic
      newResults["WCTL Add: Debt availed-other"][year] = 0; // Placeholder, needs logic
      newResults["WCTL Less: Repayments"][year] = 0; // Placeholder, needs logic
      newResults["WCTL Closing debt"][year] = 0; // Placeholder, needs logic
      // Add more calculations as needed for new metrics
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};
