# Plataforma de Delivery

O **Delivery** é uma plataforma de código aberto que permite a personalização completa com a marca e identidade visual do seu restaurante ou mais restaurantes. Similar aos principais apps do mercado, possibilita que restaurantes estabeleçam um canal de vendas diretas, eliminando intermediários e proporcionando uma experiência de compra mais próxima aos usuários. Isso não apenas reduz custos desnecessários, mas também simplifica a gestão do estabelecimento.

_Discord: anypercent__ fique a vontade para esclarecer duvidas!<br/>
_Fique a vontade para Adicionar, Modificar, Comercializar e Distribuir!_ <br/>
_Contribuições são sempre bem-vindas!_

##### <a href="https://github.com/carloshomar/appdelivery/issues">Backlog e Andamento do Projeto</a>

#### Videos

<a target="_blank" href="./Arquitetura/video2.mp4">Video - Fazendo um pedidio, aceitando e produzindo o pedido, e realizando entrega (fluxo com todos os APPs)</a>


<a target="_blank" href="./Arquitetura/video1.mp4">Video - Utilizando o App de Comida</a>


#### App de Comida

<img src="./Arquitetura/IMG_9734.PNG" alt="IMG1" width="200"></img>
<img src="./Arquitetura/IMG_9735.PNG" alt="IMG2" width="200"></img>
<img src="./Arquitetura/IMG_9736.PNG" alt="IMG3" width="200"></img>
<img src="./Arquitetura/IMG_9737.PNG" alt="IMG4" width="200"></img>
 
#### Web Restaurante

<img src="./Arquitetura/web_1.png" alt="web1" ></img>
_Kanban de fluxo de trabalho do restaurante, responsiva para celulares e computadores_

#### Gestor de Cardápio

<img src="./Arquitetura/web_2.png" alt="web2"  ></img>
_Gestor de cardápio para criação e alteração de produtos._

#### App de Entregas:

<img src="./Arquitetura/IMG_9967.PNG" alt="IMG2" width="200"></img>
<img src="./Arquitetura/IMG_9966.PNG" alt="IMG4" width="200"></img>
<img src="./Arquitetura/IMG_9964.PNG" alt="IMG3" width="200"></img>
<img src="./Arquitetura/IMG_0165.PNG" alt="IMG3" width="200"></img>

## Principais Características

- **Modos de estabelecimentos**: Existe o modo **unique** que deixa o app focado em um estabelecimento e também o modo **multi** que lista os estabelecimentos presentes no servidor, no <a href="Frontend/AppComida/config/config.tsx">arquivo de configurações</a> você pode selecionar o estilo desejado.

- **Personalização Total:** Coloque sua marca e identidade visual no sistema, transformando-o em uma extensão exclusiva do seu restaurante.
- **Vendas Diretas:** Elimine intermediários e suas taxas, oferecendo aos clientes uma experiência de compra mais acessível.

- **Gestão Simplificada:** Mantenha e simplifique a gestão do estabelecimento com a facilidade de operar o sistema.

- **Uso Próprio de Entregadores:** O sistema não gerencia a entrega, permitindo o uso de entregadores próprios para garantir uma experiência de entrega de alta qualidade.

- **Arquitetura Eficiente:** O servidor foi projetado para suportar um ou mais aplicativos simultaneamente, permitindo a divisão de custos e manutenção simplificada em larga escala.

## Técnico

Um servidor tem a capacidade de executar simultaneamente _N_ aplicativos. Dessa forma, torna-se viável reduzir os custos do servidor, necessitando apenas de um servidor para sustentar toda a infraestrutura de aplicativos.

### Arquitetura:

![image info](./Arquitetura/Diagrama%20de%20Arquitetura-5.drawio-2.png)

_Uma arquitetura baseada em microserviços_

### Back-end / Infra:

- Arquitetura baseada em microsserviços, permitindo a adição de novos serviços na linguagem desejada.
- Utiliza GoLang devido à sua performance e baixo consumo de recursos.
- O GoLang utiliza também o Fiber como framework API.
- Implementado em Docker, facilitando a inicialização do servidor sem exigir amplo conhecimento técnico.

