/**
 * Purpose: Game Logic
 * Source:  src/logic.js
 */

 /**
  * Sets up any variables needing defaults
  * Note: should be called before anything else
  */
 var gameSetup = function() {
   /* Placeholder until something else sets mine amount */
   gameField.setTotalMines(10);
   /* Placeholder until something else triggers the field generation */
   gameField.generateField(9, 9);

   // Set timer to 0 seconds and to increment
   timer.setTimeLeft(0, true);
   /* Placeholder until something else triggers the timer's start */
   // Makes the timer count down by 1 second each second
   // {Number} leap is both the refresh rate and decrement amount
   timer.startTimer(1000);

   // Display all views
   gameView.displayGameView();
 };

 /**
  * Returns a blank cell value
  * @return {String} ' '
  */
var blank = function() {
 	return ' ';
};

/**
 * Returns a mine cell value
 * @return {String} 'X'
 */
var mine = function() {
  return 'X';
};

 /**
  * Name: gameField
  * Purpose: Object holding all information
  * about the game field
  */
var gameField = function () {
	/* Private Variables */
	var rows = 0;
	var columns = 0;
	var field = [];
  var totalMines = 0;

	/* Object Literal */
	return {
    // Sets the total number of mines on the field
    setTotalMines: function(m) {
      totalMines = m;
    },
    /**
     * Gets flags left to place
     * @return {Number} flagsLeft
     */
    getFlagsLeft: function() {
      var flagsFound = 0;
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          if (field[i][j].getIsFlagged()) {
            flagsFound += 1;
          }
        }
      }

      return totalMines - flagsFound;
    },
		// Returns columns
		getColumns: function() {
			return columns;
		},
		// Returns rows
		getRows: function() {
			return rows;
		},
		getCell: function(r, c) {
			return field[r][c];
		},
		/**
		 * Returns a generated empty
		 * . field based on given paramaters
		 * @param {Number} rows
		 * @param {Number} columns
		 * @return {Array} arr
		 */
		generateField: function(r, c) {
			// Set new values
			rows = (typeof r === "number") ? r : 0;
			columns = (typeof c === "number") ? c : 0;
      // Get mine locations
      var mineLocations = this.generateMineLocations();
      // Create iterators early to be used multiple times
      var i = 0, j = 0;
			// Push new field onto field
			for (i = 0; i < rows; i++) {
				// New array (row)
				field.push([]);
				for (j = 0; j < columns; j++) {
          var foundMine = false;
          // Loop through mine locations to see if there are any matches
          for (var x = 0; x < mineLocations.length; x++) {
            // If loop is at a mine location
            if (mineLocations[x][0] === i && mineLocations[x][1] === j) {
              foundMine = true;
              // Remove element in hopes of gaining efficiency on large
              // . arrays
              mineLocations.splice(x, 1);
              // Leave loop, we found a mine
              break;
            }
          }
          if (!foundMine)
            field[i].push(cell(i, j, blank()));
          else
            field[i].push(cell(i, j, mine()));
				}
			}
      // With mines and cells generated, time to calculate and add numbers
      for (i = 0; i < rows; i++) {
				for (j = 0; j < columns; j++) {
          // If the value is not a mine
          if (field[i][j].getRealValue() !== mine()) {
            // Calculate adjacent mines
            var newVal = numOfAdjacentMines(field[i][j]);
            // Make sure it isn't zero which will be blank!
            if (newVal !== 0) {
              // Set new value
              field[i][j].setRealValue(newVal);
              // Set CSS on cells in view! (displayField)
            }
          }
				}
			}
		},
    /**
		 * Returns an array of mine locations
		 * @return {Array} arr
		 */
    generateMineLocations: function() {
      var arr = [];
      var randRow = 0;
      var randCol = 0;
      while (totalMines > arr.length) {
        randRow = Math.floor(Math.random() * (rows));
        randCol = Math.floor(Math.random() * (columns));

        // Check all pairs for duplicates
        for (var i = 0; i < arr.length; i++) {
          var rowValue = arr[i][0];
          var colValue = arr[i][1];
          if (rowValue === randRow && colValue === randCol)
          {
            // Get a new random pair and restart loop
            randRow = Math.floor(Math.random() * (rows));
            randCol = Math.floor(Math.random() * (columns));
            i = 0;
          }
        }

        arr.push([randRow, randCol]);
      }

      return arr;
    }
	};
}();

/**
 * Name: cell
 * Purpose: For holding information pertaining
 * . to an individual cell in the game field
 * @param {Number} r
 * @param {Number} c
 * @param {Number} val
 */
