
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  const jsonDirectory = path.join(process.cwd(), 'src', 'data');

  try {
    let data;
    switch (type) {
      case 'schedules':
        const schedulesFile = await fs.readFile(path.join(jsonDirectory, 'schedules.json'), 'utf8');
        data = JSON.parse(schedulesFile);
        break;
      case 'vehicle-requests':
        const requestsFile = await fs.readFile(path.join(jsonDirectory, 'vehicle-requests.json'), 'utf8');
        data = JSON.parse(requestsFile);
        break;
      default:
        // By default or if no type is specified, return schedules
        const defaultSchedulesFile = await fs.readFile(path.join(jsonDirectory, 'schedules.json'), 'utf8');
        data = JSON.parse(defaultSchedulesFile);
        break;
    }
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Data Error:', error);
    return new NextResponse('Error reading data file.', { status: 500 });
  }
}
