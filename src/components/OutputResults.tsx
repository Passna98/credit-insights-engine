
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface OutputResultsProps {
  years: string[];
  results: { [key: string]: { [year: string]: number } };
}

export const OutputResults: React.FC<OutputResultsProps> = ({ years, results }) => {
  const formatNumber = (num: number): string => {
    if (num === 0) return '0.00';
    return num.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getRowColor = (metric: string): string => {
    if (metric.includes('Growth') || metric.includes('Margin') || metric.includes('Return')) {
      return 'bg-green-50 dark:bg-green-950/20';
    }
    if (metric.includes('Debt') || metric.includes('Interest')) {
      return 'bg-red-50 dark:bg-red-950/20';
    }
    if (metric.includes('EBITDA') || metric.includes('Profit')) {
      return 'bg-blue-50 dark:bg-blue-950/20';
    }
    return '';
  };

  const sections = [
    {
      title: "FINANCIAL PERFORMANCE",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Total Operating Income",
        "EBITDA",
        "Depreciation",
        "Interest",
        "Other Income",
        "Other expense",
        "Profit before tax",
        "Current Tax",
        "Deferred Tax",
        "Profit after tax",
        "Cash Profits (GCA)",
        "CFOA"
      ]
    },
    {
      title: "CAPITAL STRUCTURE",
      subtitle: "",
      metrics: [
        "Share Capital",
        "Tangible Net Worth (TNW)",
        "Unsecured loan (Quasi eq.)",
        "Total debt",
        "Term debt",
        "WCTL",
        "Working capital debt",
        "Vehicle loans",
        "Unsecured loans",
        "SBLC/BG",
        "Capital employed",
        "Liquidity (Unencumbered)",
        "Liquidity (Encumbered)",
        "Investments",
        "Group companies",
        "Others",
        "Total outside liabilities (TOL)"
      ]
    },
    {
      title: "KEY RATIOS",
      subtitle: "GROWTH RATIOS",
      metrics: [
        "Sales growth",
        "EBITDA growth",
        "PBT growth",
        "PAT growth"
      ]
    },
    {
      title: "PROFITABILITY RATIOS",
      subtitle: "",
      metrics: [
        "EBITDA Margin",
        "PBT Margin",
        "PAT Margin"
      ]
    },
    {
      title: "RETURN RATIOS",
      subtitle: "",
      metrics: [
        "Return on Capital Employed",
        "Return on Equity"
      ]
    },
    {
      title: "SOLVENCY RATIOS/COVERAGE RATIOS",
      subtitle: "",
      metrics: [
        "Average cost of borrowing",
        "Cash Profits/Debt Repay",
        "Debt Equity ratio",
        "Overall gearing",
        "TOL/TNW",
        "Interest Coverage Ratio",
        "Debt Service Coverage Ratio",
        "Total debt/Cash Profits",
        "Term debt/Cash Profits",
        "Total debt/EBITDA (Lev.)"
      ]
    },
    {
      title: "LIQUIDITY RATIOS / TURNOVER RATIOS",
      subtitle: "",
      metrics: [
        "Sales/WC debt",
        "Avg WC Utilisation",
        "Current Ratio",
        "Debtor (days)",
        "Inventory (days)",
        "Payable (days)",
        "Operating cycle (days)",
        "Adj. Debtor (days) (incl adv to supp)",
        "Inventory (days)",
        "Adj. payable (days) (incl adv from cust)",
        "Adj. operating cycle (days)",
        "Gross Current Asset (days)",
        "Fixed Assets Turnover Ratio"
      ]
    },
    {
      title: "OTHER DETAILS",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Total current assets",
        "TCA except free liquidity",
        "Total current liabilities",
        "TCL except fin liab",
        "Net WC",
        "Gross Debtors",
        "Advance to Suppliers",
        "Inventory",
        "Creditors",
        "Advance from Customers",
        "Cost of goods sold",
        "Cost of sales",
        "A Gross FA incl CWIP",
        "B Capex advance",
        "C Creditors for capex",
        "Capex (A1+B1+C1-A0-B0-C0)",
        "Gross Debt availed",
        "Net block of Fixed Assets",
        "Repayment of TL",
        "Repayment of Vehicle loans",
        "Repayment of WCTL"
      ]
    },
    {
      title: "DSCR",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Cash Profits (GCA)",
        "Add: Interest",
        "Less: Internal Accruals",
        "Cash available for debt servicing (A)",
        "Interest payment",
        "Principal repayment",
        "Total debt servicing (B)",
        "DSCR (A/B)"
      ]
    },
    {
      title: "CAPEX AND ITS FINANCING",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "FATR to compare with capex",
        "% TL to capex",
        "Incremental capex",
        "Total term debt availed",
        "Funded from term debt",
        "Funded from unsec. loan",
        "Funded from other source (Specify)",
        "Funded from Internal Accruals"
      ]
    },
    {
      title: "DETAILS OF TERM DEBT",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Opening debt",
        "Add: Debt availed-other",
        "Less: Repayments",
        "Closing debt"
      ]
    },
    {
      title: "DETAILS OF VEHICLE LOANS",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Opening debt",
        "Add: Debt availed-other",
        "Less: Repayments",
        "Closing debt"
      ]
    },
    {
      title: "DETAILS OF WCTL",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Opening debt",
        "Add: Debt availed-other",
        "Less: Repayments",
        "Closing debt"
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Output Results
          <Badge variant="secondary">{Object.keys(results).length} metrics</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-primary">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground italic">
                      {section.subtitle}
                    </p>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 border-b font-semibold bg-muted min-w-[250px]">
                          Particulars
                        </th>
                        {years.map(year => (
                          <th key={year} className="text-center p-3 border-b font-semibold bg-muted min-w-[120px]">
                            {year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.metrics.map((metric, index) => (
                        <tr key={index} className={`hover:bg-muted/50 ${getRowColor(metric)}`}>
                          <td className="p-3 border-b font-medium">
                            {metric}
                          </td>
                          {years.map(year => (
                            <td key={year} className="p-3 border-b text-right font-mono">
                              {results[metric] && results[metric][year] !== undefined 
                                ? formatNumber(results[metric][year])
                                : '-'
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            {/* Additional metrics not in predefined sections */}
            {Object.keys(results).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  OTHER CALCULATED METRICS
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 border-b font-semibold bg-muted min-w-[250px]">
                          Particulars
                        </th>
                        {years.map(year => (
                          <th key={year} className="text-center p-3 border-b font-semibold bg-muted min-w-[120px]">
                            {year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(results)
                        .filter(metric => !sections.some(section => section.metrics.includes(metric)))
                        .map((metric, index) => (
                          <tr key={index} className={`hover:bg-muted/50 ${getRowColor(metric)}`}>
                            <td className="p-3 border-b font-medium">
                              {metric}
                            </td>
                            {years.map(year => (
                              <td key={year} className="p-3 border-b text-right font-mono">
                                {results[metric][year] !== undefined 
                                  ? formatNumber(results[metric][year])
                                  : '-'
                                }
                              </td>
                            ))}
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
