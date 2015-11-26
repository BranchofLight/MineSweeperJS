/**
 * Things needed:
 * - bot (all ACTIONS)
 * - some snapshot of adjacent cells and percentage of it not being a mine
 * - array holding all unique snapshots that are not surrounded by all blanks and/or NaNs
 */

/**
 * Order of TODO:
 * 1) Create bot [x]
 * 2) Click randomly [x]
 * 3) Confirm correct number of games are being played [x]
 * 4) Create array compare and TEST TEST TEST [x]
 * 5) Create snapshot object
 * 6) Create array of unique snapshots (make sure no all blank/NaNs!!!!)
 */

/**
 * Converts, then compares two adjacent cell arrays
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Boolean}
 */
var adjEquals = function(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i].getShownValue() !== arr2[i].getShownValue()) {
      return false;
    }
  }

  return true;
};

/**
 * Checks to see if a cell is surrounded by blanks/NaNs
 * @param {Object} cellToCheck
 * @return {Boolean}
 */
var isBlankAdj = function(cellToCheck) {
  var adj = botGetAdjacentCells(cellToCheck);
  for (var i = 0; i < adj.length; i++) {
    if (adj[i].getShownValue() !== blank() &&
        !isNaN(adj[i].getShownValue())) {
      return false;
    }
  }

  return true;
};

/**
 * The bot's view of a click
 * @param {Object} cellToUse
 * @param {Boolean} wasMine
 */
var clickSnapshot = function(cellToUse, wasMine) {
  var chanceOfMine = (wasMine) ? 1 : 0;
  // Must be calcualted immediately to accurately represent what
  // was seen at the time of the click
  var adjacentCells = botGetAdjacentCells(cellToUse);
  var numOfClicks = 1;

  return {
    getAdjCells: function() {
      return adjacentCells;
    },
    getChanceOfMine: function() {
      return chanceOfMine;
    },
    getNumOfClicks: function() {
      return numOfClicks;
    },
    addMineClick: function() {
      var numOfMines = chanceOfMine * numOfClicks;
      numOfClicks += 1;
      numOfMines += 1;
      chanceOfMine = numOfMines / numOfClicks;
    },
    addSafeClick: function() {
      // Since we store the chance of a mine,
      // we simply add a click and recalc the percentage
      numOfClicks += 1;
      chanceOfMine = numOfMines / numOfClicks;
    }
  };
};

/**
 * TODO:
 * - store new clicks (no duplicates! no all blanks/NaN!)
 * - retrieve clicks
 * - .contains(new click)
 */
var clickContainer = function() {
  var arr = [];

  return {
    getLength: function() {
      return arr.length;
    },
    /**
     * Handles adding a click to {Array} arr
     * Does not add: duplicates, cells with all blank
     * and/or NaN adjacent cells
     * Instead: calculates new percentage for duplicates, does not add cells with
     * all blank and/or NaN adjacent cells
     * @param {Object} cellToAdd
     */
    addClick: function(cellToAdd) {
      var adj = botGetAdjacentCells(cellToAdd);
      var isValid = isBlankAdj(cellToAdd);

      console.log("Valid?: " + isValid);

      var foundMatch = false;
      if (isValid) {
        for (var i = 0; i < arr.length && !foundMatch; i++) {
          if (adjEquals(arr[i].getAdjCells(), adj)) {
            if (cellToAdd.getShownValue() === mine()) {
              arr[i].addMineClick();
              foundMatch = true;
            } else {
              arr[i].addSafeClick();
              foundMatch = true;
            }
          }
        }

        if (!foundMatch) {
          var isMine = cellToAdd.getShownValue() === mine();
          arr.push(clickSnapshot(cellToAdd, isMine));
        }
      }
    },
    /**
     * Returns the percentage of whether the cell is a mine
     * Returns NaN on failure to find cell
     * @param {Object} cellCompare
     * @return {Object} clickSnapshot
     */
    getMineChance: function(cellCompare) {
      for (var i = 0; i < arr.length; i++) {
        if (adjEquals(arr[i].getAdjCells(), botGetAdjacentCells(cellCompare))) {
          return arr[i].getChanceOfMine();
        }

        return NaN;
      }
    }
  };
}();

