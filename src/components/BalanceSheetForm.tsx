
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
    "1. Short-term finance from banks - Axis Bank",
    "1. Short-term finance from banks - IDFC Bank",
    "1. Short-term finance from banks - HDFC Bank", 
    "1. Short-term finance from banks - Yes Bank",
    "1. Short-term finance from banks - Other Banks",
    "1. Short-term finance from banks - Sub-total (A)",
    "2. Short term borrowings from others/Commercial paper",
    "3. Sundry Creditors (Trade)",
    "4. Advance payments from customers/deposits from dealers",
    "5A. Instalments of Vehicle loans (due within 1 yr)(including lease liability)(linked to Repayment schedules)",
    "5B. Instalments of WCTL and DLOD (due within 1 yr)(including lease liability)(linked to Repayment schedules)",
    "5C. Instalments of CAPEX linked Term Loans/Debentures/Preference shares/Deposits/Other debts (due within 1 yr)(including lease liability)(linked to Repayment schedules)",
    "6. Other current liabilities & provisions (due within 1 year)",
    "i. Tax/statutory deferred liabilities",
    "ii. Interest accrued",
    "iii. Others dues - Rent & Dealership deposits",
    "iv. Dividend Payable",
    "v. Dues to Directors",
    "vi. Other Liabilities",
    "vii. Provisions-Dividend including tax",
    "viii.Provisions -Others",
    "ix. Preoperative expenses",
    "x. Handling charges payable",
    "xi. Rents payable",
    "xii. Others",
    "Sub Total other current liabilities other than Bank Finance (B)",
    "7. Total current liabilities (A + B)",
    "8. Creditors for Capex",
    "9A. Term Loans (excluding installments payable within 1 year and WCTL)",
    "9B. WCTL and DLOD",
    "9C. Vehicle loans",
    "10. Advances from customers",
    "11. Unsecured loans",
    "12. Other term liabilities",
    "i.Deferred payment Credits (excluding instalments due within 1 year)",
    "ii. Others - Corporate Loan",
    "iii. Provisions",
    "13. Total Term Liabilities(8+9+10+11+12)",
    "14. Total Outside Liabilities (7 + 13)",
    "NET WORTH",
    "15. Ordinary Share Capital (including premium)",
    "16. Share Warrants",
    "17. Share Premium - Opening",
    "Adjustments (Pls specify)",
    "Closing",
    "18. General Reserve - Opening",
    "Adjustments(Pls specify)",
    "18. General Reserve - Closing",
    "19. Capital Reserve - Opening",
    "Adjustments(Pls specify)",
    "19. Capital Reserve - Closing",
    "20. Other Reserves (Ind AS adjustments)",
    "21. Surplus (+) or deficit (-) in Profit & Loss account",
    "22. Deferred Tax Liability (net)",
    "23. Others",
    "i.Capital Subsidy",
    "ii.Share Application Money",
    "iii. Share Suspense",
    "iv.Revaluation Reserve-not part of TNW",
    "24. Net Worth (15 to 23)",
    "25. Total Liabilities (14 + 24)",
    "Difference Asset & Liabilities",
    "CURRENT ASSETS",
    "26. Cash and Bank Balances (unencumbered)",
    "27. Investments (other than long term)",
    "i.Govt. and other trustee securities- short term",
    "ii. Encumbered",
    "iii. Cash at Bank (Pending for strategic investment)",
    "28. Sundry Debtors -LESS THAN 6 MONTHS OLD",
    "i. Domestic receivables other than deferred & exports(incldg.bills discounted by banks)",
    "ii. Export receivables(incldg.bills discounted by banks)",
    "29. Inventory",
    "i.Raw materials- Imported",
    "Raw materials- Indigenous",
    "ii.Stocks-in-process/trade",
    "iii. Finished goods",
    "iv. Other consumable stores/spares/packing materials- Imported",
    "Other consumable stores/spares/packing materials- Indigenous",
    "30. Other current assets(specify major items)",
    "i. Advances to suppliers of raw material/spares",
    "ii. Advance payment of taxes (net of provisions)",
    "iii.Other advances- considered good",
    "iv. Accrued interest income",
    "v. Others- Current dues from Directors",
    "vi. Prepaid Expenses",
    "vii. Instalments of deferred receivables (due within 1 year)",
    "viii. Others (Godown and Office Rents)",
    "ix. Inter corporate Deposit",
    "x.Others (pls specify)",
    "31. Total Current Assets (26 to 30)",
    "FIXED ASSETS",
    "32. Gross Block (land, building, machinery, WIP) Opening",
    "33. Capital work in process",
    "34. Accumulated Depreciation till date",
    "35. Net Block (32 + 33 - 34)",
    "OTHER NON-CURRENT ASSETS",
    "36. Investments/book debts/advances/deposits which are not current assets",
    "i.Investment in New Business",
    "ii. Loans & Investments in Group companies/subsidiaries",
    "iii. Non current Investment",
    "iv. Advances for capital goods/contractors",
    "v. Debtors More Than 6 Months (net of provisions)",
    "vi. Deferred receivables (maturity > 1 year)",
    "vii. Others - FD lodged with authorities/margin money",
    "viii. Deferred Tax Assets",
    "ix. Others - Security depo, Disputed IT refund receivable",
    "x. Misc expenditures not written off",
    "xi. Long term loans and advances",
    "xii. Others (MAT CREDIT ENTITLEMENT)",
    "Total Other Non-current Assets (35 + 36)",
    "37. Intangible Assets",
    "Goodwill",
    "Others",
    "Accumulated amortization",
    "38. Total Assets (31 + 35 + 36 + 37)",
    "39. Tangible Net Worth (24 - 37)",
    "40. Adjusted TNW (TNW + Quasi equity)",
    "Unsecured Loans",
    "Unsecured Loans eligible for QE classification",
    "41. Net Working Capital (31 - 7)"
  ];

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
                  <th className="text-left p-2 border-b font-semibold min-w-[300px]">
                    Metric/Year
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
                    <td className="p-2 border-b">
                      <Label className="text-sm">{field}</Label>
                    </td>
                    {years.map(year => (
                      <td key={year} className="p-2 border-b">
                        <Input
                          type="number"
                          step="0.01"
                          className="w-full"
                          value={formData[field]?.[year] || ''}
                          onChange={(e) => updateFormData(field, year, parseFloat(e.target.value) || 0)}
                        />
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
