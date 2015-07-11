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
		// Sets new width giving 10% extra for borders, etc
		$('#game-field').css('width', (cellDimension*gameField.getColumns()*1.1));
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
