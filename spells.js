function Lightning(xs, ys, xf, yf, c, dm){
var lenX = xf-xs;
var lenY = yf-ys;
var lenR = Math.sqrt(lenX*lenX+lenY*lenY);
var p = {}

this.color = c || "lightblue";
this.dots = [];
this.beated = [];
this.dots.push(xs);
this.dots.push(ys);
this.dots.push(xs+lenR*(Math.random()*0.2-0.1)+lenX*0.3);
this.dots.push(ys+lenR*(Math.random()*0.2-0.1)+lenY*0.3);
this.dots.push(xf-lenR*(Math.random()*0.2-0.1)-lenX*0.3);
this.dots.push(yf-lenR*(Math.random()*0.2-0.1)-lenY*0.3);
this.dots.push(xf);
this.dots.push(yf);
this.isBeated = function(n){
	for(var i = 0; i<this.beated.length; i++){
		if(this.beated[i] == n) return true;
	}
	return false;
}
this.damage = dm || 100+(LightningPower-1)*100/LightningPower;
this.end = false;
this.lightningJump = LightningJump;
this.action = function(){	}
this.draw = function(){
	if( !this.end ){
		ctx.beginPath();
		ctx.moveTo(this.dots[0], this.dots[1]);
		for(var n = 2; n<this.dots.length; n+=2)
			ctx.lineTo(this.dots[n], this.dots[n+1]);
		ctx.lineWidth = 4;
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "white";
		ctx.stroke();
		}
	}
	var iter = this;
	setTimeout(function(){
		iter.end = true;
		}, 150);
}
function LightningJump(n, t, ld, lr, jx, jy, c){
var L = this;
L.beated.push(t);
	if(n>0){
		for(var m = 0; m<Enemies.length; m++){
		if(!Enemies[m].dead && !L.isBeated(m)){
			var ix = Enemies[t].x-Enemies[m].x;
			var iy = Enemies[t].y-Enemies[m].y;
			if(Math.sqrt(ix*ix+iy*iy)< lr+(Enemies[t].radius + Enemies[m].radius) && !Enemies[m].dead){
			Enemies[m].lightningResist(ld);				
			Spells.push(new Lightning(jx, jy, Enemies[m].x, Enemies[m].y, c));
			L.beated.push(m);
			setTimeout(function(){
			L.lightningJump(--n, m, ld*=0.7, lr*=0.7, Enemies[m].x, Enemies[m].y, c)
			}, 25);
			break;
			}
		}	
		}
	}
}
//ManaBurst
function ManaBurst(mpd){
	this.damage = mpd;
	this.lifetime = fps*0.3;
	this.radius = 0;
	this.end = false;
	this.dr = 700/this.lifetime;
	this.action = function(){
		this.radius+=this.dr;
		--this.lifetime;
		if(this.lifetime ==0){
			this.end = true;
			this.action = function(){}
			this.draw = function(){}
			shaman.hp-=this.damage*3;
			for(var j=0; j<Enemies.length; j++){
				Enemies[j].hp-=this.damage*3;
			}
		}
	}
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(400, 465, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "rgba(20, 120, 255, 0.8)";
		ctx.fill();
	}
}
function ManaBurstClick(button){
	Spells.push(new ManaBurst(shaman.mp));
	shaman.mp = 0;
	button.curCD = button.maxCD;
	button.pressed = false;
}
//StoneSkin
function StoneSkin(){
	this.end = false;
	this.lifetime = fps*(3+(EarthPower-1)*5);
	this.radius = (EarthPower-1)*20;
	this.damage = (EarthPower-1)*150/fps;
	this.action = function(){
	var sp = this;
		for(var n = 0; n<Enemies.length; n++){
			var dx = Enemies[n].x - 400;
			var dy = Enemies[n].y - 465;
			var lenr = Math.sqrt(dx*dx+dy*dy);
			if(lenr<(Enemies[n].radius+this.radius+40)){
				Enemies[n].earthResist(this.damage);
			}
		}
		shaman.defense=0;
		this.lifetime--;
		if(this.lifetime<0){
			shaman.defense = 1;
			this.action = function(){}
			this.draw = function(){}
			this.end = true;
		}
	}
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(400, 465, 40, 0, Math.PI*2);
		ctx.fillStyle = "#3e593e";
		ctx.fill();
		for(var r = 0; r<24; r++){
			var rad = r*(Math.PI)/12;
			var rx = 400+40*Math.cos(rad);
			var ry = 465+40*Math.sin(rad);
			Triangle(400, 465, rx, ry, this.radius+15, "#3e593e", 25);
		}
	}
}
function StoneSkinClick(button){
	Spells.push(new StoneSkin());
	shaman.mp-=button.manacost;
	button.pressed = false;
	button.curCD = button.maxCD;
}
//
function Triangle(x, y, xx, yy, r, c, s){
	var lenx = xx-x;
	var leny = yy-y;
	var lenr = Math.sqrt(lenx*lenx+leny*leny);
	ctx.beginPath();
	x = x+lenx*s/lenr || x;
	y = y+leny*s/lenr || y;
	var x1=lenx*r/lenr;
	var y1=leny*r/lenr;
	var x2 = y1;
	var y2 = -x1;
	var K = 5/(Math.sqrt(x2*x2+y2*y2));
	x2*=K;
	y2*=K;
			
	ctx.beginPath();
	ctx.moveTo(x+x1, y+y1);
	ctx.lineTo(x+x2, y+y2);
	ctx.lineTo(x-x2, y-y2);
	ctx.fillStyle = c || "black";
	ctx.fill();
}
// FireMeteor
function FireMeteor(cx, cy, sx, sy){
	this.x = sx || 400;
	this.y = sy || 465;
	this.xspeed;
	this.yspeed;
	this.angle;
	this.lifetime;
	this.end = false;
	this.color = "#ff9121";
	this.radius=18;
	
	var lenx = cx-this.x;
	var leny = cy-this.y;
	var lenR = Math.sqrt(lenx*lenx+leny*leny);
	if(lenR!=0){
		this.xspeed = lenx*800/lenR/fps;
		this.yspeed = leny*800/lenR/fps;
		this.lifetime = lenR/800*fps;
		this.angle = Math.atan2(-this.yspeed, -this.xspeed);
	} else {
		this.xspeed = 0;
		this.yspeed = 0;
		this.lifetime = 0;
	}
	
	this.action = function(){
		if(this.lifetime<1){
			this.action = function(){}
			this.draw = function(){}
			Spells.push(new FireExplosion(this.x, this.y, 100+300*(AirPower-1)/AirPower));
			this.end = true;
		} else{
			this.x+=this.xspeed;
			this.y+=this.yspeed;
			this.lifetime--;
		}
	}
	this.draw = function(){
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}
function FireExplosion(cx, cy, r){
	this.x = cx;
	this.y = cy;
	this.end = false;
	this.radius = 18;
	this.lifetime = 0.1*fps;
	this.rstep = (r-this.radius)/this.lifetime;
	this.draw = function(){
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
		ctx.fillStyle = "rgba(255, 145, 33, 0.8)"
		ctx.fill()
	}
	this.action = function(){
		if(this.lifetime>0){
			this.lifetime--;
			this.radius += this.rstep;
		} else {
			for(var m = 0; m<Enemies.length; m++){
			if(!Enemies[m].dead){
			var lenx = this.x-Enemies[m].x
			var leny = this.y-Enemies[m].y
			var lenr = Math.sqrt(lenx*lenx+leny*leny)
			if(lenr<this.radius+Enemies[m].radius) {
				SetDebuff(Enemies[m], new Burning(Enemies[m]))
				Enemies[m].fireResist(10*FirePower);
				}
			}
			}
			this.action = function(){}
			var iter = this
			setTimeout(function(){
				iter.draw = function(){}
				}, 80)
			this.end = true;
		}
	}
}
function Burning(obj){
	this.object = obj;
	this.draw = function(){
		var target = this.object;
		ctx.beginPath()
		ctx.arc(target.x, target.y, target.radius, 0, Math.PI*2)
		ctx.fillStyle = "rgba(255, 145, 33, 0.5)"
		ctx.fill()
	}
	this.lifetime = fps*(6+(AirPower-1)*5)
	this.damage = (20+(FirePower-1)*40)/fps
	this.sDeb = 2+(FirePower-1)
	this.object.xspeed /= this.sDeb;
	this.object.yspeed /= this.sDeb;
	this.object.speed /= this.sDeb;
	this.PanicChance = ((FirePower-1)/fps)*this.object.fireResist(0);
	this.action = function(){
		if(this.lifetime>0){
			this.lifetime--;
			this.object.fireResist(this.damage)
			if(Math.random()<this.PanicChance){
					this.object.controll = new Panic(this.object)			
				}
		} else {
			this.object.debuff.restore()
		}
	}
	this.restore = function(){
		this.object.debuff = null;
		this.object.xspeed *= this.sDeb;
		this.object.yspeed *= this.sDeb;
		this.object.speed *= this.sDeb;		
	}
}
function FireMeteorClick(button){
	setListener(function(e){ FireMeteorShoot(e, button)
	});
}
function FireMeteorShoot(e, button){
	var cx = e.pageX-sx;
	var cy = e.pageY-sy;
	if(cy<500 && shaman.mp>=button.manacost){
		button.pressed = false;
		shaman.mp-=button.manacost;
		button.curCD = button.maxCD;
		Spells.push(new FireMeteor(cx, cy));
		setListener(LightningClick);
	} else{
		CheckPressed(cx, cy);
	}
}
//FreezeWave
function FreezeWaveClick(button){
	Spells.push(new FreezeWave());
	shaman.mp-=button.manacost;
	button.pressed = false;
	button.curCD = button.maxCD;
}
function FreezeWave(mpd){
	this.lifetime = fps*0.2;
	this.radius = 0;
	this.end = false;
	this.dr = (300+(AirPower-1)*400)/this.lifetime;
	this.action = function(){
		this.radius+=this.dr;
		--this.lifetime;
		if(this.lifetime<0){
			this.end = true;
			this.action = function(){}
			var iter = this;
			setTimeout(function(){
			iter.draw = function(){}
			}, 60)
			for(var j=0; j<Enemies.length; j++){
				var lenx = Enemies[j].x-400;
				var leny = Enemies[j].y-465;
				var lenr = Math.sqrt(lenx*lenx+leny*leny)
				if(lenr<this.radius+Enemies[j].radius){
					SetDebuff(Enemies[j], new Freeze(Enemies[j]))
				}
			}
		}
	}
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(400, 465, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "rgba(43, 229, 255, 0.8)";
		ctx.fill();
	}
}
function Freeze(obj){
	this.object = obj;
	this.draw = function(){
		var target = this.object;
		ctx.beginPath()
		ctx.arc(target.x, target.y, target.radius, 0, Math.PI*2)
		ctx.fillStyle = "rgba(43, 229, 255, 0.5)"
		ctx.fill()
	}
	this.lifetime = fps*(6+(AirPower-1)*5)
	this.sDeb = 5+(WaterPower-1)*5
	this.object.xspeed /= this.sDeb;
	this.object.yspeed /= this.sDeb;
	this.object.delay *= this.sDeb;
	this.ShockChance = (WaterPower-1)/fps
	this.action = function(){
		if(this.lifetime>0){
			this.lifetime--;
			if(Math.random()<this.ShockChance)
				this.object.controll = new Shock(this.object)
		} else {
			this.object.debuff.restore()
		}
	}
	this.restore = function(){
		this.object.debuff = null;
		this.object.retarget(shaman)
		this.object.delay /= this.sDeb;
	}
}
//StormWraith
var LightningClick;
function StormWraithClick(button){
	setListener(function(e){
	PlaceStormTotem(e, button)
	})
}
function PlaceStormTotem(e, button){
	var cx = e.pageX-sx;
	var cy = e.pageY-sy;
	if(cy<500 && shaman.mp>=button.manacost){
	button.pressed = false;	
		shaman.mp-=button.manacost;
		button.curCD = button.maxCD;
		Spells.push(new StormWraithTotem(cx, cy));
		setListener(LightningClick);
	} else{
		CheckPressed(cx, cy);
	}
}
function StormWraithTotem(x, y){
	this.x = x
	this.y = y
	this.maxLifetime = (15+(LightningPower-1)*10/LightningPower)*fps
	this.lifetime = this.maxLifetime
	this.shootReady = false
	this.end = false
	this.curCD = 0;
	this.rad = 0;
		var iter = this;
		LightningClick =  function(e){
		LightningClickMulti(e, iter)
		}
		setListener(LightningClick)
	this.draw = function(){
	var tx = this.x;
	var ty = this.y;
	var rad = this.rad;
	var tempL = new Lightning(tx-Math.cos(rad)*40, ty-Math.sin(rad)*40, tx+Math.cos(rad)*40, ty+Math.sin(rad)*40, "blue");
	tempL.draw();
	this.rad+=0.01

		ctx.beginPath()
		ctx.arc(tx, ty, 14, 0, Math.PI*2)
		ctx.fillStyle = "#125d6f"
		ctx.fill()
		ctx.beginPath()
		ctx.arc(tx, ty, 40, 0, Math.PI*2)
		ctx.strokeStyle = "#125d6f"
		ctx.lineWidth = 2
		ctx.stroke()
		ctx.fillStyle = "grey"
		ctx.fillRect(tx-15, ty+16, 30, 6)
		ctx.fillRect(tx-15, ty+23, 30, 6)
		ctx.fillStyle = "lightgrey"
		ctx.fillRect(tx-14, ty+17, 28*this.lifetime/this.maxLifetime, 4)
		ctx.fillStyle = "#125d6f"
		ctx.fillRect(tx-14, ty+24, 28/fps*this.curCD, 4)
	}
	this.action = function(){
		if(this.lifetime<0){
			this.end = true;
			this.draw = function(){}
			this.action = function(){}
			LightningClick = LightningClickSingle;
			setListener(LightningClick)
		}
		this.lifetime--;
		if(this.curCD >= fps){
		if(!this.shootReady){
		this.shootReady = true;
		}
		}else{
			this.curCD+=1;
		}
	}
}
function LightningClickMulti(e, totem){

	var cx = e.pageX-sx;
	var cy = e.pageY-sy;

if(cy<500 && (Date.now()-LastClick)>170){	
LastClick = Date.now();
	lightning = new Lightning(400, 465, cx, cy, "blue");
	
	for(var i = 0; i<Enemies.length; i++){
	var ix = cx-Enemies[i].x;
	var iy = cy-Enemies[i].y;
	if(Math.sqrt(ix*ix+iy*iy)<Enemies[i].radius && !Enemies[i].dead){
	Enemies[i].lightningResist(lightning.damage);
	
	if(totem.shootReady){
	totem.shootReady = false;
	totem.curCD = 0;
	for(var j = 0; j<Math.floor(Math.random()*((LightningPower-1)*5+1)+1); j++){
		setTimeout(function(){
		var tempL = new Lightning(400, 465, cx, cy, "blue");
		Spells.push(tempL);
		if(Math.random()<0.2)
			Enemies[i].controll = new Shock(Enemies[i])
		Enemies[i].lightningResist(lightning.damage);
		setTimeout(function(){
	tempL.lightningJump(Math.round((LightningPower-1)*5), i, lightning.damage*=0.7, (LightningPower-1)*200/LightningPower-10, cx, cy, "blue")
		}, 25)
	}, 15*j)
	}
}

	setTimeout(function(){
	lightning.lightningJump(Math.round((LightningPower-1)*5), i, lightning.damage*=0.7, (LightningPower-1)*150/LightningPower-10, cx, cy, "blue")
	}, 25);
	break;
	}
		}
	}else{
		CheckPressed(cx, cy);
	}
}
//Controll
function Panic(obj){
	this.object = obj;
	this.lifetime = 5*fps;
	this.action = function(){
		if(this.lifetime>0){
		this.lifetime --
		if(this.lifetime % (fps*0.2) == 0){
		var lenX = Math.random()*2-1;
		var lenY = Math.random()*2-1;
		var lenR = Math.sqrt(lenX*lenX+ lenY*lenY);
			this.object.xspeed = lenX*this.object.speed/lenR;
			this.object.yspeed = lenY*this.object.speed/lenR;
		}
		this.object.step()
		} else{
			this.object.controll = null;
			this.object.retarget(shaman);
		}
	}
	this.draw = function(){
		ctx.fillStyle = "black"
		ctx.font = "bold 10px sans-serif"
		ctx.fillText("Panic", this.object.x, this.object.y)
	}
}
function Shock(obj){
	this.object = obj;
	this.lifetime = 2*fps;
	this.object.retarget(shaman)
	this.action = function(){
		if(this.lifetime>0){
		this.lifetime --
		} else{
			this.object.controll = null;
		}
	}
	this.draw = function(){
		ctx.fillStyle = "black"
		ctx.font = "bold 10px sans-serif"
		ctx.fillText("Shock", this.object.x, this.object.y)
	}
}
function Sleep(obj){
	this.object = obj;
	this.lifetime = 8*fps;
	this.prevHP = this.object.hp;
	if(this.object.retarget)
		this.object.retarget(shaman)
	this.action = function(){
		if(this.lifetime>0){
		this.lifetime --
		if(this.object.hp!=this.prevHP)
			this.object.controll = null
		} else{
			this.object.controll = null;
		}
	}
	this.draw = function(){
		ctx.fillStyle = "black"
		ctx.font = "bold 10px sans-serif"
		ctx.fillText("Sleep", this.object.x, this.object.y)
	}
}
//
function SetDebuff(obj, debuff){
	if(obj.debuff) obj.debuff.restore()
	obj.debuff  = debuff;
}