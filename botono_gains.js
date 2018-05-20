(function () {
	var botono_Interval = [];
	var botono_bigCookie = document.getElementById('bigCookie');
	var buttonContainer = document.createElement('div');
	var sellAndClickButton = document.createElement('button');
	var justClickButton = document.createElement('button');
	var cursorAmount = Game.Objects['Cursor'].amount;
	var commonCSS = "width:48px; height:48px; background-color:transparent;background-image:url(img/icons.png);border: none; cursor: pointer;";

	buttonContainer.style = "position: relative; top: 120px; left: 5px; width: 246px;";
	sellAndClickButton.title = 'Sell then Click!';
	justClickButton.title = 'Just Click!';
	sellAndClickButton.onclick = sellAndClick;
	sellAndClickButton.style = "float: left; background-position:-1104px -864px; " + commonCSS;
	justClickButton.style = "float: right; background-position:-576px -624px; " + commonCSS;
	justClickButton.onclick = justClick;

	buttonContainer.appendChild(sellAndClickButton);
	buttonContainer.appendChild(justClickButton);
	botono_bigCookie.appendChild(buttonContainer);


	function sellAndClick(e) {
		e.stopPropagation();
		updateCursorAmount();
		if (botono_Interval.length === 0) {
			Game.Objects['Cursor'].sell(cursorAmount); // Sell all cursors
			setTimeout(startClicking, 100);
			setTimeout(botono_stopClicking, 10000);
			Game.Objects['Cursor'].buy(cursorAmount); // Buy all cursors back
		}
	}

	function justClick(e) {
		e.stopPropagation();
		updateCursorAmount();
		if (botono_Interval.length === 0) {
			setTimeout(startClicking, 100);
			setTimeout(botono_stopClicking, 10000);
		}
	}

	function updateCursorAmount() {
		cursorAmount = Game.Objects['Cursor'].amount;
	}

	function startClicking() {
		if (botono_Interval.length === 0) {
			botono_Interval.push(setInterval(botono_click, 1));
		}
	}

	function botono_stopClicking() {
		if (botono_Interval.length > 0) {
			botono_Interval = botono_Interval.filter(function (interval) {
				clearInterval(interval);
				return false;
			});
		}
	}

	function botono_click() {
		botono_bigCookie.click();
	}
})();
