/*global $, TILE_SIZE, LEFT, RIGHT, UP, DOWN, window */

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

    var $e = $("<div/>").addClass("tile tile-moving").css({
        left: x * TILE_SIZE,
        top: y * TILE_SIZE
    });

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



        tileTick: function () {

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
