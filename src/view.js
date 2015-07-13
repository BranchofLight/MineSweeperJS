/**
 * Purpose: All Views
 * Source:  src/view.js
 */

/**
 * Name: GameView
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

		html += "<div id=\"mines-left\">";
		html += "<p>Mines Left: " + gameField.getMinesLeft() + "</p>";
		// Closes div id=mines-left
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

		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				// Can be hovered on by default
				html += "<div class=\"cell not-clicked\" ";
				html += "data-row=\"" + i + "\" data-col=\"" + j + "\"><p>";
				html += gameField.getCell(i, j).getShownValue();
				html += "</p></div>";
			}

			html += "<br />";
		}

		$('#game-field').append(html);
		setBorders();
		setCellDimensions();

		var that = this;
		setResizeEvent(function() {
			setCellDimensions();
		});
	};

	/**
	 * Sets borders for all cells to prevent overlap
	 */
	var	setBorders = function() {
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
	};

	/**
	 * Changes width and height of every cell
	 */
	var setCellDimensions = function() {
		// Allocates 60% of the viewport width to gameField
		var cellWidth = (($(window).width())*0.6 / gameField.getColumns());
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
		},
		/**
		 * Refreshes the view for the given cell
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
		 * Refreshes the HTML/CSS class of the cell
		 * . to the approriate one
		 * @param {Object} cellToRefresh
		 */
		refreshCellClass: function(cellToRefresh) {
			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
							if (cellToRefresh.getIsClicked()) {
								$(this).removeClass('not-clicked');
								$(this).addClass('clicked');
							}
							else {
								$(this).removeClass('clicked');
								$(this).addClass('not-clicked');
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
		 * Refreshes mine's left on the view
		 */
		refreshMinesLeft: function() {
			$('#mines-left').html($('#mines-left').html().replace(/\d+/g, gameField.getMinesLeft()));
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
