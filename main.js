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
                    return _money += value;
                } else if (type === "-") {
                    return _money -= value;
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
}
class Game {
    constructor(start) {
        this.deck = new Deck();
        this.stats = new Statistics();
        this.budget = new Budget(start);
        this.croupierCards = [...document.querySelectorAll('div.croupierCards img')];
        this.playerCards = [...document.querySelectorAll('div.playerCards img')];
        document.getElementById('start').addEventListener('click', this.startGame.bind(this));
        this.spanBudget = document.querySelector('.panel span.budget');
        this.inputBid = document.getElementById('bid');
        this.spanResult = document.querySelector('.score span.result');
        this.spanGames = document.querySelector('.score span.number');
        this.spanWins = document.querySelector('.score span.win');
        this.spanLosses = document.querySelector('.score span.loss');
        this.render()
    }
    render(money = this.budget.getBudgetAmount(), stats = [0, 0, 0], result = "") {
        this.spanBudget.textContent = money;
        this.spanGames.textContent = stats[0];
        this.spanWins.textContent = stats[1];
        this.spanLosses.textContent = stats[2];
        this.spanResult.textContent = "";
    }
    startGame() {
        if (this.inputBid.value < 1) return alert(`The minimum amount you can play is 1$ `)
        const bid = Math.floor(this.inputBid.value)
        if (!this.budget.checkCanPlay(bid)) {
            return alert("You dont have enough money")
        }
        this.budget.changeBudgetAmount(bid, '-');
        this.deck.shuffle();
        this.hand = new Hand();
        let playerHand = game.hand.getPlayersCards();
        console.log(playerHand)
        let croupierHand = game.hand.getCroupierCards();
        console.log(croupierHand)
    }
}

const game = new Game(1000);