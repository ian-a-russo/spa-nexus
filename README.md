# spa-chat

[![CI](https://github.com/ian-a-russo/spa-chat/actions/workflows/ci.yml/badge.svg)](https://github.com/ian-a-russo/spa-chat/actions/workflows/ci.yml)

Interface web de um chat em tempo real com tema cyberpunk. Consome a API [api-chat](https://github.com/ian-a-russo/api-chat).

## Funcionalidades

- Cadastro e login, com a sessão persistida no navegador.
- Lista de conversas ordenada pela atividade mais recente, com prévia da última mensagem.
- Convites: busca de usuários, envio, aceite e recusa, tudo atualizado em tempo real.
- Mensagens instantâneas, indicador de "digitando" e presença online.
- Envio de imagens e vídeos, com pré-visualização antes de enviar.
- Perfil com upload de avatar.

## Stack

| Camada     | Tecnologia                                          |
| ---------- | --------------------------------------------------- |
| Framework  | Vue 3 (`<script setup>`) + TypeScript               |
| UI         | Vuetify 4                                           |
| Estado     | Pinia                                               |
| Roteamento | Vue Router                                          |
| Tempo real | socket.io-client                                    |
| HTTP       | Axios                                               |
| Build      | Vite                                                |
| Qualidade  | Vitest, ESLint, Prettier, `vue-tsc`, GitHub Actions |

## Arquitetura

```
View / Component  →  Store (Pinia)  →  Service (HTTP / Socket)
```

- **Componentes** só cuidam de apresentação e de eventos de interface.
- **Stores** guardam o estado e as regras da interface (`auth`, `chat`, `invites`). Nenhum componente chama o HTTP diretamente.
- **Services** isolam o transporte: `http.ts` (Axios com token e tratamento de 401), `socket.ts` (conexão única) e `realtime.ts`, que traduz os eventos do servidor em ações das stores.
- **Configuração de ambiente** centralizada em `src/config/env.ts`.
- **Erros da API** passam por `apiErrorMessage`, que lê a mensagem do backend sem usar `any`.

```
src/
├── components/chat/   lista de conversas, mensagens, convites, avatar
├── config/            variáveis de ambiente
├── plugins/           tema e configuração do Vuetify
├── router/            rotas e guarda de autenticação
├── services/          HTTP, socket, uploads e eventos em tempo real
├── stores/            auth, chat e invites
├── styles/            tema global
├── types/             modelos compartilhados com a API
├── utils/             funções puras (tempo, cores de avatar, erros)
└── views/             Login, Register e Chat
```

## Como rodar

Pré-requisitos: Node 22+ e a [api-chat](https://github.com/ian-a-russo/api-chat) em execução.

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

### Variáveis de ambiente

Crie um arquivo `.env` apenas se a API não estiver em `http://localhost:3000`.

| Variável       | Descrição                 | Padrão                  |
| -------------- | ------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API REST      | `http://localhost:3000` |
| `VITE_WS_URL`  | URL do servidor Socket.IO | `http://localhost:3000` |

## Scripts

| Comando                | O que faz                          |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento        |
| `npm run build`        | Typecheck e build de produção      |
| `npm run lint:check`   | ESLint sem alterar arquivos        |
| `npm run format:check` | Verifica a formatação com Prettier |
| `npm run typecheck`    | `vue-tsc` sem emitir arquivos      |
| `npm test`             | Testes unitários (Vitest)          |

Os testes cobrem as stores (com HTTP e socket simulados) e as funções utilitárias.
