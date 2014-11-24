// JavaScript Document
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function goTop(){
	window.scrollTo(0,0);
}


function itemsCalc(){
	var items = $(".needcalc");
	var clientWidth = document.documentElement.clientWidth;
	var cur, width, height, top, bottom, left, right, widthpercent, heightpercent, toppercent, bottompercent, leftpercent, rightpercent;
	for(var i=0; i<items.length; i++){
		cur = items.eq(i);
		width = Math.round(clientWidth*parseFloat(cur.attr("widthpercent")));
		height = Math.round(clientWidth*parseFloat(cur.attr("heightpercent")));
		
		widthpercent = cur.attr("widthpercent");
		if(typeof widthpercent !="undefined"){
			width = Math.round(parseFloat(widthpercent)*clientWidth)+"px";
		}else{
			width = false;
		}
		
		heightpercent = cur.attr("heightpercent");
		if(typeof heightpercent !="undefined"){
			height = Math.round(parseFloat(heightpercent)*clientWidth)+"px";
		}else{
			height = false;
		}
		
		toppercent = cur.attr("toppercent");
		if(typeof toppercent !="undefined"){
			top = Math.round(parseFloat(toppercent)*clientWidth)+"px";
		}else{
			top = false;
		}
		
		bottompercent = cur.attr("bottompercent");
		if(typeof bottompercent !="undefined"){
			bottom = Math.round(parseFloat(bottompercent)*clientWidth)+"px";
		}else{
			bottom = false;
		}
		
		leftpercent = cur.attr("leftpercent");
		if(typeof leftpercent !="undefined"){
			left = Math.round(parseFloat(leftpercent)*clientWidth)+"px";
		}else{
			left = false;
		}
		
		rightpercent = cur.attr("rightpercent");
		if(typeof rightpercent !="undefined"){
			right = Math.round(parseFloat(rightpercent)*clientWidth)+"px";
		}else{
			right = false;
		}
		cur.css({width:width, height:height, left:left, right:right,top:top,bottom:bottom});
	}
}

/*页面弹层的JS*/
var Pop = function(){
	this.target = null;
	this.bg = document.createElement('DIV');
	this.bg.className = "pop_mask";
	this.bg.id = "pop_over_bg";
	document.body.appendChild(this.bg);	
};
Pop.prototype = {
	show: function(id){
		if(this.target!=null) return;
		this.target = JW(id);
		this.bg.style.display = "block";
		this.target.style.display = "block";
		//var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		//var width = this.target.offsetWidth;
		var height = this.target.offsetHeight;
		var top = parseInt((clientHeight-height)/2);
		//var left = parseInt((clientWidth-width)/2);
		this.target.style.top = top+"px";

	},
	hide: function(){
		this.bg.style.display = "none";
		this.target.style.display = "none";
		this.target = null;
	},
	resize: function(){
		var clientHeight = document.documentElement.clientHeight;
		var height = this.target.offsetHeight;
		var top = parseInt((clientHeight-height)/2);
		this.target.style.top = top+"px";
	}
};

var oPop = new Pop();


//输入框输入长度限制，此方法绑定在input,textarea的onkeyup事件上，参数分别人：this, maxlength,显示剩余字数的span的id.
function fed_inputLimit(target,maxlength,counterId){
	var last = maxlength-target.value.length;
	if(last>=0&&counterId){
		$('#'+counterId).html(last);
	}else{
		$(target).attr('value',target.value.toString().substring(0,maxlength));
		if(counterId){
			$('#'+counterId).html(0);
		}
	}
}

