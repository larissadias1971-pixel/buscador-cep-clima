# 🌍 Buscador de CEP e Previsão do Tempo

Aplicação web desenvolvida com **HTML5, CSS3 e JavaScript puro (Vanilla JS)** que permite consultar informações detalhadas de endereços através de um CEP brasileiro e visualizar instantaneamente a previsão do tempo atual para aquela localidade.

---

## 🚀 Tecnologias Utilizadas

* **HTML5:** Estruturação semântica da página.
* **CSS3:** Estilização moderna, design responsivo e centralizado.
* **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM e consumo assíncrono de APIs via `fetch`.

---

## 🔌 APIs Utilizadas e Funcionamento

O sistema consome **duas APIs públicas e gratuitas** em tempo real para cruzar os dados de localização e clima:

1. **[ViaCEP](https://viacep.com.br/):**
   * **Função:** Recebe o CEP digitado pelo usuário (com 8 dígitos) e retorna as informações correspondentes de **logradouro, bairro, localidade (cidade) e UF (estado)** em formato JSON.

2. **[Open-Meteo Geocoding & Weather APIs](https://open-meteo.com/):**
   * **Geocodificação:** Como a API de clima precisa de coordenadas geográficas exatas, o sistema utiliza o nome da cidade obtido pelo ViaCEP para buscar a **Latitude** e **Longitude** da região.
   * **Previsão do Tempo:** Com as coordenadas em mãos, a API de forecast do Open-Meteo retorna a **temperatura atual (°C)** e o **código numérico da condição climática** (convertido dinamicamente para texto e emojis amigáveis).

---

## ⚙️ Como a Aplicação se Conecta e Funciona

1. **Captura do Evento:** O usuário digita o CEP no campo de entrada e clica no botão de busca. O JavaScript escuta essa ação através de um `addEventListener`.
2. **Requisições Assíncronas (`async/await` & `fetch`):** 
   * O código faz uma requisição HTTP para a API do ViaCEP.
   * Assim que o JSON com o endereço retorna, ele extrai o nome da cidade e dispara uma segunda requisição para a API de geolocalização do Open-Meteo.
   * De posse da latitude e longitude, faz uma terceira chamada para obter os dados meteorológicos atuais.
3. **Atualização Dinâmica do DOM:** Por fim, o JavaScript manipula os elementos HTML, injeta os dados obtidos nas tags correspondentes (`<span>`), remove as classes utilitárias de ocultação (`.hidden`) e exibe os cards de **Endereço** e **Previsão do Tempo** de forma fluida na tela, sem a necessidade de recarregar a página.

---

## 🛠️ Como Executar o Projeto Localmente

1. Clone o repositório para o seu computador:
   ```bash
   git clone [https://github.com/larissadias1971-pixel/buscador-cep-clima.git](https://github.com/larissadias1971-pixel/buscador-cep-clima.git)
