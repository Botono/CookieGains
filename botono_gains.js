(function () {
	var botono_Interval = [];
	var botono_bigCookie = document.getElementById('bigCookie');
	var buttonContainer = document.createElement('div');
	var sellAndClickButton = document.createElement('button');
	var justClickButton = document.createElement('button');
	var cursorAmount = Game.Objects['Cursor'].amount;

	buttonContainer.style = "position: relative; top: 120px; left: 5px; width: 246px;";
	sellAndClickButton.innerHTML = 'Sell';
	justClickButton.innerHTML = 'Click';
	sellAndClickButton.onclick = sellAndClick;
	sellAndClickButton.style = "float: left;";
	justClickButton.style = "float: right";
	justClickButton.onclick = justClick;

	buttonContainer.appendChild(sellAndClickButton);
	buttonContainer.appendChild(justClickButton);
	botono_bigCookie.appendChild(buttonContainer);


	function sellAndClick() {
		updateCursorAmount();
		setTimeout(sellAndClick_worker, 250);
	}

	function justClick() {
		updateCursorAmount();
		setTimeout(justClick_worker, 250);
	}

	function updateCursorAmount() {
		cursorAmount = Game.Objects['Cursor'].amount;
	}

	function sellAndClick_worker() {
		Game.Objects['Cursor'].sell(cursorAmount); // Sell all cursors
		botono_Interval.push(setInterval(botono_click, 1));
		setTimeout(botono_stopClicking, 10000);
		Game.Objects['Cursor'].buy(cursorAmount); // Buy all cursors back
	}

	function justClick_worker() {
		botono_Interval.push(setInterval(botono_click, 1));
		setTimeout(botono_stopClicking, 10000);
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
