/*captura o botão adicionar tarefa*/
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
/*captura o formulário*/
const formAdicionarTerefa = document.querySelector('.app__form-add-task');
/*captura o textarea que conterar a descricção das tarefas*/
const textArea = document.querySelector('.app__form-textarea');
/*captura lista de tarefas*/
const ulTarefas = document.querySelector('.app__section-task-list');
/*captura o botão cancelar do formulario*/
const btnCacelarAdicionarTarefa = document.querySelector('.app__form-footer__button--cancel');
/*captura o parágrafo em andamento*/
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
/*botão remover tarefas*/
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
/*botão remover todas as tarefas*/
const btnRemoverTodasTarefas = document.querySelector('#btn-remover-todas');
/*Array com as tarefas no localstore ou vazio*/
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
/*Tarefa selecionada*/
let tarefaSelecionada = null;
/*item da lista com a tarefa selecionada*/
let liTarefaSelecionada = null;

/*Atualiza lista de tarefas no localstorage*/
const atualizarTarefas = () => {
    localStorage.setItem('tarefas',JSON.stringify(tarefas));
}

/*Cria elemento li com tarefa*/
const criarElementoTarefa = (tarefa) => {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    /*ativar botaão de edição*/
    botao.onclick = ()=>{
        /*debugger*/
        const novaDescricao = prompt('Qual a nova tarefa',tarefa.descricao);
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src','./imagens/edit.png');

    botao.append(imagemBotao);
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completada){
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disable','disable');
    }else{
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
            if(tarefaSelecionada === tarefa){
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }
    return li;
}

/*esconde o formulario de adicionar tarefa*/
const esconderFormAdicionarTarefa = () => {
    textArea.value = '';
    formAdicionarTerefa.classList.add('hidden');
}

/*adiciona o evento ao click do botão cacelar*/
btnCacelarAdicionarTarefa.addEventListener('click',()=> {
    esconderFormAdicionarTarefa();
});

/*adiciona o evento de click do botao salvar*/
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTerefa.classList.toggle('hidden');
});
/*adiciona a submição previnindo o compartamento padrao*/
formAdicionarTerefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    /*tarefa atual*/
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa); /*push de tarefa*/
    /*adiciona o elemento recem criado*/
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    /*Armazena no localStorage*/
    atualizarTarefas();
    /*limpa a textArea*/
    esconderFormAdicionarTarefa();
});

/*Carrega as tarefas do localstorage*/
tarefas.forEach(tarefa => {
    const eTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(eTarefa);
})

/*remover a tarefa  */
document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completada = true;
        atualizarTarefas();
    }
});
/*função para remover tarefas concluidas ou todas*/
const removerTarefas = (somenteCompletas) =>{
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach( elemento => {
        elemento.remove();
    });
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completada) : [];
    paragrafoDescricaoTarefa.textContent = ''
    atualizarTarefas();
}

/*clique do botão remover todas as tarefas*/
btnRemoverTodasTarefas.onclick = () => removerTarefas(false);

/*clique do botão para remover concluídas*/
btnRemoverConcluidas.onclick = () => removerTarefas(true);