### App Entregas e App Comida:

- Desenvolvido em React Native e Expo, possibilitando a publicação na App Store e Google Play.
- Utiliza o Expo para build gratuito na nuvem, dispensando a necessidade de um MacOS, especialmente para iOS.


## Como Rodar Backend

_É importante já ter o docker instalado no sistema operacional._
_Somente o backend inicia via docker, as aplicações frontend devem ser rodadas separadamente._

Rode no terminal:
```bash
cd ./Backend
```

```bash
docker compose up --build
```

As credenciais de banco estão presentes no docker-compose.yml.
<br/>
_Para fazer o deploy é só seguir os passos que o <a href="/Backend/docker-compose.yml">docker-compose.yml</a> faz._

###
#### Rodar um serviço em especifico (opcional):

Para rodar os microserviços separadamente você precisa já ter o GoLang instalado em sua maquina, acessar a pasta do microsserviço pelo terminal e utilizar:

```bash
go mod tidy
go install
```

Para rodar:

```bash
go run main.go
```


## Como rodar o Frontend:

No arquivo <a href="Frontend/docker-compose.yml">Frontend/docker-compose.yml</a>, faça alterações na URL do backend, presente na variável `API_BASE_URL`. Você pode utilizar o ipconfig/ifconfig para obter o endereço IP local da máquina junto com a porta na qual o aplicativo está rodando, e então alterar a URL.

Ainda no arquivo <a href="Frontend/docker-compose.yml">Frontend/docker-compose.yml</a>, adicione as credenciais de acesso do Expo nas variáveis `EXPO_USERNAME` e `EXPO_PASSWORD`. Para obtê-las, basta se cadastrar em: <a href="https://expo.dev">https://expo.dev</a>. Adicione também seu IP local na variável `EXPO_QR_GEN` para que os QR codes dos apps sejam gerados corretamente.

Nos arquivos <a href="Frontend/AppComida/services/api.tsx">Frontend/AppComida/services/api.tsx</a>, <a href="Frontend/AppEntrega/services/api.tsx">Frontend/AppEntrega/services/api.tsx</a> e <a href="Frontend/WebRestaurant/src/services/api.js">Frontend/WebRestaurant/src/services/api.js</a>, faça alterações na URL para apontar para o backend que você subiu.


_É importante já ter o docker instalado no sistema operacional._

Rode no terminal:

```bash
cd ./Frontend
```
```bash
docker compose up --build
```

O console vai exibir dois QRCodes para abrir os apps via Expo, e o painel WebRestaurante pode ser aberto usando http://localhost:3000.

###
#### Rodar um fronted em especifico (opicional):

_Tenha o node instalado na sua maquina, no caso eu utilizei a v20.13.1_

Nos 3 projetos de front-end (WEBRestaurante, AppComida, AppEntregas) existem arquivos no caminho _services/api.tsx_ ou _services/api.ts_ que precisam sofrer alterações da URL para apontar o backend/servidor que subiu. Utilizando Ipconfig/Ifconfig você precisa pegar o endereço IP ou DNS do servidor, juntamente com a porta em que está rodando o backend (docker).

_O processo de alteração de URL deve ser realizado nas 3 aplicações, WEBRestaurante, AppComida, AppEntregas._


<b>_Na parte WEB, em caso de não conseguir logar ou estiver tendo erro de CORS, considere instalar uma <a href="https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=pt-BR">extensão que desabilita CORS no seu navegador</a>, ou inicialize o mesmo sem essa politica._</b>

Instalando dependências.

```bash
npm install
```

Para rodar:

```bash
npm start
```

_Baixe o App do EXPO, no seu celular, pela loja de aplicativos e esteja conectado na mesma rede que o seu computador, o aplicativo será visto por toda rede interna enquando estiver em desenvolvimento._



### Não necessários para rodar

#### Rodar um serviço em especifico:

Para rodar os microserviços separadamente você precisa já ter o GoLang instalado em sua maquina, acessar a pasta do microsserviço pelo terminal e utilizar:

```bash
go mod tidy
go install
```

Para rodar:

```bash
go run main.go
```
## Configuração do Estabelecimento

