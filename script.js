const html = document.querySelector('html');
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('sons/luna-rise-part-one.mp3');
const startPauseBt = document.querySelector('#start-pause');
const iniciarouPausarBt = document.querySelector('#start-pause span');
const somIniciar = new Audio('sons/play.wav');
const somPause = new Audio('sons/pause.mp3');
const somFinalizado = new Audio('sons/beep.mp3');
const playPauseBtIcone = document.querySelector('.app__card-primary-butto-icon');
const temporizador = document.querySelector('#timer');
musica.loop = true;

let intervaloId = null;
let tempoDecorridoEmSegundos = 0.05*60;

function alterarContexto(contexto){
   botoes.forEach((contexto) => {
      contexto.classList.remove('active');
   });
   html.setAttribute('data-contexto',contexto);
   banner.setAttribute('src',`/imagens/${contexto}.png`);
   switch (contexto){
      case 'foco' :
         tempoDecorridoEmSegundos = 25*60;
         tempoDecorridoEmSegundos.time
         titulo.innerHTML = `
         Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>
         `;
         break;
      case 'descanso-curto' :
         tempoDecorridoEmSegundos = 5*60;
         titulo.innerHTML = `
         Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>
         `;
         break;
      case 'descanso-longo' :
         tempoDecorridoEmSegundos = 15*60;
         titulo.innerHTML = `
         Hora de voltar à superfície.<br><strong class="app__title-strong"> Faça uma pausa longa.</strong>
         `;
         break;
      default:
         break;
   }
   mostraTempo();
}

focoBt.addEventListener('click', (a) => {
   alterarContexto(a.target.getAttribute('data-contexto'));
   a.target.classList.add('active');
});

curtoBt.addEventListener('click', (a) => {
   alterarContexto(a.target.getAttribute('data-contexto'));
   a.target.classList.add('active');
});

longoBt.addEventListener('click', (a) => {
   alterarContexto(a.target.getAttribute('data-contexto'));
   a.target.classList.add('active');
});

musicaFocoInput.addEventListener('change', () => {
   if(musica.paused){
      musica.play().then(() => {
         console.log(`Executando audio ${musica.getAttribute('src')}`);
      }).catch(e => {
         console.log(`${musica.getAttribute('src')} falhou ${e.toString()}`);
      });
   }else{
      musica.pause();
   }
})

const contagemRegressiva = () => {
   if(tempoDecorridoEmSegundos <= 0){
      somFinalizado.play();
      alert('Tempo finalizado!');
      const focoAtivo = html.getAttribute('data-contexto') == 'foco';
      if(focoAtivo){
         const evento = new CustomEvent('FocoFinalizado');
         document.dispatchEvent(evento);
      }
      zerar();
      return;
   }
      tempoDecorridoEmSegundos--;
      mostraTempo();
}

const iniciarOuPausar = () =>{
   if(intervaloId){
      zerar();
      somPause.play();
      return;
   }
   somIniciar.play();
   intervaloId = setInterval(contagemRegressiva, 1000);
   iniciarouPausarBt.textContent = 'Pausar'
   playPauseBtIcone.setAttribute('src','imagens/pause.png')
}
const zerar = () => {
   clearInterval(intervaloId);
   iniciarouPausarBt.textContent = 'Começar'
   playPauseBtIcone.setAttribute('src','imagens/play_arrow.png')
   intervaloId = null;
}

startPauseBt.addEventListener('click',iniciarOuPausar);

const mostraTempo = () => {
   const tempo = new Date(tempoDecorridoEmSegundos*1000);
   const tempoFormatado = tempo.toLocaleString('pt-BR',{minute: '2-digit', second: '2-digit'});
   temporizador.innerHTML = `${tempoFormatado}`;
}

mostraTempo()