"use client";

import { useState } from "react";

import { useAccess } from "@/components/AccessProvider";

export default function AccessSelector() {
  const {
    showSelector,
    chooseRole,
    unlockAdmin,
    adminLoading,
    adminError,
    role,
    reopenSelector
  } = useAccess();
  const [adminCode, setAdminCode] = useState("");

  if (!showSelector && role) {
    return (
      <button type="button" className="ghost-button access-switcher" onClick={reopenSelector}>
        Modo: {role === "common" ? "Usuario padrao" : role === "professional" ? "Profissional" : "Admin"}
      </button>
    );
  }

  return (
    <>
      {role ? (
        <button type="button" className="ghost-button access-switcher" onClick={reopenSelector}>
          Modo: {role === "common" ? "Usuario padrao" : role === "professional" ? "Profissional" : "Admin"}
        </button>
      ) : null}

      {showSelector ? (
        <div className="access-overlay">
          <div className="glass-panel access-modal">
            <p className="panel-tag">Perfil de acesso</p>
            <h2>Como voce quer usar o Futebol HUB?</h2>
            <p>
              Escolha a experiencia mais adequada. O modo profissional mostra analise aprofundada,
              enquanto o padrao entrega leitura mais direta.
            </p>

            <div className="card-grid">
              <button type="button" className="access-card" onClick={() => chooseRole("common")}>
                <strong>Usuario padrao</strong>
                <span>Resultados, resumo de jogos, leitura simples de time e atleta.</span>
              </button>

              <button type="button" className="access-card" onClick={() => chooseRole("professional")}>
                <strong>Profissional</strong>
                <span>Dados tecnicos, analise mais profunda, contexto de mercado e performance.</span>
              </button>
            </div>

            <div className="admin-unlock-box">
              <div>
                <span className="detail-label">Admin</span>
                <p>Use o codigo de administrador para editar dados, atualizar relatorios e operar o modulo manual.</p>
              </div>

              <div className="admin-unlock-form">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(event) => setAdminCode(event.target.value)}
                  placeholder="Codigo admin"
                />
                <button type="button" className="primary-button" onClick={() => unlockAdmin(adminCode)} disabled={adminLoading}>
                  {adminLoading ? "Validando..." : "Entrar como admin"}
                </button>
              </div>

              {adminError ? <p className="warning">{adminError}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
