import { Suspense } from "react";

import SearchWorkspace from "@/components/SearchWorkspace";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchWorkspace />
    </Suspense>
  );
}
