var genChance;
var wave;
var ind;
var EnemyTypes;
var upCount = 0;
var upps;
var waveDuration = 20000;
var stageStartedTime;

function GenWave(){
		if(Math.random()*100<genChance){
			Enemies.push(new EnemyTypes[Index(ind)](-50, Math.random()*450, shaman));
		}
		if(Math.random()*100<genChance){
			Enemies.push(new EnemyTypes[Index(ind)](Math.random()*800, -50,  shaman));
		}
		if(Math.random()*100<genChance){
			Enemies.push(new EnemyTypes[Index(ind)](850, Math.random()*450, shaman));
		}
		if(Date.now()-stageStartedTime >= waveDuration/upps-10){
			upAdd();
			upps--;
		}
}
//WAVE
function startWave(){
upps = 3+Math.floor(wave/5*cStage)*2;
stageStartedTime = Date.now();
PrevPressedButton = Buttons[0];
ClearSpells();
addEventListener("keydown", pressKey);
 Enemies = []; 
 ScreenEffects = [];
 wave = Stage.wave;
genChance = (15+wave*5)/fps;
if(wave<EnemyTypes.length){
ind = wave
} else {
ind = EnemyTypes.length;
}
genWave = GenWave;
	Enemies.push(new EnemyTypes[0](Math.random()*800, -50,  shaman));
	timer = setInterval(Game, 1000/fps);
	setListener(LightningClick);
	fwtimer = setTimeout(finishWave, waveDuration);
}
function finishWave(stageFinished){
	wave = Stage.wave;
	genWave = function(){}
	var check = setInterval(function(){
		if(allDead()){
			if(stageFinished)
				cStage++;
			UpgradePoints+=upCount;
			upCount = 0;
	shaman.hp+=shaman.hp_reg;
	if(shaman.hp>shaman.max_hp) shaman.hp = shaman.max_hp;
			ctx.font = "bold 50px sans-serif";
			ctx.fillText("Done", 350, 250);
			clearInterval(timer);
			clearInterval(check);
			setTimeout(SpellScreen, 1000);
		}
	}, 100);
}

function allDead(){
	for(var t = 0; t<Enemies.length; t++){
		if(!Enemies[t].dead) return false;
	}
	return true;
}

function Index(n){
	if(Math.random()<0.5) return 0;
	return Math.floor(Math.random()*n);
}

