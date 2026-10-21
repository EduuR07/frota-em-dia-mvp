# Frota em Dia — MVP de Gestão de Multas

**Menos planilhas. Mais controle.**

O Frota em Dia é um MVP de uma aplicação web voltada à organização e ao acompanhamento de multas de trânsito em pequenas transportadoras.

O projeto foi desenvolvido durante um desafio da **DIO**, utilizando inteligência artificial como apoio na validação da ideia, definição dos requisitos e construção da aplicação com o Lovable.

**Aplicação publicada:** https://frota-interest-hub.lovable.app

## 1. Problema identificado

Durante minha experiência profissional na área de logística, tive contato com processos de controle de multas, acompanhamento de vencimentos e organização de informações administrativas.

Percebi que o uso de planilhas e controles manuais pode dificultar o acompanhamento das infrações, gerar retrabalho e aumentar o risco de perda de prazos.

A partir dessa experiência, surgiu a proposta do Frota em Dia: centralizar informações e simplificar a gestão de multas para pequenas transportadoras.

## 2. Proposta de solução

O Frota em Dia busca oferecer uma interface simples para registrar multas, acompanhar vencimentos e consultar informações importantes.

O MVP também conta com uma landing page para apresentar a proposta comercial e captar interessados.

A intenção é validar o interesse pelo serviço antes de investir no desenvolvimento de uma plataforma completa.

## 3. Análise de mercado — TAM, SAM e SOM

Para a análise inicial, foi considerado o mercado brasileiro de empresas de transporte rodoviário de cargas.

| Indicador | Estimativa |
|---|---|
| TAM | Aproximadamente 237 mil empresas transportadoras ativas no Brasil, como referência de mercado |
| SAM | Aproximadamente 11,9 mil empresas, considerando hipoteticamente 5% do TAM com perfil compatível |
| SOM | Meta exploratória de conquistar 20 clientes no primeiro ano |

Os valores de SAM e SOM são hipóteses de planejamento, não resultados de pesquisa de campo.

**Referência setorial:** Agência Nacional de Transportes Terrestres (ANTT), dados do RNTRC e Relatório de Gestão 2025.

Site: https://www.gov.br/antt/

## 4. Business Model Canvas

| Bloco | Descrição |
|---|---|
| Segmento de clientes | Pequenas transportadoras e gestores de frotas |
| Proposta de valor | Simplificar o controle de multas e vencimentos |
| Canais | Landing page, WhatsApp, indicações e LinkedIn |
| Relacionamento | Atendimento direto e suporte durante o piloto |
| Fontes de receita | Assinatura mensal do serviço |
| Recursos principais | Aplicação web, infraestrutura cloud e conhecimento em logística |
| Atividades principais | Desenvolvimento, suporte e prospecção comercial |
| Parcerias principais | Transportadoras participantes do piloto e provedores de tecnologia |
| Estrutura de custos | Hospedagem, manutenção, atendimento e divulgação |

Como hipótese inicial, foi considerado um preço de R$ 79 mensais, sujeito à validação com potenciais clientes.

## 5. Hipóteses do MVP

O projeto busca investigar três hipóteses principais:

1. Pequenas transportadoras enfrentam dificuldades com o controle manual de multas.
2. Existe interesse em utilizar uma aplicação que centralize multas e vencimentos.
3. Parte dessas empresas estaria disposta a pagar por uma solução simples de gestão.

O MVP permite demonstrar a proposta e captar interessados, mas ainda não comprova demanda comercial ou disposição real de pagamento.

## 6. Funcionalidades implementadas

### Landing page
- Apresentação do produto.
- Explicação dos problemas enfrentados pelas transportadoras.
- Benefícios e funcionamento da solução.
- Formulário para cadastro de interessados.

### Painel administrativo
- Autenticação de usuários com verificação por e-mail.
- Listagem de leads.
- Indicadores de interessados.
- Atualização do status dos leads.

### Controle de multas
- Cadastro de multas.
- Registro de placa, auto de infração, descrição, valor e vencimento.
- Status de multas: Pendente, Paga e Em recurso.
- Indicadores de multas cadastradas, pendentes e próximas do vencimento.
- Visualização dos registros em tabela.
- Controles de edição e exclusão.

### Persistência
- Armazenamento de informações por meio do backend integrado ao projeto.
- Manutenção dos registros e estados após atualização da página.

## 7. Tecnologias utilizadas

- Lovable — construção assistida por inteligência artificial.
- ChatGPT — estruturação da ideia, requisitos e prompts.
- React e TypeScript — desenvolvimento da interface.
- Vite — ambiente de desenvolvimento e build.
- Tailwind CSS — estilização.
- Lovable Cloud — serviços de backend e persistência.
- Git e GitHub — versionamento e documentação.

