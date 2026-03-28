# AjudaCash

Aplicativo React + Vite para controle financeiro pessoal.

## Rodando localmente

```bash
npm install
npm run dev
```

O app abre em `http://localhost:5173`.

## Modos de funcionamento

- Sem Supabase configurado: login, cadastro e dados funcionam em modo local com `localStorage`.
- Com Supabase configurado: autenticacao e persistencia passam a usar banco real.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Copie `.env.example` para `.env`.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. No SQL Editor do Supabase, execute o arquivo [supabase/schema.sql](/Users/lucas/Downloads/AjudaCash/supabase/schema.sql).
5. Rode novamente:

```bash
npm run dev
```

## Validacao

```bash
npm run typecheck
npm run build
```
