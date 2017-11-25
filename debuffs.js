//not finished
//I decided to create enemies, which can use opoison and other debuffs
//So, it is basic Debuff Class
function Debuff(tar, lt, act, col){
	this.lifetime  =  lt*fps;
	this.frame = 1;
	this.target = tar;
	this.action = function(n){
		if(this.frame>this.lifetime)
			shaman.debuffs.splice(n, 1);
		act(this);
		this.frame++;
	}
	if(col){
		this.draw = function(n){
			ctx.fillStyle  = col;
			ctx.fillRect(190+n*12, 518, 10, 10);
		}
	} else {this.draw = function(){}}
}
//It is poison))
function poisonTest(owner){
	if(owner.frame%fps==0){
		shaman.hp-=20;
		}
}
//Poisoned minion))
//Maybe I should use basic class for enemies?..
function PoisonTest(xx, yy, tar){
	this.hp = 200;
	this.damage = 0;
	this.score = 50;
	this.strikeReady = true;
	this.target;
	this.color = "green";
	this.x = xx;
	this.y = yy;
	this.speed=110/fps;
	this.xspeed;
	this.yspeed;
	this.radius = 20;
	this.range = this.radius;
	this.retarget = Retarget;
	this.die = function(){
		dieAnimation.call(this);
	}
	this.dead = false;
	this.step = Step;
	this.inRange = InRange;
	this.attack = function(){
		if(this.inRange()){
			var temp = this;
			shaman.debuffs.push(new Debuff(temp, 5, poisonTest, "#aaffaa"))
			this.attack = function(){}
		}
	}
	this.draw = Draw;
	this.lightningResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.fireResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.earthResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.debuff = null;
	this.controll = null;
	this.delay = 1000;
	this.action = function(){
		if(this.debuff) 
			this.debuff.action()
		if(this.hp<1) this.die();
		if(this.controll)	{
			this.controll.action();
		}else{
			if(this.inRange()){
			this.attack();
			}else {this.step()}
		}
	}
	this.retarget(tar);
}