//输入框输入长度限制改进2，此方法绑定在input,textarea的onfocus事件上，参数分别人：this, maxlength,显示剩余字数的span的id.
function fed_inputMaxLength(target,maxlength,counterId, option){
	var oldLength = 0,reachMax, reachZero, reachNone, lessThan, lessThanCall;
	var isReach = 'none';
	if(!!option){
		
		if(option.reachMax){
			reachMax = option.reachMax;
		}
		if(option.reachZero){
			reachZero = option.reachZero;
		}
		if(option.reachNone){
			reachNone = option.reachNone;
		}
		
		if(option.lessThanCall&&option.lessThan){
			lessThanCall = option.lessThanCall;
			lessThan = option.lessThan;
		}
	}
	function reachManage(val){
		var length = val.length;
		if(length<=0){
			if(!!reachZero&&isReach!="zero"){
				reachZero();
			}
			isReach=="zero";
		}else if(length<maxlength){
			if(!!reachNone&&(isReach!="none")){
				reachNone();
			}
			isReach = "none";
		}else{
			if(!!reachMax&&isReach!="max"){
				reachMax(val);
			}
			isReach = "max";
		}
		if((maxlength-length)<lessThan&&(maxlength-oldLength)>=lessThan){
			lessThanCall();
		}
		
		oldLength = length;
	}
	
	function inputLimit(target,maxlength,counter){
		var last = maxlength-target.value.length;
		if(last>=0&&counter){
			counter.html(last);
		}else{
			$(target).attr('value',target.value.toString().substring(0,maxlength));
			if(counter){
				counter.html(0);
			}
		}
	}


	if($(target).attr('fed_max_length')==null){
		$(target).attr('fed_max_length',maxlength);
		var counter = $('#'+counterId);
		$(target).unbind("keyup").bind("keyup", function(event) {
			reachManage($(target).val());
			inputLimit(target, maxlength, counter);
		});
		$(target).bind('blur',function(){
			var last = maxlength-target.value.length;
			if($(target).val()==$(target).attr('placeholder')){
				last = maxlength;
			}else{
				reachManage($(target).val());
				inputLimit(target, maxlength, counter);
			}
		});
	}
	
}


//截取中英文混合字符串，参数为字符串和所限定的英文的长度
function fed_MixSubstr(str, len){
	var r = /[^\x00-\xff]/g;
	var rChar = "**";
	if (str.replace(r, rChar ).length <= len){
		return str ;  
	}
	var m = Math.floor(len/2);
	for ( var i=m; i< str.length; i++) {
		if ( str.substr(0, i).replace(r, rChar).length>=len) { 
			return str.substr(0, i); 
		}
	 }
	return str ;
}


function reload(){
	window.location.reload();
}

//弹出层统一清理函数，如模仿下拉框和一些弹出浮动层，在点击层外其它地方时要把层隐藏掉。而事件需要绑定在document上，所以统一绑定。
var popPurge = (function(){
	var list = [];
	function purge(e){
		var e = window.event?window.event.srcElement:e.target;
		if(list.length==0) return;
		var tempNode;
		for(var i=0; i<list.length; i++){
			if(!!list[i]){

				tempNode = e;
				while(tempNode!=list[i][0]&&tempNode!=list[i][1]&&tempNode!=document.body){
					tempNode = tempNode.parentNode;
				}
				if(tempNode==document.body){
					list[i][0].style.display = "none";
				}
			}
		}
	}
	//e is a HTML Node
	function add(e,t){
		if(!t){
			t = document.body;
		}
		list.push([e,t]);
	}
	this.add = add;
	$(document).bind('click', purge);
	return this;
})();

function tabShift(e, tabNav, preIdStr){
	///*第一个参数为event;*/
	///*第二个参数为this;*/
	///*第三个参数为tav_con的id前缀，如果为空，表示不通过id来获取tab_con,而是通过寻找tab_nav的同一个父亲元素下的class="tab_con"来获取tab_con对象;*/
	$tabNav = $(tabNav);
	var lis = $tabNav.find("li");
	var target = window.event?event.srcElement:e.target;
	var tabCons;
	//获取到当前点击的li
	try
	{
		while(target.tagName!="LI"||target == document.body){
			target = target.parentNode;
		}
	}
	catch(err){
		
	};
	
	if(target==document.body){
		return;
	}
	
	var idx = lis.index(target);
	if(tabNav.tagName=="UL"){
		tabCons = $(tabNav).parent().siblings(".tab_con");
	}else{
		tabCons = $(tabNav).siblings(".tab_con");
	}
	
	//切换tab_con
	if(arguments.length>2){
		//通过id来获取tab_con
		for(var i=0; i<lis.length; i++){
			if(i==idx){
				$("#"+preIdStr+(i+1)).show();
			}else{
				$("#"+preIdStr+(i+1)).hide();
			}
		}
	}else{
		tabCons.hide().eq(idx).show();
	}
	
	//切换tab_nav li当前项
	lis.removeClass("current").eq(idx).addClass("current");
}

function tabShiftSet(ulId, consIdPre, index){
	var ul = $("#"+ulId);
	var lis = ul.find("li");
	var currentLi = lis.filter("li.current");
	var oldIndex = lis.index(currentLi);
	var newIndex;
	if(index=="+1"){
		newIndex=oldIndex+1;
	}else if(index=="-1"){
		newIndex = oldIndex-1;
	}else{
		newIndex = index;
	}
	
	if(newIndex>lis.length-1){
		newIndex=lis.length-1
	}else if(newIndex<0){
		newIndex = 0;
	}
	lis.removeClass("current").eq(newIndex).addClass("current");
	//通过id来获取tab_con
	for(var i=0; i<lis.length; i++){
		if(i==newIndex){
			$("#"+consIdPre+(i+1)).show();
		}else{
			$("#"+consIdPre+(i+1)).hide();
		}
	}	
}

