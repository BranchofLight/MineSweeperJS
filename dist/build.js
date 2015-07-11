/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");

	setup();

	console.log("rows: " + gameField.rows);
	console.log("columns: " + gameField.columns);
	console.log("Field: ");
	gameView.displayTextField();

	// Activate listeners
	for (var prop in listeners)
		listeners[prop]();
});

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

/**
 * Purpose: All Views
 * Source:  src/view.js
 */

/**
 * Name: GameView
 * Purpose: Contains everything necessary
 * . to work with the game view
 */
var gameView = {
	/**
	 * Displays field as text
	 */
	displayTextField: function() {
		strField = "";
		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				strField += gameField.getCell(i, j).getShownValue();
			}
			strField += "\n";
		}

		console.log(strField);
	},
	/**
	 * Displays HTML/CSS field and header
	 */
	displayGameView: function() {
		this.displayHeader();
		this.displayField();
	},
	/**
	 * Displays header
	 */
	displayHeader: function() {
		var html = "<div id=\"header\">";
		html += "<div id=\"timer\">";
		html += "<p>Time Left: " + timer.getTimeLeftSeconds() + "</p>";
		// Closes div id=timer
		html += "</div>";

		html += "<div id=\"mines-left\">";
		html += "<p>Mines Left: " + gameField.getMinesLeft() + "</p>";
		// Closes div id=mines-left
		html += "</div>";

		// Closes div id=header
		html += "</div>";

		$('#main-container').append(html);
	},
	/**
	 * Displays HTML/CSS field
	 */
	displayField: function() {
		html = "<div id=\"game-field\"></div>";
		$('#main-container').append(html);

		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				// Can be hovered on by default
				html += "<div class=\"cell hasHover\" ";
				html += "data-row=\"" + i + "\" data-col=\"" + j + "\">";
				html += gameField.getCell(i, j).getShownValue();
				html += "</div>";
			}

			html += "<br />";
		}

		$('#game-field').append(html);
		this.setBorders();
		this.setCellDimensions();

		var that = this;
		setResizeEvent(function() {
			that.setCellDimensions();
		});
	},
	/**
	 * Refreshes the view for the given cell
	 * @param {Object} cellToRefresh
	 */
	refreshCell: function(cellToRefresh) {
		$('.cell').each(function() {
			if ($(this).data('row') === cellToRefresh.getRow() &&
			    $(this).data('col') === cellToRefresh.getCol()) {
						$(this).html(cellToRefresh.getShownValue());
					}
		});
	},
	/**
	 * Changes width and height of every cell
	 */
	setCellDimensions: function() {
		// Taking 90% ensures that there will be no overflowing rows
		// Also multiply width by 0.6 to match default width of 60%
		var cellWidth = (($(window).width())*0.6 / gameField.getColumns())*0.9;
		// Allocates 75% of the viewport's height to gameField
		var cellHeight = ($(window).height() / gameField.getRows())*0.75;

		// Use the smallest value (so it fits regardless)
		var cellDimension = (cellWidth < cellHeight) ? cellWidth : cellHeight;

		$('.cell').css('width', cellDimension);
		$('.cell').css('height', cellDimension);
		// Keeps text vertically centered (note: will only work with one line of text)
		$('.cell').css('line-height', $('.cell').css('height'));
		// Give 50% of the cell to text
		$('.cell').css('font-size', cellDimension*0.5);
		// Give 40% of a cell's dimension to timer's font (just for scaling)
		$('#timer').css('font-size', cellDimension*0.4);
		$('#mines-left').css('font-size', cellDimension*0.4);
		// Sets new width giving it 1 extra pixel for each column (border) + 1 extra
		// . for far right cell which has a border on the left and right - all borders
		// . are 1 pixel as of writing this comment
		$('#game-field').css('width', (cellDimension*gameField.getColumns()+gameField.getColumns()+1));
		// Sets the header width to the width of the game field
		$('#header').css('width', $('#game-field').css('width'));
	},
	/**
	 * Sets borders for all cells to prevent overlap
	 */
	setBorders: function() {
		$('.cell').each(function() {
			// All cells have a top and left border
			$(this).css('border-left', '1px solid black');
			$(this).css('border-top', '1px solid black');

			// Last column cells have right borders
			if ($(this).data('col') === gameField.getColumns()-1) {
				$(this).css('border-right', '1px solid black');
			}

			// Last row cells have bottom borders
			if ($(this).data('row') === gameField.getRows()-1) {
				$(this).css('border-bottom', '1px solid black');
			}
		});
	},
	/**
	 * Refreshes the timer's view
	 */
	refreshTimer: function() {
		// First get all digits and replace them with the new value
		// Then replace the HTML with the new HTML
		$('#timer').html($('#timer').html().replace(/\d+/g, timer.getTimeLeftSeconds()));
	},
	/**
	 * Refreshes mine's left on the view
	 */
	refreshMinesLeft: function() {
		$('#mines-left').html($('#mines-left').html().replace(/\d+/g, gameField.getMinesLeft()));
	}
};

/**
 * Changes resize event binding
 * @param {Function} resizeFunc
 */
var setResizeEvent = function(resizeFunc) {
	$(window).resize(function() {
		resizeFunc();
	});
};
