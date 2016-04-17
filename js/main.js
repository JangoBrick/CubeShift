/*global jQuery, $, window, document, console, Level, Player, Tile, MovingTile, SlidingTile */

var HORIZONTAL = true, VERTICAL = false;
var LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;

var $game;
var showPopup, hidePopup;

var TILE_SIZE = 100;

var startLevel;
var currentLevelIndex = 0, currentLevel = null, levelCount;
var replayLevel, nextLevel;

var setLevelScore;



$(function () {

    var levelDefs = [
        [
            "........",
            ".#......",
            "..@.....",
            ".....#..",
            "........",
            "....#...",
            "..#...o.",
            "........"
        ],
        [
            ".....#.o",
            "....#...",
            "......##",
            "#....#..",
            "..#.....",
            "......#.",
            "......@.",
            "...#...."
        ],
        [
            ".......@",
            "........",
            "..<.<...",
            ".v...^..",
            "...o....",
            ".v...^..",
            "..>.>...",
            "........"
        ],
        [
            ".....#..",
            "....^v..",
            ".#v.#...",
            ".....#..",
            "...@#o..",
            ".#......",
            "....v#..",
            "........"
        ],
        [
            "v.<.<.<.",
            "..>.>.v^",
            "v^......",
            "...o#.v^",
            "v^.##@..",
            "......v^",
            "v^.<.<..",
            ".>.>.>.^"
        ],
        [
            "...#.#.#",
            "........",
            "..#..#.#",
            "...@....",
            "..#....#",
            "........",
            "..#.#.#.",
            "..o.....",
        ]
    ];
    levelCount = levelDefs.length;



    var scores = [];

    var saveScores = function () {

        var s = "";

        for (var i=0; i<scores.length; i++) {
            if (i > 0) {
                s += "|";
            }
            if (scores[i]) {
                s += scores[i].toFixed(1);
            } else {
                s += "-";
            }
        }

        window.localStorage.setItem("jangobrick.ld35.scores", s);

    };

    var scoresString = window.localStorage.getItem("jangobrick.ld35.scores");
    if (scoresString) {

        var scoresStringSpl = scoresString.split("|");

        for (var i=0; i<scoresStringSpl.length; i++) {
            if (scoresStringSpl[i] === "-") {
                scores[i] = undefined;
            } else {
                scores[i] = parseFloat(scoresStringSpl[i]);
            }
        }

    }



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

        if (id === "levels") {

            var $list = $("#popup-levels-list").empty();

            var startThisLevel = function () {
                var index = $(this).data("level-index");
                if (index === 0 || scores[index] || (index > 0 && scores[index - 1])) {
                    startLevel(index);
                }
            };

            var lastPlayed = -1;
            for (var i=0; i<levelDefs.length; i++) {

                var score = scores[i] ? scores[i].toFixed(1) : null;
                if (score) {
                    lastPlayed = i;
                }
                var playable = score || lastPlayed + 1 >= i;

                $list.append(
                    $("<div/>").addClass("popup-level" + (playable ? " popup-level-playable" : "")).append(
                        $("<img/>").addClass("popup-level-img").attr({
                            src: playable ? ("img/level" + i + ".png") : "img/levelunknown.png",
                            alt: "Picture of level #" + (i+1)
                        })
                    ).append(
                        $("<div/>").addClass("popup-level-score").append(
                            score ? $("<i/>").addClass("icon-score") : ""
                        ).append(
                            score ? score : (playable ? "Play!" : "Locked")
                        )
                    ).data("level-index", i).on("click", startThisLevel)
                );

            }

        }

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
                    // wall tile
                    tiles.push(Tile(x, y));
                } else if (tile === "o") {
                    // destination
                    destX = x;
                    destY = y;
                } else if (tile === "@") {
                    // spawn point
                    startX = x;
                    startY = y;
                } else if (tile === "<") {
                    // left-moving tile
                    tiles.push(new MovingTile(x, y, LEFT));
                } else if (tile === "^") {
                    // up-moving tile
                    tiles.push(new MovingTile(x, y, UP));
                } else if (tile === ">") {
                    // right-moving tile
                    tiles.push(new MovingTile(x, y, RIGHT));
                } else if (tile === "v") {
                    // down-moving tile
                    tiles.push(new MovingTile(x, y, DOWN));
                } else if (tile === "-") {
                    // horizontally sliding tile
                    tiles.push(new SlidingTile(x, y, HORIZONTAL));
                } else if (tile === "|") {
                    // vertically sliding tile
                    tiles.push(new SlidingTile(x, y, VERTICAL));
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
        $game.hide().fadeIn(200);

        currentLevel = level;
        currentLevelIndex = index;
        level.show();

        hidePopup();

    };



    replayLevel = function () {
        startLevel(currentLevelIndex);
    };

    nextLevel = function () {
        startLevel(currentLevelIndex + 1);
    };



    setLevelScore = function (levelIndex, score) {
        scores[levelIndex] = score;
        saveScores();
    };



    var $headerMoves = $("#header-moves"),
        $headerTime = $("#header-time");

    window.setInterval(function () {

        if (!currentLevel)
            return;

        $headerMoves.text(currentLevel.stats.moves);

        if (!currentLevel.player.isFinishing) {
            var elapsed = (Date.now() - currentLevel.stats.startTime) / 1000;
            currentLevel.stats.elapsedTime = elapsed;
            $headerTime.text(elapsed.toFixed(1) + "s");
        }

    }, 100);





    var touchX = null, touchY = null;

    $document.keydown(function(e) {

        switch(e.which) {
            case 37: // left
                currentLevel.player.move(LEFT);
                break;
            case 38: // up
                currentLevel.player.move(UP);
                break;
            case 39: // right
                currentLevel.player.move(RIGHT);
                break;
            case 40: // down
                currentLevel.player.move(DOWN);
                break;
            default:
                return;
        }

        // prevent scrolling
        e.preventDefault();

    }).keypress(function(e) {

        switch(String.fromCharCode(e.which)) {
            case 'a': // left
                currentLevel.player.move(LEFT);
                break;
            case 'w': // up
                currentLevel.player.move(UP);
                break;
            case 'd': // right
                currentLevel.player.move(RIGHT);
                break;
            case 's': // down
                currentLevel.player.move(DOWN);
                break;
            default:
                return;
        }

        // prevent scrolling
        e.preventDefault();

    }).on("touchstart", function (e) {

        touchX = e.originalEvent.touches[0].clientX;
        touchY = e.originalEvent.touches[0].clientY;

    }).on("touchmove", function (e){

        if (!currentLevel || currentLevel.player.isFinishing) {
            return;
        }

        var tx = e.originalEvent.touches[0].clientX,
            ty = e.originalEvent.touches[0].clientY;

        if (touchX !== null && touchY !== null) {

            var dx = tx - touchX,
                dy = ty - touchY;

            if (Math.abs(dx) > 60 || Math.abs(dy) > 60) {

                if (Math.abs(dx) > Math.abs(dy)) {
                    currentLevel.player.move(dx < 0 ? LEFT : RIGHT);
                } else {
                    currentLevel.player.move(dy < 0 ? UP : DOWN);
                }

                touchX = null;
                touchY = null;

            }

        }

        e.preventDefault();

    });



    var $headerMusic = $("#header-music"),
        $music = $("#music"),
        music = $music.get(0);

    $headerMusic.on("change", function (event) {

        if (typeof music.play !== "function")
            return;

        var play = $headerMusic.is(":checked");

        if (play) {
            $music.get(0).play();
        } else {
            $music.get(0).pause();
        }

        window.localStorage.setItem("jangobrick.ld35.music", play ? "yes" : "no");

    });

    if (window.localStorage.getItem("jangobrick.ld35.music") === "no") {

        if (typeof music.pause !== "function")
            return;

        $headerMusic.prop("checked", false);
        $music.get(0).pause();

    }

});
