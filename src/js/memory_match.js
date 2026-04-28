(function () {
    'use strict';

    // --- Constants ---
    var EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍒', '🥝', '🍍', '🍑'];
    var TOTAL_PAIRS = 8;
    var WRONG_DELAY_MS = 800;  // how long to show mismatched pair before flipping back

    // --- DOM references ---
    var boardEl = document.getElementById('board');
    var movesEl = document.getElementById('moves');
    var matchesEl = document.getElementById('matches');
    var totalPairsEl = document.getElementById('total-pairs');
    var timeEl = document.getElementById('time');
    var messageEl = document.getElementById('message');
    var btnNewGame = document.getElementById('btn-new-game');
    var btnReset = document.getElementById('btn-reset');

    // --- Game state ---
    var cardValues = []; // current order of faces (16 items)
    var timerId = null; // setInterval id so we can clear it
    var seconds = 0;
    var moves = 0;
    var matches = 0;
    var flippedCards = []; // the two currently flipped cards (max 2)
    var locked = false; // true while resolving a pair (ignore extra clicks)

    /**
     * Shuffle array in place using Fisher-Yates.
     * Returns a new shuffled copy.
     */
    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    /**
     * Create a span element that shows the card's face value (emoji).
     */
    function buildCardFace(value) {
        var span = document.createElement('span');
        span.className = 'card-face';
        span.textContent = value;
        return span;
    }

    /**
     * Build the game board: clear #board and create one card per value.
     * Each card is a clickable div with class .card and a hidden .card-face.
     */
    function createBoard(values) {
        if (!boardEl) return;
        boardEl.innerHTML = '';
        cardValues = values;

        for (var i = 0; i < values.length; i++) {
            (function (index) {
                var card = document.createElement('div');
                card.className = 'card';
                card.appendChild(buildCardFace(values[index]));
                card.addEventListener('click', function () {
                    handleCardClick(card, index);
                });
                boardEl.appendChild(card);
            })(i);
        }
    }

    /**
     * Create a new deck: 8 pairs (16 cards), shuffled.
     */
    function newDeck() {
        var pairs = EMOJIS.slice(0, TOTAL_PAIRS);
        var deck = pairs.concat(pairs);
        return shuffle(deck);
    }

    /** Start the elapsed-time timer (runs every 1 second). */
    function startTimer() {
        if (timerId) return;
        timerId = setInterval(function () {
            seconds++;
            if (timeEl) timeEl.textContent = seconds;
        }, 1000);
    }

    /** Stop the timer (e.g. when game is won). */
    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    /** Reset moves, matches, seconds, timer, and clear the win message in the UI. */
    function resetStatus() {
        moves = 0;
        matches = 0;
        seconds = 0;
        stopTimer();
        if (movesEl) movesEl.textContent = '0';
        if (matchesEl) matchesEl.textContent = '0';
        if (timeEl) timeEl.textContent = '0';
        if (messageEl) messageEl.textContent = '';
    }

    function updateMoves() {
        if (movesEl) movesEl.textContent = moves;
    }

    function updateMatches() {
        if (matchesEl) matchesEl.textContent = matches;
    }

    /**
     * Handle a card click: flip card, track pair, match or flip back.
     * - First click: flip one card.
     * - Second click: flip second card; if match, mark .matched; else show .wrong then flip both back.
     */
    function handleCardClick(card, index) {
        if (locked) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        startTimer();
        card.classList.add('flipped');
        flippedCards.push({ el: card, index: index });

        if (flippedCards.length === 2) {
            moves++;
            updateMoves();
            locked = true;
            var first = flippedCards[0];
            var second = flippedCards[1];
            if (cardValues[first.index] === cardValues[second.index]) {
                // Match: keep both revealed
                first.el.classList.add('matched');
                second.el.classList.add('matched');
                matches++;
                updateMatches();
                flippedCards = [];
                locked = false;
                // Game complete: stop timer and show win message
                if (matches === TOTAL_PAIRS) {
                    stopTimer();
                    if (messageEl) {
                        messageEl.textContent = 'You won! ' + moves + ' moves, ' + seconds + ' seconds.';
                    }
                }
            } else {
                // No match: briefly show .wrong, then flip both back
                first.el.classList.add('wrong');
                second.el.classList.add('wrong');
                setTimeout(function () {
                    first.el.classList.remove('flipped', 'wrong');
                    second.el.classList.remove('flipped', 'wrong');
                    flippedCards = [];
                    locked = false;
                }, WRONG_DELAY_MS);
            }
        }
    }

    /** New Game: new shuffled deck, reset all counters and message. */
    function initNewGame() {
        resetStatus();
        createBoard(newDeck());
    }

    /** Reset (Same Board): same card order, flip all back, reset counters and message. */
    function initResetSameBoard() {
        resetStatus();
        if (cardValues.length === 0) {
            createBoard(newDeck());
            return;
        }
        createBoard(cardValues.slice());
    }

    //  Wire up buttons and start first game 
    if (btnNewGame) {
        btnNewGame.addEventListener('click', initNewGame);
    }
    if (btnReset) {
        btnReset.addEventListener('click', initResetSameBoard);
    }

    if (totalPairsEl) totalPairsEl.textContent = TOTAL_PAIRS;
    initNewGame();
})();
