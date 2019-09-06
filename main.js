class Budget {
    constructor(money) {
        let _money = money;
        // pobranie aktualnego stanu budzetu
        this.getBudgetAmount = () => _money;
        // sprawdzanie, czy gracza stac na gre
        this.checkCanPlay = (value) => {
            if (_money >= value) return true;
            return false;
        }
        //zmiana stanu budzetu
        this.changeBudgetAmount = (value, type = "+") => {
            if (typeof value === "number" && !isNaN(value)) {
                if (type === "+") {
                    return _money += 2 * value;
                } else if (type === "-") {
                    return _money -= value;
                } else if (type === "=") {
                    return _money += value;
                } else {
                    throw new Error("Invalid type of operation")
                }
            } else {
                throw new Error("Invalid number")
            }
        }

    }
}
class Statistics {
    constructor() {
        this.gameResults = [];

    }
    addDealToStatistics(win) {
        let gameResult = {
            win: win
        }
        this.gameResults.push(gameResult)
    }
    showGameStatistics() {
        let games = this.gameResults.length
        let wins = this.gameResults.filter(result => result.win).length;
        let losses = this.gameResults.filter(result => !result.win).length;
        return [games, wins, losses]
    }
}
const stats = new Statistics()
class Deck {
    constructor() {
        // utworzenie talii
        this.deck = [];
        const suits = ['H', 'S', 'C', 'D'];
        const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        suits.forEach((suit, k) => {
            values.forEach((value, i) => {
                let card = {
                    cardName: `${values[i]}${suits[k]}`,
                    value: values[i]
                }
                this.deck.push(card);
            })
        })
        //tasowanie
        this.shuffle = () => {
            let deckLength = this.deck.length;
            let temp, index;
            while (deckLength > 0) {
                index = Math.floor(Math.random() * deckLength);
                deckLength--;
                temp = this.deck[deckLength];
                this.deck[deckLength] = this.deck[index];
                this.deck[index] = temp;
            }
            return this.deck
        }
        // rozdanie karty i usuniecie jej z tablicy
        this.dealCard = () => {
            return (this.deck.shift());

        }


    }
}

class Hand {
    constructor() {
        let _playerHand = this.playersCardDeal();
        let _croupierHand = this.croupiersCardDeal();
        this.getPlayersCards = () => _playerHand;
        this.getCroupierCards = () => _croupierHand;
    }
    croupierGetRestCards() {
        {
            const card = game.deck.dealCard();
            game.croupierHand.push(card)
        }
        return game.croupierHand
    }
    playersCardHit() {
        {
            const card = game.deck.dealCard();
            game.playerHand.push(card)
        }
        return game.playerHand
    }
    playersCardDeal() {
        let playerCards = [];
        for (let i = 0; i < 2; i++) {
            const card = game.deck.dealCard();
            playerCards.push(card)
        }
        return playerCards
    }
    croupiersCardDeal() {
        let croupierCards = [];
        for (let i = 0; i < 1; i++) {
            const card = game.deck.dealCard();
            croupierCards.push(card)
        }
        return croupierCards
    }
    checkHandValue(hand) {
        this.aceValueReduce = 0;
        this.valueHand = 0;
        hand.forEach(card => {
            if (typeof card.value === "number") {
                this.valueHand += card.value
            }
            if (typeof card.value === "string" && card.value === "A") {
                this.valueHand += 11
            } else if (typeof card.value === "string") this.valueHand += 10;
            if (this.valueHand > 21 && hand.filter(card => card.value === "A").length > this.aceValueReduce) {
                this.valueHand -= 10
                this.aceValueReduce++
            }
        })
        return this.valueHand

    }
}
class Result {
    constructor() {}
    checkWinHit(value) {
        console.log(value)
        if (value > 21) {
            game.btnHit.disabled = true;
            game.btnStay.disabled = true;
            game.btnPlay.removeAttribute('disabled');
            game.stats.addDealToStatistics(false);
            game.render(game.budget.getBudgetAmount(), game.stats.showGameStatistics())
            game.playerHandValue.textContent = `Sorry! You went over 21!`;

        }

    }
    checkWinStay(valueCroupier, valuePlayer) {
        if (valueCroupier > 21) {
            game.btnHit.disabled = true;
            game.btnStay.disabled = true;
            game.btnPlay.removeAttribute('disabled');
            game.stats.addDealToStatistics(true);
            game.budget.changeBudgetAmount(game.bid, "+")
            game.render(game.budget.getBudgetAmount(), game.stats.showGameStatistics())
            game.playerHandValue.textContent = `Nice! Dealer has over 21!, You won!`;
            return
        }
        if (valueCroupier > valuePlayer) {
            game.btnHit.disabled = true;
            game.btnStay.disabled = true;
            game.btnPlay.removeAttribute('disabled');
            game.stats.addDealToStatistics(false);
            game.render(game.budget.getBudgetAmount(), game.stats.showGameStatistics())
            game.playerHandValue.textContent = `Sorry! Dealer has more`;
            return
        }
        if (valueCroupier < valuePlayer) {
            game.btnHit.disabled = true;
            game.btnStay.disabled = true;
            game.btnPlay.removeAttribute('disabled');
            game.stats.addDealToStatistics(true);
            game.budget.changeBudgetAmount(game.bid, "+")
            game.render(game.budget.getBudgetAmount(), game.stats.showGameStatistics())
            game.playerHandValue.textContent = `Nice! You won!`;
            return
        }
        if (valueCroupier == valuePlayer) {
            game.btnHit.disabled = true;
            game.btnStay.disabled = true;
            game.btnPlay.removeAttribute('disabled');
            game.budget.changeBudgetAmount(game.bid, "=")
            game.render(game.budget.getBudgetAmount(), game.stats.showGameStatistics())
            game.playerHandValue.textContent = `It's draw`;
            return
        }

    }
}
class Game {
    constructor(start) {
        this.result = new Result()
        this.stats = new Statistics();
        this.budget = new Budget(start);
        this.croupierCards = [...document.querySelectorAll('div.croupierCards img')];
        this.playerCards = [...document.querySelectorAll('div.playerCards img')];
        this.btnPlay = document.getElementById('start')
        this.btnPlay.addEventListener('click', this.startGame.bind(this));
        this.btnHit = document.querySelector('.hit');
        this.btnStay = document.querySelector('.stay');
        this.spanBudget = document.querySelector('.panel span.budget');
        this.inputBid = document.getElementById('bid');
        this.spanResult = document.querySelector('.score span.result');
        this.spanGames = document.querySelector('.score span.number');
        this.spanWins = document.querySelector('.score span.win');
        this.spanLosses = document.querySelector('.score span.loss');
        this.divCroupierCards = document.querySelector('.croupierCards');
        this.divPlayerCards = document.querySelector('.playerCards');
        this.playerHandValue = document.querySelector('.playerValue');
        this.render()
        this.FlagEventListenerHit = 1;
        this.FlagEventListenerStay = 1;

    }
    cleanTable() {
        while (this.divCroupierCards.hasChildNodes()) {
            this.divCroupierCards.removeChild(this.divCroupierCards.firstChild);
        }
        while (this.divPlayerCards.hasChildNodes()) {
            this.divPlayerCards.removeChild(this.divPlayerCards.firstChild);
        }
    }

