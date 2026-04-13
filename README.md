# Futebol HUB

Projeto desenvolvido em Next.js com foco em um dashboard profissional de futebol, integrando:

- Front-end em React/Next com CSS customizado
- CRUD da entidade `ScoutNotes` conectado ao Back4App
- Consumo de API externa para exibir dados de campeonato
- Estrutura pronta para deploy no Vercel

## Integrantes

- Pedro Henrique Mendonca Ayres

## Tema

O **Futebol HUB** foi pensado como uma central de scouting e analise esportiva. O sistema permite cadastrar, editar, listar e excluir observacoes sobre jogadores, enquanto tambem apresenta dados de uma API publica de futebol para enriquecer a experiencia.

## Tecnologias

- Next.js
- React
- CSS puro
- Back4App (Parse REST API)
- API Football Standings

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env.local` com base no `.env.example`.

3. Execute em desenvolvimento:

```bash
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000).

## Back4App

Crie uma classe chamada `ScoutNotes` com os campos:

- `playerName` - String
- `club` - String
- `position` - String
- `rating` - Number
- `status` - String
- `notes` - String

Depois, copie o `App ID` e a `REST API Key` para o arquivo `.env.local`.

Guia rapido detalhado: [docs/back4app-setup.md](C:/Users/pedro/OneDrive/Documents/New%20project/docs/back4app-setup.md)

## Entrega

Na entrega final, anexar:

- Link do repositorio no GitHub
- Link do site publicado no Vercel
- Link do video no YouTube com ate 4 minutos
- PDF com a apresentacao do projeto

Checklist final: [docs/deploy-checklist.md](C:/Users/pedro/OneDrive/Documents/New%20project/docs/deploy-checklist.md)

## Sugestao de demonstracao no video

1. Mostrar a home e explicar o tema.
2. Exibir a integracao com API externa.
3. Criar uma nova observacao de jogador.
4. Editar o registro criado.
5. Excluir o registro.
6. Encerrar mostrando o deploy no Vercel e o repositorio no GitHub.
