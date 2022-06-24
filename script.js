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
        if(arrayMsg[i].type === 'status'){
            if(arrayMsg[i] === arrayMsg[arrayMsg.length-1]){
                renderizar.innerHTML += `
                <div class="msg status last">
                    <p><b>(${arrayMsg[i].time})</b>
                    <strong>${arrayMsg[i].from}</strong>
                    ${arrayMsg[i].text}</p>
                </div>`;
            }else{
                renderizar.innerHTML += `
                <div class="msg status">
                    <p><b>(${arrayMsg[i].time})</b>
                    <strong>${arrayMsg[i].from}</strong>
                    ${arrayMsg[i].text}</p>
                </div>`;
            }
        }
        if(arrayMsg[i].type === 'message'){
            if(arrayMsg[i] === arrayMsg[arrayMsg.length-1]){
                renderizar.innerHTML += `
                <div class="msg status last">
                    <p><b>(${arrayMsg[i].time})</b>
                    <strong>${arrayMsg[i].from}</strong>
                    ${arrayMsg[i].text}</p>
                </div>`;
            }else{
                renderizar.innerHTML += `
                <div class="msg mensagem">
                    <p><b>(${arrayMsg[i].time})</b>
                    <strong>${arrayMsg[i].from}</strong>
                    para
                    <strong>${arrayMsg[i].to}:</strong>
                    ${arrayMsg[i].text}</p>
                </div>`;
            }
        }
    }

    //setInterval(scrollTravado, 1000);
}

function scrollTravado(){
    const elementoQueQueroQueApareca = document.querySelector('.container .last');
    elementoQueQueroQueApareca.scrollIntoView();
}
