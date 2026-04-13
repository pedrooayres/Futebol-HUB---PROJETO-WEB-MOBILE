# Configuracao do Back4App - Futebol HUB

## 1. Criar a aplicacao

1. Entre no painel do Back4App.
2. Clique em `Build new app`.
3. Escolha a opcao `Backend as a Service`.
4. Defina um nome para a aplicacao, por exemplo `futebol-hub`.

## 2. Criar a classe do CRUD

No painel do banco de dados, crie a classe:

- `ScoutNotes`

Crie os seguintes campos:

- `playerName` - String
- `club` - String
- `position` - String
- `rating` - Number
- `status` - String
- `notes` - String

## 3. Obter as credenciais

No menu `App Settings > Security & Keys`, copie:

- `Application ID`
- `REST API Key`

## 4. Preencher o projeto local

Abra o arquivo [/.env.local](C:/Users/pedro/OneDrive/Documents/New%20project/.env.local) e substitua:

- `coloque_seu_app_id`
- `coloque_sua_rest_api_key`

## 5. Testar localmente

Execute:

```bash
npm run dev
```

Depois:

1. Acesse `http://localhost:3000`
2. Crie uma observacao de jogador
3. Edite a observacao
4. Exclua a observacao

Se tudo estiver certo, os registros vao aparecer na classe `ScoutNotes` dentro do Back4App.
