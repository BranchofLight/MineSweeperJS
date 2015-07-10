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
				strField += gameField.getCell(i, j).getValue();
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
				html += "<div class=\"cell\">";
				html += gameField.getCell(i, j).getValue();
				html += "</div>";
			}

			html += "<br />";
		}
		// Close div id=game-field 
		html += "</div>";

		$('#main-container').html(html);		
		// Taking 90% ensures that there will be no overflowing rows
		var cellWidth = ($('#game-field').width() / gameField.getColumns())*0.9;
		// Allocates 75% of the viewport's height to gameField
		var cellHeight = ($(window).height() / gameField.getRows())*0.75;
		this.setCellDimensions(cellWidth, cellHeight);

		var that = this;
		setResizeEvent(function() {
			var cellWidth = ($('#game-field').width() / gameField.getColumns())*0.9;
			var cellHeight = ($(window).height() / gameField.getRows())*0.75;
			that.setCellDimensions(cellWidth, cellHeight);
		});
	},
	/**
	 * Changes width and height of every cell 
	 * @param {Number} width
	 * @param {Number} height
	 */
	setCellDimensions: function(width, height) {
		$('.cell').css('width', width);
		$('.cell').css('height', height);
		// Keeps text vertically centered (note: will only work with one line of text)
		$('.cell').css('line-height', $('.cell').css('height'));
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