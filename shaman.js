var canv = document.getElementById( "canv" );
canv.width = 800
canv.height = 600
var ctx = canv.getContext( '2d' );
var sx = canv.getBoundingClientRect().left;
var sy = canv.getBoundingClientRect().top;

//Global variables
var fps = 50;
var timer;
var fwtimer;
var prevListener;
var TotalScore;
var BCount = 0;
var UpgradePoints;
var Stage;
var cStage;

//character stats
var LightningPower;
var EarthPower;
var FirePower;
var AirPower;
var WaterPower;
var CDMode;
var CDK;

//more global things
var shaman = new Player();
var lightning = new Lightning();
var lightningCD = 0;
var Spells = [];
var Enemies = [];
var Buttons = [];
var ButtonTypes = [];
var Upgrades = [];
var ScreenEffects = [];

startWindow();

//PLAYER
function Player(){
	this.max_hp = 2000;
	this.max_mp = 100;
	this.hp = this.max_hp;
	this.mp = this.max_mp;
	this.mp_reg = this.max_mp/20/fps;
	this.hp_reg = this.max_hp*0.1;
	this.radius = 35;
	this.defense = 1;
	this.defenseMode = 1;
	this.x = canv.width/2;
	this.y = 500-this.radius;
	this.debuffs = [];
	//draw
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "#74fcff";
		ctx.strokeStyle = "#007ab7";
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.fill();
	}
}

//START
function startWindow(){
	ctx.font = "bold 25px sans-serif"
	ctx.fillText("Кликните, чтобы начать новую игру", 200, 250);
	setListener(startGame);
}
//initing and starting game
function startGame(){	
 shaman = new Player();
 lightning = new Lightning();
 cStage = 0;
 Stages = [];
 Spells = [];
 Enemies = [];
 Buttons = [];
 ScreenEffects = [];
 ButtonTypesInit();
 UpgradesInit();
 StagesInit();
 LightningPower = 1;
 EarthPower = 1;
 FirePower = 1;
 AirPower = 1;
 WaterPower = 1;
 CDMode = 1;
 CDK = 1;
 wave = 0;
 TotalScore = 0;
 UpgradePoints = 3;
 SpellScreen();
}
//game, repeats in main loop
function Game(){
if(shaman.hp==0) finishGame();

shaman.mp+=shaman.mp_reg;
if (shaman.mp>shaman.max_mp) shaman.mp = shaman.max_mp;
	genWave();
	for(var k=0; k<shaman.debuffs.length; k++){
		shaman.debuffs[k].action(k);
	}
	for(var j = 0; j<Spells.length; j++){
		Spells[j].action();
	}
	for(var i = 0; i<Enemies.length; i++){
		Enemies[i].action();
	}
	drawGame();
}
//Finish
function finishGame(){
	removeEventListener("keydown", pressKey);
	
	clearInterval(timer);
	clearTimeout(fwtimer);
	setTimeout(startWindow, 500);
}
//drawGame
var LastFrame = Date.now()
var FPS = 0;
var fpscount = 0;
function drawGame( ){
	canv.width = canv.width;
	ctx.fillStyle = Stage.bg;
	ctx.fillRect(0, 0, 800, 500);

	for(var j = Enemies.length-1; j>-1; j--){
		Enemies[j].draw();
	}
	for (var k = 0; k<Spells.length; k++){
		Spells[k].draw();
	}
	
	lightning.draw();
	shaman.draw();
	drawStatus();
	drawButtons();
	for (var j = 0; j<ScreenEffects.length; j++){
		ScreenEffects[j].draw()
	}
	
	ctx.font = "bold 15 px sans-serif"
	ctx.fillStyle = "black"
	fpscount++;
	if(fpscount%20==0){
		FPS = Math.floor(1000/(Date.now()-LastFrame))
		fpscount = 0
		}
	ctx.fillText("FPS: "+FPS, 0, 20)
	LastFrame = Date.now()
}
//drawStatus - draws our hp, mp, fps, etc
function drawStatus(){
if(shaman.hp<0) shaman.hp = 0;
if(shaman.mp<0) shaman.mp = 0;
	var cur_hp = shaman.hp/shaman.max_hp*200;
	var cur_mp = shaman.mp/shaman.max_mp*200;
	ctx.fillStyle = "grey";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.fillRect(0, 500, 800, 600);
	ctx.fillStyle = "red";
	ctx.fillRect(190, 505, cur_hp, 10);
	ctx.strokeRect(190, 505, 200, 10);
	ctx.fillStyle = "blue";
	ctx.fillRect(610-cur_mp, 505, cur_mp, 10);
	ctx.strokeRect(410, 505, 200, 10);
	ctx.fillStyle = "white";
	ctx.font = "bold 15 px sans-serif";
	ctx.fillText("Stage: "+(cStage+1), 1, 515);
	ctx.fillText("Wave: "+wave, 68, 515);
	ctx.fillText("Total Score: "+TotalScore, 650, 520)		
	for(var i = 0; i<shaman.debuffs.length; i++)
		shaman.debuffs[i].draw(i);
}

