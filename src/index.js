/**
 * Purpose: Main
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");

	var view = new GameView();
	view.field = view.generateField(3, 3);
	console.log(view.field);
});
