/*global jQuery, $, window, document, Level, Player, Tile */

var HORIZONTAL = true,
    VERTICAL = false;
var $game;



$(function () {

    var $window = $(window),
        $document = $(document);
    $game = $("#game");



    var level = Level(8, 8, 2, 2);
    {
        level.setTile(Tile(1, 1));
        level.setTile(Tile(2, 6));
        level.setTile(Tile(4, 5));
        level.setTile(Tile(5, 3));
    }
    level.show();





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
