/*global $, window, $game, TILE_SIZE, Player, DEATH_CRUSHED, DEATH_STUCK, HORIZONTAL, VERTICAL */

function Level(w, h, px, py, destx, desty) {

    var $e = $("<div/>").addClass("level").css({
        width: w * TILE_SIZE,
        height: h * TILE_SIZE
    });

    var $dest = $("<div/>").addClass("destination").css({
        left: destx * TILE_SIZE,
        top: desty * TILE_SIZE
    }).appendTo($e);



    var tickId = 0;

    var tick = function () {

        var loopTiles = tiles.slice(0);

        for (var i=0; i<loopTiles.length; i++) {
            var tile = loopTiles[i];
            if (!tile)
                continue;
            if (tile.tileTick)
                tile.tileTick(tickId);
        }



        if (!player.isFinishing) {

            var canMove = false,
                ppos = player.position;

            if (player.state === HORIZONTAL) {
                var left = level.getTile(ppos.x - 1, ppos.y),
                    right = level.getTile(ppos.x + 1, ppos.y);
                canMove = !left || left.isMoving || !right || right.isMoving;
            } else {
                var top = level.getTile(ppos.x, ppos.y - 1),
                    bottom = level.getTile(ppos.x, ppos.y + 1);
                canMove = !top || top.isMoving || !bottom || bottom.isMoving;
            }

            if (!canMove) {
                player.die(DEATH_STUCK);
            }

        }



        tickId++;

    };
    var tickInterval;



    var level = {

        width: w,
        height: h,

        destination: {
            x: destx,
            y: desty
        },



        stats: {
            startTime: -1,
            elapsedTime: 0,
            moves: 0
        },



        checkBounds: function (x, y) {
            return !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0 && x < w && y < h;
        },



        getTile: function (x, y) {
            if (!this.checkBounds(x, y))
                return undefined;
            return tiles[x * w + y];
        },

        setTile: function (tile) {

            var pos = tile.position;
            if (!this.checkBounds(pos.x, pos.y))
                return false;

            var prev = this.getTile(pos.x, pos.y);
            if (prev) {
                prev.remove();
            }

            tiles[pos.x * w + pos.y] = tile;
            tile.append(this, $e);

            return true;

        },



        updateTilePosition: function (tile, prevX, prevY) {

            var prevTile = this.getTile(prevX, prevY);
            if (prevTile !== tile)
                return false;

            var pos = tile.position;
            if (!this.checkBounds(pos.x, pos.y))
                return false;

            tiles[prevX * w + prevY] = null;

            var otherTile = tiles[pos.x * w + pos.y];
            if (otherTile) {
                otherTile.remove();
            }
            tiles[pos.x * w + pos.y] = tile;

            if (!player.isFinishing && pos.x === player.position.x && pos.y === player.position.y) {
                window.setTimeout(function () {
                    if (!player.isFinishing && pos.x === player.position.x && pos.y === player.position.y) {
                        player.die(DEATH_CRUSHED);
                    }
                }, 400);
            }

            return true;

        },



        show: function () {

            $e.appendTo($game);
            this.stats.startTime = Date.now();

            if (tickInterval) {
                window.clearInterval(tickInterval);
            }
            /* 128 bpm - rhythm of the music */
            window.setInterval(tick, 60 / 128 * 1000);

        },

        hide: function () {
            $e.remove();
            window.clearInterval(tickInterval);
        }

    };

    var tiles = new Array(w * h);

    var player = level.player = Player(level, px, py);
    player.append($e);

    return level;

}
