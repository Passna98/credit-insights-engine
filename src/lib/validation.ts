import { z } from "zod";

// Financial input validation schema
export const financialInputSchema = z.object({
  value: z.number()
    .min(-9999999999, "Value is too small")
    .max(9999999999, "Value is too large")
    .finite("Value must be a finite number"),
});

// Percentage validation schema  
export const percentageSchema = z.object({
  value: z.number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100%")
    .finite("Percentage must be a finite number"),
});

// Safe division helper
export const safeDivide = (numerator: number, denominator: number): number => {
  if (!denominator || denominator === 0 || !isFinite(denominator)) {
    return 0;
  }
  const result = numerator / denominator;
  return isFinite(result) ? result : 0;
};

// Safe number conversion
export const safeParseFloat = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const parsed = parseFloat(value);
  return isFinite(parsed) ? parsed : 0;
};

// Validate financial input
export const validateFinancialInput = (value: string): { isValid: boolean; parsedValue: number; error?: string } => {
  const parsedValue = safeParseFloat(value);
  
  try {
    financialInputSchema.parse({ value: parsedValue });
    return { isValid: true, parsedValue };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        parsedValue: 0, 
        error: error.errors[0]?.message || "Invalid input" 
      };
    }
    return { isValid: false, parsedValue: 0, error: "Validation failed" };
  }
};

// Validate percentage input
export const validatePercentageInput = (value: string): { isValid: boolean; parsedValue: number; error?: string } => {
  const parsedValue = safeParseFloat(value);
  
  try {
    percentageSchema.parse({ value: parsedValue });
    return { isValid: true, parsedValue };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        parsedValue: 0, 
        error: error.errors[0]?.message || "Invalid percentage" 
      };
    }
    return { isValid: false, parsedValue: 0, error: "Validation failed" };
  }
};