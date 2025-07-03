# Marquei - Sistema de Agendamento

Sistema de agendamento desenvolvido para gerenciar horários e serviços de forma eficiente.

## 🚀 Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/)

## 📦 Estrutura do Projeto

```
marquei-monorepo/
├── web/                  # Frontend Next.js
│   │─── app/         # Rotas e páginas
│   │─── components/  # Componentes React
│   │─── lib/         # Configurações e utilitários
│   │─── services/    # Serviços e integrações
│   └── public/          # Arquivos estáticos
└── docker/              # Configurações Docker
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- pnpm
- Docker e Docker Compose

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/LucianTavares/agendas.l.a-web.git
cd agendas.l.a-web
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o projeto em desenvolvimento:
```bash
pnpm dev
```

### Usando Docker

Para executar o projeto usando Docker:

```bash
docker-compose up -d
```

## 🔧 Configuração do Ambiente

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria a build de produção
- `pnpm start` - Inicia o servidor de produção
- `pnpm lint` - Executa o linter
- `pnpm test` - Executa os testes

## 📝 Funcionalidades

- [x] Autenticação de usuários
- [x] Dashboard administrativo
- [x] Gerenciamento de agendamentos
- [x] Interface responsiva
- [ ] Integração com WhatsApp
- [ ] Sistema de notificações

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Lucian Tavares** - *Desenvolvimento* - [LucianTavares](https://github.com/LucianTavares)

## 📞 Suporte

Para suporte, abra uma issue no GitHub.
