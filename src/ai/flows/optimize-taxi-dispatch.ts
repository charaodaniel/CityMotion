'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing taxi dispatch based on real-time demand,
 * traffic conditions, and driver availability.
 *
 * - optimizeTaxiDispatch - A function that takes in demand, traffic, and driver availability data and returns an optimized dispatch plan.
 * - OptimizeTaxiDispatchInput - The input type for the optimizeTaxiDispatch function.
 * - OptimizeTaxiDispatchOutput - The return type for the optimizeTaxiDispatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeTaxiDispatchInputSchema = z.object({
  demandData: z.string().describe('Real-time data on taxi demand in different areas.'),
  trafficConditions: z.string().describe('Real-time traffic conditions across the city.'),
  driverAvailability: z.string().describe('Information on available taxi drivers and their locations.'),
});
export type OptimizeTaxiDispatchInput = z.infer<typeof OptimizeTaxiDispatchInputSchema>;

const OptimizeTaxiDispatchOutputSchema = z.object({
  dispatchPlan: z.string().describe('An optimized taxi dispatch plan detailing which taxis should be sent to which locations.'),
  estimatedWaitTimes: z.string().describe('Estimated wait times for citizens in different areas based on the dispatch plan.'),
  driverUtilization: z.string().describe('Expected driver utilization rates based on the dispatch plan.'),
});
export type OptimizeTaxiDispatchOutput = z.infer<typeof OptimizeTaxiDispatchOutputSchema>;

export async function optimizeTaxiDispatch(input: OptimizeTaxiDispatchInput): Promise<OptimizeTaxiDispatchOutput> {
  return optimizeTaxiDispatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeTaxiDispatchPrompt',
  input: {schema: OptimizeTaxiDispatchInputSchema},
  output: {schema: OptimizeTaxiDispatchOutputSchema},
  prompt: `You are an AI assistant specialized in optimizing taxi dispatch for a city.

  Based on the real-time demand, traffic conditions, and driver availability, create an optimized taxi dispatch plan.
  The goal is to minimize wait times for citizens and maximize driver utilization.

  Demand Data: {{{demandData}}}
  Traffic Conditions: {{{trafficConditions}}}
  Driver Availability: {{{driverAvailability}}}

  Provide a detailed dispatch plan, estimated wait times for citizens, and expected driver utilization rates.
  Ensure that the dispatch plan takes into account traffic conditions and driver availability to avoid delays and inefficiencies.
  Consider historical data and patterns to predict future demand and proactively allocate taxis to areas with high demand.
  Continuously monitor and adjust the dispatch plan based on real-time feedback and changing conditions.

  Format your output as a valid JSON object.
  `,
});

const optimizeTaxiDispatchFlow = ai.defineFlow(
  {
    name: 'optimizeTaxiDispatchFlow',
    inputSchema: OptimizeTaxiDispatchInputSchema,
    outputSchema: OptimizeTaxiDispatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
