"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getDispatchPlan } from './actions';
import type { OptimizeTaxiDispatchOutput } from '@/ai/flows/optimize-taxi-dispatch';
import { Loader2, Zap, Clock, Users } from 'lucide-react';

const formSchema = z.object({
  demandData: z.string().min(10, 'Please provide more details on demand.'),
  trafficConditions: z.string().min(10, 'Please provide more details on traffic.'),
  driverAvailability: z.string().min(10, 'Please provide more details on driver availability.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function DispatchClient() {
  const [result, setResult] = useState<OptimizeTaxiDispatchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demandData: 'High demand in downtown and airport areas. Low demand in residential suburbs.',
      trafficConditions: 'Heavy traffic on the main highway. Moderate congestion in the city center.',
      driverAvailability: '50 drivers available. Most are currently in the southern part of the city.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const response = await getDispatchPlan(data);
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Dispatch Parameters</CardTitle>
            <CardDescription>
              Enter real-time information to generate an optimized plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="demandData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demand Data</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., High demand at the stadium due to a game."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trafficConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Accident on the main bridge causing delays."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="driverAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Availability</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 20 drivers finishing shifts in the next hour."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Dispatch Plan
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is crunching the numbers...</p>
          </div>
        )}
        {error && (
            <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                <CardHeader>
                    <CardTitle className="font-headline">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                </CardContent>
            </Card>
        )}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                 <div className="p-3 rounded-full bg-primary/10 text-primary"><Zap className="h-6 w-6"/></div>
                <div>
                    <CardTitle className="font-headline text-xl">Optimized Dispatch Plan</CardTitle>
                    <CardDescription>AI-generated recommendations for taxi allocation.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
                {result.dispatchPlan}
              </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary"><Clock className="h-6 w-6"/></div>
                    <div>
                        <CardTitle className="font-headline text-xl">Estimated Wait Times</CardTitle>
                    </div>
                </CardHeader>
              <CardContent className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
                {result.estimatedWaitTimes}
              </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 rounded-full bg-primary/10 text-primary"><Users className="h-6 w-6"/></div>
                    <div>
                        <CardTitle className="font-headline text-xl">Driver Utilization</CardTitle>
                    </div>
                </CardHeader>
              <CardContent className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
                {result.driverUtilization}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
