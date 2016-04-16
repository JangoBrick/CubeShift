/*global $, TILE_SIZE */

function Tile(x, y) {

    var $e = $("<div/>").addClass("tile").css({
        left: x * TILE_SIZE,
        top: y * TILE_SIZE
    });

    return {

        position: {
            x: x,
            y: y
        },



        append: function ($container) {
            $e.appendTo($container);
        },

        remove: function () {
            $e.remove();
        }

    };

}
