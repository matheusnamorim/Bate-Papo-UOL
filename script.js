let arrayMsg = [];
let nome;
let statusOnline = false;

function iniciandoNome(){
    nome = prompt("Digite seu lindo nome!");

    const nomeObj = {
        name: nome
    };
    const nomeServidor = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeObj);

    nomeServidor.then(insercaoSucesso);
    nomeServidor.catch(insercaoErro);
}

function insercaoSucesso(msg){
    if(msg.status === 200) {
     carregarMsg();
     statusUser();
     statusOnline = true;
    }
 }

 function insercaoErro(msg){
    if(msg.response.status === 400) {
        alert("Nome já esta sendo ultilizado, digite outro!");
        iniciandoNome();
    }
}

iniciandoNome();

function enviarMsg(){
    const msg = document.querySelector("input").value;
    if(statusOnline === true) {
        let msgEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
            from: nome,
            to: "Todos",
            text: msg,
            type: "message"
        });
        document.querySelector("input").value =  ``;  
    }
}

function carregarMsg(){
    setInterval(function(){
        const envios = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        envios.then(renderizarMsg);
    }, 3000);
}

function renderizarMsg(msg){
    const arrayAux = msg.data;
    limparRenderização();
    const renderizar = document.querySelector(".container");
    for(let i=0; i<arrayAux.length; i++){
        arrayMsg[i] = msg.data[i];
        if(arrayMsg[i].type === 'message'){
            renderizar.innerHTML +=  `
            <div class="msg mensagem">
                <p><b>(${arrayMsg[i].time})</b>
                <strong>${arrayMsg[i].from}</strong>
                para
                <strong>${arrayMsg[i].to}:</strong>
                ${arrayMsg[i].text}</p>
            </div>`;
        }
        if(arrayMsg[i].type === 'status'){
            renderizar.innerHTML += `  
            <div class="msg status">
                <p><b>(${arrayMsg[i].time})</b>
                <strong>${arrayMsg[i].from}</strong>
                ${arrayMsg[i].text}</p>
            </div>`;
        }
    }
    scrollTravado();
}

function scrollTravado(){
    const temp = document.querySelectorAll(".msg");
    temp[(arrayMsg.length)-1].classList.add('last');
    const elementoQueQueroQueApareca = document.querySelector('.last');
    elementoQueQueroQueApareca.scrollIntoView();
}

function limparRenderização(){
    const renderizar = document.querySelector(".container");
    renderizar.innerHTML = ``;
}

function statusUser(){
    setInterval(function(){
        const objNome = {
            name: nome
        }
        const statusUsuario = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', objNome);
        statusUsuario.then(online);
        statusUsuario.catch(offline);
    }, 5000);
}

function online(msg){
    if(msg.status === 200) statusOnline = true;
}

function offline(msg){
    if(msg.status != 200) statusOnline = false;
}