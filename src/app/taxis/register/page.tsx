"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  driverName: z.string().min(2, "Driver name must be at least 2 characters."),
  vehicleModel: z.string().min(3, "Vehicle model is required."),
  licensePlate: z.string().min(3, "License plate must be a valid taxi plate.").regex(/^TAXI-\d{3,}/, "Format must be TAXI-XXX"),
  taxiPermit: z.any().refine(files => files?.length == 1, "Taxi permit is required."),
  vehicleInspection: z.any().refine(files => files?.length == 1, "Vehicle inspection document is required."),
});

export default function RegisterTaxiPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        driverName: '',
        vehicleModel: '',
        licensePlate: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Taxi Registration Submitted",
      description: "The taxi registration is pending verification.",
    });
    router.push('/taxis');
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Taxi Registration</CardTitle>
          <CardDescription>Fill out the form below to register a new taxi in the fleet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h3 className="font-headline text-lg font-semibold">Taxi & Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver's Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Carlos Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxi License Plate</FormLabel>
                      <FormControl>
                        <Input placeholder="TAXI-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fiat Cronos 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="font-headline text-lg font-semibold">Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="taxiPermit"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Taxi Permit Document</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*,application/pdf" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleInspection"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Vehicle Inspection Certificate</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*,application/pdf" onChange={(event) => onChange(event.target.files)} {...fieldProps} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">Submit Registration</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
