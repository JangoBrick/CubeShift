/*global window, $, HORIZONTAL, VERTICAL, showPopup, TILE_SIZE, setLevelScore, currentLevelIndex */

function Player(level, x, y) {

    var $e = $("<div/>").addClass("player player-h").css({
        left: x * TILE_SIZE,
        top: y * TILE_SIZE
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
            left: startX * TILE_SIZE,
            top: startY * TILE_SIZE
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

        isFinishing: false,



        move: function (x, y) {

            if (this.isFinishing) {
                return;
            }

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
                left: nx * TILE_SIZE,
                top: ny * TILE_SIZE
            });

            createPath(prevPos, this.position);

            if (nx === level.destination.x && ny == level.destination.y) {

                this.isFinishing = true;

                window.setTimeout(function () {
                    $e.addClass("player-final");
                    window.setTimeout(function () {

                        var score = 400 / ((level.stats.elapsedTime / 4) * level.stats.moves);

                        showPopup("level-done", {
                            time: level.stats.elapsedTime.toFixed(1) + "s",
                            moves: level.stats.moves,
                            score: score.toFixed(1)
                        });

                        setLevelScore(currentLevelIndex, score);

                    }, 1500);
                }, 100);

            }

            level.stats.moves++;

        },



        append: function ($container) {
            $e.appendTo($container);
        },

        remove: function () {
            $e.remove();
        }

    };

}
