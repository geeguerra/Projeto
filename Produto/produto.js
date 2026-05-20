//Configurações Globais

const API_URL ='http://localhost:5146/api';

//Mostrar mensagem de ERRO ou SUCESSO no Login e no Registro

const messageBox = document.getElementById ('message-box');

function mostrarMensagem(texto, type='error'){  
 if(!messageBox)return;
  messageBox.textContent = texto;
    messageBox.className = type ==='error'? 'msg-error' : 'msg-sucess';
    messageBox.style.display = 'block';
    setTi
    meout(() =>{messageBox.style.display = 'nome';}, 4000);
    
}