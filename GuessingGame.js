function generateWinningNumber() {
    var ok = Math.random() * 100;

    if (Math.ceil(ok) === ok) {
        ok = ok + 1;
    } else {
        ok = Math.ceil(ok);
    }
    return ok;
}


function shuffle(arr) {
    var n = arr.length;
    var temp;
    var i;
    while (n) {

        i = Math.floor(Math.random() * n);
        n = n - 1;
        temp = arr[n];
        arr[n] = arr[i];
        arr[i] = temp;

    }

    return arr;
}

function Game() {

    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();

}

Game.prototype.difference = function() {

    return Math.abs(this.playersGuess - this.winningNumber);

};

Game.prototype.isLower = function() {

    if (this.playersGuess < this.winningNumber) {
        return true;
    } else {
        return false;
    }

};

Game.prototype.playersGuessSubmission = function(num) {
    if (num > 100 || num < 1 || isNaN(num)) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = num;

    var ok = this.checkGuess();


    return ok;

};


Game.prototype.checkGuess = function() {

    for (i = 0; i < this.pastGuesses.length; i++) {
        if (this.playersGuess === this.pastGuesses[i]) {
            return "You have already guessed that number.";
        }
    }
    if (this.playersGuess === this.winningNumber) {
        return "You Win!";
    } else {
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length === 5) {
            return "You Lose.";
        } else if (this.difference() < 10) {
            return "You're burning up!";
        } else if (this.difference() < 25) {
            return "You're lukewarm.";
        } else if (this.difference() < 50) {
            return "You're a bit chilly.";

        } else {
            return "You're ice cold!";
        }
    }

};


function newGame() {

    return new Game();
}

Game.prototype.provideHint = function() {

    var ok = [generateWinningNumber(), this.winningNumber, generateWinningNumber()];
    ok = shuffle(ok);
    return ok;
};

function makeAGuess(game) {
    var guess = $('#player-input').val();

    $('#player-input').val("");
    var ok = game.playersGuessSubmission(parseInt(guess));
    console.log(game.pastGuesses);
    $("h1").text(ok);


    if (game.isLower() && game.winningNumber !== parseInt(guess)) {
        $("h2").text("Guess higher.");
    } else if (!game.isLower() && game.winningNumber !== parseInt(guess)) {
        $("h2").text("Guess lower.");
    }
    if (ok === "You have already guessed that number.") {
        $("h2").text("Guess again.");

    } else if (ok === "You Win!") {
        $("#submit, #hint").prop("disabled", true);
        $("h2").text("Very good.");

        $('ul li:nth-child(' + (game.pastGuesses.length + 1) + ')').text(guess).css("color", "orange");
    } else if (ok === "You Lose.") {
        $("#submit, #hint").prop("disabled", true);
        $('ul li:nth-child(' + game.pastGuesses.length + ')').text(guess);
    } else {

        $('ul li:nth-child(' + game.pastGuesses.length + ')').text(guess);
    }

}

function reset() {
    game = newGame();
    console.log(game.winningNumber);
    $("h1").text("Use the Power of Your Inner Eye!");
    $("h2").text("Which number do you see? (1-100)");
    $("ul li").text("-").css("color", "black");
    $("#submit, #hint").prop("disabled", false);

}


$("document").ready(function() {

    var game = newGame();
    console.log(game.winningNumber);
    $("#submit").on('click', function() {
        makeAGuess(game);

    })

    $("#reset").on('click', function() {
        game = newGame();

        reset(game);

    })

    $("#hint").on('click', function() {
        $("h1").text("The number is one of the following: "+game.provideHint());

    })


    $('#player-input').keypress(function(event) {

        if (event.which == 13) {
            makeAGuess(game);
        }

    })


})
