/*global jQuery, $, window, document, console, Level, Player, Tile */

var HORIZONTAL = true,
    VERTICAL = false;
var $game;
var showPopup, hidePopup;

var TILE_SIZE = 100;

var startLevel;
var currentLevelIndex = 0, currentLevel = null;
var replayLevel, nextLevel;

var setLevelScore;



$(function () {

    var levelDefs = [
        ["........", ".#......", "..@.....", ".....#..", "........", "....#...", "..#...o.", "........"],
        [".....#.o", "....#...", "......##", "#....#..", "..#.....", "......#.", "......@.", "...#...."]
    ];

    var scores = [];



    var $window = $(window),
        $document = $(document);
    $game = $("#game");



    showPopup = function (id, properties) {

        hidePopup();

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

    hidePopup = function () {
        var $popup = $(".popup:visible").removeClass("popup-visible");
        window.setTimeout(function () {
            $popup.hide();
        }, 400);
    };



    startLevel = function (index) {

        if (index < 0) {
            return;
        } else if (index >= levelDefs.length) {
            var totalScore = 0;
            for (var levelIndex=0; levelIndex<scores.length; levelIndex++) {
                if (!isNaN(scores[levelIndex]))
                    totalScore += scores[levelIndex];
            }
            showPopup("completed", {
                score: totalScore.toFixed(1)
            });
            return;
        }

        var tiles = [];
        var startX = 0, startY = 0;
        var destX = 7, destY = 7;

        $.each(levelDefs[index], function (y, cols) {
            for (var x=0; x<cols.length; x++) {

                var tile = cols.charAt(x);

                if (tile === "#") {
                    tiles.push(Tile(x, y));
                } else if (tile === "o") {
                    destX = x;
                    destY = y;
                } else if (tile === "@") {
                    startX = x;
                    startY = y;
                }

            }
        });

        var level = Level(8, 8, startX, startY, destX, destY);
        for (var i=0; i<tiles.length; i++) {
            level.setTile(tiles[i]);
        }

        if (currentLevel) {
            currentLevel.hide();
        }

        currentLevel = level;
        currentLevelIndex = index;
        level.show();

        hidePopup();

    };

    startLevel(0);



    replayLevel = function () {
        startLevel(currentLevelIndex);
    };

    nextLevel = function () {
        startLevel(currentLevelIndex + 1);
    };



    setLevelScore = function (levelIndex, score) {
        scores[levelIndex] = score;
    };



    var $headMoves = $("#head-moves"),
        $headTime = $("#head-time");

    window.setInterval(function () {

        $headMoves.text(currentLevel.stats.moves);

        if (!currentLevel.player.isFinishing) {
            var elapsed = (Date.now() - currentLevel.stats.startTime) / 1000;
            currentLevel.stats.elapsedTime = elapsed;
            $headTime.text(elapsed.toFixed(1) + "s");
        }

    }, 100);





    $document.keydown(function(e) {

        switch(e.which) {
            case 37: // left
                currentLevel.player.move(-1, 0);
                break;
            case 38: // up
                currentLevel.player.move(0, -1);
                break;
            case 39: // right
                currentLevel.player.move(1, 0);
                break;
            case 40: // down
                currentLevel.player.move(0, 1);
                break;
            default:
                return;
        }

        // prevent scrolling
        e.preventDefault();

    }).keypress(function(e) {

        switch(String.fromCharCode(e.which)) {
            case 'a': // left
                currentLevel.player.move(-1, 0);
                break;
            case 'w': // up
                currentLevel.player.move(0, -1);
                break;
            case 'd': // right
                currentLevel.player.move(1, 0);
                break;
            case 's': // down
                currentLevel.player.move(0, 1);
                break;
            default:
                return;
        }

        // prevent scrolling
        e.preventDefault();

    });

});
