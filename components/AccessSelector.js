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
    reopenSelector,
    logoutRole
  } = useAccess();
  const [adminCode, setAdminCode] = useState("");

  if (!showSelector && role) {
    return (
      <div className="access-control-row">
        <button type="button" className="ghost-button access-switcher" onClick={reopenSelector}>
          Modo: {role === "common" ? "Usuário padrão" : role === "professional" ? "Profissional" : "Admin"}
        </button>
        <button type="button" className="ghost-button access-switcher" onClick={logoutRole}>
          Sair
        </button>
      </div>
    );
  }

  return (
    <>
      {role ? (
        <div className="access-control-row">
          <button type="button" className="ghost-button access-switcher" onClick={reopenSelector}>
            Modo: {role === "common" ? "Usuário padrão" : role === "professional" ? "Profissional" : "Admin"}
          </button>
          <button type="button" className="ghost-button access-switcher" onClick={logoutRole}>
            Sair
          </button>
        </div>
      ) : null}

      {showSelector ? (
        <div className="access-overlay">
          <div className="glass-panel access-modal">
            <p className="panel-tag">Perfil de acesso</p>
            <h2>Como você quer usar o Futebol HUB?</h2>
            <p>
              Escolha a experiência mais adequada. O modo profissional mostra análise aprofundada,
              enquanto o padrão entrega leitura mais direta.
            </p>

            <div className="card-grid">
              <button type="button" className="access-card" onClick={() => chooseRole("common")}>
                <strong>Usuário padrão</strong>
                <span>Resultados, resumo de jogos, leitura simples de time e atleta.</span>
              </button>

              <button type="button" className="access-card" onClick={() => chooseRole("professional")}>
                <strong>Profissional</strong>
                <span>Dados técnicos, análise mais profunda, contexto de mercado e performance.</span>
              </button>
            </div>

            <div className="admin-unlock-box">
              <div>
                <span className="detail-label">Admin</span>
                <p>Use o código de administrador para editar dados, atualizar relatórios e operar o módulo manual.</p>
              </div>

              <div className="admin-unlock-form">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(event) => setAdminCode(event.target.value)}
                  placeholder="Código admin"
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
