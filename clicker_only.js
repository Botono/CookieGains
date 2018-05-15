(function () {
	var botono_Interval;
	var botono_bigCookie = document.getElementById('bigCookie');
	
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

	setTimeout(botono_startClicking, 500);
})();
