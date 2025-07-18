import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BalanceSheetFormProps {
  years: string[];
  formData: { [key: string]: { [year: string]: number } };
  updateFormData: (field: string, year: string, value: number) => void;
}

export const BalanceSheetForm: React.FC<BalanceSheetFormProps> = ({
  years,
  formData,
  updateFormData
}) => {
  const fields = [
    // Current Liabilities Section
    "CURRENT LIABILITIES",
    "# SBLC",
    "$ BG (EPC)",
    "1. Short-term finance from banks (including bills purchased, discounted & excess borrowing and short term loans, placed on repayment basis) CC and OD",
    "1. i. From Axis Bank",
    "1. From IDFC Bank", 
    "1. From HDFC Bank",
    "1. ii. From Yes Bank",
    "1. iii. Other Banks",
    "1. Sub-total [i + iii] (A)",
    "2. Short term borrowings from others/Commercial paper",
    "3. Sundry Creditors (Trade)",
    "4. Advance payments from customers /deposits from dealers",
    "5A. Instalments of Vehicle loans (due within 1 yr) (including lease liability) (Linked to Repayment schedules)",
    "5B. Instalments of WCTL and DLOD (due within 1 yr) (including lease liability) (Linked to Repayment schedules)",
    "5C. Instalments of CAPEX linked Term Loans/ Debentures/ Preference Shares/ Deposits/ Other debts (due within 1 yr) (including lease liability) (Linked to Repayment schedules)",
    "6. Other current liabilities & provisions (due within 1 year)",
    "6. i. Tax/ Statutory deferred liabilities (due within 1 yr)",
    "6. ii. Interest accrued (including both due & not due)",
    "6. iii. Others dues- Rent & Dealership deposits",
    "6. iv. Dividend Payable",
    "6. v. Dues to Directors",
    "6. vi. Other Liabilities",
    "6. vii. Provisions- Dividend including tax",
    "6. viii. Provisions- Others",
    "6. ix. Preoperative expenses",
    "6. ix. Handling charges payable",
    "6. xi. Rents payable",
    "6. xii. Other",
    "Sub total-Other Current Liabilities other than Bank Finance [2to6] (B)",
    "7. Total current liabilities [A + B]",
    
    // Term Liabilities Section  
    "TERM LIABILITIES",
    "8. Creditors for Capex",
    "9A. Term Loans (excluding instalments payable within 1 year and WCTL)",
    "9B. WCTL and DLOD", 
    "9C. Vehicle loans",
    "10. Advances from customers",
    "11. Unsecured loans",
    "12. Other term liabilities",
    "12. i. Deferred Payment Credits (excluding instalments due within 1 year)",
    "12. ii. Others - Corporate Loan",
    "12. iii. Provisions",
    "13. Total Term Liabilities (8+9+10+11+12)",
    "14. Total Outside Liabilities [7+13]",
    
    // Net Worth Section
    "NET WORTH",
    "15. Ordinary Share Capital (including premium)",
    "16. Share Warrants",
    "17. Share Premium: Opening",
    "17. Adjustments (please specify)",
    "17. Closing",
    "18. General Reserve: Opening",
    "18. Adjustments (please specify)", 
    "18. Closing",
    "19. Capital Reserve: Opening",
    "19. Adjustments (please specify)",
    "19. Closing",
    "20. Other Reserves (Ind AS Adjustment)",
    "21. Surplus (+) or deficit (-) in Profit & Loss a/c",
    "22. Deferred Tax Liability (Net)",
    "23. Others",
    "23. i. Capital Subsidy",
    "23. ii. Share Application Money",
    "23. iii.",
    "23. iv. Share Suspense",
    "23. v. Revaluation Reserve- not part of TNW",
    "24. Net Worth (15 to 23)",
    "25. TOTAL LIABILITIES (14+24)",
    "Difference Asset & Liabilities",
    
    // Current Assets Section
    "CURRENT ASSETS",
    "26. Cash and Bank Balances (unencumbered)",
    "27. Investments (other than long term)",
    "27. i. Govt. and other trustee securities- short term",
    "27. ii. Encumbered",
    "27. iii. Cash at Bank (Pending for strategic investment)",
    "28. Sundry Debtors- LESS THAN 6 MONTHS OLD",
    "28. i. Domestic receivables other than deferred & exports (incldg. bills discounted by banks)",
    "28. ii. Export receivables (incldg. Bills discounted by banks)",
    "29. Inventory:",
    "29. i. Raw materials",
    "29. i. Imported",
    "29. i. Indigenous",
    "29. ii. Stocks-in-process/trade",
    "29. iii. Finished goods",
    "29. iv. Other consumable stores/spares/packing mat.",
    "29. iv. Imported",
    "29. iv. Indigenous",
    "30. Other current assets (specify major items)",
    "30. i. Advances to suppliers of raw material/spares",
    "30. ii. Advance payment of taxes (net of provisions)",
    "30. iii. Other advances- considered good",
    "30. iv. Accured interest income",
    "30. v. Others- Current dues from Directors",
    "30. vi. Prepaid Expenses",
    "30. vii. Instalments of deferred receivables (due within 1 year)",
    "30. viii. Others (Godown and Office Rents)",
    "30. ix. Inter croporate Deposit",
    "30. x. Others (pls specify)",
    "31. Total Current Assets (26 to 30)",
    
    // Fixed Assets Section
    "FIXED ASSETS",
    "32. Gross Block (land, building, machinery, WIP) Opening",
    "33. Capital work in process",
    "34. Accumulated Depreciation till date",
    "35. Net Block (32+33-34)",
    
    // Other Non-Current Assets Section
    "OTHER NON-CURRENT ASSETS",
    "36. Investments/book debts/advances/ deposits which are not current assets",
    "36. i. Investment in New Business",
    "36. ii. Loans & Investments in Group companies/ subsidiaries",
    "36. iii. Non current Investment",
    "36. iv. Advances for capital goods/ contractors",
    "36. iv. Debtors More Than 6 Months (net of provisions)",
    "36. v. Deferred receivables (maturity > 1 year)",
    "36. vi. Others- FD lodged with authorities/ margin money",
    "36. vii. Deferred Tax Assets",
    "36. viii. Others- Security depo, Disputed IT refund receivable",
    "36. ix. Misc expenditures not written off",
    "36. x. long term loans and advances",
    "36. xi. Others (MAT CREDIT ENTITLEMENT)",
    "Total Other Non-current Assets (35+36)",
    "37. Intangible Assets",
    "37. Goodwill",
    "37. Others",
    "37. Accumulated amortization",
    "38. Total Assets (31+35+36+37)",
    "39. Tangible Net Worth (24-37)",
    "40. Adjusted TNW (TNW+Quasi equity)",
    "40. Unsecured Loans",
    "40. Unsecured Loans eligible for QE classification",
    "41. Net Working Capital (31-7)",
    
    // Additional Information Section
    "ADDITIONAL INFORMATION",
    "A. Break-up of Unsecured Loans",
    "A. i. as Long Term Loans",
    "A. ii. as Short Term Loans",
    "B. Arrears of depreciation",
    "C. Contingent Liabilities: (mention details from Balance Sheet)",
    "C. i. Arrears of cumulative dividends",
    "C. ii. Gratuity liability not provided for",
    "C. iii. Disputed excise / customs /tax liabilities",
    "C. iv. Bank guarantee / Letter of credit outstanding",
    "C. v. Other liabilities not provided for",
    "C. vi. Others (pls specify)",
    "C. vii. Others (pls specify)",
    "C. viii. Others (pls specify)",
    "C. ix. Others (pls specify)",
    "C. x. Others (pls specify)"
  ];

  const getFieldClass = (field: string) => {
    // Main section headers (ALL CAPS)
    if (field === field.toUpperCase() && !field.includes('.') && !field.includes('#') && !field.includes('$')) {
      return "font-bold text-blue-900 bg-blue-100 text-center";
    }
    // Special symbols (# and $)
    if (field.includes('#') || field.includes('$')) {
      return "font-medium text-purple-800 bg-purple-50";
    }
    // Main numbered sections (1., 2., etc.)
    if (/^\d+\./.test(field) && !field.includes('i.') && !field.includes('ii.') && !field.includes('iii.')) {
      return "font-semibold text-blue-900 bg-blue-50";
    }
    // Sub-sections with roman numerals or letters
    if (field.includes('i.') || field.includes('ii.') || field.includes('iii.') || field.includes('A.') || field.includes('B.') || field.includes('C.')) {
      return "font-medium text-gray-800 pl-4 bg-gray-50";
    }
    // Sub-totals and totals
    if (field.includes('Sub-total') || field.includes('Total') || field.includes('TOTAL') || field.includes('Sub total')) {
      return "font-medium text-green-700 bg-green-50";
    }
    // Adjustments and closing
    if (field.includes('Adjustments') || field.includes('Closing') || field.includes('Opening')) {
      return "font-medium text-orange-700 bg-orange-50 pl-2";
    }
    // Difference line
    if (field.includes('Difference')) {
      return "font-medium text-red-700 bg-red-50 text-center";
    }
    // Default styling for other fields
    return "text-gray-600 pl-2";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form III - Balance Sheet</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-background z-10">
                <tr>
                  <th className="text-left p-2 border-b font-semibold min-w-[400px]">
                    Particulars
                  </th>
                  {years.map(year => (
                    <th key={year} className="text-center p-2 border-b font-semibold min-w-[120px]">
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className={`p-2 border-b ${getFieldClass(field)}`}>
                      <Label className="text-sm">{field}</Label>
                    </td>
                    {years.map(year => (
                      <td key={year} className="p-2 border-b">
                        {field === field.toUpperCase() && !field.includes('.') && !field.includes('#') && !field.includes('$') ? (
                          // Section headers - no input
                          <div className="w-full h-8"></div>
                        ) : field.includes('Difference') ? (
                          // Difference calculation - no input
                          <div className="w-full h-8"></div>
                        ) : (
                          <Input
                            type="number"
                            step="0.01"
                            className="w-full"
                            value={formData[field]?.[year] || ''}
                            onChange={(e) => updateFormData(field, year, parseFloat(e.target.value) || 0)}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
