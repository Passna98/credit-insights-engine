
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
      metrics: [
        "Total Operating Income",
        "EBITDA", 
        "Depreciation",
        "Interest",
        "Other Income",
        "Extraordinary expense",
        "Profit before tax",
        "Profit after tax",
        "Cash Profits (GCA)"
      ]
    },
    {
      title: "CAPITAL STRUCTURE", 
      metrics: [
        "Tangible networth (TNW)",
        "Total debt",
        "Capital employed",
        "Liquidity (Unencumbered)"
      ]
    },
    {
      title: "KEY RATIOS",
      metrics: [
        "Sales growth",
        "EBITDA Margin",
        "PAT Margin",
        "Return on Capital Employed",
        "Debt Equity ratio", 
        "Interest Coverage Ratio"
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
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  {section.title}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 border-b font-semibold bg-muted min-w-[250px]">
                          Metric
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
                        results[metric] && (
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
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            {/* Additional metrics not in sections */}
            {Object.keys(results).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  OTHER METRICS
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 border-b font-semibold bg-muted min-w-[250px]">
                          Metric
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
