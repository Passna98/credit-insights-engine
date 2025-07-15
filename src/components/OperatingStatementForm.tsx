
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
    "1. Gross Sales - Export Sales",
    "1. Gross Sales - Domestic Sales", 
    "1. Gross Sales - Service Sales",
    "1. Gross Sales - Total",
    "2. Less Excise Duty/cess if any",
    "3. Net Sales (1-2)",
    "4. Other operating/revenue income - Rental Income",
    "4. Other operating/revenue income - Other Operating Income 1",
    "4. Other operating/revenue income - Other Operating Income 2",
    "4. Other operating/revenue income - Total",
    "5. Net Operating Income (3+4)",
    "6. Cost of Sales",
    "Raw materials CONSUMED % of sales",
    "i.Raw materials CONSUMED- Imported",
    "Raw materials CONSUMED-Indigenous",
    "Opening stock - Imported",
    "Opening stock - Indigenous",
    "Purchase - Raw Material",
    "Purchase - Trading Purchases",
    "Closing stock - Imported",
    "Closing stock - Indigenous",
    "ii. Other Stores & Spares CONSUMED - Imported",
    "Other Stores & Spares CONSUMED - Indigenous",
    "iii. Power and Fuel",
    "iv. Direct Labour (Factory wages)",
    "v. Other manufacturing expenses",
    "vi. Depreciation",
    "vii. Amortisation",
    "viii. Repairs/maintenance/replacement etc.",
    "ix. Other Mfg exp not covered above",
    "Total Manufacturing Expenses (i to ix)",
    "i. Opening Stock-in-process",
    "ii. Closing Stock-in-process", 
    "Change in Stock-in-process/trade",
    "Cost of Production",
    "i. Opening Stock of finished goods",
    "ii. Closing Stock of finished goods",
    "Change in finished goods stock",
    "Cost of Goods Sold",
    "7. Selling, general and Admin exp",
    "i. Salary and staff expenses, director fee",
    "ii. Rent, Rates and Taxes",
    "iii. Bad Debts",
    "iv. Advertisements and Sales Promotions",
    "v. Freight Outward & Transportation Exp",
    "vi. General & Admin. Expenses",
    "vii. C&F Commission",
    "viii. Other exp- Research & development",
    "ix. Other exp-Royalty on sales",
    "x. Other operating exp",
    "Total Selling Gen & Admin Exp",
    "8. Sub-total (6+7) Cost of sales",
    "9. Operating Profit before Interest (5-8)",
    "10. Finance Charges - Interest on Term Loans",
    "10. Finance Charges - Interest on WCTL and DLOD",
    "10. Finance Charges - Interest on CC",
    "10. Finance Charges - Interest vehicle loans",
    "10. Finance Charges - Bank Charges/Others",
    "11. Operating Profit after Dep & Interest (9-10)",
    "12. Other non-operating Income - Dividends received",
    "12. Other non-operating Income - Extraordinary gains",
    "12. Other non-operating Income - Profit on sale of fixed assets / Investments",
    "12. Other non-operating Income - Gain on Exchange Fluctuations",
    "12. Other non-operating Income - Misc. income/ Write backs etc",
    "12. Other non-operating Income - Interest from subsidiary",
    "12. Other non-operating Income - Other Income",
    "12. Other non-operating Income - Rental Income",
    "12. Other non-operating expenses - Prior Period Items",
    "12. Other non-operating expenses - Extraordinary Losses",
    "12. Other non-operating expenses - Loss on sale of fixed assets",
    "12. Other non-operating expenses - Loss on Exchange Fluctuations",
    "12. Other non-operating expenses - Write Offs/ Misc expenses write offs",
    "12. Other non-operating expenses - Stock Writeoff on account of Covid",
    "12. Other non-operating expenses - Exceptional Items",
    "12. Other non-operating expenses - Others",
    "13. Profit before tax/loss (11+12)",
    "14. Tax - Provision for taxes",
    "14. Tax - Deferred Tax",
    "14. Tax - Previous year adjustments",
    "15. Net Profit / Loss (13-14)",
    "16. Dividend Appropriations - Interim Dividend",
    "16. Dividend Appropriations - Proposed Dividend (Provision)",
    "16. Dividend Appropriations - Tax on dividend",
    "17. Retained Profit – P&L carried to Balance Sheet",
    "18. Inputs for Computing Operating Leverage - Variable Expenses",
    "18. Inputs for Computing Operating Leverage - Fixed Cost",
    "18. Inputs for Computing Operating Leverage - Contribution"
  ];

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
