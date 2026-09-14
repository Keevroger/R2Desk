# R2Desk

Projeto acadêmico de **Service Management**, desenvolvido com foco na criação de um portal para abertura, acompanhamento e gerenciamento de chamados de TI.

O projeto está sendo desenvolvido de forma incremental, com novas funcionalidades sendo adicionadas a cada entrega acadêmica.

## Objetivo do Projeto

Desenvolver uma plataforma de atendimento de TI que permita centralizar solicitações de usuários, organizar os chamados por área responsável e facilitar a comunicação entre o colaborador e a equipe de Tecnologia da Informação.

O R2Desk foi pensado para oferecer uma experiência simples para o solicitante e, ao mesmo tempo, disponibilizar uma visão centralizada para a equipe responsável pelo atendimento.

## Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript
* LocalStorage
* GitHub

## AC1 — Portal de Serviços de TI

A primeira entrega do projeto tem como foco o desenvolvimento da **interface e do fluxo principal do Portal de Serviços do R2Desk**.

### Principais funcionalidades

* Login de Solicitante e Administrador
* Portal do Solicitante
* Dashboard Administrativo
* Modo claro e escuro
* Catálogo de serviços por área
* Abertura de chamados
* Classificação por área, serviço e tipo de solicitação
* Seleção de urgência
* Inclusão e remoção de anexos
* Revisão das informações antes do envio
* Área de Meus Chamados
* Filtros por área e data
* Página individual do chamado
* Interação entre Solicitante e TI
* Central de notificações
* Base de Conhecimento
* Conteúdo de primeiros passos
* Indicadores de prioridade e SLA

### Áreas disponíveis

* Infraestrutura
* Help Desk
* Service Desk
* Sistemas Comerciais
* Sistemas Corporativos
* BI

### Vídeo de apresentação da AC1

> [Assistir à apresentação da AC1 no Google Drive](https://drive.google.com/file/d/1VKXviLLhv4ApCK_ba62hcm517veqNRYX/view?usp=sharing)

## Estrutura do Projeto

```text
R2Desk
│
├── css
│   └── style.css
│
├── js
│   └── app.js
│
├── index.html
│
└── README.md
```

## Desenvolvimento

A primeira versão do R2Desk foi desenvolvida utilizando **HTML5, CSS3 e JavaScript**.

O **HTML5** é responsável pela estrutura das páginas e dos componentes da aplicação.

O **CSS3** é utilizado na construção da interface, organização dos layouts, responsividade e nos modos claro e escuro.

O **JavaScript** é responsável pela lógica e pelas interações do sistema, incluindo login demonstrativo, abertura de chamados, filtros, notificações, navegação entre telas e gerenciamento das informações apresentadas no portal.

Nesta primeira versão, algumas informações são mantidas localmente no navegador utilizando **LocalStorage**.

## Arquitetura do Projeto

Nesta primeira entrega, o foco está na camada de **Front-end**.

A evolução planejada do projeto será baseada em uma arquitetura de três camadas:

```text
Front-end
HTML + CSS + JavaScript
        │
        ▼
Backend / API
        │
        ▼
Banco de Dados
```

As próximas etapas do projeto irão adicionar o Backend e o Banco de Dados, permitindo a persistência real de usuários, chamados, mensagens, notificações e outras informações do sistema.

## Contas de Demonstração

### Solicitante

```text
E-mail: solicitante@r2desk.com
Senha: 123456
```

### Administrador

```text
E-mail: admin@r2desk.com
Senha: admin123
```

As contas acima são utilizadas exclusivamente para demonstração acadêmica do protótipo.

## 📋 Acompanhamento do Projeto

O desenvolvimento e a evolução das entregas podem ser acompanhados através do Board do projeto no GitHub.

> [Acessar Board do Projeto](https://github.com/users/Keevroger/projects/1)

## Evolução do Projeto

* [x] AC1 — Front-end e fluxo do Portal de Serviços
* [ ] AC2 — Backend e API
* [ ] AC3 — Banco de Dados e integração entre as camadas
* [ ] Entrega Final — Integração completa, testes e refinamentos

## Próximas Etapas

* Desenvolvimento do Backend
* Criação de API REST
* Implementação do Banco de Dados
* Autenticação persistente
* Persistência dos chamados
* Persistência das mensagens
* Notificações integradas
* Armazenamento de anexos
* Evolução das regras de SLA

## 👨‍💻 Autor

**Kevin Roger Santos**

Projeto desenvolvido para fins acadêmicos.
