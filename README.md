# Sistema de Gerenciamento de Pacientes Frontend

Acesse [DEMO] em https://odapp-challenge-app.vercel.app/

## Visão Geral

Este é um aplicativo frontend baseado em React para gerenciar informações de pacientes como teste técnico para a vaga de desenvolvedor na empresa Odapp.

## Recursos

- Lista de Pacientes: Visualize uma lista abrangente de todos os pacientes.
- Adicionar Novo Paciente: Preencha um formulário para adicionar um novo paciente ao sistema.
- Editar Paciente: Atualize as informações de pacientes existentes.
- Autenticação de Usuário: Sistema de login seguro para proteger dados sensíveis.
- Rotas Protegidas: Certas páginas são acessíveis apenas a usuários autenticados.
- Página 404: Página de erro amigável para rotas indefinidas.
- Design Responsivo: Componentes de UI compatíveis com dispositivos móveis.

## Começando

### Pré-requisitos

- Node.js (versão 20 ou superior)
- Gerenciador de pacotes npm ou yarn

### Instalação

- Clone o repositório

```bash
git clone https://github.com/LMPeron/odapp-challenge-app.git
cd odapp-challenge-app
```

- Instale as dependências

```bash
yarn
```

### Executando o Aplicativo

- Inicie o servidor de desenvolvimento

```bash
    npm run dev
```

- Abra o navegador

```bash
    Navegue até http://localhost:3039 para visualizar o aplicativo.
```


## Roteamento

- Rotas Protegidas (Acessíveis apenas quando autenticado)
- / ou /paciente: Exibe a PatientsPage.
- /paciente/novo: Mostra o formulário NewPatient.
- /paciente/editar/:id: Abre o formulário EditPatient para o ID de paciente especificado.

## Rotas Públicas

- /entrar: Renderiza a SignInPage para login do usuário.
- /404: Exibe o componente Page404 para rotas desconhecidas.
