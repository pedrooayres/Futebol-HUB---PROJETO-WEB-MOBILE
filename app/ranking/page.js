import { Suspense } from "react";

import StandingsFullDashboard from "@/components/StandingsFullDashboard";

export default function RankingPage() {
  return (
    <main className="page-shell page-stack">
      <Suspense fallback={null}>
        <StandingsFullDashboard />
      </Suspense>
    </main>
  );
}
