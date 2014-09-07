
var canvas = document.getElementById("canvas");
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var ctx = canvas.getContext("2d");
canvas.width = windowWidth * 0.99;
canvas.height = windowHeight * 0.99;
var windowCX = canvas.width/2;
var windowCY = canvas.height/2;
var windowA = 0;
var backRad = (windowWidth > windowHeight)?windowWidth/2+canvas.width/30:windowHeight/2+canvas.height/30;
canvas.style.position = "absolute";
canvas.style.left = (windowWidth - canvas.width)/2;
canvas.style.top = (windowHeight - canvas.height)/2;
var rotateSpeed=0.5;
//////////////////
var entity;
var entityBar = 0;
var level = 0;
var entityRad = ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3);
//////////////////
var polygons = [];
var polySide = 6;
var polygonWait = 100;
var polygonWaitCount = 0;
var lineWidthJumpWait = 50;
var lineWidthJumpCount = 0;
var lineFlag = 0;
var polygonLineWidth = 1;
//////////////////

var colorMenuRed = ["#1F0000","#2E0000","#3D0000","#4C0000","#5C0000","#6B0000","#7A0000",,"#8A0000","#990000","#A31919","#AD3333","#B84D4D","#C26666","#CC8080,#D69999","#E0B2B2","#EBCCCC","#F5E6E6","#FFFFFF"];
var colors = ["red","blue","yellow","green","grey","purple"];
var colors2 = ["rgba(40,0,0,1)","rgba(80,0,0,1)","rgba(120,0,0,1)","rgba(160,0,0,1)","rgba(200,0,0,1)","rgba(240,0,0,1)"];
var colors3 = ["#FFFFFF","#FFCCFF","#FF99FF","#FF66FF","#FF33FF","#FF00FF"];
var colorCode = ["FF","CC","99","66","33","00"];
var colorCode2 = ["FF","EE","DD","CC","BB","AA","99","88","77","66","55","44","33","22","11","00"];
var colorShift2 = 0;
var colorShift1 = 0;
var colorShift3 = false;
var colorShift4 = false;
var colorChangeControlFlag = 0;
var colorChangeMax = 4;
//////////////////
var pressedKey = -1;
var gameInterval;
var died = 0;
//////////////////

window.addEventListener("keydown",keyPress);
window.addEventListener("keyup",keyRelease);
window.addEventListener("click",firefoxOScontrol);

function keyPress(e) {
	pressedKey = e.keyCode;
	console.log(pressedKey);
}

function keyRelease(e) {
	pressedKey = -1;
}

function firefoxOScontrol(e) {
	if(e.clientX<(windowWidth/2))
		pressedKey = 37;
	else
		pressedKey = 39;
}

function entityPar() {
	this.a = windowA + (360/polySide)/2; 
	this.x = windowCX + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.cos(this.a*Math.PI/180);
	this.y = windowCY + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.sin(this.a*Math.PI/180);
	this.r = (windowWidth < windowHeight)?windowWidth*0.01:windowHeight*0.01;
	this.c = "rgba(0,0,0,1)";
}

function polygonPar() {
	this.x = windowCX;
	this.y = windowCY;
	this.r = 1;//5 * entity.r;
	this.c = "rgba(0,0,0,1)";
	this.s = 6;  //sides
	this.w = entity.r * 5;  //width
	this.mbar = Math.floor(Math.random() * polySide);  //missing bar < s
}

function entitySpawn() {
	entity = new entityPar();
}

function polygonSpawn() {
	polygons.push(new polygonPar());
}

function polygonDestruct() {
	polygons.shift();
	level--;
}

