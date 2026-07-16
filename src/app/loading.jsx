import { Skeleton } from "@/components/ui/skeleton";
function Loading() {
  return /* @__PURE__ */ React.createElement("div", { className: "p-8 pt-6 space-y-4" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "h-28" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "h-28" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "h-28" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "h-28" })), /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "col-span-4 h-80" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "col-span-4 lg:col-span-3 h-80" })));
}
export {
  Loading as default
};