    renderCroupierHandTable(hand) {

        hand.forEach(card => {
            let croupierCard = document.createElement('img');
            croupierCard.setAttribute("src", `images/${card.cardName}.png`)
            game.divCroupierCards.appendChild(croupierCard)
        })


    }
    renderPlayerHandTable(hand) {
        hand.forEach(card => {
            let playerCard = document.createElement('img');
            playerCard.setAttribute("src", `images/${card.cardName}.png`)
            game.divPlayerCards.appendChild(playerCard)
        })


    }


    render(money = this.budget.getBudgetAmount(), stats = [0, 0, 0], result = "") {
        this.spanBudget.textContent = money;
        this.spanGames.textContent = stats[0];
        this.spanWins.textContent = stats[1];
        this.spanLosses.textContent = stats[2];
        this.spanResult.textContent = result;
    }
    startGame() {
        this.btnHit.removeAttribute('disabled');
        this.btnStay.removeAttribute('disabled');
        this.btnPlay.disabled = true;
        this.cleanTable();
        if (this.inputBid.value < 1) return alert(`The minimum amount you can play is 1$ `)
        this.bid = Math.floor(this.inputBid.value)
        if (!this.budget.checkCanPlay(this.bid)) {
            return alert("You dont have enough money")
        }
        this.deck = new Deck();
        this.budget.changeBudgetAmount(this.bid, '-');
        this.deck.shuffle();
        this.hand = new Hand();
        this.playerHand = this.hand.getPlayersCards();
        this.croupierHand = this.hand.getCroupierCards();
        this.renderAfterStartGame(this.playerHand, this.croupierHand);
        if (this.FlagEventListenerHit) {
            this.btnHit.addEventListener('click', this.hitCard.bind(this))
            this.FlagEventListenerHit = 0;
        }
        if (this.FlagEventListenerStay) {
            this.btnStay.addEventListener('click', this.chooseToStay.bind(this))
            this.FlagEventListenerStay = 0;
        }

    }
    renderAfterStartGame(playerHand, croupierHand, money = this.budget.getBudgetAmount(), handValue = this.hand.checkHandValue(playerHand)) {
        this.renderCroupierHandTable(croupierHand);
        this.renderPlayerHandTable(playerHand);
        this.spanBudget.textContent = money;
        this.playerHandValue.textContent = `You have ${handValue}`;
    }
    hitCard() {
        this.cleanTable();
        game.playerHand = this.hand.playersCardHit()
        this.renderAfterStartGame(this.playerHand, this.croupierHand);
        game.result.checkWinHit(this.hand.checkHandValue(this.playerHand))

    }
    chooseToStay() {
        this.cleanTable();
        game.croupierHand = this.hand.croupierGetRestCards();
        while (game.hand.checkHandValue(game.croupierHand) < 17) {
            game.croupierHand = game.hand.croupierGetRestCards()
        }
        this.renderAfterStartGame(this.playerHand, this.croupierHand);
        game.result.checkWinStay(this.hand.checkHandValue(this.croupierHand), this.hand.checkHandValue(this.playerHand))


    }

}

const game = new Game(1000);