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
     aparecerListaUsuarios();
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
    if(statusOnline === false) window.location.reload();
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
    (temp[(temp.length)-1]).scrollIntoView();
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

function aparecerUsuario(){
    const telaUsuarios = document.querySelector(".containerFalso");
    telaUsuarios.classList.add("mostrarContainer");
}

function desaparecerContainer(){
    const telaUsuarios = document.querySelector(".containerFalso");
    telaUsuarios.classList.remove("mostrarContainer");
}

function aparecerListaUsuarios(){
    setInterval(function(){
        const usuariosAtivos = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
        usuariosAtivos.then(renderizarParticipantes);
        usuariosAtivos.catch(erroUsuarios);
    }, 10000);
}

function renderizarParticipantes(usuariosAtivos){
    const usuarios = document.querySelector("ul");
    const checarMarcado = document.querySelector(".selecionado");
    let marcado;
    if(checarMarcado != null) marcado = checarMarcado.parentNode.children[0].children[1].innerHTML;
    usuarios.innerHTML = ``;
    const vetorUsuarios = [];

    if(marcado === "Todos") usuarios.innerHTML += `<li><div class="tiposUsuario"><ion-icon class="iconParticipantes" name="people-sharp"></ion-icon><p onclick="selecionarPessoa(this);">Todos</p></div><div class="check selecionado" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
    else usuarios.innerHTML += `<li><div class="tiposUsuario"><ion-icon class="iconParticipantes" name="people-sharp"></ion-icon><p onclick="selecionarPessoa(this);">Todos</p></div><div class="check" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
    
    for(let i=0; i<usuariosAtivos.data.length; i++){
        vetorUsuarios.push(usuariosAtivos.data[i]); 
        if(vetorUsuarios[i].name === marcado) usuarios.innerHTML += `<li><div class="tiposUsuario"><div class="iconParticipantes"><ion-icon name="person-circle"></ion-icon></div><p onclick="selecionarPessoa(this);">${vetorUsuarios[i].name}</p></div><div class="check selecionado" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
        else usuarios.innerHTML += `<li><div class="tiposUsuario"><div class="iconParticipantes"><ion-icon name="person-circle"></ion-icon></div><p onclick="selecionarPessoa(this);">${vetorUsuarios[i].name}</p></div><div class="check" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
    }
}

function selecionarPessoa(elemento){
    let pessoaClicada = document.querySelector(".selecionado");
    if(pessoaClicada != null){
        pessoaClicada.classList.remove("selecionado");
    }
    elemento.parentNode.parentNode.children[1].classList.add("selecionado");

}

function erroUsuarios(){
    alert("Erro ao imprimir participantes");
    window.location.reload();
}