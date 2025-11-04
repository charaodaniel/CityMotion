import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import type { Employee } from '@/lib/types';

const jsonDirectory = path.join(process.cwd(), 'src', 'data');
const filePath = path.join(jsonDirectory, 'employees.json');

async function readEmployees(): Promise<Employee[]> {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading employees file:', error);
    return [];
  }
}

async function writeEmployees(data: Employee[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing employees file:', error);
    throw new Error('Failed to write to data file.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, newRole } = body;

    if (!employeeId || !newRole) {
      return new NextResponse('Missing employeeId or newRole', { status: 400 });
    }

    const employees = await readEmployees();
    
    let updatedEmployee: Employee | undefined;
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        updatedEmployee = { ...emp, role: newRole };
        return updatedEmployee;
      }
      return emp;
    });

    if (!updatedEmployee) {
      return new NextResponse('Employee not found', { status: 404 });
    }

    await writeEmployees(updatedEmployees);

    return NextResponse.json({ 
        message: 'Profile updated successfully',
        updatedEmployee: updatedEmployee,
        employees: updatedEmployees // Return the full updated list
    });

  } catch (error) {
    console.error('API /api/profiles Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
