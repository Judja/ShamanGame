//different enemy types
//it could be shorter, but firstly i was going to use only one enemy type, so I didn't create smt like a basic class
function Goblin(xx, yy, tar){
	this.hp = 200;
	this.damage = 30;
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
	this.die = dieAnimation;
	this.dead = false;
	this.step = Step;
	this.inRange = InRange;
	this.attack = MeleeAttack;
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
//--------
//when they die, they spawn two little golems
function StoneGolem(xx, yy, tar){
	this.hp = 800;
	this.damage = 300;
	this.score = 300;
	this.strikeReady = true;
	this.target;
	this.color = "#c28c3a";
	this.x = xx;
	this.y = yy;
	this.speed=30/fps;
	this.xspeed;
	this.yspeed;
	this.radius = 30;
	this.range = this.radius;
	this.retarget = Retarget;
	this.die = function(){
		dieAnimation.call(this, true);
		Enemies.push(new LittleStoneGolem(this.x, this.y-10, shaman));
		Enemies.push(new LittleStoneGolem(this.x, this.y+10, shaman));
	}
	this.dead = false;
	this.step = Step;
	this.inRange = InRange;
	this.attack = MeleeAttack;
	this.draw = Draw;
	this.lightningResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.fireResist = function(dmg){
	this.hp-=dmg*0.5
	return 1}
	this.earthResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.debuff = null;
	this.controll = null;
	this.delay = 2000;
	this.action = function(){
	if(this.debuff) 
		this.debuff.action()
	if(this.hp<1) this.die(true);
	if(this.controll){
		this.controll.action()
	} else{
			if(this.inRange()){
			this.attack();
			}else {this.step()}
		}
	}
	this.retarget(tar);
}

function LittleStoneGolem(xx, yy, tar){
	this.hp = 300;
	this.damage = 5;
	this.score = 25;
	this.strikeReady = true;
	this.target;
	this.color = "#c28c3a";
	this.x = xx;
	this.y = yy;
	this.speed=35/fps;
	this.xspeed;
	this.yspeed;
	this.radius = 17;
	this.range = this.radius;
	this.retarget = Retarget;
	this.die = dieAnimation;
	this.dead = false;
	this.step = Step;
	this.inRange = InRange;
	this.attack = MeleeAttack;
	this.draw = Draw;
	this.debuff = null;
	this.controll = null;
	this.delay = 1500;
	this.lightningResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.fireResist = function(dmg){
	this.hp-=dmg*0.5
	return 1}
	this.earthResist = function(dmg){
	this.hp-=dmg
	return 1}
	this.action = function(){
	if(this.debuff!=null)
		 this.debuff.action();
	if(this.hp<1) this.die();
	if(this.controll){
		this.controll.action()
	} else {
			if(this.inRange()){
			this.attack();
			}else {this.step()}
		}
	}
	this.retarget(tar);
}
//------------


//////////////////////////////////////
//Methods, common for enemyTypes
function MeleeAttack(){
var Delay = this.delay;
		if(this.strikeReady){
			this.strikeReady = false;
			var iter = this;
			setTimeout(function(){
				iter.step();
				iter.target.hp-=iter.damage*iter.target.defense*iter.target.defenseMode;
				ScreenEffects.push(new Attacked(iter.damage))
				setTimeout(function(){
					iter.x-=iter.xspeed;
					iter.y-=iter.yspeed;
				}, Delay*0.2);
			}, Delay*0.1);
			setTimeout(function(){
				iter.strikeReady = true
			}, Delay);
		}
}
function dieAnimation(quickDie){
	QuickDie = quickDie || false;
	var iter = this;
	TotalScore+=iter.score;
	if(iter.debuff) iter.debuff.restore()
	iter.action = function(){};
	iter.color = "rgba(0, 0, 0, 0.7)";
	iter.dead = true;
	if(!quickDie){
		setTimeout(function(){
			iter.draw = function(){}
	}, 300)
	}else{
		iter.dead = true;
		iter.draw = function(){}
	}
}
//
function Retarget(targ){
	this.target = targ;
	var lenX = targ.x-this.x;
	var lenY = targ.y-this.y;
	var lenR = Math.sqrt(lenX*lenX+ lenY*lenY);
	if(lenR!=0){
		this.xspeed = lenX*this.speed/lenR;
		this.yspeed = lenY*this.speed/lenR;
	} else {
		this.xspeed = 0;
		this.yspeed = 0;
	}
}
function Step(){
	this.x+=this.xspeed;
	this.y+=this.yspeed;
}
function InRange(){
var iter = this.target;
	var lenX = iter.x-this.x;
	var lenY = iter.y-this.y;
	var lenR = Math.sqrt(lenX*lenX+lenY*lenY)-iter.radius-5;
	if(lenR>this.range) {return false} else {return true}
}
function Draw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fillStyle = this.color;
		ctx.fill();
		if(this.debuff) this.debuff.draw();
		if(this.controll) this.controll.draw();
}
