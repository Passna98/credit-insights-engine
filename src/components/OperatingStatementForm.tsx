
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OperatingStatementFormProps {
  years: string[];
  formData: { [key: string]: { [year: string]: number } };
  updateFormData: (field: string, year: string, value: number) => void;
}

export const OperatingStatementForm: React.FC<OperatingStatementFormProps> = ({
  years,
  formData,
  updateFormData
}) => {
  const fields = [
    // 1. Gross Sales
    "1. Gross Sales",
    "1. Gross Sales - i. Export Sales",
    "1. Gross Sales - ii. Domestic Sales",
    "1. Gross Sales - iii. Services Sales",
    "1. Gross Sales - i. Services Sales", // Added as per provided list
    "1. Gross Sales - Total",
    // 2. Less Deductions
    "2. Less Deductions", // Added as per provided list
    "2. Less Excise Duty/cess if any",
    // 3. Net Sales
    "3. Net Sales (1-2)",
    // 4. Other operating/revenue income
    "4. Other operating/revenue income",
    "4. Other operating/revenue income - i. Rental Income",
    "4. Other operating/revenue income - ii. Other Operating Income (Pls specify)",
    "4. Other operating/revenue income - iii. Other Operating Income (Pls specify)",
    "4. Other operating/revenue income - Total",
    // 5. Net Operating Income
    "5. Net Operating Income (3+4)",
    // 6. Cost of Sales
    "6. Cost of Sales",
    "Material consumed % of sales",
    "6. i. Raw materials CONSUMED",
    "6. i. Raw materials CONSUMED - Imported",
    "6. i. Raw materials CONSUMED - Indigenous",
    "Opening stock",
    "Opening stock - Imported",
    "Opening stock - Indigenous",
    "Purchase",
    "Purchase - Raw Material",
    "Purchase - Trading Purchases",
    "Closing stock",
    "Closing stock - Imported",
    "Closing stock - Indigenous",
    "6. ii. Other Stores & Spares CONSUMED",
    "6. ii. Other Stores & Spares CONSUMED - Imported",
    "6. ii. Other Stores & Spares CONSUMED - Indigenous",
    "Power and fuel % of manufacturing sales",
    "6. iii. Power and Fuel",
    "Labour % of manufacturing sales",
    "6. iv. Direct Labour (Factory wages)",
    "6. v. Other manufacturing expenses",
    "6. vi. Repairs/maintenance/replacement etc.",
    "6. vii. Other (Pls specify)",
    "6. viii. Other (Pls specify)",
    "6. ix. Other (Pls specify)",
    "6. x. Other Mfg exp not covered above",
    "Dep % of GFA excl CWIP and Intangibles",
    "6. xi. Depreciation",
    "Amor % of Intangibles",
    "6. xii. Amortisation",
    "Total Mfg Exp (i to ix)",
    "6. i. Opening Stock-in-process",
    "6. ii. Closing Stock-in-process",
    "Change in Stock-in-process/trade",
    "Cost of Production",
    "6. i. Opening Stock of finished goods",
    "6. ii. Closing Stock of finished goods",
    "Change in finished goods stock",
    "Cost of Goods Sold",
    // 7. Selling, general and Admin exp
    "7. Selling, general and Admin exp",
    "Oth expenses % of sales",
    "7. i. Salary and staff expenses, director fee",
    "7. ii. Rent, Rates and Taxes",
    "7. iii. Bad Debts",
    "7. iv. Advertisements and Sales Promotions",
    "7. v. Freight Outward & Transportation Exp",
    "7. vi. General & Admin. Expenses",
    "7. vii. C&F Commission",
    "7. viii. Other exp- Research & development",
    "7. ix. Other exp- Royalty on sales",
    "7. x. Other (Pls specify)",
    "7. xi. Other (Pls specify)",
    "7. xii. Other (Pls specify)",
    "7. xiii. Other (Pls specify)",
    "7. xiv. Other operating exp",
    "Total Selling Gen & Admin Exp",
    // 8. Sub-total (6+7) Cost of sales
    "8. Sub-total (6+7) Cost of sales",
    // 9. Operating Profit before Interest (5-8)
    "9. Operating Profit before Interest (5-8)",
    // 10. Finance Charges
    "10. Finance Charges",
    "10. i. Interest on Term Loans(Link from Repay Sch)",
    "10. ii. Interest on WCTL and DLOD",
    "10. iii. Interest on CC",
    "10. iv. Interest on vehicle loans",
    "10. v. Bank Charges/Others",
    "10. vi. Other (Pls specify)",
    "10. vii. Other (Pls specify)",
    // 11. Operating Profit after Dep & Interest (9-10)
    "11. Operating Profit after Dep & Interest (9-10)",
    // 12. Other non-operating Income
    "12. Other non-operating Income",
    "12. i. Dividends received",
    "12. ii. Extraordinary gains",
    "12. iii. Profit on sale of fixed assets / Investments",
    "12. iv. Gain on Exchange Fluctuations",
    "12. v. Misc. income/ Write backs etc",
    "12. vi. Interest from subsidiary",
    "12. vii. Interest from others",
    "12. viii. Rental Income",
    "12. ix. Other (Pls specify)",
    "12. x. Other (Pls specify)",
    "12. xi. Other (Pls specify)",
    "12. xii. Other (Pls specify)",
    "12. xiii. Other (Pls specify)",
    "12. Sub-total (Income)",
    // 12. Other non-operating expenses
    "12. Other non-operating expenses",
    "12. i. Prior Period Items",
    "12. ii. Extraordinary Losses",
    "12. iii. Loss on sale of fixed assets",
    "12. iv. Loss on Exchange Fluctuations",
    "12. v. Write Offs/ Misc expenses write offs",
    "12. vi. Stock Writeoff on account of Covid",
    "12. vii. Exceptional Items",
    "12. viii. Others (Pls specify)",
    "12. ix. Other (Pls specify)",
    "12. x. Other (Pls specify)",
    "12. xi. Other (Pls specify)",
    "12. xii. Other (Pls specify)",
    "12. xiii. Other (Pls specify)",
    "12. Sub-total (Expenses)",
    "12. Net of other non-operating income/ Exp",
    // 13. Profit before tax/loss (11+12)
    "13. Profit before tax/loss (11+12)",
    // 14. Tax
    "14. Tax",
    "Effective Tax rate",
    "14. i. Provision for taxes",
    "14. ii. Deferred Tax",
    "14. iii. Previous year adjustments",
    "14. Sub Total- Tax",
    // 15. Net Profit / Loss (13-14)
    "15. Net Profit / Loss (13-14)",
    // 16. Dividend Appropriations
    "16. Dividend Appropriations",
    "16. i. Interim Dividend",
    "16. ii. Proposed Dividend (Provision)",
    "16. iii. Tax on dividend",
    "16. Total Dividend Appropriation",
    // 17. Retained Profit- P&L carried to Balance Sheet
    "17. Retained Profit- P&L carried to Balance Sheet",
    // 18. Inputs for Computing Operating Leverage
    "18. Inputs for Computing Operating Leverage",
    "18. Variable Expenses (to be entered manually)",
    "18. Fixed Cost",
    "18. Contribution"
  ];

  const getFieldClass = (field: string) => {
    // Main sections (numbers like "1.", "2.", etc.)
    if (/^\d+\./.test(field) && !field.includes(' - ') && !field.includes('i.') && !field.includes('ii.')) {
      return "font-semibold text-blue-900 bg-blue-50";
    }
    // Sub-sections with roman numerals or letters
    if (field.includes('i.') || field.includes('ii.') || field.includes('iii.') || field.includes('A.')) {
      return "font-medium text-gray-800 pl-4 bg-gray-50";
    }
    // Percentage or calculation fields
    if (field.includes('%') || field.includes('Total') || field.includes('Sub-total') || field.includes('Change in')) {
      return "font-medium text-gray-700 bg-yellow-50";
    }
    // Default styling for other fields
    return "text-gray-600 pl-2";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form II - Operating Statement</CardTitle>
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
                        {field.includes('%') || field.includes('rate') ? (
                          <Input
                            type="number"
                            step="0.01"
                            className="w-full"
                            placeholder="%"
                            value={formData[field]?.[year] || ''}
                            onChange={(e) => updateFormData(field, year, parseFloat(e.target.value) || 0)}
                          />
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
