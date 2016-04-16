/*global jQuery, $, window, document, Level, Player, Tile */

var HORIZONTAL = true,
    VERTICAL = false;
var $game;
var showPopup;

var TILE_SIZE = 100;



$(function () {

    var $window = $(window),
        $document = $(document);
    $game = $("#game");



    showPopup = function (id, properties) {

        var $popup = $("#popup-" + id);

        $.each(properties, function (k, v) {
            var $field = $("#popup-" + id + "-" + k);
            $field.html(v);
        });

        $popup.show().css("opacity", 0);
        window.setTimeout(function () {
            $popup.css("opacity", "").addClass("popup-visible");
        }, 50);

    };



    var level = Level(8, 8, 2, 2, 6, 6);
    {
        level.setTile(Tile(1, 1));
        level.setTile(Tile(2, 6));
        level.setTile(Tile(4, 5));
        level.setTile(Tile(5, 3));
    }
    level.show();



    var $headMoves = $("#head-moves"),
        $headTime = $("#head-time");

    window.setInterval(function () {

        $headMoves.text(level.stats.moves);

        if (!level.player.isFinishing) {
            var elapsed = (Date.now() - level.stats.startTime) / 1000;
            level.stats.elapsedTime = elapsed;
            $headTime.text(elapsed.toFixed(1) + "s");
        }

    }, 100);





    $document.keydown(function(e) {

        switch(e.which) {
            case 37: // left
                level.player.move(-1, 0);
                break;
            case 38: // up
                level.player.move(0, -1);
                break;
            case 39: // right
                level.player.move(1, 0);
                break;
            case 40: // down
                level.player.move(0, 1);
                break;
            default:
                return;
        }

        // prevent scrolling
        e.preventDefault();

    }).keypress(function(e) {

        switch(String.fromCharCode(e.which)) {
            case 'a': // left
                level.player.move(-1, 0);
                break;
            case 'w': // up
                level.player.move(0, -1);
                break;
            case 'd': // right
                level.player.move(1, 0);
                break;
            case 's': // down
                level.player.move(0, 1);
                break;
            default:
                return;
        }

        // prevent scrolling
        e.preventDefault();

    });

});
