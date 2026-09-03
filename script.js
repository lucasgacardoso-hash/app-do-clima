// ============================================
// CONFIGURAÇÃO DA NOSSA API
// ============================================


const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
//Essa primeira API serve para achar uma cidade
//e transformar o nome dela em latitude e longitude


const CLIMA_URL = "https://api.open-meteo.com/v1/forecast";
//Essa segunda API vai usar latitude e longitude
//para finalmente descobrir o clima




// ============================================
// PEGANDO OS ELEMENTOS DO NOSSO HTML
// ============================================


const botaoBuscar = document.getElementById("buscar");
//Criamos uma constante chamada botaoBuscar
//e procuramos no HTML o elemento cujo id é buscar


const campoCidade = document.getElementById("cidade");
//Aqui fazemos a mesma coisa, mas agora procurando nosso input cidade


const resultado = document.getElementById("resultado");
//Aqui encontramos nosso espaço resultado
//é dentro dele que depois vamos colocar os dados do clima




// ============================================
// FAZENDO NOSSO BOTÃO FUNCIONAR
// ============================================


botaoBuscar.addEventListener("click", buscarClima);
//Falamos pro botão ficar observando
//quando acontecer um click ele executa nossa função buscarClima




// ============================================
// MELHORIA 1
// PESQUISAR APERTANDO ENTER
// ============================================


campoCidade.addEventListener("keydown", function(evento) {

    //Estamos observando nosso input
    //keydown significa quando alguma tecla do teclado for apertada


    if (evento.key === "Enter") {

        //Se a tecla que foi apertada for Enter
        //executamos a mesma função do botão

        buscarClima();

    }

});




// ============================================
// NOSSA FUNÇÃO PRINCIPAL
// ============================================