// Contains all actions for the bot
var bot = function() {
  var isGameOver = false;
  var didWinLast = false;

  var clickCell = function(cellToClick) {
    // Standard cell click procedure
    cellToClick.setIsClicked(true);
    gameView.refreshCell(cellToClick);
    gameView.setClickedClass(cellToClick, true);

    // Reveal cells if applicable
    if (cellToClick.getShownValue() === blank()) {
      gameView.revealAdjacentCells(cellToClick);
    }

    clickContainer.addClick(cellToClick);

    // Handle win or loss
    if (checkWin()) {
      bot.setIsGameOver(true);
      bot.setDidWinLast(true);
    } else if (cellToClick.getRealValue() === mine()) {
      bot.setIsGameOver(true);
      bot.setDidWinLast(false);
   }
 };

  return {
    getIsGameOver: function() {
      return isGameOver;
    },
    setIsGameOver: function(val) {
      isGameOver = (typeof val === "boolean") ? val : false;
    },
    getDidWinLast: function() {
      return didWinLast;
    },
    setDidWinLast: function(val) {
      didWinLast = (typeof val === "boolean") ? val : false;
    },
    randomClick: function() {
      var randRow = Math.floor(Math.random() * (gameField.getRows()));
      var randCol = Math.floor(Math.random() * (gameField.getColumns()));

      // Keep generating cells until an unclicked cell is found
      while (gameField.getCell(randRow, randCol).getIsClicked()) {
        randRow = Math.floor(Math.random() * (gameField.getRows()));
        randCol = Math.floor(Math.random() * (gameField.getColumns()));
      }

      console.log("randomly clicking");
      console.log("r: " + randRow);
      console.log("c: " + randCol);

      clickCell(gameField.getCell(randRow, randCol));
    },
    smartClick: function() {
      var map = {};
      var hasClicked = false;
      // Iterate over grid
      for (var i = 0; i < gameField.getRows() && !hasClicked; i++) {
        for (var j = 0; j < gameField.getColumns() && !hasClicked; j++) {
          var fieldCell = gameField.getCell(i, j);
          // Is it surrounded by invalid date? Then skip it
          if (!isBlankAdj(fieldCell)) {
            // Otherwise, continue
            var chance = clickContainer.getMineChance(fieldCell);
            // Is the chance a real number (eg. exist)?
            if (!isNaN(chance)) {
              // Is there no chance its a mine?
              if (chance === 0) {
                // Then click it!
                clickCell(fieldCell);
                hasClicked = true;
              } else {
                // Otherwise it might be a mine, so lets get all data first
                if (map.hasOwnProperty(chance)) {
                  map[chance].push(fieldCell);
                } else {
                  map[chance] = [fieldCell];
                }
              }
            }
          }

          // If there were no sure things found
          if (!hasClicked) {
            // Then lets look at any data we collected
            var percentageArr = [];
            for (var prop in map) {
              // Add all arrays of cells to one array to sort
              percentageArr.push(prop);
            }

            // Did we find anything?
            if (percentageArr.length > 0) {
              // If so, lets sort it
              percentageArr.sort(function(a, b) { return a-b; });
              // Since it sorts in ascending order, we should get the
              // cell with the lowest possible chance of being a mine
              // eg. the first cell

              // map contains percentages as keys and an array of cells as vals
              // percentageArr contains the percenteages
              // Therefore, percentageArr[0] is the lowest possible percentage
              // and map[percentageArr[0]] is the array of that possibility
              // Finally, map[percentageArr[0]][0] is the first cell of that arr
              clickCell(map[percentageArr[0]][0]);
              hasClicked = true;
            } else {
              // No information we collected helped yet, so just click randomly
              this.randomClick();
            }
          }
        }
      }
    }
  };
}();
