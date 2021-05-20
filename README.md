<p>
  <img src="https://github.com/jorgeolvr/ConsultaEsperta/raw/master/src/assets/logo-cropped.png" width="30% height="30%">
</p> 

# Acesso ao projeto
                                                                                                                        
https://consulta-esperta.vercel.app/
                                                                                                                        
# Descrição do projeto  

O aplicativo Consulta Esperta é um *Marketplace* na área da saúde, provendo um ambiente para que profissionais de saúde possam difundir e cobrar por seus serviços, gerenciar suas agendas de atendimento e prontuários de pacientes e para que pacientes possam encontrar profissionais de saúde de acordo com sua demanda de especialidade, localização, horário, preço e qualidade de atendimento. Abaixo a descrição dos principais requisitos do aplicativo:


## Requisitos não funcionais

1. O aplicativo deve funcionar em ambiente Web e em dispositivos móveis.
1. O aplicativo deve ser desenvolvido utilizando arquitetura de microserviços e serviços em nuvem para garantir escalabilidade.
1. O aplicativo deve ser desenvolvido utilizando tecnologias que permitam a incorporação de ténicas e modelos de aprendizagem de máquina.

## Requisitos funcionais

Numa primeira versão teremos módulos para as seguintes funcionalidades: autenticação de usuários, atualização de dados cadastrais, busca por profissionais, agendamento e pagamento de consultas, avaliação de atendimento, gestão de agenda.


### Autenticação de usuário
1. O aplicativo de solicitar a autenticação do usuário, aceitando cadastramento de email e senha ou login via redes sociais, como Google e Facebook.

### Atualização de dados cadastrais
1. O aplicativo deve fornecer uma interface para que os usuários completem seus dados cadastrais e possam alterar sua senha e forma de autenticação.
1. Dados cadastrais incluem: CPF, nome completo, email, telefone e formas de pagamento (inclusão de cartões de crédito).

### Busca por profissionais
1. A busca por profissionais pode ser feita por especialidade, localização, faixa de horário, faixa de preço e qualidade de atendimento.
1. Na interface mais simples o usuário indica a especialidade e posteriormente filtra os outros critérios.
1. O retorno da busca é uma lista de profissionais ranqueados de acordo com o rating do profissional e os critérios definidos na busca.
1. Ao clicar em um profissional o usuário deve ser roteado para uma tela de visualização de perfil, com disponibilidade de agenda e valores.

### Marcação de consulta
1. Na tela de perfil do profissional, uma vez selecionada a disponibilidade da agenda o usuário pode consultar o preço da consulta e pode efetuar a marcação sendo que os horários em ambas as agendas ficarão bloqueados após a confirmação do pagamento.
1. O pagamento será efetuado de acordo com o método de pagamento configurado nos dados cadastrais.

### Gestão de agenda
1. Pacientes e profissionais de saúde podem visualizar sua agenda de consultas e solicitar o cancelamento de marcações de consultas.
1. Um sistema de notificação deve alertar pacientes e profissionais sobre a marcação, proximidade da consulta e solicitar confirmação de presença.

### Avaliação de atendimento
1. Profissionais e pacientes devem receber uma solicitação para avaliação de atendimento logo após a confirmação do atendimento.
1. Na avaliação uma nota e um comentário devem ser atribuídos.

### Recomendação de especialidades
1. O paciente pode informar sintomas e receber a sugestão de especialidades associadas aos sintomas ranqueados por relevância.
1. O paciente pode escolher uma especialidade para efetuar a busca pro profissionais.
1. O paciente deve ter acesso ao log de buscas por sintomas com data/hora e sintomas informados.


## Link do projeto no Overleaf

Aqui encontra-se a parte escrita do trabalho de conclusão de curso:

https://pt.overleaf.com/6161418157hwnfddfftnzx

# Desenvolvimento do projeto

Códigos desenvolvidos para o Trabalho de Conclusão de Curso da Pontifícia Universidade Católica de Minas Gerais. É utilizado a linguagem Javascript e framework React.

## Como testar na própria máquina?

Para baixar, basta clonar este repositório na sua máquina:

```sh
git clone https://github.com/wladbrandao/ConsultaEsperta.git
```

## Bibliotecas
As seguintes bibliotecas foram utilizadas na implementação do projeto:

### Web
- [React](https://pt-br.reactjs.org/) - Framework javaScript com foco em criar interfaces de usuário em páginas web
- [Firebase](https://firebase.google.com/) - Backend as a service para aplicações web e mobile do Google
- [Axios](https://github.com/axios/axios) - Cliente para realização de requisições web por meio dos métodos HTTP
- [Moment](https://momentjs.com/) - Framework para manipulação, validação e formatação de datas 
- [Material Design UI](https://material-ui.com/) - Componentes React para um desenvolvimento mais rápido e fácil

### Mobile
- [React Native](https://facebook.github.io/react-native/) - Framework javaScript para desenvolver aplicativos de forma nativa
- [Firebase](https://firebase.google.com/) - Backend as a service para aplicações web e mobile do Google
- [Axios](https://github.com/axios/axios) - Cliente para realização de requisições web por meio dos métodos HTTP
- [Moment](https://momentjs.com/) - Framework para manipulação, validação e formatação de datas 

## Inicialização da aplicação
O *yarn* foi utilizado como gerenciador de pacotes nesse projeto. Se você ainda não possui, digite o comando abaixo no terminal para instalar globalmente:

```sh
npm install -g yarn
```

Após a instalação do *yarn* é necessário instalar todas as dependências do projeto antes prosseguir:

### Dentro da pasta *web*

```
yarn install && yarn start
```

### Dentro da pasta *mobile*
Para usar em um simulador do **iOS** execute:
```
yarn install && npx react-native run-ios
```
Se desejar executar em simulador **android**:
```
yarn install && npx react-native run-android
```
