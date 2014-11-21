// JavaScript Document

function percentBar(wrap){
	this.wrap = wrap;
	this.input = wrap.getElementsByTagName('input')[0];	//input:hidden save the percent value;
	this.value;
	this.eNum = wrap.querySelector('.pc_num');
	this.eBar = wrap.querySelector('.pc_bar');
	
	this.width = this.wrap.offsetWidth;
	this.wrapLeft = JW.offset(this.wrap).left;
	this.ifDrag = false;
	
	/* bind the events*/
	var that = this;
	this.wrap.onmousedown = function(){that.onmousedown();};
	this.wrap.ontouchstart = function(){that.onmousedown();};
	this.wrap.onmouseup = function(){that.onmouseup();};
	this.wrap.ontouchend = function(){that.onmouseup();};
	this.wrap.onmousemove = function(){that.onmousemove();};
	//this.wrap.ontouchmove = function(){that.onmousemove();};	//这种写法在Chorme simulator 中未能如愿绑定事件，但是下面的方法可以。
	addEvent(this.wrap, 'touchmove', function(){that.onmousemove();});
	this.wrap.onmouseleave = function(){that.onmouseup();};
	

}
percentBar.prototype = {
	onmousedown: function(e){
		e = window.event?window.event:e;
		this.width = this.wrap.offsetWidth;
		this.ifDrag = true;
		var _touchX;
		if(!!e.touches){
			_touchX = e.touches[0].pageX;
		}else{
			_touchX = e.clientX;
		}
		var _left = _touchX - this.wrapLeft;
		this.update(_left);
		return false;
	},
	onmouseup: function(e){
		this.ifDrag = false;
	},
	onmousemove: function(e){
		if(this.ifDrag){
			e = window.event?window.event:e;
			var _touchX;
			if(!!e.touches){
				_touchX = e.touches[0].pageX;
				console.debug(_touchX);
			}else{
				_touchX = e.clientX;
			}
			var _left = _touchX - this.wrapLeft;
			this.update(_left);
			return false;
		}
	},
	update: function(disLeft){
		//disLeft/
		this.value = Math.round((disLeft/this.width)*100);
		if(this.value<0){
			 this.value = 0;
		}else if(this.value>100){
			 this.value = 100;
		}
		this.eNum.innerHTML = this.value + "%";
		this.eBar.style.width = this.value +"%";
		this.input.value = this.value * 0.01;
		
	}
};

