(function () {
	var botono_Interval;
	var botono_bigCookie = document.getElementById('bigCookie');
	var cursorAmount = Game.Objects['Cursor'].amount;
	
	function botono_startClicking() {
		botono_Interval = setInterval(botono_click, 1);
		setTimeout(botono_stopClicking, 10000);
	}

	function botono_stopClicking() {
		clearInterval(botono_Interval);
	}

	function botono_click() {
		botono_bigCookie.click();
	}

	Game.Objects['Cursor'].sell(cursorAmount); // Sell all cursors

	botono_startClicking();

	Game.Objects['Cursor'].buy(cursorAmount); // Buy all cursors back
})();
