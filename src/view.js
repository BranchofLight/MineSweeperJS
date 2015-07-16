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
		html = "";

		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				// Can be hovered on by default
				html += "<div class=\"cell not-clicked\" ";
				html += "data-row=\"" + i + "\" data-col=\"" + j + "\">";
				html += gameField.getCell(i, j).getShownValue();
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
