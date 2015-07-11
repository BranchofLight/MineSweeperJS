/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");

	setup();
	gameField.generateField(9, 9);
	console.log("rows: " + gameField.rows);
	console.log("columns: " + gameField.columns);
	console.log("Field: ");
	gameView.displayTextField();

	gameView.displayHeader();
	gameView.displayField();

	// Activate listeners
	for (var prop in listeners)
		listeners[prop]();
});
