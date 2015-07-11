/**
 * Purpose: Game Logic
 * Source:  src/logic.js
 */

 /**
  * Sets up any variables needing defaults
  * Note: should be called before anything else
  */
 var setup = function() {
   /* Placeholder until something else sets mine amount */
   gameField.setTotalMines(10);
   /* Placeholder until something else triggers the field generation */
   gameField.generateField(9, 9);

   // Set timer to 30 seconds
   timer.setTimeLeft(30000);
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
 	return '-';
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
     * Gets mines left on field
     * @return {Number} minesLeft
     */
    getMinesLeft: function() {
      var minesFound = 0;
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          if (field[i][j].getShownValue() === this.getMine()) {
            minesFound += 1;
          }
        }
      }

      return totalMines - minesFound;
    },
		// Returns columns
		getColumns: function() {
			return columns;
		},
		// Returns rows
		getRows: function() {
			return rows;
		},
		// Empty or not-clicked cell value
		getBlank: blank(),
		// Mine cell value
		getMine: function() {
			return 'X';
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
			// Push new field onto field
			for (var i = 0; i < rows; i++) {
				// New array (row)
				field.push([]);
				for (var j = 0; j < columns; j++) {
          // Loop through mine locations to see if there are any matches
          for (var x = 0; x < mineLocations.length; x++) {
            var foundMine = false;
            // If loop is at a mine location
            if (mineLocations[x][0] === i && mineLocations[x][1] === j) {
              foundMine = true;
              /* Note: look into deleting a location after
                 the mine has been placed */
              // Leave loop, we found a mine
              break;
            }
          }
          if (!foundMine)
            field[i].push(cell(i, j, blank()));
          else
            field[i].push(cell(i, j, this.getMine()));
				}
			}
		},
    /**
		 * Returns an array of mine locations
     * Array is based on 0...rows*columns
     * . or i+j in generateField()
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
	var isChecked = false;

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
		// Returns the value shown to the player
		getShownValue: function() {
			return (isChecked) ? value : blank();
		},
		getIsChecked: function() {
			return isChecked;
		},
		setIsChecked: function(val) {
			isChecked = (typeof val === "boolean") ? val : false;
		}
	};
};

 /**
  * Name: listeners
  * Purpose: Holds all listeners needed
  * . outside objects for the game
  * (can be activated anywhere)
  */
var listeners = {
	click: function() {
    // Calling 'on' on #main-container makes sure it will work
    // even if no .cells are present on initialization
		$('#main-container').on('click', '.cell', function() {
			var location = [$(this).data('row'), $(this).data('col')];
			var clickedCell = gameField.getCell(location[0], location[1]);
			clickedCell.setIsChecked(true);
      $(this).removeClass('hasHover');
      $(this).css('background', '#D0D6E2');
      if (clickedCell.getShownValue() === gameField.getMine())
        gameView.refreshMinesLeft();

			gameView.refreshCell(clickedCell);
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
     * Starts the timer
     * @param {Number} leap
     */
    startTimer: function(leap) {
      var that = this;
      // {Function} counter will be used till timeLeft reaches 0
      var counter = function() {
        setTimeout(function() {
          // Decrement timer and refresh view
          that.decrementTimeLeft(leap);
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
