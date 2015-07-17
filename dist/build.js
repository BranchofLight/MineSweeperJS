/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");

	gameSetup();
	// displayMainMenu();

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

/**
 * Purpose: All Views
 * Source:  src/view.js
 */

/* Placeholder */
var removeWelcomeView = function() {
	$('#welcome').remove();
};

/**
 * Name: displayMainMenu
 * Purpose: Will display the main menu on the screen
 * Note: Does no HTML deletion so no <div> other than
 * . main-container should be alive
 */
var displayMainMenu = function() {
	var html = "<div id=\"welcome\">";
	html += "<h1>Welcome to MineSweeper JS!</h1>";
	html += "<h2>Quick Play</h2>";
	html += "<form id=\"diff-form\">";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"beginner\" checked>";
	html += "<label for=\"beginner\">Beginner</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"intermediate\">";
	html += "<label for=\"intermediate\">Intermediate</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"expert\">";
	html += "<label for=\"expert\">Expert</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"impossible\">";
	html += "<label for=\"impossible\">Impossible</label><br>";
	html += "<button class=\"btn\" id=\"quick-play-button\">Play</button>";
	html += "</form>";
	html += "<h2>Custom Game</h2>";
	html += "<p id=\"row-select\">Rows (between 4 and 30): </p>";
	html += "<input type=\"text\" name=\"row-text\" size=\"2\" id=\"row-input\">";
	html += "<br><br>";
	html += "<p id=\"col-select\">Columns (between 4 and 30): </p>";
	html += "<input type=\"text\" name=\"col-text\" size=\"2\" id=\"col-input\">";
	html += "<br><br>";
	html += "<p id=\"mines-select\">Number of Mines: </p>";
	html += "<input type=\"text\" name=\"mines-text\" size=\"2\" ";
	html += "id=\"mines-input\"><br><button class=\"btn\"";
	html += "id=\"custom-play-button\">Play</button>";
	html += "</div>";
	$('#main-container').append(html);
};

/**
 * Name: displayEndGame
 * Purpose: Will display the end game on the screen
 * Note: Does no HTML deletion so no <div> other than
 * . main-container should be alive
 * @param Will take a paramater for loss/win and time
 */
var displayEndGame = function() {
	var html = "<div id=\"end-game\">";
	html += "<h1>Congratulations! / Game Over</h1>";
	html += "<p class=\"top-marg\">You won / lost in #time seconds</p>";
	html += "<p>Play again?</p>";
	html += "<button class=\"btn\">Play Same Setup</button>";
	html += "<button class=\"btn\">Play New Setup</button>";
	html += "</div>";

	$('#main-container').append(html);
};

/**
 * Name: gameView
 * Purpose: Contains everything necessary
 * . to work with the game view
 */
