/*
 * Create a list that holds all of your cards
 */
let cardsArray = ["fa-bomb","fa-anchor","fa-diamond","fa-bolt","fa-paper-plane-o","fa-bolt","fa-leaf","fa-bicycle",
    "fa-cube","fa-bomb","fa-diamond","fa-anchor","fa-paper-plane-o","fa-cube","fa-leaf","fa-bicycle"];

let deck = document.querySelector('ul.deck');
let fragment = document.createDocumentFragment();

//function to empty the deck and then to shuffle and reassign cards to deck lists
function emptyAndShuffle(cardsArray){
    emptyDeck();
    shuffleCards(cardsArray).forEach(function(cardItem) {
        //create list for each item(card) in the array
        let createListElement = document.createElement('li');
        //add class card to createListElement
        createListElement.classList.add('card');
        //create SpanElement
        let createSpanElement = document.createElement('span');
        //add class fa to createListElement
        createSpanElement.classList.add('fa');
        //add each card Item(card) in the cardsArray as class to each span
        createSpanElement.classList.add(cardItem);
        //add createSpanElement to each createListElement
        createListElement.appendChild(createSpanElement);
        //add createListElement to fragment element
        fragment.appendChild(createListElement);
    });
    //add fragment to deck
    deck.appendChild(fragment);
}

// create a function to delete all card classes for each list in the deck div
let emptyDeck = function deckEmpty() {
	let cardLists = document.querySelectorAll('li.card'); 
	for(let i = 0; i < cardLists.length ; i++) {
		cardLists[i].remove();
	}
}	

// Shuffle function from http://stackoverflow.com/a/2450976
let shuffleCards =  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}  
emptyAndShuffle(cardsArray);

// clicking reset button
let restart = document.querySelector(".restart");
restart.addEventListener("click",function(restartButton) {
    closeMessage();
});

// clicking on playAgainButton to reset the game
let playAgainButton = document.querySelector(".playAgain-button");
function clickPlayAgain() {
    playAgainButton.addEventListener("click",function(playagain) {
        closeMessage();
    });

}
clickPlayAgain();

//creat function to show hidden stars on the display after game is finished
function showStars() {
    if (starsNumber == 2) {
        starOne.style.display = 'block';
    } else if (starsNumber == 1) {
        starTwo.style.display = 'block';
        starOne.style.display = 'block';
    }

}	

// stop counting time & reset all variables & reshuffle the cards
function callReset() {
    stopCounting();
    timer.innerHTML= '0:0';
    counter.innerHTML = '0';
    moveCounter = 0;
    minute = 0;
    seconds = 0;
    openCards.length = 0;
    cardSymbol.length = 0;
    lockedCards.length = 0;
    showStars();
    starsNumber = 3;
    emptyAndShuffle(cardsArray);
    //calls init() to rerun the game
    init();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// define variables 
openCards = [];
cardSymbol = [];
moveCounter = 0;
let counter = document.querySelector('.moves');
lockedCards = [];
seconds = 0;
minute = 0;
time = 0;
let timer = document.querySelector('.countTime');

/*
select congratulations modal 
*/
let closeModalButton = document.querySelectorAll('[data-modal-close]');
let overlay = document.getElementById('overlay');


//count time starting from the first card move
function startTimer() {
    time = setInterval(function() {
        seconds++;
        timer.innerHTML = minute +":"+ seconds;
        if (seconds == 60) {
            minute++;
            seconds = 0;
        }
    }, 1000);
}    

// stop the time function
function stopCounting ()	{
    clearInterval (time);
}

//counts the moves 
function movecounter() {
    moveCounter++ 
    counter.innerHTML = moveCounter;
    //start the timer if move counts is 1 
    if (moveCounter===1) {
       startTimer();
    }
}

//function explains what to do when two cards are matched 
function match() {
    openCards.forEach(function(card) {
        card.classList.add('show', 'open', 'match');
        //increment lockedcards.length by 1 for each matched two cards
        lockedCards.push(card);  //  add the card to lockedCards list
        modalMessage(); // when all cards are matched modalmessage will appear    
    });
    openCards.length = 0;
    cardSymbol.length = 0;
}


//function explains what to do when two selected cards are not matched
function unmatch() {
    openCards.forEach(function(card) {
        card.classList.remove('show', 'open');

    });
    openCards.length = 0;
    cardSymbol.length = 0;
}


//prevents card from matching with itself
function preventSelfMatching() {
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(function(cardClick) {
        cardClick.addEventListener("click",function(cardIsClicked) {
            //if openCards.length is 1 and (card.classList.contains('show') then unmatch 
            if (openCards.length == 1 && cardClick.classList.contains('show')) {
                unmatch();
            } 
        });
    });
}


//Stars rating
let starOne = document.getElementsByClassName('fa fa-star')[0];
let starTwo = document.getElementsByClassName('fa fa-star')[1];

let starsNumber = 3;
function starRating()  {
    if (moveCounter ===30) {
        starOne.style.display = 'none';
        starsNumber--;
    }else if (moveCounter === 40) {
        starTwo.style.display = 'none';  
        starsNumber--;
    }
}

/*
functions for congratulations modal 
*/
function modalMessage() {
    //if all cards are matched, then display popup message with the score 
    if (lockedCards.length==16)  {   
        congratulationsAllMatched();  
    }

    
    //close popup meassge when X button is clicked 
    closeModalButton.forEach(function(button) {
        button.addEventListener("click",() => {
            let modal = button.closest('.modal')
            closeMessage();
        });
    });
        
   
    //close popup meassge for any click on the overlay
    overlay.addEventListener("click", () => {
        let allModals= document.querySelectorAll('.modal.active')
        allModals.forEach(modal => {
            closeMessage();
        });
    });
}

function closeMessage() { 
    modal.classList.remove('active');
    overlay.classList.remove('active'); 
    callReset();
}  

function congratulationsAllMatched() {
    modal.classList.add('active');
    overlay.classList.add('active');
    innerMessage();
    stopCounting ();
}

//inner message of modal 
let modalParagraph = document.querySelector(".modal-paragraph");
function innerMessage() {
    modalParagraph.innerHTML = `You are a winner &#128522; you made ${moveCounter} moves in ${minute} minutes
    ${seconds} seconds &#128356; your final rate is ${starsNumber} stars`;
}




function init(init) {
    preventSelfMatching();
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card) {
        //display the card's symbol add the card to a list of open cards if card is clicked 
        card.addEventListener("click",function(displaycard) {
            card.classList.add('show', 'open');
            openCards.push(card);
            cardSymbol.push(card.innerHTML);
            let currentCard = cardSymbol[0]; 
            let previousCard = cardSymbol[1];
            //counts one move when each time openCards.length == 1
            if (openCards.length == 1)  { 
                movecounter();  
            }
            //if the list already has another card, check to see if the two cards match
            if (openCards.length == 2)  { 
                setTimeout (function(){
                    openCards.forEach(function(card) {
                        if (currentCard==previousCard)  {   
                            //if the cards do match, lock the cards in the open position
                            match();
                        } else {
                            //if the cards do not match, close the cards.
                            unmatch();  
                        } 
                    });
                    //calling Star rating function  
                    starRating();         
                }, 0);
            }
        });  
    });
    
}
init();
starRating();