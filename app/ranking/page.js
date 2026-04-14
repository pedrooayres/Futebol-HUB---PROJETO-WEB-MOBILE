import StandingsPreview from "@/components/StandingsPreview";

export default function RankingPage() {
  return (
    <main className="page-shell page-stack">
      <section className="section-banner">
        <div>
          <span className="eyebrow">Ranking Hub</span>
          <h1>Tabela e comparativos</h1>
          <p>
            Secao dedicada para demonstrar o consumo de API externa dentro de uma experiencia mais
            parecida com portal esportivo.
          </p>
        </div>
      </section>

      <StandingsPreview title="Recorte principal do campeonato" limit={6} />
    </main>
  );
}
