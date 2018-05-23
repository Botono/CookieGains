(function () {
	var theIntervals = [],
		bigCookie = document.getElementById('bigCookie'),
		buttonContainer = document.createElement('div'),
		sellAndClickButton = document.createElement('button'),
		justClickButton = document.createElement('button'),
		cursorAmount = Game.Objects['Cursor'].amount,
		commonCSS = "width:48px; height:48px; background-color:transparent;background-image:url(img/icons.png);border: none; cursor: pointer;",
		clickBuffs = [
			'Dragonflight',
			'Click frenzy', // Correct capitalization
			'Cursed finger',
		],
		clickAction = null,
		clickDuration = 10000,
		clickDurationBuff = 2000;


	buttonContainer.style = "position: relative; top: 120px; left: 5px; width: 246px;";
	sellAndClickButton.title = 'Sell then Click!';
	justClickButton.title = 'Just Click!';
	sellAndClickButton.onclick = sellAndClick;
	sellAndClickButton.style = "float: left; background-position:-1104px -864px; " + commonCSS;
	justClickButton.style = "float: right; background-position:-576px -624px; " + commonCSS;
	justClickButton.onclick = justClick;

	buttonContainer.appendChild(sellAndClickButton);
	buttonContainer.appendChild(justClickButton);
	bigCookie.appendChild(buttonContainer);


	function sellAndClick(e) {
		if (e) {
			e.stopPropagation();
		}

		updateCursorAmount();
		clickAction = 'sellAndClick';
		if (theIntervals.length === 0) {
			Game.Objects['Cursor'].sell(cursorAmount); // Sell all cursors
			setTimeout(startClicking, 100);
			setTimeout(stopClicking, getClickDuration());
			Game.Objects['Cursor'].buy(cursorAmount); // Buy all cursors back
		}
	}

	function justClick(e) {
		if (e) {
			e.stopPropagation();
		}

		updateCursorAmount();
		clickAction = 'justClick';
		if (theIntervals.length === 0) {
			setTimeout(startClicking, 100);
			setTimeout(stopClicking, getClickDuration());
		}
	}

	function updateCursorAmount() {
		cursorAmount = Game.Objects['Cursor'].amount;
	}

	function startClicking() {
		if (theIntervals.length === 0) {
			theIntervals.push(setInterval(doTheClick, 1));
		}
	}

	function stopClicking() {
		if (theIntervals.length > 0) {
			theIntervals = theIntervals.filter(function (interval) {
				clearInterval(interval);
				return false;
			});
		}

		if (clickingBuffActive()) {
			// Keep on clicking!
			switch (clickAction) {
				case 'sellAndClick':
					sellAndClick();
					break;
				default:
					justClick();
					break;
			}
		} else {
			clickAction = null;
		}
	}

	function doTheClick() {
		bigCookie.click();
	}

	function getClickDuration () {
		if (clickingBuffActive()) {
			return clickDurationBuff;
		}
		return clickDuration;
	}

	function clickingBuffActive () {
		if (Game.buffs) {
			return clickBuffs.some(function (v) {
				// Keep clicking if the right buff is active and it has at least 1 second remaining.
				if (Game.buffs[v]) {
					return (Game.buffs[v].maxTime - Game.buffs[v].time) >= 30;
				}
				return false;
			});
		}
		return false;
	}
})();
