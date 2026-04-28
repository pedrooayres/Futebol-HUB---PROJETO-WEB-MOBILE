import { Suspense } from "react";

import ScoutingWorkspace from "@/components/ScoutingWorkspace";

export default function ScoutingPage() {
  return (
    <Suspense fallback={null}>
      <ScoutingWorkspace
        title="Mesa de scouting"
        subtitle="Ambiente de trabalho para registrar relatorios, priorizar atletas, montar shortlist e exportar fichas para decisao tecnica."
      />
    </Suspense>
  );
}
