const duty = 1
const suits = ['Oracle', 'Sword', 'Mermaid', 'Kraken', 'Map', 'Anchor', 'Hook', 'Cannon', 'Key', 'Chest'];
const wholeCardSet = []
let playDeck = []
let playBoard = []
let hand = []
let handSuit = {
    Oracle: [],
    Sword: [],
    Mermaid: [],
    Kraken: [],
    Map: [],
    Anchor: [],
    Hook: [],
    Cannon: [],
    Key: [],
    Chest: []
}
const opponent = []
let discardPile = []
let drawFlag = true

const draw = undefined;

const deckContainer = document.querySelector('.deck-container')
const playContainer = document.querySelector('.play-container')
const discardContainer = document.querySelector('.discard-container')
const message = document.querySelector('.message')
const container = document.querySelector(".drag-container");
const handContainer = document.querySelector('.board-hand-area')


createCardSet(suits, wholeCardSet)
InitDeck(playDeck, wholeCardSet, discardPile)
shuffle(playDeck)
createCardPile()
startTurn()

function createCardSet(suits, wholeCardSet) {
    suits.forEach(suit => {
        for (let i = 2; i <= 5; i++) {
            wholeCardSet.push({suit: suit, number: i})
        }
    })
}

function InitDeck(deck, cardSet, discard) {
    cardSet.forEach(card => {
        if (card.number === 2) {
            discard.push(card)
        } else {
            deck.push(card)
        }
    })
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function createCardPile() {
    playContainer.innerHTML = ''
    let html = '';
    playDeck.map((card, index) => {
        let url = `asset/${card.suit}.png`
        html += `<div class="card-wrapper pile"
                             data-suit="${card.suit}"
                             data-number="${card.number}">
                        <div class="card" style="--i: ${index}">
                            <div class="back"><h1>Click</h1></div>
                            <div class="face"
                            style='background: url("${url}"); background-size: cover'
                            >${card.number}
<!--                                <img src="asset/${card.suit}.png" style="object-fit: cover;width: 100%; height: 100%">-->
                            </div>
                        </div>
                    </div>`
    })
    deckContainer.insertAdjacentHTML("afterbegin", html)
    html = '';
    discardPile.map((card, index) => {
        html += `<div class="card-wrapper pile"
                             data-suit="${card.suit}"
                             data-number="${card.number}">
                        <div class="card" style="--i: ${index}">
                            <div class="back"><h1>Discard</h1></div>
                            <div class="face"></div>
                        </div>
                    </div>`
    })
    discardContainer.insertAdjacentHTML("afterbegin", html)
}

deckContainer.addEventListener('change', () => {
    if (playDeck.length === 0) {
        //game end
    }
})

/**
 *  최초 탑카드 온클릭
 */
function startTurn() {
    drawFlag = true
    deckContainer.lastChild.addEventListener("click", (e) => {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        const target = e.currentTarget
        target.classList.remove("pile")
        target.lastElementChild.classList.add('open')
        if (drawFlag) {
            drawFlag = false
            // const target =  e.currentTarget
            const bust = isBust()
            if (bust) {
                occurBust(target)
            } else {
                draggable(target)
            }
        }
    })
}

document.querySelector('.start').addEventListener('click', e => {
    startTurn()
})

/**
 *  드래그완료 후 탑카드 온클릭 루프
 */
playContainer.addEventListener("dragover", e => {
    e.stopImmediatePropagation()
    e.stopPropagation()
    e.preventDefault()
    const selectedItem = document.querySelector(".dragging");

    let isAppend = playContainer.appendChild(selectedItem)
    if (isAppend) {
        drawFlag = true
        onClickDraw(playDeck, playBoard, drawFlag, discardPile)
    }
})

/**
 * 탑카드 온클릭
 */
function onClickDraw() {
    // deckContainer.querySelector('div:not(.pile)')
    deckContainer.lastChild.addEventListener("click", (e) => {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        const target = e.currentTarget
        target.classList.remove("pile")
        target.lastElementChild.classList.add('open')
        if (drawFlag) {
            drawFlag = false
            const bust = this.isBust()
            if (bust) {
                console.log('bust')
                occurBust(target)
            } else {
                draggable(target)
            }
        }
    })
}

function draggable(target) {
    target.removeEventListener('click', null)

    target.setAttribute('draggable', true)
    target.addEventListener("dragstart", () => {
        target.classList.add("dragging")
    })
    target.addEventListener("dragend", () => {
        target.classList.remove("dragging");
    })
}

function isBust() {
    const draw = playDeck.pop()
    const result = playBoard.filter(card =>
        card.suit === draw.suit
    )
    playBoard.push(draw)
    return result.length > 0;

}

function occurBust(target) {
    message.classList.add('popup')
    setTimeout(() => {
        deckContainer.removeChild(target)
        discardPile.push(...playBoard)
        playBoard = []
        createDiscardPile()
        message.classList.remove('popup')
    }, 2000)
}

function createDiscardPile() {
    playContainer.innerHTML = '';
    let html = '';
    discardPile.map((card, index) => {
        html += `<div class="card-wrapper pile"
                             data-suit="${card.suit}"
                             data-number="${card.number}">
                        <div class="card" style="--i: ${index}">
                            <div class="back"><h1>discard</h1></div>
                            <div class="face"></div>
                        </div>
                    </div>`
    })
    discardContainer.innerHTML = ''
    discardContainer.insertAdjacentHTML("afterbegin", html)
}

document.querySelector('.end-turn-btn').addEventListener('click', () => {
    if (drawFlag) endTurn()
})

function endTurn() {
    hand.push(...playBoard)
    playBoard = []
    for (let suit in handSuit) {
        hand.forEach((card) => {
            if (suit === card.suit) {
                handSuit[suit].push(card)
            }
        })
    }
    hand = []
    createHand()
}

function createHand() {
    playContainer.innerHTML = '';
    let html = '';
    for (let suit in handSuit) {
        handSuit[suit].map((card, index) => {
            let url = `asset/${card.suit}.png`
            html += `<div class="card-wrapper"
                            data-suit="${card.suit}"
                            data-number="${card.number}"
                            style="--i: ${index}">
                        <div class="card open">
                            <div class="back"></div>
                            <div class="face"
                                 style='background: url("${url}");
                                        background-size: cover'
                            >${card.number}</div>
                        </div>
                    </div>`
        })
        handContainer.querySelector(`.${suit}`).innerHTML = suit
        handContainer.querySelector(`.${suit}`).insertAdjacentHTML("afterbegin", html)
        html = '';
    }
}

function useAbility(card) {
    switch (card.suit) {
        case 'Oracle':
            break;
        case 'Sword':

            break;
        case 'Kraken':
            break;
        case 'Map':
            break;
        case 'Anchor':
            break;
        case 'Hook':
            break;
        case 'Cannon':
            break;
        case 'Key':
            break;
        case 'Chest':
            break;

    }

}

