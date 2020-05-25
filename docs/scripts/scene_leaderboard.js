// JavaScript Document

// DEBUG
console.log("scene_leaderboard.js loaded successfully");

//   - Images
game.leaderboardBackground = {
        //Get handle
    image: document.getElementById("leaderboardBackground"),
        //Declare object information
    org_width: 1920 * game.scale,
    org_height: 1080 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
        //Adjust transformation
    resize: function () {
        this.width = engine.width;
        this.height = engine.height;
    },
        //Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardTitle = {
	// Get handle to image
    image: document.getElementById("titleWhite"),
	// Declare object transform information
    org_width: 413 * game.scale,
    org_height: 262 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 600;
        this.posY = Math.max(40, Math.min(50, this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion))));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};


game.leaderboardPlayerScore = {
        //Get handle
    image: document.getElementById("leaderboardScore"),
        //Declare object information
    org_width: 613 * game.scale,
    org_height: 342 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
        //Adjust transformation
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 30 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = 325 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
        //Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardSponsor = {
	// Get handle
    image: document.getElementById("SponsorsBox"),
	// Declare object information
    org_width: 340 * game.scale,
    org_height: 620 * game.scale,
    width: 0,
    height: 0,
    org_posX: 0,
    org_posY: 0,
    posX: 0,
    posY: 0,
	// Adjust transformation
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 1850 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = 450 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
	// Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.leaderboardSponsorLogo = {
	// Get handle
    image: function () {
        return document.getElementById(game.sponsors.getSponsor());
    },
	// Declare object information
    org_width: 200 * game.scale,
    org_height: 200 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1590,
    org_posY: 785,
    posX: 0,
    posY: 0,
	// Adjust transformation
    resize: function () {
        this.width = game.leaderboardSponsor.width * 0.95;
        this.height = this.width;

        // Attach Bottom Side
        this.posX = game.leaderboardSponsor.posX + (game.leaderboardSponsor.width - this.width) / 2;
        this.posY = game.leaderboardSponsor.posY + game.leaderboardSponsor.height / 2 - this.height / 3;
    },
	// Draw object
    draw: function () {
        this.resize();
        
    }
};

game.finalPlayerScore = {
        //Get handle
    div: document.getElementById("finalPlayerScore"),
        //Declare object information
    org_width: 150 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 325,
    org_posY: 82,
    posX: 0,
    posY: 0,
    //Declare variables
    org_font_size: 74,
    font_size: 0,
    score: 0,
    //Initialize the object
    init: function () {
        //Add event listener
        this.div.addEventListener("click", game.finalPlayerScore.clickMe);
    },
        //Adjust tranformation
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        //attach left side
        this.posX = game.leaderboardPlayerScore.posX + game.leaderboardPlayerScore.width / 2 - this.width / 2;
        this.posY = game.leaderboardPlayerScore.posY + game.leaderboardPlayerScore.height / 2 - this.height / 2;

        //adjust font
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
    },
        //draw object
    draw: function () {
        this.updateScore();
        this.adjustStyle();
    },
	//apply changes
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "pt";
        this.div.style.zIndex = 4;
    },
    //Update/display score
    updateScore: function () {
        this.score = Math.max(0, game.player.score);
        this.div.innerHTML = this.score;
    },
        //Handle user interaction
    clickMe: function() {
        //Refresh timer
        game.timeoutOverlay.refreshTimer();
    }
};
game.finalPlayerScore.init();

