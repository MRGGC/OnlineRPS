const goDown = 100; // icon down px
const boxSize = 145; // px size of each icon's box
const iconSize = 20;
const offsetX = 45;
const offsetY = 45;
const link = "http://kapilnemo.free.fr/codepen/playstation-loading/";
const iconBase = "background"
const iconAnimationTiming = [1000, 12000+1];

let WIDTH = getWidth();
let HEIGHT = getHeight();

let icons = [];

function random(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Icon {
    constructor(x, y, id) {
        this.vec = random(0, 2); // 1 -> go down / 0 -> go up
        this.pos = new Vec2(x, this.vec ? y : y + goDown);
        this.id = id;
    }

    animate() {
        this.pos.y = this.vec ? this.pos.y + goDown : this.pos.y - goDown;
        let degree = 180;

        $('#'+this.id).addClass('rotated');

        $('#'+this.id).animate({
            top: this.pos.y + "px"
        }, 1600, () => {
            $('#'+this.id).removeClass('rotated');
        });

        this.vec = !this.vec;

        setTimeout(this.animate.bind(this), random(iconAnimationTiming[0], iconAnimationTiming[1]));
    }
}

function generateIcon(x, y) {
    let iconType = random(1, 5);
    let iconId = 'icon' + icons.length;
    let icon = new Icon(x, y, iconId);
    let iconTag = `<img src="${link + iconType + '.png'}" width="${iconSize}" id="${iconId}" class="icon" style="top: ${icon.pos.y}px; left: ${icon.pos.x}px">`;

    $('#' + iconBase).append(iconTag);
    icons.push(icon);

    setTimeout(icon.animate.bind(icon), random(iconAnimationTiming[0], iconAnimationTiming[1]));
}

for (let i = 0; i < HEIGHT / (boxSize + iconSize + offsetY); i++) {
    for (let j = 0; j < WIDTH / (boxSize + iconSize + offsetX); j++) {
        let x = j * (offsetX + boxSize) + random(iconSize, boxSize-iconSize-1);
        let y = i * (offsetY + boxSize) + random(iconSize, boxSize-goDown-11);
        generateIcon(x, y);
    }
}

$('#'+iconBase).animate({opacity: 0.3}, 600);
