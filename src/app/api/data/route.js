import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
async function readJsonFile(filename) {
  const jsonDirectory = path.join(process.cwd(), "src", "data");
  try {
    const fileContents = await fs.readFile(path.join(jsonDirectory, filename), "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  try {
    let data;
    switch (type) {
      case "schedules":
        data = await readJsonFile("schedules.json");
        break;
      case "vehicle-requests":
        data = await readJsonFile("vehicle-requests.json");
        break;
      case "vehicles":
        data = await readJsonFile("vehicles.json");
        break;
      case "employees":
        data = await readJsonFile("employees.json");
        break;
      case "sectors":
        data = await readJsonFile("sectors.json");
        break;
      case "work-schedules":
        data = await readJsonFile("work-schedules.json");
        break;
      case "maintenance-requests":
        data = await readJsonFile("maintenance-requests.json");
        break;
      case "organizations":
        data = await readJsonFile("organizations.json");
        break;
      case "all":
        const [schedules, requests, vehicles, employees, sectors, workSchedules, maintenanceRequests, organizations] = await Promise.all([
          readJsonFile("schedules.json"),
          readJsonFile("vehicle-requests.json"),
          readJsonFile("vehicles.json"),
          readJsonFile("employees.json"),
          readJsonFile("sectors.json"),
          readJsonFile("work-schedules.json"),
          readJsonFile("maintenance-requests.json"),
          readJsonFile("organizations.json")
        ]);
        data = { schedules, requests, vehicles, employees, sectors, workSchedules, maintenanceRequests, organizations };
        break;
      default:
        return new NextResponse("Please specify a data type to fetch.", { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Data Error:", error);
    return new NextResponse("Error reading data file.", { status: 500 });
  }
}
export {
  GET
};
