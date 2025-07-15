
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
      title: "1. FINANCIAL PERFORMANCE",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Total Operating Income",
        "EBITDA", 
        "Depreciation",
        "Interest",
        "Other Income",
        "Extraordinary expense",
        "Profit before tax",
        "Current Tax",
        "Deferred Tax",
        "Profit after tax",
        "Cash Profits (GCA)",
        "CFOA",
        "CFOA/EBITDA"
      ]
    },
    {
      title: "2. CAPITAL STRUCTURE", 
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Share Capital",
        "Tangible networth (TNW)",
        "Total debt",
        "- Term debt",
        "- Working capital debt",
        "- Vehicle loans",
        "- Unsecured loans",
        "Capital employed",
        "Liquidity (Unencumbered)",
        "Total outside liabilities (TOL)"
      ]
    },
    {
      title: "3. KEY RATIOS",
      subtitle: "GROWTH RATIOS",
      metrics: [
        "Sales growth",
        "EBITDA growth",
        "PBT growth",
        "PAT growth"
      ]
    },
    {
      title: "4. PROFITABILITY RATIOS",
      subtitle: "",
      metrics: [
        "EBITDA Margin",
        "PBT margin",
        "PAT Margin"
      ]
    },
    {
      title: "5. RETURN RATIOS",
      subtitle: "",
      metrics: [
        "Return on Capital Employed",
        "Return on Equity"
      ]
    },
    {
      title: "6. SOLVENCY RATIOS/COVERAGE RATIOS",
      subtitle: "",
      metrics: [
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
      title: "7. LIQUIDITY RATIOS / TURNOVER RATIOS",
      subtitle: "",
      metrics: [
        "Current Ratio",
        "Average debtor (days)",
        "Average inventory (days)",
        "Average payable (days)",
        "Operating cycle (days)",
        "Fixed Assets Turnover Ratio"
      ]
    },
    {
      title: "8. OTHER DETAILS",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Total current assets",
        "Total current liabilities",
        "Gross Debtors",
        "Inventory",
        "Creditors",
        "Cost of goods sold",
        "Cost of sales",
        "Gross block of Fixed Assets",
        "Gross Debt availed",
        "Capex for creditors",
        "Capex",
        "Repayment of TL",
        "Repayment of Vehicle loans"
      ]
    },
    {
      title: "9. DSCR",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Cash Profits (GCA)",
        "Add: Interest",
        "Cash available for debt servicing (A)",
        "Interest payment",
        "Principal repayment",
        "Total debt servicing (B)",
        "DSCR (A/B)"
      ]
    },
    {
      title: "10. CAPEX AND ITS FINANCING",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Incremental capex",
        "Effect of capex adv. & cred.",
        "Total term debt availed",
        "Funded from term debt",
        "Funded from unsec. loan",
        "Funded from equity infusion",
        "Funded from Internal Accruals"
      ]
    },
    {
      title: "11. DETAILS OF TERM DEBT",
      subtitle: "(Amount in Cr.)",
      metrics: [
        "Opening debt",
        "Add: Debt availed-other",
        "Less: Repayments",
        "Closing debt"
      ]
    },
    {
      title: "12. DETAILS OF VEHICLE LOANS",
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
