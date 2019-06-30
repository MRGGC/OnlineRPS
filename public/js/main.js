let move1 = move2 = null; // move1 - your's / move2 - opponent's
let point1 = point2 = 0; // point1 - your's / point2 - opponent's

const beating       =   [2, 0, 1];
const moveEncrypt   =   ["✊", "🖐", "✌️"];
const colorEncrypt  =   ["red", "blue", "green"];
const alertEncrypt  =   ["You Lost!", "Draw!", "You Won!"];

let won = null;

let screenSize, iconWidth;

function refreshVariables() {
    screenSize = document.documentElement.clientWidth;
    iconWidth = screenSize <= 768 ? 100 : 150;
}

socket.on('opponentMove', move => {
    move2 = move;
    changePoints();
});

function makeMove(move) {
    move1 = move;
    socket.emit('makingMove', move, room);
    selectFigure(move);
    changePoints();
}

function selectFigure(figure) {
    refreshVariables();

    for (let i of [0, 1, 2]) {
        if (i != figure) {
            $('#figure' + i).animate({
                'width': (iconWidth - 10) + 'px',
                'opacity': '0.1'
            }, 80);

            $('#figure' + i).css({
                '-webkit-filter': "grayscale(100%)",
                'filter': "grayscale(100%)"
            });
        } else {
            $('#figure' + i).animate({
                'width': (iconWidth + 30) + 'px',
                'opacity': '1'
            }, 80);

            $('#figure' + i).css({
                '-webkit-filter': "grayscale(0%)",
                'filter': "grayscale(0%)"
            });
        }
    }
}

socket.on('initializePoints', (p1, p2) => {
    point1 = p1;
    point2 = p2;
    renderPoints(p1, p2);
});

socket.on('getPoints', () => {
    socket.emit('sendPoints', room, point2, point1);
});

function changePoints() {
    if (move1 !== null && move2 !== null) {

        if (beating[move1] == move2) {
            won = 1;
            point1++;
        } else if (beating[move2] == move1) {
            won = -1;
            point2++;
        } else {
            won = 0;
        }

        defaultIcons();

        renderSummary(move1, move2);

        move1 = move2 = null;

        renderPoints(point1, point2);
    }
}

function defaultIcons() {
    refreshVariables();

    for (let i of [0, 1, 2]) {
        $('#figure' + i).animate({
            'width': iconWidth + 'px',
            'opacity': '1'
        });

        $('#figure' + i).css({
            '-webkit-filter': "grayscale(0%)",
            'filter': "grayscale(0%)"
        });
    }
}

function renderSummary(m1, m2) {
    let winningTxt = alertEncrypt[won+1];

    let txt = `${moveEncrypt[m1]} vs ${moveEncrypt[m2]}<br><b>${winningTxt}</b>`;

    alertTxt(txt, colorEncrypt[won+1]);
}

function alertTxt(txt, color) {
    let tag = `
        <div class="w3-panel w3-${color} w3-display-container w3-round w3-display-middle alertBox w3-card-4">

            <center>
                <h2>${txt}</h2>
            </center>

        </div>
    `;

    $('body').append(tag);
    $('.alertBox').fadeIn(1000, () => {
        $('.alertBox').delay(1000).fadeOut(1200, () => {
            $('.alertBox').remove();
        });
    });
}

function renderPoints(p1, p2) {
    $('#user-score').text(p1);
    $('#opponent-score').text(p2);
}

function clearPoints() {
    point1 = point2 = 0;
}
