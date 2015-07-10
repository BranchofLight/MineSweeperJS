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