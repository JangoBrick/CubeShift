/*global $, TILE_SIZE, HORIZONTAL, VERTICAL, LEFT, RIGHT, UP, DOWN, window */

function Tile(x, y) {

    var $e = $("<div/>").addClass("tile").css({
        left: x * TILE_SIZE,
        top: y * TILE_SIZE
    });

    return {

        level: null,

        position: {
            x: x,
            y: y
        },

        isMoving: false,



        append: function (level, $container) {
            this.level = level;
            $e.appendTo($container);
        },

        remove: function () {
            this.level = null;
            $e.fadeOut(200, function () {
                $e.remove();
            });
        }

    };

}



function MovingTile(x, y, direction) {

    var nx = x,
        ny = y;
    switch (direction) {
        case LEFT:
            nx--;
            break;
        case RIGHT:
            nx++;
            break;
        case UP:
            ny--;
            break;
        case DOWN:
            ny++;
            break;
        default:
            return;
    }

    var horizontal = direction === LEFT || direction === RIGHT;
    var $e = $("<div/>").addClass("tile tile-moving").css({
        left: x * TILE_SIZE,
        top: y * TILE_SIZE
    }).append(
        $("<i/>").addClass("icon-" + (horizontal ? "horizontal" : "vertical"))
    );

    var state = false;

    return {

        level: null,

        position: {
            x: x,
            y: y
        },

        isMoving: true,



        append: function (level, $container) {
            this.level = level;
            $e.appendTo($container);
        },

        remove: function () {
            this.level = null;
            $e.fadeOut(200, function () {
                $e.remove();
            });
        },



        tileTick: function (tick) {

            if (tick % 2 === 0) {
                // move every 2nd tick
                return;
            }

            state = !state;

            var prevX = this.position.x,
                prevY = this.position.y;

            if (state) {
                this.position.x = nx;
                this.position.y = ny;
            } else {
                this.position.x = x;
                this.position.y = y;
            }

            if (!this.level.checkBounds(this.position.x, this.position.y)) {
                this.position.x = prevX;
                this.position.y = prevY;
            }

            $e.css({
                left: this.position.x * TILE_SIZE,
                top: this.position.y * TILE_SIZE
            }).css("opacity", 0.5);
            window.setTimeout(function () {
                $e.css("opacity", "");
            }, 400);

            this.level.updateTilePosition(this, prevX, prevY);

        }

    };

}



function SlidingTile(x, y, orientation) {

    var $e = $("<div/>").addClass("tile tile-sliding").css({
        left: x * TILE_SIZE,
        top: y * TILE_SIZE
    }).append(
        $("<i/>").addClass("icon-" + (orientation === HORIZONTAL ? "horizontal" : "vertical"))
    );

    var state = false;

    return {

        level: null,

        position: {
            x: x,
            y: y
        },

        isMoving: true,



        append: function (level, $container) {
            this.level = level;
            $e.appendTo($container);
        },

        remove: function () {
            this.level = null;
            $e.fadeOut(200, function () {
                $e.remove();
            });
        },



        tileTick: function (tick) {

            var prevX = this.position.x,
                prevY = this.position.y;
            var nx = prevX,
                ny = prevY;

            if (orientation === HORIZONTAL) {
                if (state) {
                    nx--;
                } else {
                    nx++;
                }
            } else {
                if (state) {
                    ny--;
                } else {
                    ny++;
                }
            }

            if (!this.level.checkBounds(nx, ny) || this.level.getTile(nx, ny)) {
                state = !state;
                return;
            }

            this.position.x = nx;
            this.position.y = ny;

            $e.css({
                left: this.position.x * TILE_SIZE,
                top: this.position.y * TILE_SIZE
            }).css("opacity", 0.5);
            window.setTimeout(function () {
                $e.css("opacity", "");
            }, 200);

            this.level.updateTilePosition(this, prevX, prevY);

        }

    };

}
