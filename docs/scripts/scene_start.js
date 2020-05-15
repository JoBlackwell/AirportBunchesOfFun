// JavaScript Document

// - Start Scene
// - Images
game.startBackground = {
	// Get handle to image
    image: document.getElementById("ABoFBackground"),
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

game.ABoFTitle = {
	// Get handle to image
    image: document.getElementById("ABoFTitle"),
	// Declare object transform information
    org_width: 413 * game.scale,
    org_height: 262 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 40,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 2;
        this.posY = Math.max(40, Math.min(50, this.org_posY * (1 - Math.max(engine.widthProportion, engine.heightProportion))));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//   - Buttons
game.menuButton = {
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
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.menuButton.clickMe);
    },
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
game.menuButton.init();// Force initialize object on first script load

game.startButton = {
	// Get handle to image
    image: document.getElementById("startButton"),
	// Declare object transform information
    org_width: 256 * game.scale,
    org_height: 256 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.startButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 1.98 - this.width / 2;
        this.posY = engine.height / 3 - this.height / 2;
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
game.startButton.init(); // Force object initialization on first script load

game.leaderboardButton = {
	// Get handle to image
    image: document.getElementById("leaderboardButton"),
	// Declare object transform information
    org_width: 256 * game.scale,
    org_height: 256 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.leaderboardButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 1.98 - this.width / 2;
        this.posY = engine.height / 2 - this.height / 2;
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
};
game.leaderboardButton.init(); // Force object initialization on first script load

game.quitButton = {
	// Get handle to image
    image: document.getElementById("quitButton"),
	// Declare object transform information
    org_width: 256 * game.scale,
    org_height: 256 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.quitButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 1.98 - this.width / 2;
        this.posY = engine.height / 1.5 - this.height / 2;
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
};
game.quitButton.init(); // Force object initialization on first script load