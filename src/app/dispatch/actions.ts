"use server";

import { optimizeTaxiDispatch, OptimizeTaxiDispatchInput } from "@/ai/flows/optimize-taxi-dispatch";

export async function getDispatchPlan(input: OptimizeTaxiDispatchInput) {
    try {
        const result = await optimizeTaxiDispatch(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: errorMessage };
    }
}
