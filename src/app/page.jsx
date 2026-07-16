"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home");
  }, [router]);
  return /* @__PURE__ */ React.createElement(Loading, null);
}
export {
  HomePage as default
};
