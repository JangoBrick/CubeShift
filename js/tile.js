/*global $ */

function Tile(x, y) {

    var $e = $("<div/>").addClass("tile").css({
        left: x * 100,
        top: y * 100
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
