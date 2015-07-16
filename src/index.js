/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	console.log("Hello World!");

	removeWelcomeView();
	gameSetup();

	// Activate listeners
	for (var prop in listeners)
		listeners[prop]();
});
