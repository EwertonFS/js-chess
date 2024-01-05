/* Lembre-se, a chave para aprender a programar é entender o ‘porquê’ e o ‘como’, não apenas o ‘o quê’. */

const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector('#info-display')
const width = 8
// console.log(width)
let playerGo='black'
playerDisplay.textContent='black'


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
// console.log(allSquares)

// O evento dragstart é disparado quando o usuário começa a arrastar um elemento ou uma seleção //de texto 

allSquares.forEach(square => {
    square.addEventListener('dragstart',dragStart)
    square.addEventListener('dragover',dragOver)
    square.addEventListener('drop', dragDrop);
})


// Variáveis globais
let startPositionId;
let draggedElement;

// Função para iniciar o arrasto
function dragStart(e) {
    // atravez desse console vem o objeto dgragstart
    // console.log(e)
    // Capturando o id do elemento pai da peça que está sendo arrastada
    startPositionId = e.target.parentNode.getAttribute('square-id') ;
    // console.log(startPositionId) //=> recebo o id do quadrado referente a peça
    // Armazenando o elemento que está sendo arrastado
    draggedElement = e.target;
}

// Função para permitir o arrasto sobre um elemento
function dragOver(e) {
    //  console.log(e.target) 
      e.preventDefault();
      
}


function dragDrop(e){
    console.log('Entering dragDrop');
 // ele impede o evento de borbulhar até os elementos pai ou capturar até os elementos filho
 e.stopPropagation();
//  console.log('playerGo',playerGo)
//  console.log('e.target',e.target)
 const correctGo =draggedElement.firstChild.classList.contains(playerGo)
 const taken =e.target.classList.contains('piece')
 const valid = checkIfValid(e.target)
 const opponentGo = playerGo === 'white' ? 'black' : 'white'
//  console.log('opponentGo' , opponentGo)
 const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)

    if(correctGo){
        //must check this first
          // Deve verificar se é tomado pela oponente primeiro
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            checkForWin()
            changePlayer()
            return       
        }
        //then check this
         // Deve verificar se é tomado e não pela oponente antes de verificar a validade
       if(taken && !takenByOpponent){
           infoDisplay.textContent = "you cannot go here!"
           setTimeout(()=>infoDisplay.textContent = " ", 2000)

         return  
       }   
          // A verificação de validade deve ser a última
       if(valid){
           e.target.append(draggedElement)
           checkForWin()
           changePlayer()
           return
        }
    }
    //  e.target.parentNode.append(draggedElement); 
    // e.target.remove() 
    // e.target.append(draggedElement)
    // changePlayer()
}





