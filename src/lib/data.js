import { chartData as chartDataJson, driverActivity as driverActivityJson } from "@/data/charts.json";
const sectors = [];
const employees = [];
const vehicles = [];
const workSchedules = [];
const schedules = [];
const vehicleRequests = [];
const chartData = chartDataJson;
const driverActivity = driverActivityJson;
const timeToDestination = [
  { zone: "A", time: 12 },
  { zone: "B", time: 8 },
  { zone: "C", time: 15 },
  { zone: "D", time: 7 },
  { zone: "E", time: 10 }
];
export {
  chartData,
  driverActivity,
  employees,
  schedules,
  sectors,
  timeToDestination,
  vehicleRequests,
  vehicles,
  workSchedules
};
