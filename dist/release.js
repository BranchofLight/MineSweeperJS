var adjEquals=function(a,b){if(a.length!==b.length)return!1;for(var c=0;c<a.length;c++)if(a[c].getShownValue()!==b[c].getShownValue())return!1;return!0},isBlankAdj=function(a){for(var b=getAdjacentCells(a,!0),c=0;c<b.length;c++)if(b[c].getShownValue()!==blank()&&!isNaN(b[c].getShownValue()))return!1;return!0},clickSnapshot=function(a,b){var c=b?1:0,d=getAdjacentCells(a,!0),e=1;return{getAdjCells:function(){return d},getChanceOfMine:function(){return c},getNumOfClicks:function(){return e},addMineClick:function(){var a=c*e;e+=1,a+=1,c=a/e},addSafeClick:function(){e+=1,c=numOfMines/e}}},clickContainer=function(){var a=[];return{getLength:function(){return a.length},addClick:function(b){var c=getAdjacentCells(b,!0),d=isBlankAdj(b);console.log("Valid?: "+d);var e=!1;if(d){for(var f=0;f<a.length&&!e;f++)adjEquals(a[f].getAdjCells(),c)&&(b.getShownValue()===mine()?(a[f].addMineClick(),e=!0):(a[f].addSafeClick(),e=!0));if(!e){var g=b.getShownValue()===mine();a.push(clickSnapshot(b,g))}}},getMineChance:function(b){for(var c=0;c<a.length;c++)return adjEquals(a[c].getAdjCells(),getAdjacentCells(b))?a[c].getChanceOfMine():NaN}}}(),bot=function(){var a=!1,b=!1,c=function(a){a.setIsClicked(!0),gameView.refreshCell(a),gameView.setClickedClass(a,!0),a.getShownValue()===blank()&&gameView.revealAdjacentCells(a),clickContainer.addClick(a),checkWin()?(bot.setIsGameOver(!0),bot.setDidWinLast(!0)):a.getRealValue()===mine()&&(bot.setIsGameOver(!0),bot.setDidWinLast(!1))};return{getIsGameOver:function(){return a},setIsGameOver:function(b){a="boolean"==typeof b?b:!1},getDidWinLast:function(){return b},setDidWinLast:function(a){b="boolean"==typeof a?a:!1},randomClick:function(){for(var a=Math.floor(Math.random()*gameField.getRows()),b=Math.floor(Math.random()*gameField.getColumns());gameField.getCell(a,b).getIsClicked();)a=Math.floor(Math.random()*gameField.getRows()),b=Math.floor(Math.random()*gameField.getColumns());console.log("randomly clicking"),console.log("r: "+a),console.log("c: "+b),c(gameField.getCell(a,b))},smartClick:function(){for(var a={},b=!1,d=0;d<gameField.getRows()&&!b;d++)for(var e=0;e<gameField.getColumns()&&!b;e++){var f=gameField.getCell(d,e);if(!isBlankAdj(f)){var g=clickContainer.getMineChance(f);isNaN(g)||(0===g?(c(f),b=!0):a.hasOwnProperty(g)?a[g].push(f):a[g]=[f])}if(!b){var h=[];for(var i in a)h.push(i);h.length>0?(h.sort(function(a,b){return a-b}),c(a[h[0]][0]),b=!0):this.randomClick()}}}}}();$(document).ready(function(){var a=0,b=1,c=0,d=0,e=setInterval(function(){if(b>a){for(console.log("Game #"+(a+1)),botClearView(),botGameSetup({diff:"bot_test",rows:10,cols:10,mines:5});!bot.getIsGameOver();)bot.smartClick();bot.setIsGameOver(!1),a+=1,c+=bot.getDidWinLast()?1:0,console.log("The bot has won "+c+" games.")}else clearInterval(e)},d)});var gameSetup=function(a){a="object"==typeof a&&null!==a?a:{diff:"beginner",rows:9,cols:9,mines:10},gameSettings=a,gameField.setTotalMines(a.mines),gameField.generateField(a.rows,a.cols),timer.setTimeLeft(0,!0),gameView.displayGameView(),$("#main-container").hide(),$("#main-container").fadeIn(1e3,function(){timer.startTimer(1e3)})},botGameSetup=function(a){a="object"==typeof a&&null!==a?a:{diff:"beginner",rows:9,cols:9,mines:10},gameSettings=a,gameField.setTotalMines(a.mines),gameField.generateField(a.rows,a.cols),timer.setTimeLeft(0,!0),gameView.displayBotGameView()},blank=function(){return" "},mine=function(){return"X"},gameField=function(){var a=0,b=0,c=[],d=0;return{getTotalMines:function(){return d},setTotalMines:function(a){d=a},getFlagsLeft:function(){for(var e=0,f=0;a>f;f++)for(var g=0;b>g;g++)c[f][g].getIsFlagged()&&(e+=1);return d-e},getColumns:function(){return b},getRows:function(){return a},getCell:function(a,b){return c[a][b]},generateField:function(d,e){a="number"==typeof d?d:0,b="number"==typeof e?e:0;var f=this.generateMineLocations();c=[];var g=0,h=0;for(g=0;a>g;g++)for(c.push([]),h=0;b>h;h++){for(var i=!1,j=0;j<f.length;j++)if(f[j][0]===g&&f[j][1]===h){i=!0,f.splice(j,1);break}i?c[g].push(cell(g,h,mine())):c[g].push(cell(g,h,blank()))}for(g=0;a>g;g++)for(h=0;b>h;h++)if(c[g][h].getRealValue()!==mine()){var k=numOfAdjacentMines(c[g][h]);0!==k&&c[g][h].setRealValue(k)}},generateMineLocations:function(){for(var c=[],e=0,f=0;d>c.length;){e=Math.floor(Math.random()*a),f=Math.floor(Math.random()*b);for(var g=0;g<c.length;g++){var h=c[g][0],i=c[g][1];h===e&&i===f&&(e=Math.floor(Math.random()*a),f=Math.floor(Math.random()*b),g=0)}c.push([e,f])}return c}}}(),cell=function(a,b,c){var d="number"==typeof a?a:0,e="number"==typeof b?b:0,f=c,g=!1,h=!1;return{getRow:function(){return d},getCol:function(){return e},getRealValue:function(){return f},setRealValue:function(a){f=a||blank()},getShownValue:function(){return g?f:blank()},getIsClicked:function(){return g},setIsClicked:function(a){g="boolean"==typeof a?a:!1},getIsFlagged:function(){return h},setIsFlagged:function(a){h="boolean"==typeof a?a:!1}}},getAdjacentCells=function(a,b){for(var c=a.getRow(),d=a.getCol(),e=[[c-1,d],[c-1,d-1],[c-1,d+1],[c,d-1],[c,d+1],[c+1,d-1],[c+1,d],[c+1,d+1]],f=[],g=0;g<e.length;g++){var h=e[g][0],i=e[g][1];if(h>=0&&h<gameField.getRows()&&i>=0&&i<gameField.getColumns())f.push(gameField.getCell(h,i));else if("boolean"==typeof b&&b){var j=cell(h,i,NaN);j.setIsClicked(!0),f.push(j)}}return f},numOfAdjacentMines=function(a){for(var b=0,c=getAdjacentCells(a),d=0;d<c.length;d++)c[d].getRealValue()===mine()&&(b+=1);return b},listeners={on:{clicks:function(){document.oncontextmenu=function(){return!1},$("#main-container").on("mousedown",".cell",function(a){var b=[$(this).data("row"),$(this).data("col")],c=gameField.getCell(b[0],b[1]);0===a.button?(c.getIsFlagged()&&(c.setIsFlagged(!1),gameView.setFlaggedClass(c,!1),gameView.refreshFlagsLeft()),c.getRealValue()===blank()&&gameView.revealAdjacentCells(c),c.setIsClicked(!0),gameView.refreshCell(c),gameView.setClickedClass(c,!0)):2==a.button&&(c.getIsClicked()||(c.getIsFlagged()?(c.setIsFlagged(!1),gameView.setFlaggedClass(c,!1),gameView.refreshFlagsLeft()):(c.setIsFlagged(!0),gameView.setFlaggedClass(c,!0),gameView.refreshFlagsLeft()))),(0===a.button||1===a.button)&&(checkWin()?transitionToEndGame(!0):c.getRealValue()===mine()&&transitionToEndGame(!1))})},buttons:function(){$("#quick-play-button").on("click",function(){$("#beginner").prop("checked")?transitionToGame({diff:"beginner",rows:9,cols:9,mines:10}):$("#intermediate").prop("checked")?transitionToGame({diff:"intermediate",rows:15,cols:15,mines:35}):$("#expert").prop("checked")?transitionToGame({diff:"expert",rows:20,cols:20,mines:80}):$("#impossible").prop("checked")&&transitionToGame({diff:"impossible",rows:25,cols:25,mines:137})}),$("#custom-play-button").on("click",function(){var a=parseInt($("#row-input").val()),b=parseInt($("#col-input").val()),c=parseInt($("#mines-input").val()),d="",e=!1;if(isNaN(a)||isNaN(b)||isNaN(c))d="<br>Invalid input. Make sure input consists of only numbers.";else if(a>=4&&30>=a&&b>=4&&30>=b){var f=c/(a*b)*100;c>0&&100>f?(transitionToGame({diff:"custom",rows:a,cols:b,mines:c}),e=!0):d="Mines exceed lower or upper bound constraints."}else d="Check number of columns and rows.";e?$("#error").length&&$("#error").remove():$("#error").length?$("#error").html()!="Error: "+d&&$("#error").html("Error: "+d):$("#custom-play-button").after('<p id="error">Error: '+d+"</p>")}),$("#back-button").on("click",function(){transitionToMainMenu()}),$("#replay-button").on("click",function(){transitionToGame(gameSettings)}),$("#new-game-button").on("click",function(){transitionToMainMenu()})}},off:{clicks:function(){$("#main-container").off("mousedown",".cell")},buttons:function(){$("#quick-play-button").off("click"),$("#custom-play-button").off("click"),$("#back").off("click"),$("#replay-button").off("click"),$("#new-game-button").off("click")}}},addListeners=function(){for(var a in listeners.on)listeners.on[a]()},removeListeners=function(a){for(var b in listeners.off)listeners.off[b]();a()},checkWin=function(){for(var a,b=0,c=0,d="",e=0;e<gameField.getRows();e++)for(var f=0;f<gameField.getColumns();f++)if(gameField.getCell(e,f).getIsClicked()||(b+=1),gameField.getCell(e,f).getIsFlagged()&&(c+=1),gameField.getCell(e,f).getShownValue()===mine())return!1;return console.log("Shown values: "+d),console.log("Real values: "+a),b===c||b===gameField.getTotalMines()},timer=function(){var a=0,b=null;return{setTimeLeft:function(b){a="number"==typeof b?b:a},getTimeLeft:function(){return a>0?a:0},getTimeLeftSeconds:function(){var b=parseInt(a/1e3);return b>0?b:0},decrementTimeLeft:function(b){a-="number"==typeof b?b:0},incrementTimeLeft:function(b){a+="number"==typeof b?b:0},startTimer:function(a,c){var d=this;c="boolean"==typeof c?c:!1,b=setInterval(function(){c?d.decrementTimeLeft(a):d.incrementTimeLeft(a),gameView.refreshTimer(),d.getTimeLeft()<=0&&clearInterval(b)},a)},stopTimer:function(){"number"==typeof b&&null!==b&&clearInterval(b)}}}(),gameSettings=null,displayMainMenu=function(){var a='<div id="welcome">';a+="<h1>Welcome to MineSweeper JS!</h1>",a+="<h2>Quick Play</h2>",a+='<div id="diff-form">',a+='<input type="radio" name="difficulty" id="beginner" checked>',a+='<label for="beginner">Beginner</label><br>',a+='<input type="radio" name="difficulty" id="intermediate">',a+='<label for="intermediate">Intermediate</label><br>',a+='<input type="radio" name="difficulty" id="expert">',a+='<label for="expert">Expert</label><br>',a+='<input type="radio" name="difficulty" id="impossible">',a+='<label for="impossible">Impossible</label><br>',a+='<button class="btn" id="quick-play-button">Play</button>',a+="</div>",a+="<h2>Custom Game</h2>",a+='<p id="row-select">Rows (between 4 and 30): </p>',a+='<input type="text" name="row-text" size="2" id="row-input">',a+="<br><br>",a+='<p id="col-select">Columns (between 4 and 30): </p>',a+='<input type="text" name="col-text" size="2" id="col-input">',a+="<br><br>",a+='<p id="mines-select">Number of Mines: </p>',a+='<input type="text" name="mines-text" size="2" ',a+='id="mines-input">',a+="<br>",a+='<button class="btn"',a+='id="custom-play-button">Play</button>',a+="<br>",a+="<h2>How To</h2>",a+="<p>Left Click (tap): reveal cell</p>",a+="<p>Right Click (long tap): flag cell</p>",a+="</div>",$("#main-container").append(a)},transitionToMainMenu=function(){var a=!1,b=function(){setTimeout(function(){var b=null;$("#game-field").length?b=$("#game-field, #header, #back-button"):$("#end-game").length&&(b=$("#end-game")),b.fadeOut(1e3).promise().done(function(){a||(b===$("#game-field")?gameView.removeField():b.remove(),displayMainMenu(),a=!0,addListeners(),timer.stopTimer())})},50)};$(".cell").removeClass("not-clicked"),removeListeners(b)},transitionToGame=function(a){var b=function(){setTimeout(function(){var b=null;$("#welcome").length?b=$("#welcome"):$("#end-game").length&&(b=$("#end-game")),b.fadeOut(750,function(){b.remove(),gameSetup(a),listeners.on.buttons()})},100)};listeners.off.buttons(),b()},botClearView=function(){$("#header, #game-field").remove()},transitionToEndGame=function(a){timer.stopTimer();var b=!1,c=function(){setTimeout(function(){$("#game-field").fadeOut(1e3,function(){b||(gameView.removeField(),displayEndGame(a),b=!0,addListeners())})},500)};$(".cell").removeClass("not-clicked"),removeListeners(c)},displayEndGame=function(a){var b='<div id="end-game" style="display:none">';a?(b+="<h1>Congratulations!</h1>",b+='<p class="top-marg">You won '):(b+="<h1>Game Over</h1>",b+='<p class="top-marg">You lost '),b+=gameSettings.diff+" in "+timer.getTimeLeftSeconds()+" second",b+=1===timer.getTimeLeftSeconds()?"</p>":"s</p>",b+="<p>Play again?</p>",b+='<button class="btn" id="replay-button">Play Same Setup</button>',b+='<button class="btn" id="new-game-button">Play New Setup</button>',b+="</div>",$("#main-container").append(b),$("#end-game").fadeIn(1e3)},gameView=function(){var a=function(){var a='<div id="header">';a+='<div id="timer">',a+="<p>Time: "+timer.getTimeLeftSeconds()+"</p>",a+="</div>",a+='<div id="flags-left">',a+="<p>Flags Left: "+gameField.getFlagsLeft()+"</p>",a+="</div>",a+="</div>",$("#main-container").append(a)},b=function(){html='<div id="game-field"></div>',$("#main-container").append(html),html="";for(var a=0;a<gameField.getRows();a++){for(var b=0;b<gameField.getColumns();b++){var c=gameField.getCell(a,b);html+='<div class="cell not-clicked ',c.getRealValue()!==mine()&&c.getRealValue()!==blank()&&(html+="mine-number-"+c.getRealValue()),html+='" ',html+='data-row="'+a+'" data-col="'+b+'">',html+=c.getShownValue(),html+="</div>"}html+="<br>"}$("#game-field").append(html),d(),e(),setResizeEvent(function(){e()})},c=function(){var a='<div class="center-button">';a+='<button class="btn" id="back-button">Back</button>',a+="</div>",$("#game-field").after(a)},d=function(){var a="1px solid black";$(".cell").each(function(){$(this).css("border-left",a),$(this).css("border-top",a),$(this).data("col")===gameField.getColumns()-1&&$(this).css("border-right",a),$(this).data("row")===gameField.getRows()-1&&$(this).css("border-bottom",a)})},e=function(){var a=.6*$(window).width(),b=.75*$(window).height(),c=b>a?a:b,d=c/gameField.getRows(),e=c/gameField.getColumns(),f=e>d?d:e;f=Math.floor(f),$(".cell").css("width",f),$(".cell").css("height",f),$(".cell").css("font-size",.9*f);var g=f*gameField.getColumns(),h=f*gameField.getRows();$("#game-field").css("width",g),$("#game-field").css("height",h),$("#header").css("width",g),$("#header").css("font-size",.05*g)};return{displayTextField:function(){strField="";for(var a=0;a<gameField.getRows();a++){for(var b=0;b<gameField.getColumns();b++)strField+=gameField.getCell(a,b).getShownValue();strField+="\n"}console.log(strField)},displayGameView:function(){a(),b(),c()},displayBotGameView:function(){a(),b()},removeField:function(){$("#header").remove(),$("#game-field").remove(),$(".center-button").remove()},refreshCell:function(a){$(".cell").each(function(){$(this).data("row")===a.getRow()&&$(this).data("col")===a.getCol()&&$(this).html(a.getShownValue())})},revealAdjacentCells:function(a){for(var b=getAdjacentCells(a),c=0;c<b.length;c++)b[c].getIsFlagged()||b[c].getIsClicked()||(b[c].setIsClicked(!0),this.refreshCell(b[c]),this.setClickedClass(b[c],!0),b[c].getRealValue()===blank()&&this.revealAdjacentCells(b[c]))},setClickedClass:function(a,b){b="boolean"==typeof b?b:!1,$(".cell").each(function(){$(this).data("row")===a.getRow()&&$(this).data("col")===a.getCol()&&(b?($(this).removeClass("not-clicked"),$(this).addClass("clicked")):($(this).removeClass("clicked"),$(this).addClass("not-clicked")))})},setFlaggedClass:function(a,b){b="boolean"==typeof b?b:!1,$(".cell").each(function(){$(this).data("row")===a.getRow()&&$(this).data("col")===a.getCol()&&(b?$(this).addClass("flagged"):$(this).removeClass("flagged"))})},refreshTimer:function(){var a=$("#timer").html();"string"==typeof a&&(a=a.replace(/\d+/g,timer.getTimeLeftSeconds()),$("#timer").html(a))},refreshFlagsLeft:function(){$("#flags-left").html($("#flags-left").html().replace(/-?\d+/g,gameField.getFlagsLeft()))}}}(),setResizeEvent=function(a){$(window).resize(function(){a()})};