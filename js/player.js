/*global $, HORIZONTAL, VERTICAL */

function Player(level, x, y) {

    var $e = $("<div/>").addClass("player player-h").css({
        left: x * 100,
        top: y * 100
    });

    var prevPos = {
        x: x,
        y: y
    };

    var createPath = function (from, to) {
        var startX = Math.min(from.x, to.x),
            endX = Math.max(from.x, to.x);
        var startY = Math.min(from.y, to.y),
            endY = Math.max(from.y, to.y);
        if (startX === endX && startY === endY)
            return;
        // TODO support for paths > 1
        var $path = $("<div/>").addClass("path").css({
            left: startX * 100,
            top: startY * 100
        });
        if (startX !== endX) {
            $path.addClass("path-h");
        } else {
            $path.addClass("path-v");
        }
        $e.parent().append($path.fadeIn(400));
    };

    return {

        position: {
            x: x,
            y: x
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

            prevPos.x = this.position.x;
            prevPos.y = this.position.y;

            this.position.x = nx;
            this.position.y = ny;

            $e.css({
                left: nx * 100,
                top: ny * 100
            });

            createPath(prevPos, this.position);

        },



        append: function ($container) {
            $e.appendTo($container);
        },

        remove: function () {
            $e.remove();
        }

    };

}
