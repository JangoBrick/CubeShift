/*global $, $game, Player */

function Level(w, h, px, py, destx, desty) {

    var $e = $("<div/>").addClass("level").css({
        width: w * 100,
        height: h * 100
    });

    var $dest = $("<div/>").addClass("destination").css({
        left: destx * 100,
        top: desty * 100
    }).appendTo($e);

    var level = {

        width: w,
        height: h,

        destination: {
            x: destx,
            y: desty
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