//SpellScreen
function SpellScreen(){
removeEventListener("keydown", pressKey);
	setListener(SpellScreenClick);
	if(ButtonTypes.length<1)
		setListener(ChooseBuff);
	canv.width = canv.width;
	ctx.fillStyle = "grey";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, 800, 600);
	ctx.fillStyle = "lightgrey";
	ctx.font = "bold 50px sans-serif";
	ctx.fillText("Click any Spell in list to learn it", 50, 70);
	ctx.fillStyle = "black";
	if(ButtonTypes.length<1){
	ctx.font = "bold 20 sans-serif";
	ctx.fillText("If the list is empty, just click anywhere", 100, 300);
	}
	ctx.fillStyle = "lightgrey";
	ctx.fillRect(0, 520, 800, 80);
	ShowButtonTypes();
	drawButtons();
	ctx.font = "bold 20px sans-serif";
	ctx.fillStyle = "black";
	switch(Buttons.length){
	case 12:
		ctx.fillText("V", 730, 550);
	case 11:
		ctx.fillText("C", 665, 550);
	case 10:
		ctx.fillText("X", 600, 550);
	case 8:
		ctx.fillText("Z", 535, 550);
	case 9:
		ctx.fillText("F", 470, 550);
	case 7:
		ctx.fillText("D", 405, 550);
	case 6:
		ctx.fillText("S", 340, 550);
	case 5:
		ctx.fillText("A", 275, 550);
	case 4:
		ctx.fillText("R", 210, 550);
	case 3:
		ctx.fillText("E", 145, 550);
	case 2:
		ctx.fillText("W", 80, 550);
	case 1:
		ctx.fillText("Q", 15, 550);
	}
}
function SpellScreenClick(e){
	var cx = e.pageX-sx;
	var cy = e.pageY-sy;	
	
	if(cy>100&&cy<500){
		var numb = Math.floor((cy-100)/100)+4*Math.floor((cx-20)/250);
	if(numb>-1&&numb<ButtonTypes.length){
			var but = ButtonTypes[numb];
			addButton(but.button, but.color, but.secCD*1000, but.manacost);
			ButtonTypes.splice(numb, 1);
			SpellScreen(	)						
			setListener(ChooseBuff);
			ctx.fillStyle = "rgba(100, 100, 100, 0.7)";
			ctx.fillRect(0, 0, 800, 520);
			ctx.fillStyle = "white";
			ctx.font = "bold 40 px sans-serif";
			ctx.fillText("Spell is learned, click to continue", 80, 400);
			}
	}
}
//ChooseBuff
function ChooseBuff(){
	setListener(ChooseBuffClick);
	canv.width = canv.width;
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, 800, 600);

	ctx.fillStyle = "lightgrey";
	ctx.font = "bold 50px sans-serif"
	ctx.fillText("Upgrades", 300, 60)
	ctx.fillRect(600, 100, 200, 40);
	ctx.fillStyle = "black";
	ctx.font = "bold 20px sans-serif";
	ctx.fillText("UpgradePoints: "+UpgradePoints, 615, 128);
	
	ctx.fillStyle = "lightgrey";
	ctx.fillRect(550, 150, 250, 300);
	ctx.strokeStyle = "gold";
	ctx.strokeRect(550, 150, 250, 300);
	ctx.strokeStyle = "black";
	ctx.font = "bold 20px sans-serif";
	ctx.fillStyle = "black";
	ctx.fillText("HP", 570, 190);
	ctx.fillText("MP", 570, 215);
	ctx.fillText("MPReg: ", 570, 240);
	ctx.fillText(Math.floor(shaman.mp_reg*fps*10)/10+"/sec", 650, 240);
	ctx.fillText("HPReg: ", 570, 260);
	ctx.fillText(Math.floor(shaman.hp_reg)+"/wave", 650, 260);
	ctx.fillText("CDRed: ", 570, 280);
	ctx.fillText(Math.floor(CDK*100)+"("+Math.floor((1-1/CDK)*100)+"%)", 650, 280);
	
	ctx.fillStyle = "yellow";
	ctx.fillText("Lightning Power: ", 570, 320);
	ctx.fillText(Math.floor(LightningPower*100), 740, 320);
	ctx.fillStyle = "white";
	ctx.fillText("Air Power: ", 570, 340);
	ctx.fillText(Math.floor(AirPower*100), 740, 340);
	ctx.fillStyle = "blue";
	ctx.fillText("Water Power: ", 570, 360);
	ctx.fillText(Math.floor(WaterPower*100), 740, 360);
	ctx.fillStyle = "green";
	ctx.fillText("Earth Power: ", 570, 380);
	ctx.fillText(Math.floor(EarthPower*100), 740, 380);
	ctx.fillStyle = "orange";
	ctx.fillText("Fire Power: ", 570, 400);
	ctx.fillText(Math.floor(FirePower*100), 740, 400);
	
	ctx.fillStyle = "red";
	ctx.fillRect(620, 172, 160*(shaman.hp/shaman.max_hp), 19);
	ctx.strokeRect(620, 172, 160, 19);
	ctx.fillStyle = "blue";
	ctx.fillRect(620, 197, 160*(shaman.mp/shaman.max_mp), 19);
	ctx.strokeRect(620, 197, 160, 19);
	ctx.fillStyle = "white";
	ctx.font = "bold 18px sans-serif";
	ctx.fillText(Math.floor(shaman.hp)+"/"+Math.floor(shaman.max_hp), 655, 188);
	ctx.fillText(Math.floor(shaman.mp)+"/"+Math.floor(shaman.max_mp), 665, 213);
	
	ctx.fillStyle = "lightgrey";
	ctx.fillRect(0, 550, 800, 50);
	ctx.beginPath();
	ctx.moveTo(0, 550);
	ctx.lineTo(800, 550);
	ctx.stroke();
	ctx.font = "bold 40px sans-serif";
	ctx.fillStyle = "black";
	ctx.fillText("Start Wave", 300, 590);
	
	ShowUpgrades();
}
function ChooseBuffClick(e){
	var cx = e.pageX-sx;
	var cy = e.pageY-sy;	
	
	if(cy>150 && cx<530 && cx>30){
		var n = Math.floor((cx-30)/250)+2*Math.floor((cy-150)/60)
		if(n<Upgrades.length){
		if(Upgrades[n].cost<=UpgradePoints){
			UpgradePoints-=Upgrades[n].cost;
			Upgrades[n].press();
			Upgrades[n].cost++;
		}
		}
	}
	
	ChooseBuff();
	
	if(cy>550) {
		Stage = Stages[cStage];
		EnemyTypes = Stage.enemyTypes;
		Stage.Wave();
	}
}
//Upgrades
function UpgradesInit(){
	Upgrades = [];
	Upgrades.push(new UpgradeButton("+10% to Lightning Power", "+5% to MPReg", function(){LightningPower*=1.1; shaman.mp_reg*=1.05}));
	Upgrades.push(new UpgradeButton("+10% to Fire Power", "+10% to HPReg",function(){FirePower*=1.1; shaman.hp_reg*=1.1}));
	Upgrades.push(new UpgradeButton("+10% to Water Power", "+8% to MP", function(){WaterPower*=1.1; shaman.max_mp*=1.08; shaman.mp*=1.08}));
	Upgrades.push(new UpgradeButton("+10% to Earth Power", "+6% to HP",  function(){EarthPower*=1.1; shaman.hp*=1.06; shaman.max_hp*=1.06}));
	Upgrades.push(new UpgradeButton("+10% to Air Power", "+3% to CDRed", function(){AirPower*=1.1; CDK*=1.03}));
	Upgrades.push(new UpgradeButton("+20% to HP", "+10% to HPReg", function(){shaman.max_hp*=1.2; shaman.hp*=1.2; shaman.hp_reg*=1.1}));
	Upgrades.push(new UpgradeButton("+20% to MP", "+7% to MPReg", function(){shaman.max_mp*=1.15; shaman.mp*=1.15; shaman.mp_reg*=1.07}));
	Upgrades.push(new UpgradeButton("+15% to MP Regeneration", "None", function(){shaman.mp_reg*=1.15}));
	Upgrades.push(new UpgradeButton("+40% to HP Regeneration", "None", function(){shaman.hp_reg*=1.4}));
	Upgrades.push(new UpgradeButton("+5% to CD Reduction", "None", function(){CDK*=1.05}));
}
function UpgradeButton(txt, als, func){
	this.text = txt;
	this.also = als;
	this.cost = 1;
	this.press = func;
	this.draw = function(n){
		ctx.fillStyle = "lightgrey";
		ctx.linewidth = 2;
		ctx.strokeStyle = "black";
		ctx.fillRect(30+250*(n%2), 150+60*Math.floor(n/2), 250, 60);
		ctx.strokeRect(30+250*(n%2), 150+60*Math.floor(n/2), 250, 60);
		ctx.fillStyle = "black";
		ctx.font = "bold 20px sans-serif";
		ctx.fillText(this.text, 40+250*(n%2), 185+60*Math.floor(n/2));
		
		ctx.fillStyle = "black";
		ctx.font = "bold 15px sans-serif"
		ctx.fillText(this.also, 40+250*(n%2), 205+60*Math.floor(n/2))
		ctx.fillText("Cost: "+this.cost+" UP", 190+250*(n%2), 205+60*Math.floor(n/2));
	}
}
function ShowUpgrades(){
	for(var i=0; i<Upgrades.length; i++){
		Upgrades[i].draw(i);
	}
}
//ButtonTypes
function ButtonType(c, n, t, e, cd, mc, func){
	this.color = c;
	this.name = n;
	this.type = t;
	this.el = e;
	this.secCD = cd;
	this.manacost = mc;
	this.button = func;
	this.draw = function(n){
		var raw = 100+100*(n%4);
		var coll = 20+250*(Math.floor(n/4));
		ctx.fillStyle = "lightgrey";	
		ctx.fillRect(coll, raw, 250, 100);
		ctx.strokeRect(coll, raw, 250, 100);
		ctx.fillStyle = this.color;
		ctx.fillRect(coll+15, raw+15, 70, 70);
		ctx.fillStyle = "black";
		ctx.font = "bold 15px sans-serif";
		ctx.fillText(this.name, coll+95, raw+25);
		ctx.fillStyle = "orange";
		ctx.fillText("Type: "+this.type, coll+95, raw+40);
		ctx.fillStyle = "grey";
		ctx.fillText("Element: "+this.el, coll+95, raw+55);
		ctx.fillStyle = "green";
		ctx.fillText("CD: "+this.secCD+"sec", coll+95, raw+70);
		ctx.fillStyle = "blue";
		ctx.fillText("Manacost: "+this.manacost, coll+95, raw+85);
	}
}
function ButtonTypesInit(){
	ButtonTypes = [];
	ButtonTypes.push(new ButtonType("blue", "ManaBurst", "AOE Spell", "None", 15, 0, ManaBurstClick));
	ButtonTypes.push(new ButtonType("#3e593e", "StoneSkin", "DamageBlock", "Earth", 30, 40, StoneSkinClick));
	ButtonTypes.push(new ButtonType("#ff9121", "FireMeteor", "AOE Debuff", "Fire & Air", 12, 20, FireMeteorClick))
	ButtonTypes.push(new ButtonType("#2bd5ff", "FreezeWave", "AOE Debuff", "Water & Air", 15, 30, FreezeWaveClick))
	ButtonTypes.push(new ButtonType("#125d6f", "StormWraith", "Buff Totem", "Lightning", 50, 35, StormWraithClick))
	ButtonTypes.push(new ButtonType("#91b1b3", "SwiftWind", "CD Buff Totem", "Air", 70, 30, SwiftWindClick))
	}
