let arrayMsg = [];
let nome;
let statusOnline = false;
let usuarioMSg;
let visibilidadeEscolhida;

function iniciandoNome(){

    nome = document.querySelector(".inputNome").value;
    document.querySelector(".nome").classList.add("escondido");
    document.querySelector(".entrando").classList.remove("escondido");
    setTimeout(function(){
        const nomeServidor = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {
            name: nome
        });
        nomeServidor.then(insercaoSucesso);
        nomeServidor.catch(insercaoErro);
    }, 2000);
}

function insercaoSucesso(msg){
    if(msg.status === 200) {
        document.querySelector(".telaInicio").classList.add("escondido");
        carregarMsg();
        aparecerListaUsuarios();
        statusUser();
        statusOnline = true;
    }
 }

 function insercaoErro(msg){
    if(msg.response.status === 400) {
        alert("Nome já esta sendo ultilizado, digite outro!");
        window.location.reload();
    }
}

function enviarMsg(){
    const msg = document.querySelector(".inputBottomBar").value;
    let tipo;
    if(statusOnline === true) {
       if(visibilidadeEscolhida === "Público") tipo = "message";
       else if(visibilidadeEscolhida === "Reservadamente") tipo = "private_message";
       if(usuarioMSg === undefined && visibilidadeEscolhida === undefined){
            let msgEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
                from: nome,
                to: "Todos",
                text: msg,
                type: "message"
            });
            msgEnviada.catch(erroMsg);
            document.querySelector(".inputBottomBar").value =  ``;  
       }else{
            let msgEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
                from: nome,
                to: usuarioMSg,
                text: msg,
                type: tipo
            });
            msgEnviada.catch(erroMsg);
            document.querySelector(".inputBottomBar").value =  ``;  
       }
    }
    if(statusOnline === false) window.location.reload();
}

function erroMsg(){
    alert("Primeiro selecione o Participante que deseja enviar a mensagem e a sua visibilidade, clicando no icone do canto superior direito!");
}

function carregarMsg(){
    const envios = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    envios.then(renderizarMsg);
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
        if(arrayMsg[i].type === 'private_message' && (arrayMsg[i].from === nome || arrayMsg[i].to === nome)){
            renderizar.innerHTML += `
            <div class="msg privateMsg">
                <p><b>(${arrayMsg[i].time})</b>
                <strong>${arrayMsg[i].from}</strong>
                reservadamente para
                <strong>${arrayMsg[i].to}:</strong>
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
    const usuariosAtivos = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    usuariosAtivos.then(renderizarParticipantes);
    usuariosAtivos.catch(erroUsuarios);
}

function renderizarParticipantes(usuariosAtivos){
    const usuarios = document.querySelector("ul");
    const checarMarcado = document.querySelector(".selecionado");
    let marcado;
    if(checarMarcado != null) marcado = checarMarcado.parentNode.children[0].children[1].innerHTML;
    usuarios.innerHTML = ``;
    const vetorUsuarios = [];

    if(marcado === "Todos") usuarios.innerHTML += `<li><div class="tiposUsuario"><ion-icon class="iconParticipantes" name="people-sharp"></ion-icon><p data-identifier="participant" onclick="selecionarPessoa(this);">Todos</p></div><div class="check selecionado" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
    else usuarios.innerHTML += `<li><div class="tiposUsuario"><ion-icon class="iconParticipantes" name="people-sharp"></ion-icon><p data-identifier="participant" onclick="selecionarPessoa(this);">Todos</p></div><div class="check" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
    
    for(let i=0; i<usuariosAtivos.data.length; i++){
        vetorUsuarios.push(usuariosAtivos.data[i]); 
        if(vetorUsuarios[i].name === marcado) usuarios.innerHTML += `<li><div class="tiposUsuario"><div class="iconParticipantes"><ion-icon name="person-circle"></ion-icon></div><p data-identifier="participant" onclick="selecionarPessoa(this);">${vetorUsuarios[i].name}</p></div><div class="check selecionado" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
        else usuarios.innerHTML += `<li><div class="tiposUsuario"><div class="iconParticipantes"><ion-icon name="person-circle"></ion-icon></div><p data-identifier="participant" onclick="selecionarPessoa(this);">${vetorUsuarios[i].name}</p></div><div class="check" ><ion-icon name="checkmark"></ion-icon></div></l1>`;
    }
}

function selecionarPessoa(elemento){
    let pessoaClicada = document.querySelector(".selecionado");
    if(pessoaClicada != null){
        pessoaClicada.classList.remove("selecionado");
    }
    usuarioMSg = elemento.parentNode.parentNode.children[0].children[1].innerHTML;
    if((usuarioMSg === "Todos" && visibilidadeEscolhida === "Reservadamente"));
    else{
        if(usuarioMSg != nome) elemento.parentNode.parentNode.children[1].classList.add("selecionado");
        usuarioMSg = document.querySelector(".selecionado").parentNode.children[0].children[1].innerHTML;
        msgRemetente();
    }
}

function selecionarVisibilidade(elemento){
    let visibilidadeClicada = document.querySelector(".visibilidadeSelecionado");
    if(visibilidadeClicada != null){
        visibilidadeClicada.classList.remove("visibilidadeSelecionado");
    }
    visibilidadeEscolhida = elemento.innerHTML;
    if(usuarioMSg != null){
        if(usuarioMSg === "Todos" &&  elemento.innerHTML === "Reservadamente");
        else {
            elemento.parentNode.parentNode.children[1].classList.add("visibilidadeSelecionado");
            visibilidadeEscolhida = document.querySelector(".visibilidadeSelecionado").parentNode.children[0].children[1].innerHTML;
            msgRemetente();
        }
    }
}

function msgRemetente(){
    if(usuarioMSg != null && visibilidadeEscolhida != null) {
        if(usuarioMSg === "Todos" && visibilidadeEscolhida === "Reservadamente");
        else{
            const string = `Enviando para ${usuarioMSg} (${visibilidadeEscolhida})`;
            document.querySelector(".remetente").innerHTML = string;
            document.querySelector(".remetente").classList.remove("selecionadoRemetente");
        }
    }
}

function erroUsuarios(){
    alert("Erro ao imprimir participantes");
    window.location.reload();
}

document.addEventListener("keypress", function(evento){
    if(evento.key === "Enter" && statusOnline === true) enviarMsg();
    else if(evento.key === "Enter" && statusOnline === false) iniciandoNome();
});

setInterval(function(){
    aparecerListaUsuarios();
}, 10000);

setInterval(function (){
    carregarMsg();
}, 3000);