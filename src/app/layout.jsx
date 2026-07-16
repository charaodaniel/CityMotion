"use client";
import { AppProvider } from "@/contexts/app-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { LGPDBanner } from "@/components/lgpd-banner";
import { PWAInstaller } from "@/components/pwa-installer";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
function RootLayout({
  children
}) {
  return /* @__PURE__ */ React.createElement("html", { lang: "pt-BR", suppressHydrationWarning: true }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", { name: "application-name", content: "CityMotion" }), /* @__PURE__ */ React.createElement("meta", { name: "apple-mobile-web-app-capable", content: "yes" }), /* @__PURE__ */ React.createElement("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }), /* @__PURE__ */ React.createElement("meta", { name: "apple-mobile-web-app-title", content: "CityMotion" }), /* @__PURE__ */ React.createElement("meta", { name: "format-detection", content: "telephone=no" }), /* @__PURE__ */ React.createElement("meta", { name: "mobile-web-app-capable", content: "yes" }), /* @__PURE__ */ React.createElement("meta", { name: "theme-color", content: "#09090b" }), /* @__PURE__ */ React.createElement("link", { rel: "manifest", href: "/manifest.webmanifest", crossOrigin: "use-credentials" })), /* @__PURE__ */ React.createElement("body", { className: cn("font-sans antialiased", inter.variable) }, /* @__PURE__ */ React.createElement(AppProvider, null, children, /* @__PURE__ */ React.createElement(Toaster, null), /* @__PURE__ */ React.createElement(LGPDBanner, null), /* @__PURE__ */ React.createElement(PWAInstaller, null))));
}
export {
  RootLayout as default
};
