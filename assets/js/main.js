var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

const canvas = document.querySelector("#canvas");
canvas.width = width/1.5;
canvas.height = height/2;
const ctx = canvas.getContext('2d');

const alpha = 0.1;
const point_number = 300

var rod = [];

const scale = (T) => (canvas.height / 2) - T;

//https://stackoverflow.com/a/6333775
const arrow = (context, fromx, fromy, tox, toy) => {
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}

const draw = () => {
    ctx.lineWidth = 2;
    ctx.font = "30px Ubuntu";
    //Clear screen
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //Draw Axis
    ctx.beginPath();
    //Y
    arrow(ctx, 10, canvas.height - 10, 10, 10)
    //X
    arrow(ctx, 10, canvas.height - 10, canvas.width - 10, canvas.height - 10)
    ctx.stroke();

    //Label axies
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillText("Temperature",20,40)
    ctx.fillText("Position",canvas.width - 150, canvas.height - 40)
    ctx.fill()

    //Draw Point by point the rod
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(0,scale(rod[0]));
    for(var i = 1; i < rod.length; i++){
        ctx.lineTo(i * canvas.width / rod.length, scale(rod[i]));
    }
    ctx.stroke();
}

const compute = (dt) => {
    var new_rod = [];
    for(var i = 0; i < rod.length; i++){
        if(i == 0){
            var dT = rod[0] - rod[1]
        }else if(i == rod.length - 1) {
            var dT = rod[rod.length - 1] - rod[rod.length - 2]
        }else{
            var dT = rod[i] - (rod[i-1] + rod[i+1]) / 2;
        }
        new_rod.push(rod[i] - dT * alpha * dt);
    }
    rod = new_rod;
}

/* init rod */
const sine = () => {
    rod = []; 
    for(var i = 0; i < point_number; i++){
        rod.push( Math.cos( i * Math.PI * 4 / point_number) * (canvas.height / 2)) 
    }
}

const square = () => {
    rod = []; 
    for(var i = 0; i < point_number; i++){
        (i < point_number / 2) ? rod.push(canvas.height/3) : rod.push(-canvas.height/3) 
    }
};

const random = () => {
    var generator = new Simple1DNoise();
    var x = Math.random() * 1000;
    rod = []; 
    for(var i = 0; i < point_number; i++){
        rod.push(generator.getVal((x + i)/15) * canvas.height - canvas.height / 2)
    }
}

random();

setInterval(() => {
    draw();
    var iterations = document.querySelector("#speed").value
    for(var i = 0; i < iterations; i ++){
        compute(1);
    }
}, 1/60)

document.querySelector("#sine").onclick = sine;
document.querySelector("#square").onclick = square;
document.querySelector("#noise").onclick = random;