import { z } from 'zod/v4';

export const payrollSchema = z.object({
	grossSalary: z.number().default(15000),
	nightDiff: z.number(),
	otPercentage: z.number().default(125),
	otHrs: z.number().default(3),
	ot: z.number(),
	sssPercentage: z.number().default(9),
	sssEmployeeDeduction: z.number(),
	sssEmployerDeduction: z.number(),
	// pagibigPercentage: z.number().default(7),
	pagibigEmployeeDeduction: z.number(),
	pagibigEmployerDeduction: z.number(),
	philhealthPercentage: z.number().default(5),
	philhealthEmployeeDeduction: z.number(),
	philhealthEmployerDeduction: z.number(),
	totalDeductions: z.number(),
	totalOvertime: z.number(),
	totalNetIncome: z.number()
});

export type PayrollSchema = z.infer<typeof payrollSchema>;
