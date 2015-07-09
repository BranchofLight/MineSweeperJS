/**
 * Purpose: All views
 * Source:  src/view.js
 */
// Placeholder hack class
function GameView() {
	this.field = "";
	/**
	 * Returns a generated empty 
	 * . field based on given paramaters
	 * @param {Number} rows
	 * @param {Number} columns
	 * @return {Array} arr
	 */
	this.generateField = function(rows, columns) {
		var arr = [];
		for (var i = 0; i < rows; i++) {
			arr.push(new Array());
			for (var j = 0; j < columns; j++) {
				arr[i].push('x');
			}
		}

		return arr;
	};
};
