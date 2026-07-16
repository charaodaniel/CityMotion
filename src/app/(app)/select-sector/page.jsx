"use client";
import { useApp } from "@/contexts/app-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building, Car, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
function SelectSectorPage() {
  const { currentUser, vehicles, employees, setSelectedSector, isLoading } = useApp();
  const router = useRouter();
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 max-w-4xl space-y-8" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "h-10 w-1/2 mx-auto" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "h-8 w-3/4 mx-auto" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-8" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "h-48" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "h-48" }))));
  }
  if (!currentUser || !currentUser.sector || currentUser.sector.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen bg-background" }, /* @__PURE__ */ React.createElement(Card, { className: "w-full max-w-md text-center" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Nenhum Setor Encontrado"), /* @__PURE__ */ React.createElement(CardDescription, null, "Voc\xEA n\xE3o est\xE1 associado a nenhum setor. Entre em contato com um administrador."))));
  }
  if (currentUser.sector.length === 1) {
    setSelectedSector(currentUser.sector[0]);
    router.push("/dashboard");
    return /* @__PURE__ */ React.createElement(Skeleton, { className: "h-screen w-full" });
  }
  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
    router.push("/dashboard");
  };
  const getSectorStats = (sectorName) => {
    const vehicleCount = vehicles.filter((v) => v.sector === sectorName).length;
    const employeeCount = employees.filter((e) => e.sector.includes(sectorName)).length;
    return { vehicleCount, employeeCount };
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 max-w-4xl text-center" }, /* @__PURE__ */ React.createElement(Building, { className: "mx-auto h-16 w-16 mb-4 text-primary" }), /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-bold tracking-tight mb-2" }, "Selecione um Setor"), /* @__PURE__ */ React.createElement("p", { className: "text-lg text-muted-foreground mb-12" }, "Voc\xEA tem permiss\xE3o para gerenciar mais de um setor. Escolha qual deles voc\xEA deseja administrar agora."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-left" }, currentUser.sector.map((sectorName) => {
    const { vehicleCount, employeeCount } = getSectorStats(sectorName);
    return /* @__PURE__ */ React.createElement(
      Card,
      {
        key: sectorName,
        onClick: () => handleSectorSelect(sectorName),
        className: "cursor-pointer hover:border-primary hover:shadow-lg transition-all transform hover:-translate-y-1"
      },
      /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Building, { className: "h-5 w-5" }), sectorName), /* @__PURE__ */ React.createElement(CardDescription, null, "Clique para gerenciar este setor.")),
      /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement(Car, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, vehicleCount, " ", vehicleCount === 1 ? "ve\xEDculo" : "ve\xEDculos")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement(Users, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, employeeCount, " ", employeeCount === 1 ? "funcion\xE1rio" : "funcion\xE1rios")))
    );
  }))));
}
export {
  SelectSectorPage as default
};
