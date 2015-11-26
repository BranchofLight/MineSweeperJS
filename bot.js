/*
 *
 *
 *
 *
 * DEPRECATED
 * KEPT AS REFERENCE
 *
 *
 *
 *
 * /

/*
 * Bot Algorithm:
 *  1) First Attempt:
 *     - pick random cell and click it [x]
 *     - store cell location, if it was a mine or not, and what was adjacent [x]
 *     - do this until loss [x]
 *  2) Second Attempt and On:
 *     - look at previous (arbitrary number to prevent memory hogging, 10?) attempts [x]
 *     - see what worked and what didn't [x]
 *     - match any information given now by preivous attempt (is there a cell with all 1s around it like last time? was it good to click it last time? flag it?)
 *     - repeat indefinitely
 */

 /**
  * TODO:
  * - Create a comparison function so arrays can be compared properly [x]
  * - Make sure the same click scenario isn't saved to allClicksArr more than once (update percentage) [x]
  * - Think a lot about smartClick() before continuing! [x]
  * - IMPORTANT: Make sure that getAdjacentCells(true) is working properly!!!
  */

/**
 * Stores information about the chance of a blank being under the cell
 * @param {Number} percOfNotMine
 * @param {Number} numOfClicks
 */
 var botCellInfo = function(percOfNotMine, numOfClicks) {
   return {
     getPercOfNotMine: function() {
       return percOfNotMine;
     },
     setPercOfNotMine: function(val) {
       percOfNotMine = (typeof val === "number") ? val : percOfNotMine;
     },
     getNumOfClicks: function() {
       return numOfClicks;
     },
     incrementNumOfClicks: function() {
       numOfClicks += 1;
     },
    // Not needed as of now
    //  decrementNumOfClicks: function() {
    //    numOfClicks -= 1;
    //  },
     setNumOfClicks: function(val) {
       numOfClicks = (typeof val === "number") ? val : numOfClicks;
     },
     // Calculates new percOfBlank
     calcNewPercent: function(isBlank) {
       // Calculate number of blanks clicked in this case
       var numOfBlanks = percOfNotMine * numOfClicks;
       // Increment total clicks
       this.incrementNumOfClicks();
       // Add to blanks if new cell is blank
       numOfBlanks += (isBlank) ? 1 : 0;
       // Set new percentage
       percOfNotMine = numOfBlanks / numOfClicks;
     }
   };
 };

