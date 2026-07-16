"use client";
import { AppProvider } from "@/contexts/app-provider";
function BadgeLayout({
  children
}) {
  return /* @__PURE__ */ React.createElement(AppProvider, null, children);
}
export {
  BadgeLayout as default
};
