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
		buildingBuffs = [
			'High-five',
			'Congregation',
			'Luxuriant harvest',
			'Ore vein',
			'Oiled-up',
			'Juicy profits',
			'Fervent adoration',
			'Manabloom',
			'Delicious lifeforms',
			'Breakthrough',
			'Righteous cataclysm',
			'Golden ages',
			'Extra cycles',
			'Solar flare',
			'Winning streak',
		],
		gameUpgradeIDs = [331, 452], // Golden Switch and Sugar Frenzy, Game.UpgradesById[331].buy()
		undoGoldenSwitchID = 332,
		usingSellAndClick = false,
		clickDuration = 10000,
		clickDurationBuff = 2000,
		maxCursorsToSell = 500,
		fullAutoActiveStyle = "position:absolute; bottom:0; left:100px;background-position:-1200px -337px; " + commonCSS,
		fullAutoDisabledStyle = "position:absolute; bottom:0; left:100px;background-position:-480px -1px; " + commonCSS,
		buildingBuffCount = 0,
		spellsContainer = document.getElementById('rowSpecial7');

	// DOM stuff

	// Clear existing UI
	if (oldContainer !== null ) {
		oldContainer.parentNode.removeChild(oldContainer);
	}

	// Open Grimoire
	if (spellsContainer.style.display !== 'block') {
		Game.ObjectsById[7].switchMinigame(-1);
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

	// https://davidwalsh.name/javascript-debounce-function
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	var checkBuffs = debounce(function () {
		castSpellIfReady();
		if (clickingBuffActive()) {
			sellAndClick();
			if (Game.buffs['Elder frenzy']) {
				msg('Popping all wrinklers due to Elder Frenzy buff!', buttonContainer, true);
				Game.CollectWrinklers();
			}
		}
	}, 1000, true);

	function msg(msg, el, center) {
		if (el === undefined) {
			Game.Popup(msg);
		} else {
			var rect = el.getBoundingClientRect(),
				x = center ? rect.left + (rect.right-rect.left)/2 : rect.left,
				y = center ? rect.bottom + (rect.top - rect.bottom) / 2: rect.top;
			// console.log('msg() DEBUG: x: ' + x + ', y: '+ y);
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

	// States to click during:
	// - Any buff in clickBuffs is present
	// - 2 building buffs together
	function clickingBuffActive() {
		if (Game.buffs) {
			buildingBuffCount = 0;
			buildingBuffs.forEach(function (buff) {
				if (Game.buffs[buff]) {
					buildingBuffCount++;
				}
			});
			var clickBuffFound = clickBuffs.some(function (v) {
				// Keep clicking if the right buff is active and it has at least 7% of its time remaining.
				if (Game.buffs[v]) {
					// return (Game.buffs[v].maxTime - Game.buffs[v].time) >= 60;
					return (Game.buffs[v].time / Game.buffs[v].maxTime) >= 0.07;
				}
				return false;
			});

			return (buildingBuffs > 1) || clickBuffFound;
		}
		return false;
	}

	function haveEnoughMana(grim) {
		var spell = grim.spells['hand of fate'];
		if (grim.magic >= (spell.costPercent * grim.magicM) + spell.costMin) {
			// console.log('Enough Mana! ' + (spell.costPercent * grim.magicM) + spell.costMin );
			return true;
		}
		return false;
	}

	// Game.Objects['Wizard tower'].minigame
	// Useful children of that object:
	// - magic
	// - magicM
	// - spells {}
	// - spells['hand of fate'].costMin
	// - spells[].costPercent
	// DOM ID of 'Force Hand of Fate': grimoireSpell1
	// works to cast: document.getElementById('grimoireSpell1').click();
	function castSpellIfReady() {
		var grim = Game.Objects['Wizard tower'].minigame;
		if (Game.buffs['Frenzy']) {
			for (buff in buildingBuffs) {
				if (Game.buffs[buff] && haveEnoughMana(grim)) {
					msg('Casting "Force Hand of Fate"! Good luck!');
					document.getElementById('grimoireSpell1').click();
					break;
				}
			}
		}
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
			if (shouldPopShimmer(shimmer)) {
				shimmer.pop();
				checkBuffs();
			}
		});

	}

	function shouldPopShimmer(shimmer) {
		var shouldPop = false;

		switch (shimmer.type) {
			case 'reindeer':
				shouldPop = true;
				break;
			case 'golden':
				if (!shimmer.wrath || (shimmer.wrath && shimmer.forceObj == 0)) {
					shouldPop = true;
				}
				break;
		}

		return shouldPop;
	}
})();
