/* Lembre-se, a chave para aprender a programar é entender o ‘porquê’ e o ‘como’, não apenas o ‘o quê’. */

const gameBoard = document.querySelector("#gameboard")
const playerDislpay = document.querySelector("#player")
const infoDisplay = document.querySelector('#info')
const width = 8
console.log(width)


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
        square.classList.add('square')
        /*+ curto , utilizar quando vier fonte dados mais seguros como bd*/
        square.innerHTML = startPiece;
        /*Essa linha torna arrastavel draggable - atributo global*/
        square.firstChild?.setAttribute('draggable',true)
        /* setAttribute para alterar o valor de um atributo class ou id em um elemento HTML2. */
        square.setAttribute('square-id',i)
        /* square.classList.add('beige') */

        /* cores tabuleiros*/
        /*Math.floor -retorna o maior número inteiro que é menor ou igual a um número1. */
        const row = Math.floor((63 - i) /8) + 1

        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "beige" : "brown")
        }else{
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }

        /*cores peças*/
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

/* O evento dragstart é disparado quando o usuário começa a arrastar um elemento ou uma seleção de texto */
allSquares.forEach(square => {
    square.addEventListener('dragstart',dragStart)
})


/*capturando o id do elemento peca*/
let startPosTitionId
let draggedElement

function dragStart(e){
    /* console.log(e.target.parentNode.getAttribute('square-id')) */
    startPosTitionId = e.target.parentNode.getAttribute('square-id')
    draggedElement= e.target
}

function dragOver(e){
    e.preventDefault()
}



 

