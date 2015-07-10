/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");
	
	gameField.generateField(3, 3);
	console.log("rows: " + gameField.rows);
	console.log("columns: " + gameField.columns);
	console.log("Field: ");
	GameView.displayTextField();
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
			rows = r;
			columns = c;
			// Push new field onto field
			for (var i = 0; i < rows; i++) {
				// New array (row)
				field.push(new Array());
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
 */
var cell = function(x, y, value) {
	/* Set Private Variables */
	var x = (typeof x === "number") ? x : 0;
	var y = (typeof y === "number") ? y : 0;
	var value = value || undefined;

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
	}
};