Tendo postman na sua maquina, é só importar a biblioteca de requests presentes na pasta _Backend/docs/delivery.postman_collection.json_ no qual você terá acesso a uma mini documentação dos endpoints e formatos esperados pela API.

#### Configure o Modo:

No arquivo <a href="Frontend/AppComida/config/config.tsx">_Frontend/AppComida/config/config.tsx_</a> altere a variavel **APP_MODE** para **.unique** ou **.multi**.

- Unique: Para quando o app é voltado somente para 1 unico restaurante, neste caso ele consome da variavel estatica **ESTABLISHMENT**, também presente no arquivo.

- Multi: Para quando o app deve comportar todos os restaurantes cadastrados no servidor, e fornece a possibilidade do usuário selecionar o restaurante que bem deseja.

#### Cadastrar Estabelecimento:

- Auth / Create User & Establishment  **_(Fique atento a geolocalização do estabelecimento, para o calculo correto de entrega)_**
- Product & Order / Delivery / Alter Taxe Delivery
- Product & Order / Products / Create Multi Products  <b>_(Pode ser feito pela aplicação WEBRestaurante)_</b>
- Product & Order / Additional / Create Additional  <b>_(Pode ser feito pela aplicação WEBRestaurante)_</b>
- Product & Order / Additional / Vinculo Additional Products  <b>_(Pode ser feito pela aplicação WEBRestaurante)_</b>

#### Cadastrar Entregador:

- Cada entregador deve estar devidamente cadastrado, no próprio AppEntregas tem uma pagina de cadastro básica, somente para uso de testes.


#### Configuração de APPComida:

- No arquivo <a href="Frontend/AppComida/config/config.tsx">_Frontend/AppComida/config/config.tsx_</a>, na propriedade _ESTABLISHMENT_, modifique o objeto com as informações desejadas, incluindo logotipos e coordenadas geográficas do estabelecimento (para cálculos de distância).
- No mesmo arquivo, <a href="Frontend/AppComida/config/config.tsx">_Frontend/AppComida/config/config.tsx_</a>, atualize a propriedade _ESTABLISHMENT_ID_ com o identificador gerado durante o cadastro do estabelecimento _(REQUEST: Auth / Create User & Establishment)_.


#### Eventos do Pedido (RabbitMQ)

- Quando o pedido é feito pelo app de comida e aprovado pelo estabelecimento, ele é publicada na fila indicada na variável de ambiente: `RABBIT_DELIVERY_QUEUE`.
- Quando o status do pedido é alterado por parte do entregador, o evento é publicado na fila indicada na variável de ambiente: `RABBIT_ORDER_QUEUE`.

#### Pagamento (futuro)

- Para desenvolver o pagamento, pretendo adicionar um serviço que sobe escutando a fila `RABBIT_DELIVERY_QUEUE`, existe outro serviço que também escuta essa fila, ao escutar uma mensagem com status de `APROVED` realiza o pagamento com os dados advindos na mensagem.
- No app do cliente, na parte de pagamento, adiciono uma tela para o cliente preencher os dados de pagamento, e no checkout adicionar uma validação dos dados de acordo com o método de pagamento.


# Detalhes Gerais

#### Cálculo de Entrega:

- Cada restaurante tem seu próprio valor de entrega e distância de atendimento.
- O cálculo consiste em pôr um valor fixo (Taxa de Serviço) `fixedTaxa` e um valor por KM `perKm`.
- Baseado na distância recebida, o app calcula a distância através do algoritmo de Haversine (exite um método no backend e nofrontend para esse cálculo), envia para o backend e recebe o valor calculado de acordo com o estabelecimento.

_Utilizei o algoritimo de Haversine para evitar o uso de APIs de mapas, por serem pagas, talvez ele não seja o melhor a ser usado em larga escala pois ele calcula em uma linha reta, não levando em conta o caminho real a ser percorrido pelo entregador, mas a menor distância entre os dois pontos (ponto de coleta e entrega)._

#### Entregador:

