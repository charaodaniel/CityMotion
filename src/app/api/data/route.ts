
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Helper function to read a JSON file
async function readJsonFile(filename: string) {
    const jsonDirectory = path.join(process.cwd(), 'src', 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, filename), 'utf8');
    return JSON.parse(fileContents);
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  try {
    let data;
    switch (type) {
      case 'schedules':
        data = await readJsonFile('schedules.json');
        break;
      case 'vehicle-requests':
        data = await readJsonFile('vehicle-requests.json');
        break;
      case 'vehicles':
        data = await readJsonFile('vehicles.json');
        break;
      case 'employees':
        data = await readJsonFile('employees.json');
        break;
      case 'sectors':
        data = await readJsonFile('sectors.json');
        break;
      case 'work-schedules':
        data = await readJsonFile('work-schedules.json');
        break;
      case 'all':
        const [schedules, requests, vehicles, employees, sectors, workSchedules] = await Promise.all([
          readJsonFile('schedules.json'),
          readJsonFile('vehicle-requests.json'),
          readJsonFile('vehicles.json'),
          readJsonFile('employees.json'),
          readJsonFile('sectors.json'),
          readJsonFile('work-schedules.json'),
        ]);
        data = { schedules, requests, vehicles, employees, sectors, workSchedules };
        break;
      default:
         return new NextResponse('Please specify a data type to fetch.', { status: 400 });
    }
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Data Error:', error);
    return new NextResponse('Error reading data file.', { status: 500 });
  }
}