function ShowButtonTypes(){
	for(var j=0; j<ButtonTypes.length; j++){
		ButtonTypes[j].draw(j);
	}
}
function ClearSpells(){
	for(var i = 0; i<Spells.length; i++){
		if(Spells[i].end) {
			Spells.splice(i, 1);
			i--;
		}
	}
}
//UpgradePoints
function UpgradePoint(xx, yy, tar){
	this.hp = 1
	this.score = 0;
	this.x = xx;
	this.y = yy;
	this.radius = 25;
	this.lifetime = 5*fps;
	this.rsm=1;
	this.die = function(quickDie){
		this.rsm=4;
		this.dead = true;
		var iter = this;
		this.action = function(){}
		if(!quickDie){
			upCount++
			setTimeout(function(){
				iter.draw = function(){}
			}, 700);
		} else {iter.draw = function(){}}
	}
	this.dead = false;
	this.draw = function(){
		this.lifetime--;
		ctx.save()
		var scaler = Math.abs(Math.sin(this.lifetime/8*this.rsm));
		ctx.translate(-this.x*scaler, -this.y);
		ctx.scale(scaler, 1);
		ctx.translate(this.x/scaler, this.y);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "#111111"
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius-3, 0, Math.PI*2);
		ctx.fillStyle = "#aaaaaa";
		ctx.fill();
		ctx.fillStyle = "#111111";
		ctx.font = "bold 25px sans-serif";
		ctx.fillText("UP", this.x-15, this.y+10);
		ctx.restore()
	}
	this.lightningResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.fireResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.earthResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.action = function(){
		if(this.hp<=0) this.die();
		if(this.lifetime<0) this.die(true);
	}
}
function upAdd(){
	Enemies.push(new UpgradePoint(Math.floor(Math.random()*750+25), Math.floor(Math.random()*400+25)));
}