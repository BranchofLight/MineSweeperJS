/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	// displayMainMenu();
	// addListeners();

	var gamesPlayed = 0;
	var gamesToPlay = 1;
	var gamesWon = 0;
	var delay = 0;

	var botInterval = setInterval(function() {
		if (gamesPlayed < gamesToPlay) {
			console.log("Game #" + (gamesPlayed+1));
			botClearView();
			gameView.displayBotGameView();

			botGameSetup({
				diff: "bot_test",
				rows: 10,
				cols: 10,
				mines: 5
			});

			while (!bot.getIsGameOver()) {
				bot.smartClick();
			}

			// var clickInterval = setInterval(function() {
			// 	bot.smartClick();
			// 	if (bot.getIsOver()) {
			// 		clearInterval(clickInterval);
			// 	}
			// }, 1000);

			// bot.printTempArrString();

			// Tell bot a new game is starting
			bot.setIsGameOver(false);
			gamesPlayed += 1;
			gamesWon += (bot.getDidWinLast()) ? 1 : 0;
			console.log("The bot has won " + gamesWon + " games.");
		} else {
			clearInterval(botInterval);
		}
	}, delay);


});

// var testEquals = function(num) {
// 	for (var i = 0; i < num; i++) {
// 		var scale = 10;
// 		var expected = false;
// 		var arr1 = [];
// 		var arr2 = [];
//
// 		// Populate arr1
// 		for (var j = 0; j < 8; j++) {
// 			arr1.push(randomCell());
// 		}
//
// 		// Make random decisions to arr2
// 		var randNum = Math.floor(Math.random() * 5);
// 		// Make it arr1
// 		if (randNum === 0) {
// 			arr2 = arr1;
// 			expected = true;
// 		} else if (randNum === 1) {
// 			// Make it mostly arr1
// 			arr2 = arr1.slice(0, arr1.length-2);
// 			arr2.push(randomCell());
// 			expected = false;
// 		} else if (randNum === 2) {
// 			arr2 = [];
// 			expected = false;
// 		} else {
// 			// Populate arr2
// 			for (var j = 0; j < 8; j++) {
// 				arr2.push(randomCell());
// 			}
// 			// Unknown
// 			expected = null;
// 		}
//
// 		console.log("Test #" + (i+1) + " of " + num);
// 		if (expected !== null) {
// 			if (expected !== adjEquals(arr1, arr2)) {
// 				console.log("Expected " + expected);
// 				console.log("arr1: " + getString(arr1));
// 				console.log("arr2: " + getString(arr2));
// 				console.log("Return: " + adjEquals(arr1, arr2));
// 			} else {
// 				console.log("Test passed.");
// 			}
// 		} else {
// 			console.log("No expectation");
// 			console.log("arr1: " + getString(arr1));
// 			console.log("arr2: " + getString(arr2));
// 			console.log("Return: " + adjEquals(arr1, arr2));
// 		}
// 	}
// }
//
// var randomCell = function() {
// 	var ran = Math.floor(Math.random() * 11);
// 	var c = null;
// 	if (ran >= 0 && ran <= 8) {
// 		c = cell(0, 0, ran);
// 		c.setIsClicked(true);
// 		return c;
// 	} else if (ran === 9) {
// 		c = cell(0, 0, ran);
// 		c.setIsClicked(true);
// 		return c;
// 	} else {
// 		c = cell(0, 0, ran);
// 		c.setIsClicked(true);
// 		return c;
// 	}
// }
//
// var getString = function(arr) {
// 	var str = "[";
// 	for (var i = 0; i < arr.length; i++) {
// 		str += arr[i].getShownValue() + ", ";
// 	}
// 	return str + "]";
// }
