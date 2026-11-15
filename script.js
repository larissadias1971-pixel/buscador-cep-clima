// Selecionando os elementos do HTML que vamos interagir
const cepInput = document.getElementById('cepInput');
const searchBtn = document.getElementById('searchBtn');

const addressResult = document.getElementById('addressResult');
const streetEl = document.getElementById('street')
const neighborhoodEl = document.getElementById('neighborhood');
const cityStateEl = document.getElementById('cityStateEl');

const weatherResult = document.getElementById('weatherResult');
const tempEl = document.getElementById('temp');
const conditionEl = document.getElementById('condition');


// ADICIONE ESTA LINHA PARA TESTAR SE O BOTÃO FOI ENCONTRADO:
console.log("Botão encontrado:", searchBtn);

// Ouvinte de evento: Dispara a busca ao clicar no botão
searchBtn.addEventListener('click', () => {
    // ADICIONE ESTA LINHA PARA TESTAR SE O CLIQUE FUNCIONOU:
    console.log("O botão foi clicado!");

    const cep = cepInput.value.replace(/\D/g, ''); 
    if (cep.length === 8) {
        buscarDados(cep);
    } else {
        mostrarErro('Por favor, digite um CEP válido com 8 dígitos.');
    }
});

// Função principal assíncrona para buscar os dados
async function buscarDados(cep) {
    ocultarErrosEresultados();

    try {
        // 1. Consumindo a API do ViaCEP
        const respostaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dadosCep = await respostaCep.json();

        if(dadosCep.erro){
            mostrarErro('CEP não encontrado na base de dados');
            return;
        }
        
        // Exibindo os dados do endereço na tela
        exibirEndereco(dadosCep);
        // 2. Buscando coordenadas da cidade para o Clima (usando a API de Geocoding do Open-Meteo)
        const cidadeQuery = `${dadosCep.localidade}, ${dadosCep.uf}, Brazil`;
        const respostaGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidadeQuery)}&count=1`);
        const dadosGeo = await respostaGeo.json();

        if (!dadosGeo.results || dadosGeo.results.length === 0) {
            mostrarErro('Endereço encontrado mas não foi possivel carregar o clima')
            return;
        }
        const { latitude, longitude } = dadosGeo.results[0];
        
        // 3. Consumindo a API de Previsão do Tempo do Open-Meteo
        const respostaClima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
        const dadosClima = await respostaClima.json();

        // Exibindo os dados do clima na tela
        exibirClima(dadosClima.current);
    
    } catch(error) {
        console.error('Erro ao buscar dados', error);
        mostrarErro('Ocorreu um erro ao buscar as informações. Tente novamente.');
    }
}       
// Funções Auxiliares para Manipulação do DOM (Interface)
function exibirEndereco(dados) {
    // Verificamos cada campo. Se vier vazio da API, colocamos um texto padrão amigável
    if (streetEl) streetEl.textContent = dados.logradouro || 'Endereço não especificado / Rua principal';
    if (neighborhoodEl) neighborhoodEl.textContent = dados.bairro || 'Bairro não informado';
    if (cityStateEl) cityStateEl.textContent = `${dados.localidade} - ${dados.uf}`;
    
    // FORÇA O CARD DE ENDEREÇO A APARECER NA TELA:
    if (addressResult) {
        addressResult.classList.remove('hidden');
    }
}

function exibirClima(currentClima) {
    if (tempEl) tempEl.textContent = currentClima.temperature_2m;
    if (conditionEl) conditionEl.textContent = traduzirCodigoClima(currentClima.weather_code);
    
    weatherResult.classList.remove('hidden'); // Mostra o card de clima
}
function exibirClima(currentClima) {
    tempEl.textContent = currentClima.temperature_2m;
    conditionEl.textContent = traduzirCodigoClima(currentClima.weather_code);
    weatherResult.classList.remove('hidden'); // Mostra o card de clima
}

function mostrarErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.classList.remove('hidden');
}

function ocultarErrosEresultados() {
    errorMessage.classList.add('hidden');
    addressResult.classList.add('hidden');
    weatherResult.classList.add('hidden');
}

// Pequeno dicionário para traduzir os códigos numéricos de clima da API do Open-Meteo
function traduzirCodigoClima(codigo) {
    const codigos = {
        0: 'Céu limpo ☀️',
        1: 'Principalmente limpo 🌤️',
        2: 'Parcialmente nublado ⛅',
        3: 'Nublado ☁️',
        45: 'Nevoeiro 🌫️',
        51: 'Chuvisco leve 🌧️',
        61: 'Chuva leve 🌦️',
        63: 'Chuva moderada 🌧️',
        95: 'Tempestade ⛈️'
    };
    return codigos[codigo] || 'Condição estável 🌤️';
}


