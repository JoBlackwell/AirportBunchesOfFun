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

game.playTimeBoardBG = {
    // Get handle to image
    image: document.getElementById("playTimeBoardBG"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_heigth: 350 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    org_posY: 50,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = Math.max(50, Math.min(40, this.org_posY - engine.heightDifference))
    },
    // Draw the object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playTimeBoard = {
    // Get handle to div
    div: document.getElementById("playTimeBoard"),
    // Declare object transform information
    org_width: 200 * game.scale,
    org_height: 95 * game.scale,
    width: 0,
    height: 0,
    org_posX: 150,
    org_posY: 82,
    posX: 0,
    posY: 0,
    // Declare member variables
    org_font_size: 82,
    font_size: 0,
    timeStart: null,
    timeEnd: null,
    timeSeconds: null,
    timerStarted: false,
    timerExpired: false,
    timerDisplay: '',
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.playTimeBoard.clickMe);
    },
    // Adjust the object's transform
    resize: function () {
        
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_height * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        this.posX = (game.playTimeBoardBG.posX + game.playTimeBoardBG.width/2) - this.width/2;
        this.posY = game.playTimeBoardBG.posY + game.playTimeBoardBG.height - this.height - 16 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        // Adjust font size
        this.font_size = this.org_font_size * (1 - Math.max(engine.widthProportion, engine.heightProportion));
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
        this.div.style.fontSize = this.font_size + "pt";
        this.div.style.zIndex = 4;
    },
    // Handle user interaction based on game state
    clickMe: function () {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
    }
};
game.playTimeBoard.init(); // Force initialize playTimeBoard's event listener

game.playTitle = {
    // Get handle to image
    image: document.getElementById("titleWhite"),
    // Declare object transform information
    org_width: 413 * game.scale,
    org_heigth: 262 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTimeBoardBG.posY + game.playTimeBoardBG.height;
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
    org_width: 413 * game.scale,
    org_heigth: 263 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    // Adjust the object's transform
    resize: function () {
        
        this.width = this.org_width * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.height = this.org_heigth * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        
        this.posX = 30 + 10 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playTitle.posY + game.playTitle.height;
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
    // Initialize the object
    init: function () {
        // Add event listener to the button
        this.div.addEventListener("click", game.playScore.clickMe);
    },
    textResize: function () {
        // Declare references to screen objects
        var mySpan = $("#playScoreSpan");
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

        this.posX = (game.playScoreBoard.posX + game.playScoreBoard.width / 2) - this.width / 2;
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
    // Update the score with the player's score
    updateScore: function () {
        this.div.innerHTML = Math.max(0, game.player.score);
    },
    // Handle user interaction
    clickMe: function () {
        // Refresh the timeout timer
        game.timeoutOverlay.refreshTimer();
    }
};

game.playFieldBackground = {
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
        this.posY = engine.height / 2 - this.height / 2;
    },
    // Draw the object
    draw: function () {
        this.resize();
        // engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playSponsor = {
    // Get handle
    image: document.getElementById("sponsorsBox"),
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
        this.posX = engine.width - this.width;
        this.posY = engine.height - this.height;
    },
    // Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

game.playSponsorLogo = {
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
        this.width = game.playSponsor.width * 0.70;
        this.height = this.width;

        // Attach Bottom Side
        this.posX = game.playSponsor.posX + 35 * (1 - Math.max(engine.widthProportion, engine.heightProportion));
        this.posY = game.playSponsor.posY + game.playSponsor.height / 2 - this.height / 3;
    },
    // Draw object
    draw: function () {
        this.resize();
        engine.context.drawImage(this.image(), this.posX, this.posY, this.width, this.height);
    }
};

game.playFieldGrid = {
    //get handle to div
    div: document.getElementById("playGrid"),
    //define transform information
    org_width: 1026 * game.scale,
    org_height: 940 * game.scale,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    gridArray: [],
    //adjust transformation
    resize: function () {
        //set dive size equal to play field background
        this.width = game.playFieldBackground.width;
        this.height = game.playFieldBackground.height;

        //position div on top of play field background
        this.posX = game.playFieldBackground.posX;
        this.posY = game.playFieldBackground.posY;
    },
    draw: function () {
        this.adjustStyle();
        this.buildGrid();
    },
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
    buildGrid: function () {
        var containerNum = "";
        var divPrefix = '<div id="gemContainerDiv'
        var gridBuilder = '';

        for (var i = 0; i < 81; i++) {
            containerNum = i + 1;
            gridBuilder += divPrefix + containerNum + '" class="gem-container" style="display:inline-block; width:' + Math.floor(game.playFieldGrid.width / 9 - 2) + 'px;height: ' + Math.floor(game.playFieldGrid.height / 9 - 2) + 'px;margin:0px;">gem</div>';
            
            
            game.playFieldGrid.gridArray.push("gemContainerDiv");    
        };
        

        game.playFieldGrid.div.innerHTML = gridBuilder;
    }
}



game.playField = {
    positions: [],
    shape: null,
    init: function () {
        for (var i = 0; i < 81; i++) {
            var shape = new Shape();
            this.positions.push({shape});
    }
},
    evaluate: function() {
        for (var i = 0; i < 81; i++) {
            this.shape = this.positions[i]
            this.shape.x = i % 9; // Column
            this.shape.y = i % 9; // Row
            if (this.shape.x == 0) {
                this.shape.top = null;
                this.shape.left = null;
                this.shape.right = this.positions[i + 1];
                if (this.positions.length > (i + 9)) {
                    this.shape.bottom = this.positions[i + 9];
                }
            }
        }
    }
};

game.shapeId = 0; // Must remain unique!

game.triangle = {
    image: $("#myTriangle")
}
game.star = {
    image: $("#myStar")
}
game.heart = {
    image: $("#myHeart")
}
game.square = {
    image: $("#mySquare")
}
game.cicle = {
    image: $("#myCircle")
}
game.pentagon = {
    image: $("#myPentagon")
}
game.rectangle = {
    image: $("#myRectangle")
}

var shapeArray = [game.triangle, game.star, game.heart, game.square, game.circle, game.pentagon, game.rectangle];
function getRandomShape() {
    var myShape = shapeArray[Math.floor(Math.random() * shapeArray.length)];
}