function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    //aqui esta toda informação sobre um elemento para saber se o movimento é válido
    console.log('targetId', targetId);
    console.log('startId', startId); 
    console.log('piece', piece);

    switch(piece){
        case  'pawn' :
            const starterRow = [8,9,10,11,12,13,14,15]
            if(
                starterRow.includes(startId) && startId + width * 2 === targetId ||
                startId + width === targetId ||
                startId + width -1 === targetId && document.querySelector(`[square-id="${startId + width -1}"]`).firstChild ||
                startId + width +1 === targetId && document.querySelector(`[square-id="${startId + width +1}"]`).firstChild  
            ){
                return true
            }
            break;
            // case' knight':
            // if(
            //     startId + width * 2 + 1 === targetId ||
            //     startId + width * 2 - 1 === targetId ||
            //     startId + width - 2 === targetId ||
            //     startId + width + 2 === targetId ||
            //     startId - width * 2 + 1 === targetId ||
            //     startId - width * 2 - 1 === targetId ||
            //     startId - width -2 === targetId ||
            //     startId - width +2 === targetId 

            //  ){

            //     return true
            // }
            // break;
            case 'knight':
            // Criamos uma matriz chamada validMoves para armazenar todas as posições válidas para o cavalo
            const validMoves = [
                startId + width * 2 + 1,
                startId + width * 2 - 1,
                startId + width + 2,
                startId + width - 2,
                startId - width * 2 + 1,
                startId - width * 2 - 1,
                startId - width + 2,
                startId - width - 2
            ];

            // Verificamos se o targetId está incluído nas posições válidas
            if (validMoves.includes(targetId)) {
                return true;
            }
            break;

            case'bishop' :
            if(
                startId + width +1 === targetId ||
                startId + width *2 +2 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild ||
                startId + width *3 +3 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  ||
                startId + width *4 +4 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild ||
                startId + width *5 +5 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4}"]`).firstChild ||
                startId + width *6 +6 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5}"]`).firstChild ||
                startId + width *7 +7 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *6 + 6}"]`).firstChild||
                //--
                startId - width -1 === targetId || 
                startId - width *2 -2 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild ||
                startId - width *3 -3 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  ||
                startId - width *4 -4 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild ||
                startId - width *5 -5 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4}"]`).firstChild ||
                startId - width *6 -6 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5}"]`).firstChild ||
                startId - width *7 -7 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *6 - 6}"]`).firstChild||
                //--
                startId - width -1 === targetId || 
                startId - width *2 +2 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild ||
                startId - width *3 +3 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  ||
                startId - width *4 +4 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild ||
                startId - width *5 +5 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4}"]`).firstChild ||
                startId - width *6 +6 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5}"]`).firstChild ||
                startId - width *7 +7 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *6 + 6}"]`).firstChild||
                 //--
                 startId + width -1 === targetId || 
                 startId + width *2 -2 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild ||
                 startId + width *3 -3 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  ||
                 startId + width *4 -4 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild ||
                 startId + width *5 -5 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4}"]`).firstChild ||
                 startId + width *6 -6 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5}"]`).firstChild ||
                 startId + width *7 -7 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *6 - 6}"]`).firstChild
            ){
                return true
            }
            break;

            case 'rook':
                if(
                    startId + width === targetId ||
                    startId + width *2 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                    startId + width *3 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  ||
                    startId + width *4 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  ||
                    startId + width *5 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *4}"]`).firstChild  ||
                    startId + width *6 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *5}"]`).firstChild  ||
                    startId + width *7 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *6}"]`).firstChild  ||
                    //--
                    startId - width === targetId ||
                    startId - width *2 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                    startId - width *3 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  ||
                    startId - width *4 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  ||
                    startId - width *5 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *4}"]`).firstChild  ||
                    startId - width *6 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *5}"]`).firstChild  ||
                    startId - width *7 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *6}"]`).firstChild  ||
                    //-
                    startId + 1 === targetId ||
                    startId + 2 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                    startId + 3 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  ||
                    startId + 4 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  ||
                    startId + 5 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild  ||
                    startId + 6 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild  ||
                    startId + 7 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId +6}"]`).firstChild  ||
                    //-
                    startId - 1 === targetId ||
                    startId - 2 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                    startId - 3 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  ||
                    startId - 4 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  ||
                    startId - 5 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild  ||
                    startId - 6 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild  ||
                    startId - 7 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId -6}"]`).firstChild  
                ){
                    return true
                }
                break;
                case 'queen':
                    if(
                        startId + width +1 === targetId ||
                        startId + width *2 +2 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild ||
                        startId + width *3 +3 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  ||
                        startId + width *4 +4 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild ||
                        startId + width *5 +5 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4}"]`).firstChild ||
                        startId + width *6 +6 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5}"]`).firstChild ||
                        startId + width *7 +7 === targetId && !document.querySelector(`[square-id="${startId + width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 + 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *6 + 6}"]`).firstChild||
                        //--
                        startId - width -1 === targetId || 
                        startId - width *2 -2 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild ||
                        startId - width *3 -3 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  ||
                        startId - width *4 -4 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild ||
                        startId - width *5 -5 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4}"]`).firstChild ||
                        startId - width *6 -6 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5}"]`).firstChild ||
                        startId - width *7 -7 === targetId && !document.querySelector(`[square-id="${startId - width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 - 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *6 - 6}"]`).firstChild||
                        //--
                        startId - width -1 === targetId || 
                        startId - width *2 +2 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild ||
                        startId - width *3 +3 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  ||
                        startId - width *4 +4 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild ||
                        startId - width *5 +5 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4}"]`).firstChild ||
                        startId - width *6 +6 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5}"]`).firstChild ||
                        startId - width *7 +7 === targetId && !document.querySelector(`[square-id="${startId - width +1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width *2 + 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *3 + 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *4 + 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId - width *5 + 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId - width *6 + 6}"]`).firstChild||
                         //--
                         startId + width -1 === targetId || 
                         startId + width *2 -2 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild ||
                         startId + width *3 -3 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  ||
                         startId + width *4 -4 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild ||
                         startId + width *5 -5 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4}"]`).firstChild ||
                         startId + width *6 -6 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5}"]`).firstChild ||
                         startId + width *7 -7 === targetId && !document.querySelector(`[square-id="${startId + width -1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width *2 - 2}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *3 - 3}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *4 - 4}"]`).firstChild && firstChild && !document.querySelector(`[square-id="${startId + width *5 - 5}"]`).firstChild  && firstChild && !document.querySelector(`[square-id="${startId + width *6 - 6}"]`).firstChild||
                         //--
                         startId + width === targetId ||
                         startId + width *2 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                         startId + width *3 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  ||
                         startId + width *4 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  ||
                         startId + width *5 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *4}"]`).firstChild  ||
                         startId + width *6 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *5}"]`).firstChild  ||
                         startId + width *7 === targetId &&  !document.querySelector(`[square-id="${startId + width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + width *6}"]`).firstChild  ||
                         //--
                         startId - width === targetId ||
                         startId - width *2 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                         startId - width *3 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  ||
                         startId - width *4 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  ||
                         startId - width *5 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *4}"]`).firstChild  ||
                         startId - width *6 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *5}"]`).firstChild  ||
                         startId - width *7 === targetId &&  !document.querySelector(`[square-id="${startId - width}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width *2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - width *6}"]`).firstChild  ||
                         //-
                         startId + 1 === targetId ||
                         startId + 2 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                         startId + 3 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  ||
                         startId + 4 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  ||
                         startId + 5 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild  ||
                         startId + 6 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild  ||
                         startId + 7 === targetId &&  !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId +6}"]`).firstChild  ||
                         //-
                         startId - 1 === targetId ||
                         startId - 2 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                         startId - 3 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  ||
                         startId - 4 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  ||
                         startId - 5 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild  ||
                         startId - 6 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild  ||
                         startId - 7 === targetId &&  !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 2}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild  &&  !document.querySelector(`[square-id="${startId -6}"]`).firstChild  

                    ){
                        return true
                    }
                    break;
                    case 'king':
                        if(
                           startId + 1 === targetId ||
                           startId - 1 === targetId ||
                           startId + width === targetId ||
                           startId - width === targetId ||
                           startId + width -1 === targetId ||
                           startId + width +1 === targetId ||
                           startId - width -1 === targetId ||
                           startId - width +1 === targetId 


                        ){
                            return true
                        }

                
            }        
                
            

            
           
}

function changePlayer(){
    if(playerGo === "black"){
        playerGo = "white"
        reverseIds()
        playerDisplay.textContent ='white'
    }else{
        revertIds()
        playerGo = "black"
        playerDisplay.textContent="black"
    }
    console.log('Player changed to:', playerGo)
}

function reverseIds(){
  const allSquares = document.querySelectorAll(".square") 
  allSquares.forEach((square, i) => 
    square.setAttribute('square-id',(width * width -1) - i));
} 

function revertIds(){
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square,i)=>
        square.setAttribute('square-id',i));
} 

function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings)
    if(!kings.some(king=>king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = 'black player wins!'
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable',false))
    }
    if(!kings.some(king=>king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = 'white player wins!'
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable',false))
    }

}

// function revertIds(){
//     const allSquares = document.querySelectorAll(".square");
//     allSquares.forEach((square,i) => square.setAttribute('square-id',i));
// }

