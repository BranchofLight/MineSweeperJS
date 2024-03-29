/**
 * Purpose: All Views
 * Source:  src/view.js
 */

// Holds the settings loaded from transitionToGame
var gameSettings = null;

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

	html += "<div id=\"diff-form\">";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"beginner\" checked>";
	html += "<label for=\"beginner\">Beginner</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"intermediate\">";
	html += "<label for=\"intermediate\">Intermediate</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"expert\">";
	html += "<label for=\"expert\">Expert</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"impossible\">";
	html += "<label for=\"impossible\">Impossible</label><br>";
	html += "<button class=\"btn\" id=\"quick-play-button\">Play</button>";
	html += "</div>";

	html += "<h2>Custom Game</h2>";

	html += "<p id=\"row-select\">Rows (between 4 and 30): </p>";
	html += "<input type=\"text\" name=\"row-text\" size=\"2\" id=\"row-input\">";
	html += "<br><br>";

	html += "<p id=\"col-select\">Columns (between 4 and 30): </p>";
	html += "<input type=\"text\" name=\"col-text\" size=\"2\" id=\"col-input\">";
	html += "<br><br>";

	html += "<p id=\"mines-select\">Number of Mines: </p>";
	html += "<input type=\"text\" name=\"mines-text\" size=\"2\" ";
	html += "id=\"mines-input\">";
	html += "<br>";

	html += "<button class=\"btn\"";
	html += "id=\"custom-play-button\">Play</button>";
	html += "<br>";

	html += "<h2>How To</h2>";
	html += "<p>Left Click (tap): reveal cell</p>";
	html += "<p>Right Click (long tap): flag cell</p>";

	html += "</div>";

	$('#main-container').append(html);
};

/**
 * Transitions the view to the main menu
 */
var transitionToMainMenu = function() {
	// Needed because the wildcard * calls the callback
	// . for every element otherwise
	var hasFadedOnce = false;

	// Used as a callback later
	var animation = function() {
		setTimeout(function() {
			// Determine what the current view is
			var $currentView = null;
			if ($('#game-field').length) {
				$currentView = $('#game-field, #header, #back-button');
			} else if ($('#end-game').length) {
				$currentView = $('#end-game');
			}

			// Use the current view here
			$currentView.fadeOut(1000).promise().done(
				function() {
					if (!hasFadedOnce) {
						if ($currentView === $('#game-field')) {
							gameView.removeField();
						} else {
							$currentView.remove();
						}
						displayMainMenu();
						hasFadedOnce = true;
						addListeners();
						timer.stopTimer();
					}
				}
			);
		}, 50);
	};

	// Prevent clicks or hovers from changing CSS
	$('.cell').removeClass('not-clicked');
	// Remove listeners to prevent clicks from changing view
	// Called with animation as a callback
	removeListeners(animation);
};

/**
 * Transitions the view to the game screen from anywhere
 * @param {Object} settings
 */
var transitionToGame = function(settings) {
	// Used as a callback later
	var animation = function() {
		setTimeout(function() {
			// Determine what the current view is
			var $currentView = null;
			if ($('#welcome').length) {
				$currentView = $('#welcome');
			} else if ($('#end-game').length) {
				$currentView = $('#end-game');
			}

			// Use the current view here
			$currentView.fadeOut(750, function() {
				$currentView.remove();
				gameSetup(settings);
				// Turn buttons back on
				listeners.on.buttons();
			});
		}, 100);
	};

	// Remove listeners to prevent clicks from changing view
	listeners.off.buttons();
	animation();
};

var botClearView = function() {
	$('#header, #game-field').remove();
};

/**
 * Transitions the view to the end game screen from game view
 * @param {Boolean} didWin
 */
var transitionToEndGame = function(didWin) {
	timer.stopTimer();

	// Needed because the wildcard * calls the callback
	// . for every element otherwise
	var hasFadedOnce = false;

	// Used as a callback later
	var animation = function() {
		setTimeout(function() {
			$('#game-field').fadeOut(1000, function() {
				if (!hasFadedOnce) {
					gameView.removeField();
					displayEndGame(didWin);
					hasFadedOnce = true;
					// Needed for buttons on end game screen
					addListeners();
				}
			});
		}, 500);
	};

	// Prevent clicks or hovers from changing CSS
	$('.cell').removeClass('not-clicked');
	// Remove listeners to prevent clicks from changing view
	// Called with animation as a callback
	removeListeners(animation);
};

/**
 * Name: displayEndGame
 * Purpose: Will display the end game on the screen
 * Note: Does no HTML deletion so no <div> other than
 * . main-container should be alive
 * @param {Boolean} didWin
 */
var displayEndGame = function(didWin) {
	var html = "<div id=\"end-game\" style=\"display:none\">";
	if (didWin) {
		html += "<h1>Congratulations!</h1>";
		html += "<p class=\"top-marg\">You won ";
	} else {
		html += "<h1>Game Over</h1>";
		html += "<p class=\"top-marg\">You lost ";
	}
	html += gameSettings.diff + " in " + timer.getTimeLeftSeconds() + " second";
	if (timer.getTimeLeftSeconds() === 1) {
		html += "</p>";
	} else {
		html += "s</p>";
	}
	html += "<p>Play again?</p>";
	html += "<button class=\"btn\" id=\"replay-button\">Play Same Setup</button>";
	html +="<button class=\"btn\" id=\"new-game-button\">Play New Setup</button>";
	html += "</div>";

	$('#main-container').append(html);

	$('#end-game').fadeIn(1000);
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
		html += "<p>Time: " + timer.getTimeLeftSeconds() + "</p>";
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

			html += "<br>";
		}

		$('#game-field').append(html);
		setBorders();
		setCellDimensions();

		setResizeEvent(function() {
			setCellDimensions();
		});
	};

	var displayMenuButton = function() {
		var html = "<div class=\"center-button\">";
		html += "<button class=\"btn\" id=\"back-button\">Back</button>";
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
		 * Displays field as text (for basic debugging purposes)
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
			displayMenuButton();
		},
		displayBotGameView: function() {
			displayHeader();
			displayField();
		},
		/**
		 * Removes HTML/CSS field and header
		 */
		removeField: function() {
			$('#header').remove();
			$('#game-field').remove();
			$('.center-button').remove();
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
		 * Reveals all blank cells adjacent
		 * . as well as any cells adjacent to a blank
		 * @param {Object} cellToCheck
		 */
		revealAdjacentCells: function(cellToCheck) {
			var adjacentCells = getAdjacentCells(cellToCheck);
			for (var i = 0; i < adjacentCells.length; i++) {
				// If cell is not flagged and not clicked
				// This also ensures there is no stack overflow from recursion later on
				if (!adjacentCells[i].getIsFlagged() &&
						!adjacentCells[i].getIsClicked()) {
					// Reveal cell
					adjacentCells[i].setIsClicked(true);
					this.refreshCell(adjacentCells[i]);
		      this.setClickedClass(adjacentCells[i], true);
					// Now go check it's cells and make them revealed if it's blank
					if (adjacentCells[i].getRealValue() === blank())
						this.revealAdjacentCells(adjacentCells[i]);
				}
			}
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
			var html = $('#timer').html();
			// Checked in case timer is attempting to refresh when it no longer exists
			if (typeof html === "string") {
				html = html.replace(/\d+/g, timer.getTimeLeftSeconds());
				$('#timer').html(html);
			}
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
