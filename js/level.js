/*global $, $game, TILE_SIZE, Player */

function Level(w, h, px, py, destx, desty) {

    var $e = $("<div/>").addClass("level").css({
        width: w * TILE_SIZE,
        height: h * TILE_SIZE
    });

    var $dest = $("<div/>").addClass("destination").css({
        left: destx * TILE_SIZE,
        top: desty * TILE_SIZE
    }).appendTo($e);

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



        getTile: function (x, y) {
            return tiles[x * w + y];
        },

        setTile: function (tile) {
            var prev = this.getTile(tile.position.x, tile.position.y);
            if (prev) {
                prev.remove();
            }
            tiles[tile.position.x * w + tile.position.y] = tile;
            tile.append($e);
        },



        show: function () {
            $e.appendTo($game);
            this.stats.startTime = Date.now();
        },

        hide: function () {
            $e.remove();
        }

    };

    var tiles = new Array(w * h);

    var player = level.player = Player(level, px, py);
    player.append($e);

    return level;

}
