"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
function Error({
  error,
  reset
}) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen" }, /* @__PURE__ */ React.createElement(Card, { className: "w-full max-w-md" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "font-headline" }, "Something went wrong"), /* @__PURE__ */ React.createElement(CardDescription, null, "An unexpected error occurred. You can try to recover from this error.")), /* @__PURE__ */ React.createElement(CardContent, { className: "flex flex-col gap-4" }, error.message && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, error.message), /* @__PURE__ */ React.createElement(Button, { onClick: () => reset() }, "Try again"))));
}
export {
  Error as default
};
