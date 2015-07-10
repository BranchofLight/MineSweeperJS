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