function setListener(newListener){
	canv.removeEventListener("mousedown", prevListener);
	prevListener = newListener;
	canv.addEventListener("mousedown", newListener, false);
}
//SPELLS
var LastClick=Date.now();
//lightningClick - it is our shooting ability
function LightningClickSingle(e){
	var cx = e.pageX-sx;
	var cy = e.pageY-sy;

if(cy<500 && (Date.now()-LastClick)>170){	
LastClick = Date.now();
	lightning = new Lightning(400, 465, cx, cy);
	
	for(var i = 0; i<Enemies.length; i++){
	var ix = cx-Enemies[i].x;
	var iy = cy-Enemies[i].y;
	if(Math.sqrt(ix*ix+iy*iy)<Enemies[i].radius && !Enemies[i].dead){
	Enemies[i].lightningResist(lightning.damage);

	setTimeout(function(){
	lightning.lightningJump(Math.round((LightningPower-1)*5), i, lightning.damage*=0.7, (LightningPower-1)*150/LightningPower-10, cx, cy)
	}, 25);
	break;
	}
		}
	}else{
		CheckPressed(cx, cy);
	}
}
LightningClick = LightningClickSingle;	
//BUTTON
//buttons, clickable/use keyboard
function Button(func, col, cd, mc){
	this.color = col;
	this.action = func;
	this.maxCD = cd*fps/1000;
	this.curCD = 0;
	this.manacost = mc;
	this.pressed = false;
	this.press = function(){
		if(this.curCD<1 && this.manacost<=shaman.mp){
			SetPressedButton(this);
			this.action(this);
		}
	}
	this.draw = function(n){
		ctx.fillStyle = this.color;
		ctx.fillRect(15+65*n, 530, 60, 60);
		if(this.curCD>0){
		ctx.fillStyle = "rgba(100, 100, 100, 0.7)";
		var tempCD = 60*this.curCD/this.maxCD;
		ctx.fillRect(15+65*n, 590-tempCD, 60, tempCD);
		this.curCD-= 1*CDK*CDMode;
		}
		if(shaman.mp<this.manacost){
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#4b3cff";
		ctx.strokeRect(15+65*n, 530, 60, 60);
		}
		if(this.pressed){
			ctx.lineWidth = 3;
			ctx.strokeStyle = "white";
			ctx.strokeRect(15+65*n, 530, 60, 60);		
		}
	}
}
var PrevPressedButton;
function SetPressedButton(but){
	PrevPressedButton.pressed= false;
	but.pressed = true;
	PrevPressedButton = but;
}
function addButton(f, c, cd, mc){
if(BCount<12){
	Buttons.push(new Button(f, c, cd, mc));
	BCount++;
	}
}
function drawButtons(){
	for(var l = 0; l<Buttons.length; l++){
		Buttons[l].draw(l);
	}
}
function CheckPressed(bx, by){
	if(by>529 && by<591){
		var bn=Math.floor((bx-15)/65);
		if(bx>14){
			if(bx<11+65*(bn+1)) Buttons[bn].press();
		}
	}
}
////
function pressKey(e){
	switch(e.keyCode){
		case "Q".charCodeAt(0):
		if(Buttons.length>0)
			Buttons[0].press();
		break;
		case "W".charCodeAt(0):
		if(Buttons.length>1)
			Buttons[1].press();
		break;
		case "E".charCodeAt(0):
		if(Buttons.length>2)
			Buttons[2].press();
		break;
		case "R".charCodeAt(0):
		if(Buttons.length>3)
			Buttons[3].press();
		break;
		case "A".charCodeAt(0):
		if(Buttons.length>4)
			Buttons[4].press();
		break;
		case "S".charCodeAt(0):
		if(Buttons.length>5)
			Buttons[5].press();
		break;
		case "D".charCodeAt(0):
		if(Buttons.length>6)
			Buttons[6].press();
		break;
		case "F".charCodeAt(0):
		if(Buttons.length>7)
			Buttons[7].press();
		break;
		case "Z".charCodeAt(0):
		if(Buttons.length>8)
			Buttons[8].press();
		break;
		case "X".charCodeAt(0):
		if(Buttons.length>9)
			Buttons[9].press();
		break;
		case "C".charCodeAt(0):
		if(Buttons.length>10)
			Buttons[10].press();
		break;
		case "V".charCodeAt(0):
		if(Buttons.length>11)
			Buttons[11].press();
		break;		
	}
}
//ScreenEffects
//add red bounding rect, when enemies hit you
//greater hits causes greater rects)) working pretty nice
function Attacked(dmg){
	this.lifetime = fps*0.1
	this.draw = function(){
		ctx.strokeStyle = "red"
		ctx.lineWidth = dmg/10+5;
		ctx.strokeRect(0,0,800,600)
		this.lifetime--
		if(this.lifetime<0){
			this.draw = function(){}
		}
	}
}