## 8. Desenvolvimento com IA

O processo foi organizado em etapas.

### Etapa 1 — Ideação

Foi escolhido um problema relacionado à minha experiência em logística: o controle manual de multas e vencimentos.

### Etapa 2 — Validação preliminar

Com apoio do ChatGPT, foram estruturados:
- Problema e público-alvo.
- Proposta de valor.
- Estimativas de TAM, SAM e SOM.
- Business Model Canvas.
- Hipóteses comerciais.

### Etapa 3 — Mega prompt inicial

O prompt inicial solicitou ao Lovable:

- Criação de uma landing page responsiva.
- Identidade visual em azul petróleo, verde e branco.
- Formulário de interesse.
- Armazenamento de leads.
- Painel administrativo com autenticação.
- Gerenciamento de interessados.

A proposta foi manter o escopo reduzido para economizar créditos e priorizar um MVP funcional.

### Etapa 4 — Evolução do MVP

Após analisar a primeira versão, foi identificada a necessidade de demonstrar a funcionalidade central do negócio.

Foi solicitado um segundo módulo para controle de multas, incluindo cadastro, edição, exclusão, status e indicadores de vencimento.

### Etapa 5 — Testes e avaliação

Foram realizados testes manuais durante o desenvolvimento, incluindo:

- Envio de formulário e consulta do lead no painel.
- Alteração de status do lead.
- Verificação da persistência do status após atualização.
- Cadastro de uma multa fictícia.
- Conferência dos indicadores de multas.
- Identificação de multa próxima do vencimento.
- Teste de autenticação com verificação por e-mail.

Também foi identificado um problema visual de baixo contraste no indicador de vencimento, registrado como melhoria futura.

Os testes não substituem uma auditoria completa de segurança.

## 9. O que ficou manual de propósito?

Para evitar complexidade desnecessária antes da validação comercial, algumas atividades permaneceram fora da automação:

- Negociação com interessados.
- Fechamento de contratos.
- Cobrança e envio de links de pagamento.
- Consulta de infrações em órgãos oficiais.
- Envio de lembretes aos clientes.

A proposta é validar a necessidade e o interesse antes de automatizar essas operações.

## 10. Melhorias futuras

- Cadastro de motoristas e veículos.
- Vinculação de multas a transportadoras.
- Importação de planilhas.
- Filtros e relatórios avançados.
- Notificações automáticas de vencimento.
- Integração com WhatsApp.
- Pagamentos e assinaturas.
- Portal individual para cada cliente.
- Melhorias de acessibilidade e contraste visual.

## 11. Executando localmente

Pré-requisito: Node.js instalado.

```bash
git clone https://github.com/EduuR07/frota-em-dia-mvp.git
cd frota-em-dia-mvp
npm install
npm run dev
```

A execução local de funcionalidades conectadas ao backend depende da configuração adequada das variáveis de ambiente e dos serviços utilizados.

Nunca publique senhas, tokens privados ou chaves de serviço no repositório.

## 12. Resultados e aprendizados

O desenvolvimento do Frota em Dia permitiu aplicar conceitos de:

- MVP e validação de hipóteses.
- Modelagem de negócios.
- Business Model Canvas.
- Engenharia de prompts.
- Desenvolvimento assistido por IA.
- Interfaces responsivas.
- Autenticação e persistência de dados.
- Testes funcionais.
- Versionamento com GitHub.

O principal aprendizado foi compreender que um MVP não precisa conter todas as funcionalidades de um produto final. Seu objetivo é testar uma proposta de valor com o menor investimento possível.

O projeto representa uma primeira versão funcional, ainda sujeita a melhorias e validação com potenciais clientes.


## Demonstração do MVP

### Landing page

Apresentação da proposta de valor do Frota em Dia, destacando os problemas enfrentados pelas pequenas transportadoras e os benefícios da solução.

![Landing page do Frota em Dia](screenshots/landing-page.png)

### Painel de leads

Área administrativa para acompanhamento dos interessados cadastrados por meio do formulário.

![Painel de leads](screenshots/painel-leads.png)

### Controle de multas

Módulo de gerenciamento de multas, com informações sobre infrações, valores, vencimentos e status.

![Controle de multas](screenshots/controle-multas.png)

## 13. Autor

**Eduardo Rodrigues Bueno**

Estudante de Análise e Desenvolvimento de Sistemas — Universidade Positivo.

GitHub: https://github.com/EduuR07

LinkedIn: https://www.linkedin.com/in/eduardobueno07/

---

Desenvolvido como parte de um desafio prático da DIO, explorando inteligência artificial como apoio à criação e validação de produtos digitais.
