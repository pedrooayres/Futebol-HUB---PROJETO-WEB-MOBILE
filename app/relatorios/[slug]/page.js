import { notFound } from "next/navigation";

import ReportProfileClient from "@/components/ReportProfileClient";
import { getMarketReportBySlug, marketReports } from "@/lib/football-data";

export function generateStaticParams() {
  return marketReports.map((report) => ({ slug: report.slug }));
}

export default async function MarketReportPage({ params }) {
  const { slug } = await params;
  const report = getMarketReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return <ReportProfileClient report={report} />;
}
