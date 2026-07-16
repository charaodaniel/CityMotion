import { Header } from "@/components/layout/header";
import { BookOpen } from "lucide-react";
import Link from "next/link";
function PublicLayout({
  children
}) {
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement(Header, null), /* @__PURE__ */ React.createElement("main", { className: "flex-1" }, children), /* @__PURE__ */ React.createElement("footer", { className: "border-t bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto flex h-14 items-center justify-center" }, /* @__PURE__ */ React.createElement(Link, { href: "/docs", className: "flex items-center text-sm text-muted-foreground hover:text-primary transition-colors" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, "Central de Ajuda")))));
}
export {
  PublicLayout as default
};
