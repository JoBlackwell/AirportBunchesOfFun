// JavaScript Document

// DEBUG
console.log("play_scene.js loaded successfully");

//   - Images
game.playBackground = {
    // Get handle to image
    image: document.getElementById("playBackground"),
    // Declare object transform information
    org_width: 1920 * game.scale,
    org_heigth: 1080 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = engine.width;
        this.height = engine.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playField = {
    // Get handle to image
    image: document.getElementById("playField"),
    // Declare object transform information
    org_width: 1026 * game.scale,
    org_heigth: 940 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = (((game.playTitle.posX + game.playTitle.width) + game.playSponsor.posX) / 2) - (this.width / 2);
        this.posY = engine.height/2 - this.height/2;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playTimeBoard = {
    // Get handle to image
    image: document.getElementById("timeBoard"),
    // Declare object transform information
    org_width: 413,
    org_heigth: 350,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 50 * game.scale;
        this.posY = game.playTitle.posY - this.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playTitle = {
    // Get handle to image
    image: document.getElementById("titleWhite"),
    // Declare object transform information
    org_width: 413,
    org_heigth: 262,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 50 * game.scale;
        this.posY = engine.height / 2 - this.height / 2;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playScoreBoard = {
    // Get handle to image
    image: document.getElementById("scoreBoard"),
    // Declare object transform information
    org_width: 413,
    org_heigth: 263,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = 50 * game.scale;
        this.posY = game.playTitle.posY + game.playTitle.height;
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        console.log("Score Pos X: " + this.posX);
    }
};

game.playSponsor = {
        // Get handle to image
        image: document.getElementById("sponsorsBox"),
        // Declare object transform information
        org_width: 340,
        org_heigth: 620,
        width: 0,
        height: 0,
        posX: 0,
        posY: 0,
        // Adjust the object's transform
        resize: function () {
            this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
            this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
            this.posX = engine.width - this.width;
            this.posY = engine.height - this.height; 
        },
        // Draw the object
        draw: function () {
            this.resize();
            engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        }
};

game.playScore = {
    // Get handle to div element
    div: document.getElementById("playerScore"),
    // Declare object transform information
    org_width: 200 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
    // Declare member variables
    org_font_size: 82,
    font_size: 0,
    textResize: function() {
        // Declare references to screen objects
        var mySpan = $("#playerScoreSpan");
        var myDiv = $("#playerScore");
        
        // Initialize the span
        mySpan.css("font-size", this.org_font_size);
        mySpan.html(myDiv.html());
        
        // Reduce the font size until the span is the correct width
        if (mySpan.width() > this.width) {
                while (mySpan.width() > this.width) {
                // Get the font size as an integer, base 10
                this.font_size = parseInt(mySpan.css("font-size"), 10);
                // Reduce the font size by 1
                mySpan.css("font-size", this.font_size - 1);
            }
        } else if (this.font_size < this.org_font_size) {
            // Reset the font size to normal
            this.font_size = this.org_font_size;
            // Reduce the font size by 1
            mySpan.css("font-size", this.font_size);
        }
        
        // Set the player score to the proper size
        $("#playerScore").css("font-size", this.font_size).html(mySpan.html());
    },
    // Adjust the object's transform
    resize: function () {

        this.width = game.playScoreBoard.width * 0.8;
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = (game.playScoreBoard.posX + game.playScoreBoard.width/2) - this.width/2;
        this.posY = game.playScoreBoard.posY + game.playScoreBoard.height * 0.32;
        
        // Adjust font size
        this.textResize();
    },
    // Draw the object
    draw: function () {
        this.updateScore();
        this.adjustStyle();
    },
    // Apply changes via CSS
    adjustStyle: function () {
        this.resize();
        this.div.style.position = "absolute";
        this.div.style.display = "block";
        this.div.style.left = this.posX.toString() + "px";
        this.div.style.top = this.posY.toString() + "px";
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.zIndex = 1;
    },
    updateScore: function () {
        game.player.score = 100;
    }
};

//   - Buttons
game.playMenuButton = {
	// Get handle to image
    image: document.getElementById("menuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
    org_posX: 1645,
    org_posY: 50,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        // Attach Top-Right Side
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
    }
};
