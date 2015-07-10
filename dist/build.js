/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");
	
	gameField.generateField(9, 9);
	console.log("rows: " + gameField.rows);
	console.log("columns: " + gameField.columns);
	console.log("Field: ");
	gameView.displayTextField();
	gameView.displayField();
});

/**
 * Purpose: Game Logic
 * Source:  src/logic.js
 */

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

	/* Object Literal */
	return {
		// Returns columns
		getColumns: function() {
			return columns;
		},
		// Returns rows
		getRows: function() {
			return rows;
		},
		// Empty cell value
		getEmpty: function() {
			return ' ';
		},
		// Mine cell value
		getMine: function() {
			return 'X';
		},
		getCell: function(x, y) {
			return field[x][y];
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
			// Push new field onto field
			for (var i = 0; i < rows; i++) {
				// New array (row)
				field.push([]);
				for (var j = 0; j < columns; j++) {
					field[i].push(cell(i, j, this.getMine()));
				}
			}
		}		
	};
}();

/**
 * Name: cell
 * Purpose: For holding information pertaining
 * . to an individual cell in the game field
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} value2
 */
var cell = function(x2, y2, value2) {
	/* Set Private Variables */
	var x = (typeof x2 === "number") ? x : 0;
	var y = (typeof y2 === "number") ? y : 0;
	var value = value2 || undefined;

	/* Object Literal */
	return {
		getX: function() {
			return x;
		},
		getY: function() {
			return y;
		},
		getValue: function() {
			return value;
		}
	};
};
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