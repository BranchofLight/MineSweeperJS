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