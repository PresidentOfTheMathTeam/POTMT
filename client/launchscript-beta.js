console.log('Launching... launch script v 3.3.1');

var gamesVersion;

if (!location.hash.includes("#favs=")) {
    location.hash = "";
}

function loadFavorite(element) {
    console.log("Loading Favorite " + element);
    var card = element;
    var cardNumber = card.id.replace("gamecard-", "");
    var favoritesList = document.getElementById("favoritesList");
    var gameList = document.getElementById("gameList");
    var list = favoritesList;

    var icon = card.getElementsByTagName("button")[1].getElementsByTagName("i")[0];
    var text = card.getElementsByTagName("button")[1].getElementsByTagName("t")[0];
    icon.classList.remove("grayed");
    icon.classList.add("favorited");
    text.innerHTML = "Favorited";

    if (list.children.length == 0) {
        list.appendChild(card);
        document.getElementById("favorites").style.display = "";
        return;
    }

    var insertElement = null;
    var offset = cardNumber;
    offset++;
    console.log(offset);
    while (insertElement == null) {
        console.log("Trying " + offset)
        var attempt = document.getElementById("gamecard-" + offset);
        offset--;
        if (attempt != null && attempt.parentElement == list) {
            console.log(cardNumber + " (card) compared to (offset) " + offset);
            insertElement = attempt;
            if (offset < cardNumber || offset == 0) {
                console.log("inserting after");
                insertElement.after(card);
            } else {
                console.log("inserting before");
                list.insertBefore(card, insertElement);
            }
        }
        if (offset < 0) {
            list.prepend(card);
            insertElement = true;
        }
    }

    if (favoritesList.children.length == 0) {
        document.getElementById("favorites").style.display = "none";
        location.hash = "";
    } else if (gameList.children.length == 0) {
        document.getElementById("generalheader").style.display = "none";
        document.getElementsByClassName("advancment-easteregg")[0].remove();
    }

}

async function loadGames() {
    let clientFetch = await fetch("https://president-of-the-math-team.com/client/v331.html")
    let html = await clientFetch.text();

    document.write(html.replace("REPLACE/LAUNCHER/VERSION/HERE", "v" + launcherVersion));

    let gameIDsFetch = await fetch("https://president-of-the-math-team.com/games.json");
    let gameIDsJSON = await gameIDsFetch.json();
    let gameIDs = gameIDsJSON.list;
    gamesVersion = gameIDsJSON.version;

    console.log(gameIDs);

    gameIDs.forEach(game => {
        var gamecard = createGameCard(game.name, game.id, game.image, game.url, game.description, game.alert);
        document.getElementById("gameList").appendChild(gamecard);
    })

    if (location.hash.includes("#favs=")) {
        var newHash = "#favs=";
        var favArray = location.hash.replace("#favs=", "").split(",");
        console.log(favArray);
        favArray.forEach(favNum => {
            var gamecard = document.getElementById("gamecard-" + favNum);
            if (gamecard != null) {
                loadFavorite(gamecard);
                newHash = newHash + "," + favNum;
            }
        })

        newHash = newHash.replace("#favs=,", "#favs=");
        location.hash = newHash;
    }
    console.log("Completed!")
}

function createGameCard(name, id, image, url, description, alert) {
    let gamecard = document.createElement("div");
    gamecard.classList.add("game-card");
    gamecard.id = "gamecard-" + id;
    gamecard.style = "background-image: url('https://president-of-the-math-team.com/img/" + image + "');";
    if (description != null) {
        description = "<i><br>" + description + "</i>";
    } else {
        description = "";
    }
    if (alert != null) {
        alert = "alert(`" + alert + "`);";
    } else {
        alert = "";
    }
    gamecard.innerHTML = `<p>${name}${description}</p><button onclick="${alert}updateURL('${url}');"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch</button><button onclick='favoriteScript(this);'><i class="fa-solid fa-heart grayed"></i><t>Favorite</t></button>`;
    return gamecard;
}


loadGames();