function entityRender() {
	ctx.beginPath();
	ctx.fillStyle = entity.c;
	ctx.arc(entity.x,entity.y,entity.r,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
}

function polygonRender() {
	for(var i=0;i<polygons.length;i++) {
		for(var j=0;j<polySide;j++) {
			if(polygons[i].mbar == j)
				continue;
			ctx.beginPath();
			ctx.moveTo(windowCX+polygons[i].r*Math.cos((windowA+j*360/polySide)*Math.PI/180),windowCY+polygons[i].r*Math.sin((windowA+j*360/polySide)*Math.PI/180));
			j++;
			ctx.lineTo(windowCX+polygons[i].r*Math.cos((windowA+j*360/polySide)*Math.PI/180),windowCY+polygons[i].r*Math.sin((windowA+j*360/polySide)*Math.PI/180));
			j--;
			ctx.strokeStyle = polygons[i].c;
			ctx.lineWidth = polygonLineWidth;
			ctx.stroke();
			ctx.closePath();
		}
		//polygons[i].lw -= 1;
		if(polygons[i].r >= (backRad-15)) {
			polygonDestruct();
			break;
		}
		polygons[i].r+=2;
	}
	
}

function entityUpdate() {
	if(pressedKey == 37) {
		entity.a -= 360/polySide;
		pressedKey = -1;
		entityBar--;
		if(entityBar<0)
			entityBar = polySide-1;
	} else if(pressedKey == 39) {
		entity.a += 360/polySide;
		pressedKey = -1;
		entityBar++;
		if(entityBar>=polySide)
			entityBar = 0;
	}

	entity.x = windowCX + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.cos(entity.a*Math.PI/180);
	entity.y = windowCY + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.sin(entity.a*Math.PI/180);
}

function backgroundGen() {
	for(var i=0;i<polySide;i++) {
		ctx.beginPath();
		ctx.moveTo(windowCX,windowCY);
		ctx.lineTo(windowCX+backRad*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		i++;
		ctx.lineTo(windowCX+backRad*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		ctx.lineTo(windowCX,windowCY);
		i--;
		if(colorShift4 == false) {
			if(colorShift3 == false)
				ctx.fillStyle = "#"+colorCode2[colorShift1]+colorCode[i%6]+colorCode2[colorShift2];
			else if(colorShift3 == true)
				ctx.fillStyle = "#"+colorCode2[colorShift1]+colorCode[i%6]+colorCode2[colorCode2.length-1-colorShift2];
		} else if(colorShift4 == true) {
			if(colorShift3 == false)
				ctx.fillStyle = "#"+colorCode2[colorCode2.length-1-colorShift1]+colorCode[i%6]+colorCode2[colorShift2];
			else if(colorShift3 == true)
				ctx.fillStyle = "#"+colorCode2[colorCode2.length-1-colorShift1]+colorCode[i%6]+colorCode2[colorCode2.length-1-colorShift2];
		} 
		ctx.fill();
		ctx.closePath();
	}
	colorChangeControlFlag++;
	if(colorChangeControlFlag == colorChangeMax) {
	/////////////////////
	colorChangeControlFlag = 0;
	colorShift2++;
		if(colorShift2 == colorCode2.length) {
			colorShift2 = 0;
			colorShift1++;
			if(colorShift1 == colorCode2.length) {
				colorShift1 = 0;
				colorShift4 = !colorShift4;
			}
			colorShift3 = !colorShift3;
		}
	/////////////////////
	}
}

function entityCollisionCheck() {
	if(entityBar != polygons[level].mbar && (polygons[level].r*Math.cos(360/polySide/2 * Math.PI / 180)) >= (entityRad-5) && (polygons[level].r*Math.cos(360/polySide/2 * Math.PI / 180)) <= (entityRad+5)) {
		clearInterval(gameInterval);
		died = 1;
	}
	if((polygons[level].r*Math.cos(360/polySide/2 * Math.PI / 180)) > (entityRad+5)) {
		level++;
	}
}

function killfunc() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	windowA = 0;
	died = 0;
	rotateSpeed=0.5;

	entityBar = 0;
	level = 0;
//////////////////
	polygons = [];
	polySide = 6;
	polygonWait = 100;
	polygonWaitCount = 0;
	lineWidthJumpWait = 50;
	lineWidthJumpCount = 0;
	lineFlag = 0;
	polygonLineWidth = 1;
//////////////////
	colorShift2 = 0;
	colorShift1 = 0;
	colorShift3 = false;
	colorShift4 = false;
	colorChangeControlFlag = 0;
	colorChangeMax = 4;
//////////////////
	pressedKey = -1;
//////////////////
	z=0;
	track=[];
	dur=[];
	tol=[];
	flag=1;	
	h=1;

	if(aud == true) {
		aud=false;
		document.getElementById("audio").pause();
		document.getElementById("audio").currentTime = 0;
	}
	document.getElementById("menu").style.display="block";
	MenuGenerate();
}

var z=0;
var len;
var track=[];
var dur=[];
var tol=[];
var flag=1;

function toggle()
{
	if(flag==1)
		flag=0;
	else flag=1;
}
function speed()
{	if(flag==1){if(rotateSpeed<tol[z%len])rotateSpeed+=track[z%len];}
	else {if(rotateSpeed>tol[z%len])rotateSpeed-=track[z%len];}
}

var counter=0;
function gameframe() {
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	polygonWaitCount++;
	//lineWidthJumpCount++;
	polygonLineWidth+=0.1;
	if(polygonLineWidth >= 5) {
		polygonLineWidth = 1;
	}
	if(polygonWait == polygonWaitCount) {
		polygonWaitCount = 0;
		polygonSpawn();
	}
	windowA += rotateSpeed;
	entity.a += rotateSpeed;
	entityUpdate();
	if(level<polygons.length)
		entityCollisionCheck();
	backgroundGen();
	polygonRender();
	entityRender();
	speed();
	counter++;
	if(counter==dur[z]){ z=(z+1)%len; counter=0;toggle();}

	if(died == 1)
		killfunc();

}

var aud=false;

function playSys() {
	ctx.clearRect(0,0,windowWidth,windowHeight);
	document.getElementById("menu").style.display="none";
	if(aud==true)
		document.getElementById("audio").play();
	entitySpawn();
	polygonSpawn();
	gameInterval = setInterval(gameframe,17);
}

function Side(e)
{
	polySide=e;
}

var h=1;

function Choice(e){
	aud=false;
	if(e==1){
		len=1;
		track=[0.05];
		tol=[h*1];
		dur=[1000000];
	}
	else if(e==2){
		len=2;
		track=[0.05,0.05];
		tol=[h*1,-1*h];;
		dur=[300,300];	
	}
	else if(e==3){
		len=2;
		track=[0.4,0.4];
		tol=[h*1,-1*h];;
		dur=[20,20];	
	}
	else {
		len=12;
		track=[0.1,0.3,0.1,0.1,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3];
		dur=[40,60,80,90,60,400,200,300,50,50,50,100];
		tol=[1,-3,2,-2,2,-1,1,-4,3,-2,1,-4];
		aud=true;
	}
}
function hard(){
	h=2;polygonWait=75;
}
function easy(){
	h=1;polygonWait=100;
} 

function MenuGenerate() {
	//var canvas1 = document.getElementById("canvasMenu");
	var backRad1 = backRad;
	for(var i=0;i<polySide;i++) {
		ctx.beginPath();
		ctx.moveTo(windowCX,windowCY);
		ctx.lineTo(windowCX+backRad1*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad1*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		i++;
		ctx.lineTo(windowCX+backRad1*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad1*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		ctx.lineTo(windowCX,windowCY);
		i--;
		ctx.fillStyle=colorMenuRed[i];
		ctx.fill();
		ctx.closePath();
	}
	backRad1=backRad1*2/3;

	for(var i=0;i<polySide;i++) {
		ctx.beginPath();
		ctx.moveTo(windowCX,windowCY);
		ctx.lineTo(windowCX+backRad1*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad1*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		i++;
		ctx.lineTo(windowCX+backRad1*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad1*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		ctx.lineTo(windowCX,windowCY);
		i--;
		ctx.fillStyle=colorMenuRed[i+6];
		ctx.fill();
		ctx.closePath();
	}

	backRad1=backRad1/3;

	ctx.beginPath();
	ctx.moveTo(windowCX+backRad1*Math.cos((windowA)*Math.PI/180),windowCY+backRad1*Math.sin((windowA)*Math.PI/180));
	for(var i=1;i<polySide;i++) {
		ctx.lineTo(windowCX+backRad1*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad1*Math.sin((windowA+i*360/polySide)*Math.PI/180));
	}
	ctx.fillStyle=colorMenuRed[15];
	ctx.fill();
	ctx.closePath();
}

MenuGenerate();