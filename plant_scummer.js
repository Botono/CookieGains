(function () {
    var mySaveString = window.prompt('Paste your save');
    var plantName = window.prompt('Which plant are you looking for?');
    var desiredAmount = window.prompt('How many plants?', 1);
    var plants = {
        "Baker's Wheat": 1,
        "Thumbcorn": 2,
        "Cronerice": 3,
        "Gildmillet": 4,
        "Ordinary Clover": 5,
        "Golden Clover": 6,
        "Shimmerlily": 7,
        "Elderwort": 8,
        "Bakeberry": 9,
        "Chocoroot": 10,
        "White Chocoroot": 11,
        "White Mildew": 12,
        "Brown Mold": 13,
        "Meddleweed": 14,
        "Whiskerbloom": 15,
        "Chimerose": 16,
        "Nursetulip": 17,
        "Drowsyfern": 18,
        "Wardlichen": 19,
        "Keenmoss": 20,
        "Queenbeet": 21,
        "Juicy Queenbeet": 22,
        "Duketater": 23,
        "Crumbspore": 24,
        "Doughshroom": 25,
        "Glovemorel": 26,
        "Cheapcap": 27,
        "Fool's Bolete": 28,
        "Wrinklegill": 29,
        "Green Rot": 30,
        "Shriekbulb": 31,
        "Tidygrass": 32,
        "Everdaisy": 33,
        "Ichorpuff": 34,
    };
    var desiredPlantId = plants[plantName]; //find plant ids here: https://docs.google.com/spreadsheets/d/1QToJWQnpJGglD4JxH6pThtWtqjSUBDpAAo5BJvbdET8/edit#gid=2090827045

    var garden = Game.ObjectsById[2].minigame;
    var refreshId = setInterval(function () {
        actualAmount = 0;
        //iterate through field and count occurences of desiredPlant
        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 6; x++) {
                if (garden.isTileUnlocked(x, y)) { //such that smaller gardens can use this as well
                    if (garden.plot[x][y][0] == desiredPlantId) {
                        actualAmount = actualAmount + 1;
                    }
                }
            }
        }
        //Check against desiredAmount, exit loop if it fits
        if (actualAmount >= desiredAmount) {
            clearInterval(refreshId); //cancel out of entire loop
        } else {
            //Load save
            Game.ImportSaveCode(mySaveString);
        }
    }, 10);
})();

