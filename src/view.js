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
	 * Displays HTML/CSS field
	 */
	displayField: function() {
		html = "<div id=\"game-field\">";

		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				html += "<div class=\"cell loc " + i + " " + j + "\">";
				html += gameField.getCell(i, j).getShownValue();
				html += "</div>";
			}

			html += "<br />";
		}
		// Close div id=game-field 
		html += "</div>";

		$('#main-container').html(html);	
		this.setCellDimensions();	

		var that = this;
		setResizeEvent(function() {
			that.setCellDimensions();
		});
	},
	/* Placeholder hack */
	refreshField: function() {
		$('#game-field').remove();
		this.displayField();
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
		// Sets new width giving 10% extra for borders, etc
		$('#game-field').css('width', (cellDimension*gameField.getColumns()*1.1));
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