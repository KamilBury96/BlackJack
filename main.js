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

class Deck {
    constructor() {
        // utworzenie talii
        this.deck = [];
        const suits = ['H', 'S', 'C', 'D'];
        const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        suits.forEach((suit, k) => {
            values.forEach((value, i) => {
                this.deck.push(`${values[i]}${suits[k]}`)
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


const deck = new Deck();
const budget = new Budget(200);
console.log(deck.deck);