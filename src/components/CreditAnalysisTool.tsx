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
      const totalOperatingIncome = (row["5. Net Operating Income (3+4)"] || 0);
      
      // EBITDA = Operating Profit before Interest + Depreciation + Amortisation  
      const operatingProfit = row["11. Operating Profit before Interest (5-10)"] || 0;
      const depreciationAmount = row["9. i. Depreciation"] || 0;
      const amortisationAmount = row["9. ii. Amortisation"] || 0;
      const ebitda = operatingProfit + depreciationAmount + amortisationAmount;
      
      // Depreciation = Depreciation + Amortisation of F-II
      const depreciation = depreciationAmount + amortisationAmount;
      
      // Interest = Finance Charges of F-II
      const interest = row["12. Finance Charges"] || 0;
      
      // Other Income = Sub-total (Income) of F-II
      const otherIncome = row["Sub-total (Income)"] || 0;
      
      // Other expense = Sub-total (Expenses) of F-II  
      const otherExpense = row["Sub-total (Expenses)"] || 0;
      
      // Profit before tax = EBITDA - Depreciation - Interest + Other Income - Other expense
      const profitBeforeTax = ebitda - depreciation - interest + otherIncome - otherExpense;
      
      // Current Tax = Provision for taxes + Previous year adjustments of F-II
      const currentTax = (row["14. i. Provision for taxes"] || 0) + (row["Previous year adjustments"] || 0);
      
      // Deferred Tax = Deferred Tax of F-II
      const deferredTax = row["14. ii. Deferred Tax"] || 0;
      
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
    
    try {
      // Check if we have any form data
      const hasData = Object.keys(formData).length > 0;
      if (!hasData) {
        toast.error('Please enter some data in the forms first.');
        return;
      }

      // Debug: Show which fields have data
      const fieldsWithData = Object.keys(formData).filter(field => 
        Object.values(formData[field]).some(value => value > 0)
      );
      console.log('Fields with data:', fieldsWithData);

      // Convert formData to year-based structure for calculations
      const yearBasedData: { [year: string]: any } = {};
      years.forEach(year => {
        yearBasedData[year] = {};
        Object.keys(formData).forEach(field => {
          yearBasedData[year][field] = formData[field]?.[year] || 0;
        });
      });

      console.log('Year-based data:', yearBasedData);

      // Convert to arrays for the calculation function
      const fII = years.map(year => ({ Year: year, ...yearBasedData[year] }));
      const fIII = years.map(year => ({ Year: year, ...yearBasedData[year] }));

      console.log('FII data:', fII);
      console.log('FIII data:', fIII);

      // Calculate results using the existing comprehensive calculation function
      const calculatedResults = calculateCreditAnalysis(fII, fIII);
      console.log('Calculated results:', calculatedResults);

      // Convert results back to field-based structure
      const newResults: FormData = {};
      calculatedResults.forEach((result, index) => {
        Object.keys(result).forEach(field => {
          if (field !== 'Year') {
            if (!newResults[field]) {
              newResults[field] = {};
            }
            newResults[field][years[index]] = parseFloat(result[field]) || 0;
          }
        });
      });

      setResults(newResults);
      toast.success('Output calculated successfully!');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Error calculating output. Please check your input data.');
    }
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