function JW(id){
	return document.getElementById(id);
}

JW.offset = function(elem){
	var docElem, win,
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument,
		strundefined = typeof undefined;

	if ( !doc ) {
		return;
	}
	docElem = doc.documentElement;
	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = window;
	console.log(box.left+"_"+win.pageXOffset+"_"+docElem.clientLeft);
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	}
}
//生成一个从0-(_limit-1)的随机数;
JW.createRandom = function(_limit){
	var ranNum = Math.floor(Math.random()*_limit);
	return ranNum;
}














/*extend function, improved*/
function extend(subClass, superClass){
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superclass = superClass.prototype;
	if(superClass.prototype.constructor == Object.prototype.constructor){
		//console.debug("superClass.prototype.constructor==Object.prototype.constructor");
		//superClss为手写类，他的原型指向Object.prototype;
		//如果superClass为继承的类的话，那么就不会指向Object.prototype;
		superClass.prototype.constructor = superClass;
	}
}
function addEvent(el, type, fn){
     if(window.addEventListener){
          el.addEventListener(type, fn, false);
     }
     else if(window.attachEvent){
          el.attachEvent('on'+type, fn);
     }
     else{
          el['on'+type] =fn;
     }
}

/*Interface*/
var Interface = function(name, methods){
	if(arguments.length != 2){
		throw new Error("Interface constructor called with "+ arguments.length + "")
	}
	this.name = name;
	this.methods = [];
	for(var i=0, len = methods.length; i<len; i++){
		if(typeof methods[i] !== 'string'){
			throw new Error("Interface constructor expects method names to be passed in as a string.");
		}
		this.methods.push(methods[i]);
	}
};

//Static class method of Interface
Interface.ensureImplements = function(object){
	if(arguments.length <2 ){
		throw new Error("Function Interface.ensureImplements called with "+
		arguments.length + " arguments, but expected at least 2."
		);
	}
	for(var i= 1, len = arguments.length; i<len; i++){
		var interface = arguments[i];
		if(interface.constructor !== Interface){
			throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface.");
		}
		for(var j=0, methodsLen = interface.methods.length; j< methodsLen; j++){
			var method = interface.methods[j];
			if(!object[method]||typeof object[method] !== 'function'){
				throw new Error("Function Interface.ensureImplements: object"
				+" does not implement the "+interface.name
				+" inerface.Method" + method + "was not found.");
			}
		}
	}
};



var DynamicNumButton = function(target,option){
	this.target = target;
	this.touchTimer = 400;
	this.touchHandler = null;
	if(!!option){
		console.debug('option exist');
		this.option = {
			value:option.value?option.value:0,
			addSize:option.addSize?option.addSize:1,
			maxValue:typeof option.maxValue !="undefined"?option.maxValue:false,
			minValue:typeof option.minValue !="undefined"?option.minValue:false,
			callback:option.callback?option.callback:false,
		};
	}else{
		alert("DynamicNumButton need option");
	}
	var that = this;
	addEvent(this.target, 'touchstart', function(){that.touchStart();});
	addEvent(this.target, 'mousedown', function(){that.touchStart();});
	addEvent(this.target, 'touchend', function(){that.touchEnd();});
	addEvent(this.target, 'mouseup', function(){that.touchEnd();});
	addEvent(this.target, 'mouseleave', function(){that.touchEnd();});
	
};
DynamicNumButton.prototype = {
	touchStart:function(){
		this.numMove();
		var that = this;
		this.touchHandler = setTimeout(function(){that.touchKeep();},this.touchTimer);
		
	},
	touchKeep: function(){
		if(this.touchTimer>30){
			this.touchTimer -= 30;
		}
		this.numMove();
		if(this.touchHandler!=null){
			clearTimeout(this.touchHandler);
		}
		var that = this;
		this.touchHandler = setTimeout(function(){that.touchKeep();},this.touchTimer);
	},
	touchEnd:function(){
		if(this.touchHandler!=null){
			clearTimeout(this.touchHandler);
		}
		this.touchTimer = 200;
	},
	numMove: function(){
		var tmpValue = this.option.value+this.option.addSize;
		
		if((this.option.maxValue !== false && tmpValue>this.option.maxValue)||(this.option.minValue !== false&&tmpValue<this.option.minValue)){
			return;
		}
		this.option.value = this.option.value+this.option.addSize;
		this.option.callback(this.option.value);
	}
};





