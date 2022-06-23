let arrayMsg = [];

function iniciandoNome(){
    const nome = prompt("Digite seu lindo nome!");

    const nomeObj = {
        name: nome
    };
    const nomeServidor = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeObj);

    nomeServidor.then(insercaoSucesso);
    nomeServidor.catch(insercaoErro);
}

iniciandoNome();

function insercaoSucesso(msg){
   if(msg.status === 200) carregarMsg();
}

function insercaoErro(msg){
    if(msg.response.status === 400) {
        alert("Nome já esta sendo ultilizado, digite outro!");
        iniciandoNome();
    }
}

function carregarMsg(){
    const envios = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    envios.then(renderizarMsg);
}

function renderizarMsg(msg){
    arrayMsg = msg.data;
    const renderizar = document.querySelector(".container");

    for(let i=0; i<arrayMsg.length; i++){
        console.log(arrayMsg[i]);
        renderizar.innerHTML += `
        <div class="msg">
            <h1>(${arrayMsg[i].time})</h1>
            <p><strong>${arrayMsg[i].from}</strong>
            ${arrayMsg[i].text}</p>
        </div>`;
    }
}