//Leaderboard Table
game.top10players = {
        //Get handle 
    div: document.getElementById("top10table"),
        //Declare object information
    org_width: 0,
    org_height: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_font_size: 36,
    font_size: 0,
    //Array to hold items
    divArray: [],
    //table commplete
    tableBuilt: false,
    //Initialize
    init: function() {
        //Add event listener
        this.div.addEventListener("click", game.top10players.clickMe);
    },
        //Adjust transformation
    resize: function () {
        this.width = game.width * .80;
        this.height = game.height - 280 * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Left Side
        this.posX = game.posX + (game.width - this.width) / 2;
        this.posY = game.posY + 250 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
            

        // Update font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        // Update CSS for all children
        $("#lbContainerDiv").width(this.width);
    },
    
    // Apply changes via CSS
    adjustStyle: function () {
        if (!this.tableBuilt) {
            this.buildTable();
        }
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.fontSize = this.font_size + "px";
        this.div.style.zIndex = 1;
    },
    
    // Hide the table and clear
    hideTable: function () {
        this.divArray = [];
        this.tableBuilt = false;
    },
    // Build the table
    buildTable: function () {
        var place = "";
        var divPrefix = '<div id="lbContainerDiv';
        var tablePrefix = '<table>';
        var rowPrefix = '<tr>';
        var dataPrefix = '<td class="top-10-data"';
        var tableBuilder = '';
        var placeHolder = '';
        var scoreHolder = '';

        //AJAX query
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "scripts/leaderboard.php", true);
        ajax.send();

        // Perform actions when AJAX completes (State: 4)
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Parse and store the JSON message from PHP
                var leaders = JSON.parse(this.responseText);

                //open div
                tableBuilder += divPrefix + place + '" class="table-container" style="width:' + (game.top10players.width) + 'px">';
                
                for (var i = 0; i < leaders.length; i++) {
                    place = i + 1;

                    placeHolder = leaders[i].user.toString();
                    scoreHolder = leaders[i].score.toString();

                    if (game.player.initials.toString() == placeHolder && game.player.score.toString() == scoreHolder) {
                        tableBuilder += tablePrefix + rowPrefix + dataPrefix + " style='background-color: #f41c63;'>" + place + "</td>" + dataPrefix + " style='background-color: #f41c63;'>" + leaders[i].user + "</td>" + dataPrefix + " style='background-color: #f41c63;'>" + scoreHolder + "</td></tr>";
                    } else {
                        tableBuilder += tablePrefix + rowPrefix + dataPrefix + ">" + place + "</td>" + dataPrefix + ">" + leaders[i].user + "</td>" + dataPrefix + ">" + scoreHolder + "</td></tr>";
                    }

                }
                //close table
                tableBuilder += "</table>"

                //close div
                tableBuilder += "</div>";

                game.top10players.divArray.push("lbContainerDiv");
                game.top10players.div.innerHTML = tableBuilder;
                
                // Disable extra queries
                game.top10players.tableBuilt = true;
            }
        }
    },
	// Handle user interaction
    clickMe: function () {
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
    }
};
game.top10players.init();

//   - Buttons
game.leaderboardMenuButton = {
	// Get handle to image
    image: document.getElementById("menuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
    
    init:function () {
        //Add event
        this.image.addEventListener("click", game.menuButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width - this.width;
        this.posY = Math.max(50, Math.min(40, this.org_posY - engine.heightDifference));
    },
	// Draw the object
    draw: function () {
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.image.style.position = "absolute";
        this.image.style.display = "block";
        this.image.style.left = this.posX.toString() + "px";
        this.image.style.top = this.posY.toString() + "px";
        this.image.style.width = this.width + "px";
        this.image.style.height = this.height + "px";
        this.image.style.zIndex = 1;
    },
    // Handle user interaction based on game state
    clickMe: function () {
		// Determine the current game state
        switch (game.currState) {
            case 'start':
				// Inform Google the user quit the game
                game.google.quit();
				// Redirect the user to the O'Hare landing page
                window.location.replace("http://www.flywithbutchohare.com/");
                break;
            default:
				// All but the Start Scene returns to the Start Scene
				// Hide all elements
                game.hideElements.hideAll();
				// Reset the player object
                game.player.reset();
				// Refresh the timeout timer
                game.timeoutOverlay.refreshTimer();
				// Set the new game state to the Start Scene
                game.currState = game.gameState[0];
				// Redraw all objects
                game.drawOnce();
                break;
        }
    }
};
game.menuButton.init();// Force initialize object on first script load

game.leaderboardRetryButton = {
	// Get handle to image
    image: document.getElementById("leaderboardRetryButton"),
	// Declare object transform information
    org_width: 265 * game.scale,
    org_height: 107 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener
        this.image.addEventListener("click", game.leaderboardRetryButton.retry);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 5.5 - this.width / 5.5;
        this.posY = engine.height / 1.5 - this.height / 1.5;
    },
	// Draw the object
    draw: function () {
        this.adjustStyle();
    },
	// Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.image.style.position = "absolute";
        this.image.style.display = "block";
        this.image.style.left = this.posX.toString() + "px";
        this.image.style.top = this.posY.toString() + "px";
        this.image.style.width = this.width + "px";
        this.image.style.height = this.height + "px";
        this.image.style.zIndex = 1;
    },
    // Actions when clicking
    retry: function () {
        // Inform Google the player is starting a new game
        game.google.start();
        // Set the game state to Play Scene
        game.currState = game.gameState[1];
        // Reset the player object
        game.player.reset();
        // Reset leaderboard table
        game.top10players.hideTable();
        // Reset plane animation
        game.leaderboardAnimation.resetElements();
        // Refresh the timeout timer
		game.timeoutOverlay.refreshTimer();
        // Hide all elements
		game.hideElements.hideAll();
        // Redraw all elements
		game.drawOnce();
    }
};
game.leaderboardRetryButton.init();