async function buscarClima() {

    //async permite que nossa função trabalhe com coisas
    //que podem demorar, como esperar informações vindas da internet


    const cidade = campoCidade.value.trim();

    //.value pega aquilo que o usuário digitou no input
    //.trim remove espaços extras do começo e do final




    // ============================================
    // VERIFICANDO SE O USUÁRIO DIGITOU UMA CIDADE
    // ============================================


    if (cidade === "") {

        //Se cidade for exatamente igual a vazio entra aqui


        resultado.innerHTML = `
            <p class="erro">Digite o nome de uma cidade.</p>
        `;

        //Colocamos nossa mensagem dentro do espaço resultado


        return;

        //Paramos nossa função aqui
        //assim ela não tenta consultar uma cidade vazia
    }




    // ============================================
    // MELHORIA 2
    // MOSTRAR QUE O SITE ESTÁ CONSULTANDO
    // ============================================


    resultado.innerHTML = "<p>Consultando o clima...</p>";

    //Como consultar uma API pode levar um pouco de tempo
    //mostramos essa mensagem enquanto esperamos




    try {

        //try significa basicamente:
        //tente executar tudo que estiver aqui dentro




        // ============================================
        // PRIMEIRA CONSULTA
        // DESCOBRINDO LATITUDE E LONGITUDE
        // ============================================


        const urlCidade =
            `${GEO_URL}?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

        //Montamos o endereço que vamos mandar para nossa primeira API

        //${cidade} coloca o valor da variável cidade dentro da URL

        //encodeURIComponent ajuda a preparar aquilo que o usuário escreveu
        //para poder ser colocado corretamente dentro de uma URL

        //count=1 diz que queremos apenas 1 resultado

        //language=pt pede informações em português

        //format=json pede a resposta em JSON




        const respostaCidade = await fetch(urlCidade);

        //fetch envia nossa requisição para a internet

        //await manda nossa função esperar a API responder
        //antes de continuar daqui para baixo




        if (!respostaCidade.ok) {

            //Se nossa resposta não estiver ok
            //criamos um erro

            throw new Error("Erro ao procurar a cidade.");

        }




        const dadosCidade = await respostaCidade.json();

        //.json transforma a resposta recebida
        //em informações que o JavaScript consegue trabalhar




        console.log("Cidade encontrada:", dadosCidade);

        //Mostramos no console para conseguir ver
        //o JSON que a nossa primeira API devolveu




        // ============================================
        // VERIFICANDO SE A CIDADE EXISTE
        // ============================================


        if (!dadosCidade.results || dadosCidade.results.length === 0) {

            //Se results não existir ou não tiver nenhum resultado
            //significa que a cidade não foi encontrada


            resultado.innerHTML = `
                <p class="erro">Cidade não encontrada.</p>
            `;


            return;

            //Paramos a função aqui

        }




        // ============================================
        // PEGANDO OS DADOS DA CIDADE
        // ============================================


        const local = dadosCidade.results[0];

        //[0] significa que estamos pegando o primeiro resultado da lista


        const latitude = local.latitude;

        //Pegamos dentro desse resultado a latitude


        const longitude = local.longitude;

        //Pegamos a longitude


        const nomeCidade = local.name;

        //Pegamos também o nome encontrado pela API


        const pais = local.country;

        //Aqui pegamos o país dessa cidade
        //essa será uma das nossas melhorias




        // ============================================
        // SEGUNDA CONSULTA
        // AGORA BUSCAMOS O CLIMA
        // ============================================


        const urlClima =
            `${CLIMA_URL}?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
            `&timezone=auto`;

        //Agora montamos a URL da segunda API

        //latitude e longitude são as coordenadas que conseguimos antes

        //current diz quais informações atuais queremos receber

        //temperature_2m = temperatura

        //apparent_temperature = sensação térmica

        //relative_humidity_2m = umidade

        //wind_speed_10m = velocidade do vento

        //weather_code = código que representa a condição do clima

        //timezone=auto faz a API considerar automaticamente o fuso daquela região




        const respostaClima = await fetch(urlClima);

        //Enviamos nossa segunda requisição pela internet




        if (!respostaClima.ok) {

            //Se a API não responder corretamente
            //criamos um erro que será pego pelo catch depois

            throw new Error("Erro ao consultar o clima.");

        }




        const dadosClima = await respostaClima.json();

        //Transformamos nossa resposta novamente em JSON




        console.log("Clima recebido:", dadosClima);

        //Mostramos no console para conseguir observar os dados




        // ============================================
        // PEGANDO OS DADOS DO JSON
        // ============================================


        const clima = dadosClima.current;

        //Dentro da resposta da nossa API
        //current guarda as informações do clima atual




        const temperatura = clima.temperature_2m;

        //Pegamos a temperatura




        const sensacao = clima.apparent_temperature;

        //Pegamos a sensação térmica




        const umidade = clima.relative_humidity_2m;

        //Pegamos a umidade




        const vento = clima.wind_speed_10m;

        //Pegamos a velocidade do vento




        const codigoClima = clima.weather_code;

        //A API não manda simplesmente "chuva" ou "sol"
        //ela manda um código
        //por isso vamos transformar esse código em um texto




        const condicao = descobrirCondicao(codigoClima);

        //Chamamos nossa função descobrirCondicao
        //e ela vai transformar o código em algo como
        //"Céu limpo", "Chuva", "Neblina", etc




        // ============================================
        // MOSTRANDO NOSSO RESULTADO NA PÁGINA
        // ============================================


        resultado.innerHTML = `

            <div class="card-clima">

                <h2>${nomeCidade}</h2>

                <p>📍 ${pais}</p>

                <p>
                    🌡️ Temperatura:
                    <strong>${temperatura} °C</strong>
                </p>

                <p>
                    🔥 Sensação térmica:
                    <strong>${sensacao} °C</strong>
                </p>

                <p>
                    💧 Umidade:
                    <strong>${umidade}%</strong>
                </p>

                <p>
                    💨 Vento:
                    <strong>${vento} km/h</strong>
                </p>

                <p>
                    ☁️ Condição:
                    <strong>${condicao}</strong>
                </p>

            </div>

        `;

        //innerHTML permite colocar conteúdo dentro da nossa section resultado

        //usamos crase porque assim conseguimos colocar HTML
        //e também nossas variáveis usando ${}




    } catch (erro) {

        //Se alguma coisa dentro do try der errado
        //o código vem parar aqui


        console.error(erro);

        //Mostramos o erro verdadeiro no console
        //isso ajuda bastante quando precisamos descobrir o problema


        resultado.innerHTML = `
            <p class="erro">
                Não foi possível consultar o clima dessa cidade.
            </p>
        `;

        //E mostramos uma mensagem mais simples para o usuário

    }

}




// ============================================
// TRANSFORMANDO O CÓDIGO DO CLIMA EM TEXTO
// ============================================


function descobrirCondicao(codigo) {

    //Essa função recebe o código que veio da API
    //e devolve uma descrição mais fácil para o usuário


    if (codigo === 0) {

        return "Céu limpo";

    }


    if (codigo === 1 || codigo === 2 || codigo === 3) {

        return "Parcialmente nublado";

    }


    if (codigo === 45 || codigo === 48) {

        return "Neblina";

    }


    if (codigo >= 51 && codigo <= 57) {

        return "Chuvisco";

    }


    if (codigo >= 61 && codigo <= 67) {

        return "Chuva";

    }


    if (codigo >= 71 && codigo <= 77) {

        return "Neve";

    }


    if (codigo >= 80 && codigo <= 82) {

        return "Pancadas de chuva";

    }


    if (codigo >= 95) {

        return "Tempestade";

    }


    return "Condição não identificada";

    //Se nenhum dos casos acima servir
    //devolvemos essa mensagem

}