- Cada entregador deve estar devidamente cadastrado. Essa documentação do Postman pode ser encontrada em `Auth/DeliveryMan/Register Deliveryman`.
- Toda entrega realizada pelo entregador é salva em seu extrato, que pode ser visualizado no seu respectivo APP.
- É permitida somente uma entrega por vez, por entregador. **_(Existe a possibilidade de adição de uma fila de pedidos para entrega no AppEntrega por se tratar de um array, pretendo adicionar como feature futura)_**
- No endpoint Delivery/Orders, o entregador envia sua localização e recebe os pedidos ao redor, todos os entregadores enviam um "sinal de vida" com sua localização. **_(Pretendo utilizar esse endpoint para rastreio das localizações percorridas pelo entregador, inclusive seu caminho percorrido para mapear a locomoção, cálculos de gastos calóricos e etc.)_**
- Caso a entrega seja cancelada/removida, ou o entregador seja removido da entrega (**somente via banco, no mongoDB**), no próximo "sinal de vida" essa condição será refletida no app do mesmo e ele volta a ficar disponível para novas entregas. Sendo assim, existe a possiblidade da feature de remoção/sobreposição de um entregador em uma respectiva entrega, más não pretendo desenvolver. 

#### Restaurante:

- Todos os dados do restaurante podem ser alterados pelo painel WEBRestaurante.
- Os restaurantes são cadastrados via endpoint (Auth / Create User & Establishment). A página de cadastro de restaurante está em desenvolvimento futuro.
- Ainda falta uma feature de relatórios, pretendo adiciona-la no futuro, más os dados podem ser obtidos no mongoDB do serviço do restaurante.
- Todos os itens do cardápio tem suporte à Adicionais e Categorias de pedido.
- A visualização do cliente é composta primeiro das categorias exibindo produtos agrupados, na página do restaurante, no AppComida e após as categorias vem uma listagem geral.
- Os adicionais podem ou não possuir algum valor, que em caso de existência é refletido no valor do pedido.

#### Etapas de Entrega:

- O restaurante faz o cadastramento de todos os seus produtos e "abre o estabelecimento" na aplicação WEBRestaurante.
- O cliente realiza o pedido e indica a forma de pagamento, que pode ser feita na entrega. Atualmente, não temos integração com APIs de pagamento, mas isso pode ser implementado em qualquer linguagem e facilmente devido à arquitetura.
- O restaurante aceita/recusa o pedido, arrastando-o para os próximos estágios do Painel Principal (Quadro Kanban).
- Ao arrastar o pedido para o estágio de "Em produção", o mesmo aparece disponível para entrega aos entregadores ao redor.
- Enquanto o pedido está no estágio de "Em produção", o entregador se locomove até o estabelecimento e consegue sinalizar no AppEntrega que chegou ao estabelecimento. O restaurante recebe essa alteração no status do pedido.
- Ao arrastar o pedido para "Pronto para Entrega", o restaurante consegue entregar o pedido no balcão. Para isso, é necessário o código do restaurante (código de quatro dígitos que está disponível no card do pedido, na parte WEB do restaurante).
- Ao receber o pedido, o entregador pode se locomover ao encontro do cliente e, ao entregar o pedido, solicitar o respectivo código de entrega (código de quatro dígitos disponível na área de pedidos no APP do Cliente).
- _**Disclamer**: no código atual da **main**, adicionei o Código do Cliente (em vermelho) no card do pedido, isso é para facilitar os teste, em caso de publicação o ideal é remover o **Código do Cliente** da Visualização do Restaurante (Quadro Kanban), más pode variar de acordo com a regra de negócio._
- Após a entrega, o pedido sai do Painel Principal (Quadro Kanban) do restaurante, e a entrega é salva na tela de  **Extrato do entregador**.


**_O fluxo acima de Etapas de Entrega pode ser visualizado no primeiro video._**


#### Publicação:

- No caso de publicação você pode utilizar o próprio expo para fazer o build, ou fazer o `eject` saindo do expo e usando react native.
- Você precisa adicionar a chave de API de mapas na aplicação do entregador, pois ela utiliza o maps da Apple e Google só seguir essa <a href="https://docs.expo.dev/versions/latest/sdk/map-view/">Documentação</a>.


##### Atenciosamente, CHomar
##### Discord: anypercent_
