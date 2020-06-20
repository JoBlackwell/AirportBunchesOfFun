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