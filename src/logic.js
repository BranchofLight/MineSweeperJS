/**
 * Purpose: Game Logic
 * Source:  src/logic.js
 */

 /**
  * Returns a blank cell value
  * @return {String} ' '
  */
 var blank = function() {
 	return '-';
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
		// Empty or not-clicked cell value
		getBlank: blank(),
		// Mine cell value
		getMine: function() {
			return 'X';
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
 * @param {Number} r
 * @param {Number} c
 * @param {Number} val
 */
var cell = function(r, c, val) {
	/* Set Private Variables */
	var row = (typeof r === "number") ? r : 0;
	var col = (typeof c === "number") ? c : 0;
	var value = val || undefined;
	var isChecked = false;

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
		// Returns the value shown to the player
		getShownValue: function() {
			return (isChecked) ? value : blank();
		},
		getIsChecked: function() {
			return isChecked;
		},
		setIsChecked: function(val) {
			isChecked = (typeof val === "boolean") ? val : false;
		}
	};
};

/**
 * Holds all listeners needed
 * . outside objects for the game
 * (can be activated anywhere)
 */
var listeners = {
	click: function() {
    // Calling 'on' on #main-container makes sure it will work
    // even if no .cells are present on initialization
		$('#main-container').on('click', '.cell', function() {
			var location = [$(this).data('row'), $(this).data('col')];
			var clickedCell = gameField.getCell(location[0], location[1]);
			clickedCell.setIsChecked(true);
			gameView.refreshCell(clickedCell);
		});
	}
};
