(function () {
	var botono_Interval;
	var botono_bigCookie = document.getElementById('bigCookie');
	var cursorAmount = Game.Objects['Cursor'].amount;
	
	function botono_startClicking() {
		Game.Objects['Cursor'].sell(cursorAmount); // Sell all cursors
		botono_Interval = setInterval(botono_click, 1);
		setTimeout(botono_stopClicking, 10000);
		Game.Objects['Cursor'].buy(cursorAmount); // Buy all cursors back
	}

	function botono_stopClicking() {
		clearInterval(botono_Interval);
	}

	function botono_click() {
		botono_bigCookie.click();
	}

	setTimeout(botono_startClicking, 500);
})();