var gameView = function() {
	/* Private Functions */
	/**
	 * Displays header
	 */
	var displayHeader = function() {
		var html = "<div id=\"header\">";
		html += "<div id=\"timer\">";
		html += "<p>Time Left: " + timer.getTimeLeftSeconds() + "</p>";
		// Closes div id=timer
		html += "</div>";

		html += "<div id=\"flags-left\">";
		html += "<p>Flags Left: " + gameField.getFlagsLeft() + "</p>";
		// Closes div id=flags-left
		html += "</div>";

		// Closes div id=header
		html += "</div>";

		$('#main-container').append(html);
	};

	/**
	 * Displays HTML/CSS field
	 * Intended for first display only
	 * Refresh functions should be used afterwards
	 */
	var displayField = function() {
		html = "<div id=\"game-field\"></div>";
		$('#main-container').append(html);
		html = "";

		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				var cellToDisplay = gameField.getCell(i, j);
				// Can be hovered on by default
				// Careful: class " not closed!
				html += "<div class=\"cell not-clicked ";
				if (cellToDisplay.getRealValue() !== mine() &&
					  cellToDisplay.getRealValue() !== blank()) {
					html += "mine-number-" + cellToDisplay.getRealValue();
				}
				// Closes class "
				html += "\" ";
				html += "data-row=\"" + i + "\" data-col=\"" + j + "\">";
				html += cellToDisplay.getShownValue();
				html += "</div>";
			}

			html += "<br />";
		}

		$('#game-field').append(html);
		setBorders();
		setCellDimensions();

		setResizeEvent(function() {
			setCellDimensions();
		});
	};

	var displaySubmitButton = function() {
		var html = "<div class=\"center-button\">";
		html += "<button class=\"btn\" id=\"submit-solution\">Submit</button>";
		html += "</div>";
		$('#game-field').after(html);
	};

	/**
	 * Sets borders for all cells to prevent overlap
	 */
	var	setBorders = function() {
		var borderStyle = "1px solid black";
		$('.cell').each(function() {
			// All cells have a top and left border
			$(this).css('border-left', borderStyle);
			$(this).css('border-top', borderStyle);

			// Last column cells have right borders
			if ($(this).data('col') === gameField.getColumns()-1) {
				$(this).css('border-right', borderStyle);
			}

			// Last row cells have bottom borders
			if ($(this).data('row') === gameField.getRows()-1) {
				$(this).css('border-bottom', borderStyle);
			}
		});
	};

	/**
	 * Calculates and sets width and height of every cell
	 */
	var setCellDimensions = function() {
		// Give field width 60% and height 75%
		var fieldWidth = 0.60 * $(window).width();
		var fieldHeight = 0.75 * $(window).height();

		// Find the smaller of 2 to use as the dimension of each cell
		var smaller = (fieldWidth < fieldHeight) ? fieldWidth : fieldHeight;

		// Calculate smaller dimension and use it
		var cellHeight = smaller/gameField.getRows();
		var cellWidth = smaller/gameField.getColumns();
		var cellDimension = (cellHeight < cellWidth) ? cellHeight : cellWidth;
		// Floor it for an even number
		cellDimension = Math.floor(cellDimension);

		// Set CSS
		$('.cell').css('width', cellDimension);
		$('.cell').css('height', cellDimension);
		// Take up most of the cell with text
		$('.cell').css('font-size', cellDimension*0.9);

		// Calcualte new height and width
		var newWidth = cellDimension*gameField.getColumns();
		var newHeight = cellDimension*gameField.getRows();

		// Set CSS
		$('#game-field').css('width', newWidth);
		$('#game-field').css('height', newHeight);
		$('#header').css('width', newWidth);
		// Scale to cells
		$('#header').css('font-size', newWidth*0.05);
	};

	/* Public Functions */
	return {
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
			displayHeader();
			displayField();
			displaySubmitButton();
		},
		/**
		 * Refreshes the view for the given cell
		 * To be called if the shown value changes
		 * @param {Object} cellToRefresh
		 */
		refreshCell: function(cellToRefresh) {
			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
							$(this).html(cellToRefresh.getShownValue());
						}
			});
		},
		/**
		 * Sets the HTML/CSS clicked class of the cell
		 * . to either on or off
		 * @param {Object} cellToRefresh
		 * @param {Boolean} setToClicked
		 */
		setClickedClass: function(cellToRefresh, setToClicked) {
			setToClicked =
				(typeof setToClicked === "boolean") ? setToClicked : false;

			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
					if (setToClicked) {
						$(this).removeClass('not-clicked');
						$(this).addClass('clicked');
					} else {
						$(this).removeClass('clicked');
						$(this).addClass('not-clicked');
					}
				}
			});
		},
		/**
		 * Either removes or adds the CSS flagged class
		 * @param {Object} cellToRefresh
		 * @param {Boolean} setToFlagged
		 */
		setFlaggedClass: function(cellToRefresh, setToFlagged) {
			setToFlagged =
				(typeof setToFlagged === "boolean") ? setToFlagged : false;

			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
					if (setToFlagged) {
						$(this).addClass('flagged');
					} else {
						$(this).removeClass('flagged');
					}
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
		 * Refreshes flag's left on the view
		 */
		refreshFlagsLeft: function() {
			$('#flags-left').html($('#flags-left').html().replace(/-?\d+/g, gameField.getFlagsLeft()));
		}
	};
}();

/**
 * Changes resize event binding
 * @param {Function} resizeFunc
 */
var setResizeEvent = function(resizeFunc) {
	$(window).resize(function() {
		resizeFunc();
	});
};
