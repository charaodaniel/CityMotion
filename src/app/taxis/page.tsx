import { taxis } from '@/lib/data';
import type { Taxi } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Star } from 'lucide-react';
import Link from 'next/link';

function getStatusVariant(status: Taxi['status']) {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'secondary';
    case 'Maintenance':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function TaxisPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Taxi Fleet Management
            </h1>
            <p className="text-muted-foreground">View, manage, and register taxis.</p>
        </div>
        <Link href="/taxis/register">
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Taxi
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Taxi Fleet</CardTitle>
          <CardDescription>A list of all registered taxis in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Rides Today</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxis.map((taxi) => (
                <TableRow key={taxi.id}>
                  <TableCell className="font-medium">{taxi.licensePlate}</TableCell>
                  <TableCell>{taxi.driverName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {taxi.vehicleModel}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(taxi.status)}>{taxi.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end items-center gap-1">
                    {taxi.rating.toFixed(1)}
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                  </TableCell>
                  <TableCell className="text-right">{taxi.ridesToday}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
