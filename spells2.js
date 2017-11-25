//part2

//peaceful totem, makes everyone inside of area to sleep
function SwiftWindClick(button){
	setListener(function(e){
	PlaceWindTotem(e, button)
	})
}
function PlaceWindTotem(e, button){
	var cx = e.pageX-sx;
	var cy = e.pageY-sy;
	if(cy<500 && shaman.mp>=button.manacost){
		button.pressed = false;	
		shaman.mp-=button.manacost;
		button.curCD = button.maxCD;
		Spells.push(new SwiftWindTotem(cx, cy));
		setListener(LightningClick);
	} else{
		CheckPressed(cx, cy);
	}
}
function SwiftWindTotem(x, y){
	this.radius = 100;
	this.x = x
	this.y = y
	this.maxLifetime = 10*fps
	this.lifetime = this.maxLifetime
	this.end = false
	this.rad = 0
	this.draw = function(){
	var tx = this.x;
	var ty = this.y;
	var rad = this.rad
	this.rad-=0.1
	ctx.beginPath()
	ctx.moveTo(tx, ty)
	ctx.lineTo(tx+Math.cos(rad)*35, ty+Math.sin(rad)*35)
	ctx.strokeStyle = "lightblue" 
	ctx.lineWidth = 3
	ctx.stroke()
		ctx.beginPath()
		ctx.arc(tx, ty, 14, 0, Math.PI*2)
		ctx.fillStyle = "#91b1b3"
		ctx.fill()
		ctx.beginPath()
		ctx.arc(tx, ty, 35, 0, Math.PI*2)
		ctx.strokeStyle = "#91b1b3"
		ctx.lineWidth = 2
		ctx.stroke()
		ctx.fillStyle = "grey"
		ctx.fillRect(tx-15, ty+16, 30, 6)
		ctx.fillStyle = "lightgrey"
		ctx.fillRect(tx-14, ty+17, 28*this.lifetime/this.maxLifetime, 4)
	}
	this.action = function(){
		if(this.lifetime % 5*fps == 0){
			for(var i = 0; i<Enemies.length; i++){
				var lenX = Enemies[i].x - this.x;
				var lenY = Enemies[i].y - this.y;
				if (lenX*lenX+lenY*lenY<this.radius*this.radius){
					Enemies[i].controll = new Sleep(Enemies[i]);
				}
			}
		}
		if(this.lifetime<0){
			this.end = true;
			this.draw = function(){}
			this.action = function(){}
			}
			this.lifetime--;						
	}
}
//TODO: last six spells
