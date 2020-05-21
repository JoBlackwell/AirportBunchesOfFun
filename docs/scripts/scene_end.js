// JavaScript Document

// DEBUG
console.log("scene_end.js loaded successfully");
//Start End Scene

// Images
//End_Scene Play background 
game.endBackground = {
	// Get handle to image
    image: document.getElementById("endBackground"),
	// Declare object transform information
    org_width: 1920 * game.scale,
    org_height: 1080 * game.scale,
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

//   - Buttons
// Left Panel
//End_Scene Time Board Background
game.endTimeBoardBG = {
	// Get handle to image
    image: document.getElementById("endTimeBoardBG"),
	// Declare object transform information
    org_width: 413 * game.scale,
    org_height: 350 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = Math.max(50, Math.min(40, this.org_posY - engine.heightDifference));
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};
//End_Scene Time Left
game.TimeLeft = {
    // Get handle to div element
    div: document.getElementById("endTimeLeft"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_height: 263 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endGamePoints.posY / 1;
    },
	// Draw the object
    draw: function () {
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
    }
};

//End_Scene Title Background
game.endTitle = {
	// Get handle to image
    image: document.getElementById("titleWhite"),
	// Declare object transform information
    org_width: 413 * game.scale,
    org_height: 262 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endTimeBoardBG.posY + game.endTimeBoardBG.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Game Points Background
game.endGamePoints = {
    // Get handle to image
    image: document.getElementById("endGamePoints"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_height: 263 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endTitle.posY + game.endTitle.height;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Player Score
game.endPlayerScore = {
    // Get handle to div element
    div: document.getElementById("endPlayerScore"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_height: 263 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endGamePoints.posY / 1;
    },
	// Draw the object
    draw: function () {
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
    }
};

// Game Over Area
//End_Scene Game Over
game.endGameOver = {
	// Get handle to image
    image: document.getElementById("endGameOver"),
	// Declare object transform information
    org_width: 1320 * game.scale,
    org_height: 210 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = engine.width / 2 - this.width / 2.5;
        this.posY = game.endGamePoints.posY / 3;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Intials Background
game.endInitialsBG = {
	// Get handle to image
    image: document.getElementById("endInitials"),
	// Declare object transform information
    org_width: 811 * game.scale,
    org_height: 103 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = engine.width / 2 - this.width / 3;
        this.posY = game.endGamePoints.posY / 1.4;
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

//End_Scene Player Score
game.endPlayerInitials = {
    // Get handle to div element
    div: document.getElementById("endPlayerInitials"),
    // Declare object transform information
    org_width: 811 * game.scale,
    org_height: 103 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    poxY: 0,
	// Adjust the object's transform
    resize: function () {

        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = engine.width / 2 - this.width / 120;
        this.posY = game.endGamePoints.posY / 1.3;
    },
	// Draw the object
    draw: function () {
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
    }
};

//End_Scene Keypad Background
game.endKeyboardBackground = {
	// Get handle to image
    image: document.getElementById("endKeyboardBackground"),
	// Declare object transform information
    org_width: 1500 * game.scale,
    org_height: 870 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (2 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (2 - Math.max(engine.widthProportion, engine.heightProportion));

        this.posX = ((engine.width - (game.endTitle.posX + game.endTitle.width)) + (this.width/2)) / 4;
        this.posY = engine.height - this.height;

        console.log(`<End:KeyboardBG>\nW: ${this.width}, H: ${this.height}\nX: ${this.posX}, Y: ${this.posY}`);
    },
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.endKeyboardKeys = {
	// Get handle to image
    image: document.getElementById("endKeyboardKeys"),
	// Declare object transform information
    org_width: 94 * game.scale,
    org_height: 102 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = game.endKeyboardBackground.posX + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.endKeyboardBackground.posY + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
		
		<div id="inputKeypad" style="display: inline-block; position: absolute; left: 20px; top: 786px; width: 1540px; height: 244px; z-index: 1;"> == $0
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_A.png" name="A">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_B.png" name="B">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_C.png" name="C">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_D.png" name="D">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_E.png" name="E">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_F.png" name="F">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_G.png" name="G">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_H.png" name="H">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_I.png" name="I">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_J.png" name="J">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_K.png" name="K">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_L.png" name="L">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_M.png" name="M">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_N.png" name="N">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_O.png" name="O">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_P.png" name="P">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_Q.png" name="Q">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_R.png" name="R">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_S.png" name="S">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_T.png" name="T">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_U.png" name="U">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_V.png" name="V">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_W.png" name="W">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_X.png" name="X">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_Y.png" name="Y">
		<img id="LetterButton_A" class="keypad_image" sec="images/end_scene/key_Z.png" name="Z">
		</div>	
	},
	// Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

// Buttons
//End_Scene Menu Button
game.endMenuButton = {
	// Get handle to image
    image: document.getElementById("menuButton"),
	// Declare object transform information
    org_width: 275 * game.scale,
    org_height: 138 * game.scale,
    width: 0,
    height: 0,
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

//End_Scene Submit Button
game.endSubmitButton = {
	// Get handle to image
    image: document.getElementById("submitButton"),
	// Declare object transform information
    org_width: 215 * game.scale,
    org_height: 86 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
	// Initialize the object
    init: function () {
        // Add event listener to the button
        this.image.addEventListener("click", game.endSubmitButton.clickMe);
    },
	// Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posX = game.endKeyboardBackground.posX + (game.endKeyboardBackground.width - this.width) - 10;
        this.posY = game.endKeyboardBackground.posY + (game.endKeyboardBackground.height - this.height) / 1;
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

	clickMe: function () {
        //AJAX
        var ajax = new XMLHttpRequest();
		// Send player's initials and score to the database
        ajax.open("GET", "scripts/insert_score.php?u=" + game.player.initials + "&s=" + game.player.score, true);
        ajax.send();

		// Await response completion (State: 4)
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
				// DEBUG
                console.log(this.responseText);

				// TRANSITION
				// Change game state to Leaderboard Scene
                game.currState = game.gameState[3];
				// Hide all elements
                game.hideElements.hideAll();
				// Redraw all elements
                game.drawOnce();
				// Inform Google the player completed a playthrough
				game.google.finish();
            }
        }
    }
};
game.endSubmitButton.init(); // Force initialize object on first script load 