var cell = function(r, c, val) {
	/* Set Private Variables */
	var row = (typeof r === "number") ? r : 0;
	var col = (typeof c === "number") ? c : 0;
	var value = val || undefined;
	var isClicked = false;
  var isFlagged = false;

	/* Object Literal */
	return {
		getRow: function() {
			return row;
		},
		getCol: function() {
			return col;
		},
		// Returns the actual value regardless
		// . if it's shown
		getRealValue: function() {
			return value;
		},
    setRealValue: function(val) {
      value = val | blank();
    },
		// Returns the value shown to the player
		getShownValue: function() {
			return (isClicked) ? value : blank();
		},
		getIsClicked: function() {
			return isClicked;
		},
		setIsClicked: function(val) {
			isClicked = (typeof val === "boolean") ? val : false;
		},
    getIsFlagged: function() {
      return isFlagged;
    },
    setIsFlagged: function(val) {
      isFlagged = (typeof val === "boolean") ? val : false;
    }
	};
};

/**
 * Calculates and returns the number of
 * . mines adjacent to a cell paramater
 * @param {Object} cellToCheck
 */
var numOfAdjacentMines = function(cellToCheck) {
  var r = cellToCheck.getRow();
  var c = cellToCheck.getCol();

  var numOfMines = 0;

  // All locations to check
  var adjacent = [
    [r-1, c],
    [r-1, c-1],
    [r-1, c+1],
    [r, c-1],
    [r, c+1],
    [r+1, c-1],
    [r+1, c],
    [r+1, c+1],
  ];

  for (var i = 0; i < adjacent.length; i++) {
    var row = adjacent[i][0];
    var col = adjacent[i][1];

    // If location is out of bounds do not check anything
    if (row >= 0 && row < gameField.getRows() &&
        col >= 0 && col < gameField.getColumns()) {
      if (gameField.getCell(row, col).getRealValue() === mine()) {
        numOfMines += 1;
      }
    }
  }

  return numOfMines;
};

 /**
  * Name: listeners
  * Purpose: Holds all listeners needed
  * . outside objects for the game
  * (can be activated anywhere)
  */
var listeners = {
	click: function() {
    // Removes default menu even if no cell was clicked
    document.oncontextmenu = function() {
      return false;
    };

    // Calling 'on' on #main-container makes sure it will work
    // even if no .cells are present on initialization
		$('#main-container').on('mousedown', '.cell', function(event) {
      // Get cell that was clicked for all events
      var location = [$(this).data('row'), $(this).data('col')];
      var clickedCell = gameField.getCell(location[0], location[1]);

      // 0: left, 1: middle, 2: right
      if (event.button === 0) {
        if (clickedCell.getIsFlagged()) {
          clickedCell.setIsFlagged(false);
          gameView.setFlaggedClass(clickedCell, false);
          gameView.refreshFlagsLeft();
        }

  			clickedCell.setIsClicked(true);

  			gameView.refreshCell(clickedCell);
        gameView.setClickedClass(clickedCell, true);

      } else if (event.button == 2) {
        // Only flag if cell has not been clicked
        if (!clickedCell.getIsClicked()) {
          // If flag is already flagged, unflag
          if (clickedCell.getIsFlagged()) {
            clickedCell.setIsFlagged(false);
            gameView.setFlaggedClass(clickedCell, false);
            gameView.refreshFlagsLeft();
          } else {
            clickedCell.setIsFlagged(true);
            gameView.setFlaggedClass(clickedCell, true);
            gameView.refreshFlagsLeft();
          }
        }
      }
		});
	}
};

/**
 * Name: timer
 * Purpose: Works as a timer for the timer display
 */
var timer = function() {
  var timeLeft = 0;

  return {
    /**
     * Sets the time for the timer (in ms)
     * @param {Number} t
     */
    setTimeLeft: function(t) {
      timeLeft = (typeof t === "number") ? t : timeLeft;
    },
    getTimeLeft: function() {
      return (timeLeft > 0) ? timeLeft : 0;
    },
    getTimeLeftSeconds: function() {
      var timeInSeconds = parseInt(timeLeft/1000);
      return (timeInSeconds > 0) ? timeInSeconds : 0;
    },
    /**
     * Decrements the time left
     * @param {Number} leap
     */
    decrementTimeLeft: function(leap) {
      timeLeft -= (typeof leap === "number") ? leap : 0;
    },
    /**
     * Increments the time left
     * Careful, as there's no ceiling to stop
     * . infinite incrementation
     * @param {Number} leap
     */
    incrementTimeLeft: function(leap) {
      timeLeft += (typeof leap === "number") ? leap : 0;
    },
    /**
     * Starts the timer
     * @param {Number} leap
     * @param {Boolean} shouldInc
     */
    startTimer: function(leap, shouldInc) {
      var that = this;
      // Default to decrementing
      shouldInc = (typeof shouldInc === "boolean") ? shouldInc : false;
      // {Function} counter will be used till timeLeft reaches 0
      var counter = function() {
        setTimeout(function() {
          // Decrement or increment timer
          if (shouldInc) {
            that.decrementTimeLeft(leap);
          }
          else {
            that.incrementTimeLeft(leap);
          }
          // Refresh view
          gameView.refreshTimer();
          // Start again if there is time left
          if (timer.getTimeLeft() > 0)
            counter();
        }, leap);
      };

      // Call to start the "loop"
      counter();
    }
  };
}();
