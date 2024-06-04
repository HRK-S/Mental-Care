const perguntas = [
    {
        pergunta: "Você tem dificuldade de se alimentar?",
        respostas: [
            "Sim",
            "Talvez",
            "Não",
        ],
        correta: 2
    },
    {
        pergunta: "Você tem se sentido muito ansioso ultimamente?",
        respostas: [
            "Sim",
            "Talvez",
            "Não",
        ],
        correta: 0
    },
    {
        pergunta: "Você tem se sentido depressivo ultimamente?",
        respostas: [
            "Sim",
            "Talvez",
            "Não",
        ],
        correta: 0
    },
    {
        pergunta: "Você tem dificuldade de focar em certas situações?",
        respostas: [
            "Sim",
            "Talvez",
            "Não",
        ],
        correta: 2
    },
    {
        pergunta: "Você convive com o sentimento de burnout?",
        respostas: [
            "Sim",
            "Talvez",
            "Não",
        ],
        correta: 1
    },
];

const quizContainer = document.querySelector('#quiz-container');
const quiz = document.querySelector('#quiz');
const template = document.querySelector('template');
const proximaBtn = document.querySelector('#proxima');
const enviarBtn = document.querySelector('#enviar');
const resultadoDiv = document.querySelector('#resultado');

let respostasUsuario = [];
let perguntaAtual = 0;

function mostrarPergunta(index) {
    const quizitem = template.content.cloneNode(true);
    const item = perguntas[index];
    quizitem.querySelector('h3').textContent = item.pergunta;

    for (let resposta of item.respostas) {
        const dt = quizitem.querySelector('dl dt').cloneNode(true);
        dt.querySelector('span').textContent = resposta;
        dt.querySelector('input').setAttribute('name', 'pergunta-' + index);
        dt.querySelector('input').value = item.respostas.indexOf(resposta);
        dt.querySelector('input').onchange = (event) => {
            respostasUsuario[index] = parseInt(event.target.value);
        }

        quizitem.querySelector('dl').appendChild(dt);
    }

    quizitem.querySelector('dl dt').remove();
    quiz.appendChild(quizitem);

    const quizItems = quiz.querySelectorAll('.quiz-item');
    quizItems.forEach(item => item.style.display = 'none');
    quizItems[perguntaAtual].style.display = 'block';
}

mostrarPergunta(perguntaAtual);

proximaBtn.addEventListener('click', () => {
    if (perguntaAtual < perguntas.length - 1) {
        perguntaAtual++;
        mostrarPergunta(perguntaAtual);
    } else {
        proximaBtn.style.display = 'none';
        enviarBtn.style.display = 'block';
    }
});

enviarBtn.addEventListener('click', () => {
    let respostas = [];

    for (let i = 0; i < respostasUsuario.length; i++) {
        const resposta = perguntas[i].respostas[respostasUsuario[i]];
        respostas.push(resposta);
    }

    const simCount = respostas.filter(resposta => resposta === 'Sim').length;
    const talvezCount = respostas.filter(resposta => resposta === 'Talvez').length;
    const naoCount = respostas.filter(resposta => resposta === 'Não').length;

    let diagnostico = "<span class='diag'>Diagnóstico: </span>";

    if (simCount >= 3) {
        diagnostico += "<span class='sim'>Possível alto nível de estresse, ansiedade e depressão. Recomendamos buscar ajuda profissional.</span><br><br>" +
                      "<span class='sim'>(15) 98136-4474 - Dr. Gustavo Frederico Peres (Psiquiatra)</span>";
    } else if (naoCount >= 3) {
        diagnostico += "<span class='nao'>Baixa probabilidade de estresse, ansiedade e depressão. Continue cuidando da sua saúde mental.</span>";
    } else {
        diagnostico += "<span class='outros'>Probabilidade moderada de estresse, ansiedade e depressão. Monitorize seus sentimentos e busque apoio se necessário.</span><br><br>" +
                      "<span class='outros'>(15) 99749-4257 - Dra. Maria Cristina Miranda Pavia (Psicóloga)</span>";
    }

    resultadoDiv.innerHTML = diagnostico;
});
