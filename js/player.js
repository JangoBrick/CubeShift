/*global $, HORIZONTAL, VERTICAL */

function Player(level, x, y) {

    var $e = $("<div/>").addClass("player player-h").css({
        left: x * 100,
        top: y * 100
    });

    return {

        position: {
            x: 2,
            y: 2
        },

        state: HORIZONTAL,



        move: function (x, y) {

            var nx = this.position.x + x,
                ny = this.position.y + y;

            if (nx < 0 || ny < 0 || nx >= level.width || ny >= level.height) {
                return;
            }

            var nt = level.getTile(nx, ny);
            if (nt) {
                return;
            }

            if (x !== 0) {
                if (this.state !== HORIZONTAL)
                    return;
                this.state = VERTICAL;
                $e.removeClass("player-h").addClass("player-v");
            } else {
                if (this.state !== VERTICAL)
                    return;
                this.state = HORIZONTAL;
                $e.removeClass("player-v").addClass("player-h");
            }

            this.position.x = nx;
            this.position.y = ny;

            $e.css({
                left: nx * 100,
                top: ny * 100
            });

        },



        append: function ($container) {
            $e.appendTo($container);
        },

        remove: function () {
            $e.remove();
        }

    };

}
