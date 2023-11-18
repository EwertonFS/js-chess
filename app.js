/* Lembre-se, a chave para aprender a programar é entender o ‘porquê’ e o ‘como’, não apenas o ‘o quê’. */

const gameBoard = document.querySelector("#gameboard")
const playerDislpay = document.querySelector("#player")
const infoDisplay = document.querySelector('#info')
const width = 8
console.log(width)
//let playerGo='black'
//playerDisplay.textContent='black'


const startPieces = [
    rook,knight,bishop,queen,king,bishop,knight,rook,
    pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
    rook,knight,bishop,queen,king,bishop,knight,rook,
]

/* console.log(startPieces) */

function createBoard(){
    /*  o índice i é usado mais tarde no código para definir o atributo ‘square-id’ e para determinar a cor das peças*/
    startPieces.forEach((startPiece,i) => {
        /* Melhor opção = createElement , + seguro,+performace,(-) maiorTamanho*/
        const square = document.createElement('div')
        //adcionando css 
        square.classList.add('square')
        /*+ curto , utilizar quando vier fonte dados mais seguros como bd*/
        square.innerHTML = startPiece;
        /*Para o caso de existir Essa linha torna arrastavel draggable - atributo global*/
        /*Isso é útil para evitar erros ao acessar propriedades aninhadas de objetos quando não temos certeza se uma determinada propriedade existe , se n retornaria undifened interrompendo.*/
        square.firstChild?.setAttribute('draggable',true)
        /* setAttribute para alterar o valor de um atributo class ou id em um elemento HTML2. */
        square.setAttribute('square-id',i)
        /* square.classList.add('beige') */

        /* cores tabuleiros*/
        /*Math.floor -retorna o maior número inteiro que é menor ou igual a um número 1. */
        /*Arrendondado para baixo em seguida adcionando 1 para contagem ficar correra o index zero passe a ser o index 1*/
        const row = Math.floor((63 - i) /8) + 1

        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "beige" : "brown")
        }else{
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }

        /*cores peças e posicionamentos*/
        //sçao duas tags ate se chegar ao elemento por isso firstChild firtChild
         if(i <= 15){
            square.firstChild.firstChild.classList.add('black')
        } 
        
        if(i >= 48){
            square.firstChild.firstChild.classList.add('white')
        }
        
        /*O método append() em JavaScript é uma função nativa que nos permite adicionar elementos ao HTML de forma dinâmica*/
        gameBoard.append(square) 
    })
}

createBoard()



const allSquares = document.querySelectorAll("#gameboard .square")
console.log(allSquares)

// O evento dragstart é disparado quando o usuário começa a arrastar um elemento ou uma seleção //de texto 

allSquares.forEach(square => {
    square.addEventListener('dragstart',dragStart)
    square.addEventListener('dragover',dragOver)
    square.addEventListener('drop',dragDrop)
})


// Variáveis globais
let startPosTitionId;
let draggedElement;

// Função para iniciar o arrasto
function dragStart(e) {
    // Capturando o id do elemento pai da peça que está sendo arrastada
    startPosTitionId = e.target.parentNode.getAttribute('square-id');
    // Armazenando o elemento que está sendo arrastado
    draggedElement = e.target;
}

// Função para permitir o arrasto sobre um elemento
function dragOver(e) {
    e.preventDefault();
}

// Função para soltar o elemento arrastado
function dragDrop(e) {
    // ele impede o evento de borbulhar até os elementos pai ou capturar até os elementos filho
    e.stopPropagation();

    // console.log(e.target)
    const taken = e.target.classList.contains('piece')
    
    
    // Anexando o elemento arrastado ao elemento alvo
    // e.target.parentNode.append(draggedElement);
    //e.target.remove() 
    //e.target.append(draggedElement)
    changePlayer()
}

 function changePlayer(){
    if(playerGo === 'black'){ 
        // reverseIds(); 
        playerGo = 'white';
        playerDisplay.textContent='white';
    }else{
        revertIds();
        playerGo = 'black';
        playerDisplay.textContent='black';
    }
}


function reverseIds(){
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square,i)=>
        square.setAttribute('square-id',(width * width -1)-i));
}

function revertIds(){
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square,i)=>
        square.setAttribute('square-id',i));
} 

 

