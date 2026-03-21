# X Games Club SP — Assistente Oficial

Chatbot oficial do **X Games Club São Paulo**, o maior clube de esportes radicais da América Latina. Construído com Next.js 15, TypeScript, Tailwind CSS e Claude Sonnet via Anthropic API.

## Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **IA:** Anthropic Claude Sonnet (`claude-sonnet-4-6`) com streaming
- **Ícones:** Lucide React
- **Markdown:** react-markdown

## Funcionalidades

- Chat em tempo real com streaming de respostas
- Base de conhecimento local em Markdown (`data/knowledge.md`)
- Sistema de prompt estruturado com contexto do clube
- Chips de sugestão para perguntas frequentes
- Sidebar responsiva com informações rápidas do clube
- Design dark theme com identidade visual do X Games
- Textarea auto-redimensionável
- Timestamps nas mensagens (hover)
- Indicador de digitação com animação

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave da API Anthropic:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Obtenha sua chave em [console.anthropic.com](https://console.anthropic.com/).

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 4. Build de produção

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
xgames-club-sp/
├── app/
│   ├── api/chat/route.ts    # Endpoint de chat com streaming
│   ├── globals.css          # Estilos globais + animações
│   ├── layout.tsx           # Root layout com metadados
│   └── page.tsx             # Página principal (state management)
├── components/
│   ├── ChatArea.tsx         # Container principal do chat
│   ├── ChatMessage.tsx      # Bolha de mensagem com Markdown
│   ├── InputBar.tsx         # Textarea + botão de envio
│   ├── Sidebar.tsx          # Sidebar com info do clube
│   └── SuggestionChips.tsx  # Chips de perguntas rápidas
├── data/
│   └── knowledge.md         # Base de conhecimento do clube
├── lib/
│   ├── knowledge.ts         # Loader da base de conhecimento
│   └── types.ts             # Tipos TypeScript
└── ...configs
```

## Personalização

### Atualizar informações do clube

Edite `data/knowledge.md` — o arquivo é lido em runtime a cada deploy (com cache em memória). Não é necessário recompilar o projeto para atualizar o conteúdo.

### Alterar sugestões de perguntas

Edite o array `CHIPS` em `components/SuggestionChips.tsx`.

### Mudar modelo de IA

Em `app/api/chat/route.ts`, altere o campo `model`:

```ts
model: "claude-opus-4-6",  // mais poderoso
model: "claude-haiku-4-5-20251001", // mais rápido e econômico
```

### Ajustar comportamento do assistente

Edite a função `buildSystemPrompt()` em `lib/knowledge.ts`.

## Deploy

### Vercel (recomendado)

1. Faça push para um repositório GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Adicione `ANTHROPIC_API_KEY` nas variáveis de ambiente do projeto
4. Deploy automático a cada push

### Outras plataformas

O projeto é um app Next.js padrão compatível com qualquer plataforma que suporte Node.js 18+.

---

Desenvolvido para o **X Games Club São Paulo** 🛹🚵🧗🏄
