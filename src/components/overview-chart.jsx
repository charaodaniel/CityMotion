"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { chartData } from "@/lib/data";
function OverviewChart() {
  return /* @__PURE__ */ React.createElement(ChartContainer, { config: {}, className: "h-[350px] w-full" }, /* @__PURE__ */ React.createElement(BarChart, { data: chartData }, /* @__PURE__ */ React.createElement(CartesianGrid, { vertical: false }), /* @__PURE__ */ React.createElement(
    XAxis,
    {
      dataKey: "month",
      tickLine: false,
      tickMargin: 10,
      axisLine: false
    }
  ), /* @__PURE__ */ React.createElement(YAxis, null), /* @__PURE__ */ React.createElement(ChartTooltip, { content: /* @__PURE__ */ React.createElement(ChartTooltipContent, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "rides", fill: "var(--color-chart-1)", radius: 4 }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "drivers", fill: "var(--color-chart-2)", radius: 4 })));
}
export {
  OverviewChart
};
