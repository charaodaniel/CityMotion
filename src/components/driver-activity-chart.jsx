"use client";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { driverActivity } from "@/lib/data";
function DriverActivityChart() {
  return /* @__PURE__ */ React.createElement(ChartContainer, { config: {}, className: "h-[350px] w-full" }, /* @__PURE__ */ React.createElement(
    LineChart,
    {
      data: driverActivity,
      margin: { top: 5, right: 20, left: -10, bottom: 5 }
    },
    /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", vertical: false }),
    /* @__PURE__ */ React.createElement(XAxis, { dataKey: "time" }),
    /* @__PURE__ */ React.createElement(YAxis, null),
    /* @__PURE__ */ React.createElement(ChartTooltip, { content: /* @__PURE__ */ React.createElement(ChartTooltipContent, null) }),
    /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "activeDrivers", stroke: "var(--color-chart-1)", strokeWidth: 2 }),
    /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "onRide", stroke: "var(--color-chart-2)", strokeWidth: 2 })
  ));
}
export {
  DriverActivityChart
};
