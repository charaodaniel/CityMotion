
import { NextResponse, NextRequest } from 'next/server';
import { schedules } from '@/data/schedules.json';
import { vehicleRequests } from '@/data/vehicle-requests.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  switch (type) {
    case 'schedules':
      return NextResponse.json(schedules);
    case 'vehicle-requests':
      return NextResponse.json(vehicleRequests);
    default:
      // By default or if no type is specified, return schedules
      return NextResponse.json(schedules);
  }
}