/**
 * Holds information about each click a bot makes
 * @param {Object cell} cellToStore
 * @param {Object botCellInfo} chanceOfNotMine
 */
 var botClick = function(cellToStore, chanceOfNotMine) {
   return {
    //  getCell: function() {
    //    return cellToStore;
    //  },
     getAdjCells: function() {
       return getAdjacentCells(cellToStore, true);
     },
     getBotCellInfo: function() {
       return chanceOfNotMine;
     },
     setBotCellInfo: function(val) {
       if (typeof val === "object" && val !== null) {
         chanceOfNotMine = val;
       }
     }
   };
 };

 var bot = function() {
   // To be called on a cell for the bot to click
   var clickCell = function(cellToClick) {
     // Reveal cells if applicable
     if (cellToClick.getRealValue() === blank()) {
       gameView.revealAdjacentCells(cellToClick);
     }

     // Standard cell click procedure
     cellToClick.setIsClicked(true);
     gameView.refreshCell(cellToClick);
     gameView.setClickedClass(cellToClick, true);

     // Add to clicks array
     addClickToArr(cellToClick);

     // Handle win or loss
     if (checkWin()) {
       bot.setIsOver(true);
       bot.setLastOutcome(true);
     } else if (cellToClick.getRealValue() === mine()) {
       console.log("Number of unique clicks (not surrounded by blanks) till loss: " + allClicksArr.length);
       for (var i = 0; i < allClicksArr.length; i++) {
        //  console.log("Cell Value: " + allClicksArr[i].getCell().getShownValue());
         var str = "[";
         var adj = allClicksArr[i].getAdjCells();
         for (var j = 0; j < adj.length; j++) {
           str += "'" + adj[j].getShownValue() + "', ";
         }
         console.log("Adjacent Cells: " + str + "]");
         console.log("Percentage: " + allClicksArr[i].getBotCellInfo().getPercOfNotMine());
       }
       bot.setIsOver(true);
       bot.setLastOutcome(false);
    }
   };

   var getNumClickedCells = function() {
     var clickedCells = 0;
     for (var i = 0; i < gameField.getRows(); i++) {
       for (var j = 0; j < gameField.getColumns(); j++) {
         if (gameField.getCell(i, j).getIsClicked()) {
           clickedCells += 1;
         }
       }
     }

     return clickedCells;
   };

   /**
    * Compares two adjacent cell arrays
    * Must be adhacent cell arrays or behaviour will be unexpected
    * @param {Array} arr1
    * @param {Array} arr2
    * @return {Boolean}
    */
   var equalsAdjArr = function(arr1, arr2) {
     console.log("comparing arrays");
     // If lengths are different, they are not the same
     if (arr1.length !== arr2.length) {
       console.log("not same length, returning false");
       return false;
     }


     console.log("checking element values");
     // Checks all cell values in both
     for (var i = 0; i < arr1.length; i++) {
       // If any cell have different values
       // Use shown value only as bot must use what it actually saw
       // Must always take into account that blanks can be clicked or not
       // So check for click status as well
       console.log("comparing " + arr1[i].getShownValue() + " and " + arr2[i].getShownValue());
       if (arr1[i].getShownValue() !== arr2[i].getShownValue()) {
         console.log(arr1[i].getShownValue() + " is not equal to " + arr2[i].getShownValue() + ", returning false");
         return false;
       }
     }

     console.log("all values are equal, returning true");
     return true;
   };

   /**
    * Handles adding a click to {Array} allClicksArr
    * Does not add: duplicates, cells with all blank
    * and/or NaN adjacent cells
    * Instead: calculates new percentage for duplicates, does not add cells with
    * all blank and/or NaN adjacent cells
    * @param {Object} cellToAdd
    */
   var addClickToArr = function(cellToAdd) {
     var adjCells = getAdjacentCells(cellToAdd, true);
     var isInvalid = true;
     // Check to make sure the array is not entirely blanks or NaNs
     // Add isInvalid condition to stop loop early if applicable
     for (var a = 0; a < adjCells.length && isInvalid; a++) {
       if (adjCells[a].getShownValue() !== blank() &&
           !isNaN(adjCells[a].getShownValue())) {
         isInvalid = false;
       }
     }

     console.log("Is invalid?: " + isInvalid);
     console.log("If false, adding: '" + cellToAdd.getShownValue() + "'");
     var str = "[";
     for (var y = 0; y < adjCells.length; y++) {
       str += "'" + adjCells[y].getShownValue() + "', ";
     }
     console.log("Adjacent: " + str + "]");


     // If not all adjacent cells are blank or NaN
     if (!isInvalid) {
      //  console.log("adding");
       var foundMatch = false;
       // Check if the same click has already occurred
       for (var i = 0; i < allClicksArr.length && !foundMatch; i++) {
         // Compares the two clicks
         if (equalsAdjArr(
               adjCells, allClicksArr[i].getAdjCells())) {
           // They are the same, is it a mine?
           if (cellToAdd.getShownValue() !== mine()) {
             // Add a new blank click to this cell info
             allClicksArr[i].getBotCellInfo().calcNewPercent(true);
             foundMatch = true;
           } else {
             // Add a new mine click to this cell info
             allClicksArr[i].getBotCellInfo().calcNewPercent(false);
             foundMatch = true;
           }
         }
       }

       // If there was no match found, add the new unique click
       if (!foundMatch) {
         // If not a mine, add with 100% chance of blank
         if (cellToAdd.getShownValue !== mine()) {
           console.log("pushing not mine unique");
           allClicksArr.push(botClick(cellToAdd, botCellInfo(1, 1)));
         } else {
           // Else, add with 0% chance of blank
           console.log("pushing is mine unique");
           allClicksArr.push(botClick(cellToAdd, botCellInfo(0, 1)));
         }
       }
     }
   };

   var getNumUnClickedCells = function() {
     var numOfCells = gameField.getRows() * gameField.getColumns();
     var clickedCells = getNumClickedCells();
     return numOfCells - clickedCells;
   };

   /**
    * Clicks the cell most likely to NOT be a mine
    */
   var smartClick = function() {
     // Look at every cell (except those surrounded by blanks)
     // Determine if any cell's adjacent cell is safe to click from previous information - eventually weight percent, for now, yes or no
     // If so, click it, update information and repeat
     // Else, random, save information then repeat

     var fieldCell = null;
     // Will be used as a map
     var foundCellsMap = {};
     var hasClicked = false;

     // Makes sure no click has happeend in all loop conditions
     for (var i = 0; i < gameField.getRows() && !hasClicked; i++) {
       for (var j = 0; j < gameField.getColumns() && !hasClicked; j++) {
         fieldCell = gameField.getCell(i, j);
         if (!fieldCell.getIsClicked()) {
           for (var x = 0; x < allClicksArr.length && !hasClicked; x++) {
             if (equalsAdjArr(
                 allClicksArr[x].getAdjCells(), getAdjacentCells(fieldCell, true))) {
                console.log("found match!");
                console.log("val: " + fieldCell.getShownValue());
                console.log("val r: " + fieldCell.getRow());
                console.log("val c: " + fieldCell.getCol());
                var str = "[";
                var adj = getAdjacentCells(fieldCell, true);
                for (var z = 0; z < adj.length; z++) {
                  str += "'" + adj[z].getShownValue() + "', ";
                }
                console.log("val Adjacent Cells: " + str + "]");

                // console.log("allClicksArr val: " + allClicksArr[x].getCell().getShownValue());
                // console.log("allClicksArr r: " + allClicksArr[x].getCell().getRow());
                // console.log("allClicksArr c: " + allClicksArr[x].getCell().getCol());
                console.log("allClicksArr perc: " + allClicksArr[x].getBotCellInfo().getPercOfNotMine());
                str = "[";
                adj = allClicksArr[x].getAdjCells();
                for (z = 0; z < adj.length; z++) {
                  str += "'" + adj[z].getShownValue() + "', ";
                }
                console.log("allClicksArr Adjacent Cells: " + str + "]");

                var percent =
                  allClicksArr[x].getBotCellInfo().getPercOfNotMine();
                // If so far, this cell has not been a mine
                if (percent === 1) {
                  clickCell(fieldCell);
                  console.log("would click with certainty: ");
                  console.log("would val: " + fieldCell.getShownValue());
                  console.log("would r: " + fieldCell.getRow());
                  console.log("would c: " + fieldCell.getCol());
                  hasClicked = true;
                } else {
                  // If it sometimes has been a mine...
                  // Check if the map contains this percentage
                  if (foundCellsMap.hasOwnProperty(percent)) {
                    // Add another cell with this percentage
                    foundCellsMap[percent].push(fieldCell);
                  } else {
                    // Otherwise, add this percentage and cell
                    foundCellsMap[percent] = [fieldCell];
                  }
                }
              } else {
                console.log("no match found");
              }
           }
         }
       }
     }

     // If there was never a click (eg. no certainty)
     if (!hasClicked) {
       var percentageArr = [];
       for (var prop in foundCellsMap) {
         percentageArr.push(prop);
       }
       // If cells were found at all
       if (percentageArr.length > 0) {
         percentageArr.sort(function(a, b) { return a-b; });
         console.log("percentages: " + percentageArr);

         // Get the last (most likely safe) cell in map
         var propertyIndex = percentageArr[percentageArr.length-1];
         console.log("property index: " + propertyIndex);
         // Mappings to arrays! Must take an array index!!
         var cellToClick = foundCellsMap[propertyIndex][0];
         clickCell(cellToClick);
         console.log("would click with " + (percentageArr[percentageArr.length-1]*100) + "% certainty: ");
         console.log("would val: " + cellToClick.getShownValue());
         console.log("would r: " + cellToClick.getRow());
         console.log("would c: " + cellToClick.getCol());
      } else {
        // If no cells were found, resort to random
        randomClick();
      }
     }
   };

   // Clicks a random unclicked cell
   var randomClick = function(r, c) {
     var randRow = Math.floor(Math.random() * (gameField.getRows()));
     var randCol = Math.floor(Math.random() * (gameField.getColumns()));

     // Keep generating cells until an unclicked cell is found
     while (gameField.getCell(randRow, randCol).getIsClicked()) {
       randRow = Math.floor(Math.random() * (gameField.getRows()));
       randCol = Math.floor(Math.random() * (gameField.getColumns()));
     }

     console.log("randomly clicking");
     console.log("r: " + randRow);
     console.log("c: " + randCol);

     clickCell(gameField.getCell(randRow, randCol));
   };

   // Holds information on all clicks [botClick]
   var allClicksArr = [];
   // Allows a check to be called whether game is lost
   var isOver = false;
   // Holds the last game outcome (true = won, false = lost)
   var lastOutcome = false;

   return {
     getIsOver: function() {
       return isOver;
     },
     setIsOver: function(val) {
       isOver = (typeof val === "boolean") ? val : false;
     },
     getLastOutcome: function() {
       return lastOutcome;
     },
     setLastOutcome: function(val) {
       lastOutcome = (typeof val === "boolean") ? val : false;
     },
     // Uses previous information to determine what cell to click next and clicks
     chooseCell: function() {
       smartClick();
     }
   };
 }();
