//I rewrote this part of game, adding ability to form different levels with different enemylists
//and "BossFights, where you need to defeat One enemy (it just generates one enemy and immediately stops wave generation)
//this part is working, but not finished yet
var Stages = [];

function TestStage(){
	this.bg = "#ffdf98";
	this.wave = 0;
	this.enemyTypes = new Array();
	this.Wave = function(){
		this.wave++;
		startWave();
		//startBossFight(PoisonTest);
	}
	
	this.enemyTypes.push(Goblin);
	this.enemyTypes.push(StoneGolem);
}

function TestStage2(){
	this.bg = "#aaffaa";
	this.wave = 0;
	this.enemyTypes = new Array();
	this.Wave = function(){
		this.wave++;
		startWave();
		if(this.wave == 5) startBossFight(Goblin);
	}
	
	this.enemyTypes.push(Goblin);
	this.enemyTypes.push(StoneGolem);
}
////////////INITIALIZATION
function StagesInit(){
	Stages.push(new TestStage());
	Stages.push(new TestStage2());
}
/////////////BossFights
function startBossFight(Boss){
PrevPressedButton = Buttons[0]
ClearSpells();
addEventListener("keydown", pressKey);
 Enemies = []; 
 ScreenEffects = [];
wave = "Boss";
	Enemies.push(new Boss(400, -50,  shaman));
	timer = setInterval(Game, 1000/fps);
	setListener(LightningClick);
	finishWave(true);
}
//-------BOSSES!!!!
