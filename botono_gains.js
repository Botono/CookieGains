(function () {
	// Initialization
	var clickIntervals = [],
		fullAutoIntervals = [],
		bigCookie = document.getElementById('bigCookie'),
		oldContainer = document.getElementById('botono_ButtonContainer'),
		buttonContainer = document.createElement('div'),
		sellAndClickButton = document.createElement('button'),
		justClickButton = document.createElement('button'),
		fullAutoButton = document.createElement('button'),
		cursorAmount = Game.Objects['Cursor'].amount,
		commonCSS = "width:48px; height:48px; background-color:transparent;background-image:url(img/icons.png);border: none; cursor: pointer;",
		clickBuffs = [
			'Dragonflight',
			'Click frenzy', // Correct capitalization
			'Cursed finger',
			'Elder frenzy',
		],
		gameUpgradeIDs = [331, 452], // Golden Switch and Sugar Frenzy, Game.UpgradesById[331].buy()
		undoGoldenSwitchID = 332,
		usingSellAndClick = false,
		clickDuration = 10000,
		clickDurationBuff = 2000,
		maxCursorsToSell = 500,
		fullAutoActiveStyle = "position:absolute; bottom:0; left:100px;background-position:-1200px -337px; " + commonCSS,
		fullAutoDisabledStyle = "position:absolute; bottom:0; left:100px;background-position:-480px -1px; " + commonCSS;

	// DOM stuff

	// Clear existing UI
	if (oldContainer !== null ) {
		oldContainer.parentNode.removeChild(oldContainer);
	}
	
	// while (buttonContainer.firstChild) {
	// 	buttonContainer.removeChild(buttonContainer.firstChild);
	// }
	buttonContainer.style = "position: relative; top: 0; left: 5px; width: 246px; height: 246px;";

	sellAndClickButton.title = 'Sell then Click!';
	justClickButton.title = 'Just Click!';

	sellAndClickButton.style = "position:absolute; left: 0; top:100px; background-position:-1104px -864px; " + commonCSS;
	justClickButton.style = "position:absolute; right:0; top:100px; background-position:-576px -624px; " + commonCSS;
	fullAutoButton.style = fullAutoDisabledStyle;

	justClickButton.onclick = justClick;
	sellAndClickButton.onclick = sellAndClick;
	fullAutoButton.onclick = fullAuto;

	buttonContainer.id = 'botono_ButtonContainer';
	justClickButton.id = 'botono_JustClickButton';
	sellAndClickButton.id = 'botono_SellAndClickButton';
	fullAutoButton.id = 'botono_FullAutoButton';
	
	
	buttonContainer.appendChild(sellAndClickButton);
	buttonContainer.appendChild(justClickButton);
	buttonContainer.appendChild(fullAutoButton);
	bigCookie.appendChild(buttonContainer);

	function msg(msg, el, center) {
		if (el === undefined) {
			Game.Popup(msg);
		} else {
			var rect = el.getBoundingClientRect(),

				x = center ? rect.left + (rect.right-rect.left)/2 : rect.left,
				y = center ? rect.bottom + (rect.right - rect.left) / 2: rect.top;
			console.log('msg() DEBUG: x: ' + x + ', y: '+ y);
			Game.Popup(msg, x, y);
		}

		console.log(msg); // Debug
	}

	function sellAndClick(e) {
		
		if (e) {
			e.stopPropagation();
		}

		updateCursorAmount();
		if (clickIntervals.length === 0) {
			msg('DUMP AND PUMP', sellAndClickButton);
			usingSellAndClick = true;
			Game.Objects['Cursor'].sell(cursorAmount); // Sell all cursors
			setTimeout(startClicking, 100);
			setTimeout(stopClicking, clickDuration);
			Game.Objects['Cursor'].buy(cursorAmount); // Buy all cursors back
		}
	}

	function justClick(e) {
		if (e) {
			e.stopPropagation();
		}

		updateCursorAmount();
		if (clickIntervals.length === 0) {
			usingSellAndClick = false;
			setTimeout(startClicking, 100);
			setTimeout(stopClicking, getClickDuration());
		}
	}

	function updateCursorAmount() {
		cursorAmount = Game.Objects['Cursor'].amount > maxCursorsToSell ? maxCursorsToSell : Game.Objects['Cursor'].amount;
	}

	function startClicking() {
		if (clickIntervals.length === 0) {
			clickIntervals.push(setInterval(doTheClick, 1));
		}
	}

	function stopClicking() {
		if (clickIntervals.length > 0) {
			clickIntervals = clickIntervals.filter(function (interval) {
				clearInterval(interval);
				return false;
			});
		}

		if (clickingBuffActive()) {
			// Keep on clicking!
			console.log('Going to keep clicking for a while!');
			if (usingSellAndClick) {
				msg('MORE!', sellAndClickButton);
				sellAndClick();
			} else {
				msg('AGAIN!', justClickButton);
				justClick();
			}
		} else {
			msg('WHEW! Done...', buttonContainer, true);
			usingSellAndClick = false;
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

	function clickingBuffActive() {
		if (Game.buffs) {
			console.log(Game.buffs);
			return clickBuffs.some(function (v) {
				// Keep clicking if the right buff is active and it has at least 7% of its time remaining.
				if (Game.buffs[v]) {
					console.log('Found buff: '+ v);
					console.log('Time remianing: ' + (Game.buffs[v].time / Game.buffs[v].maxTime));
					// return (Game.buffs[v].maxTime - Game.buffs[v].time) >= 60;
					return (Game.buffs[v].time / Game.buffs[v].maxTime) >= 0.07;
				}
				return false;
			});
		}
		return false;
	}

	function fullAuto() {
		var buttonObj = document.getElementById('botono_FullAutoButton');
		if (fullAutoIntervals.length === 0) {
			fullAutoIntervals.push(setInterval(autoClicker, 1000));
			buttonObj.style = fullAutoActiveStyle;
			msg('Full Auto Mode ACTIVED', buttonObj);
		} else {
			// If Full Auto Mode is on, toggle it off
			fullAutoIntervals = fullAutoIntervals.filter(function (interval) {
				clearInterval(interval);
				return false;
			});
			buttonObj.style = fullAutoDisabledStyle;
			msg('Full Auto Mode DISABLED', buttonObj);
		}
	}

	function autoClicker() {
		Game.shimmers.forEach(function (shimmer) {
			if (shimmer.type == 'reindeer' || shimmer.type == 'golden') {
				shimmer.pop();
				console.log('Popped a '+ shimmer.type + ':');
				console.log(shimmer);
				checkBuffs();
			}
		});

	}

	function checkBuffs() {
		console.log('Checking buff stack.');
		if (clickingBuffActive()) {
			console.log('Found the right buffs, time to sell and click.');
			sellAndClick();
			if (Game.buffs['Elder frenzy']) {
				console.log('Popping all wrinklers due to Elder Frenzy buff!');
				Game.CollectWrinklers();
			}
		}
	}
})();
