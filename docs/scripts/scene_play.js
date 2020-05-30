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

game.playSponsorLogo = {
    //
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
    textResize: function () {
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
    updateScore: function () {
        game.player.score = 100;
    }
};

/*
game.playField = {
    positions: [],
    shape: null,
    init: function () {
        for (var i = 0; i < 81; i++) {
            var shape = new Shape();
            this.positions.push({ parseInt(shape.id) + ":" + shape._type});
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
class Shape {
    constructor() {
        var self = this;
        this.id = game.shapeId++;
        this.x = null;
        this.y = null;
        this.top = null;
        this.bottom = null;
        this.right = null;
        this.left = null;
    }
    switch(myShape, target) {

    }
    createRandomShape() {
        var x = Math.floor(Math.random * 7);
        switch (x) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            default:

        }
    }
}
class triangle extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "triangle";
        this.shape = document.getElementById("triangleShape");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}
class circle extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "circle";
        this.shape = document.getElementById("gemCircle");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}
class rectangle extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "rectangle";
        this.shape = document.getElementById("gemRactangle");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}
class star extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "star";
        this.shape = document.getElementById("gemStar");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}
class pentagon extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "pentagon";
        this.shape = document.getElementById("gemPentagon");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}
class square extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "square";
        this.shape = document.getElementById("gemSquare");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}
class heart extends Shape {
    constructor() {
        super();
        var self = this;
        this.type = "heart";
        this.shape = document.getElementById("gemHeart");
        this.addEventListener("drag", self.dragMe);
        this.points = 120;
    }
    dragMe() {
        var direction = self.getMouseDragDirection();
        switch (direction) {
            case 'up':
                if (super.top) {
                    try {
                        super.switch(this, super.top);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'down':
                if (super.bottom) {
                    try {
                        super.switch(this, super.bottom);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'left':
                if (super.left) {
                    try {
                        super.switch(this, super.left);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
            case 'right':
                if (super.right) {
                    try {
                        super.switch(this, super.right);
                    }
                    catch (InvalidShapeException) {
                        // Do nothing
                    }
                }
        }
    }
    getMouseDragDirection() {

    }
    get _type() {
        return this.type;
    }
}

game.triangle = {
    image: $("#myTriangle"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}
game.star = {
    image: $("#myStar"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}
game.heart = {
    image: $("#myHeart"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}
game.square = {
    image: $("#mySquare"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}
game.cicle = {
    image: $("#myCircle"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}
game.pentagon = {
    image: $("#myPentagon"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}
game.rectangle = {
    image: $("#myRectangle"),
    org_width: 99,
    org_height: 99,
    width: 0,
    height: 0,
    resize: function () {
        this.width = playFieldBackground.width / 9;
        this.height = playFieldBackground.height / 9;
    },
    draw: function () {
        this.resize();
    }
}

var shapeArray = [game.triangle, game.star, game.heart, game.square, game.circle, game.pentagon, game.rectangle];
function getRandomShape() {
    var myShape = shapeArray[Math.floor(Math.random() * shapeArray.length)];
}
*/



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
