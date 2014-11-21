// JavaScript Document

var TigerMachine = function(){
    this.$Scrollers = $("#machine_screen .col ul");
    this.$eTip = $("#machine_tip");
    this.$Money = $("#your_money");
    this.itemHeight = this.$Scrollers.find("li").outerHeight();
    this.wholeHeight = this.itemHeight*10;
    this.roller = [new RollingCard(this.$Scrollers.eq(0),50,4,3,this.itemHeight, this.wholeHeight,0),
                   new RollingCard(this.$Scrollers.eq(1),60,4,2,this.itemHeight, this.wholeHeight,1), 
                   new RollingCard(this.$Scrollers.eq(2),70,4,1,this.itemHeight, this.wholeHeight,2)
                  ];
    this.isRollUp = false;
    this.money = parseInt(localStorage.getItem("money"));
    if(isNaN(this.money)){
        this.money = 100;
    }
    this.setMoney(1);
    this.bet = 0;
    this.underMoving = false;
    
};

TigerMachine.prototype = {
    start:function(){
        if(this.underMoving){
            return;
        }
        if(this.bet ==0){
            this.showTip('请先投币！');
            return;
        }
        this.isRollUp = true;
        this.roller[0].start();
        this.underMoving = true;
    },
    stop:function(){
        for(var i=0; i<this.roller.length; i++){
            this.roller[i].stop();
        }
    },
    finish:function(){
        var val = [this.roller[0].value];
        var isNew = true;
        for(var i=1; i<this.roller.length; i++){
            isNew = true;
            for(var j=0; j<val.length; j++){
                if(val[j]==this.roller[i].value){
                    isNew = false;
                    break;
                }
            }
            if(isNew){
                val.push(this.roller[i].value);
            }
        }
        //alert(val.length);
        //val.length 表示了不同数值的个数。
        if(val.length ==3){
            this.showTip("你输了!");
        }else if(val.length==2){
            this.showTip("你赢了三倍的赌注!");
            this.setMoney(3*this.bet);
        }else{
            this.showTip("你赢了十倍的赌注！!");
            this.setMoney(10*this.bet);
        }
        this.underMoving = false;
        this.bet = 0;
        
    },
    getMoney:function(){
        
    },
    putMoney:function(num){
        this.bet += num;
        this.setMoney(num*-1);  //扣钱
        this.showTip("你投了"+this.bet+"块钱");
    },
    showTip:function(txt){
        txt = txt.toLocaleUpperCase();
        this.$eTip.html(txt);
    },
    setMoney:function(num){
        this.money += num;
        this.$Money.html("$"+this.money);
        localStorage.setItem("money",this.money);
    }

};

var RollingCard = function($target,topSpeed, accelerate, damp, cardHeight, wholeHeight, index){
    this.$target = $target;
    this.topSpeed = topSpeed;
    this.speed = 0;
    this.accelerate = accelerate;
    this.damp = damp;
    this.cardHeight = cardHeight;
    this.wholeHeight = wholeHeight;
    this.isPowered = false;
    this.index = index;
    this.currentY = 0;
    this.value = 0;
    RollingCard.roller.push(this);
    
};
RollingCard.prototype = {
    start:function(){
        this.money -= this.bet;
        this.isPowered = true;
        if(RollingCard.handle == null){
            RollingCard.stepCaller();
        }
    },
    stop:function(){    //停止动力
        this.isPowered = false; //失去动力
    },
    end:function(){ //停止运动
        
    },
    rolling:function(){ //运动中的计算。
        console.debug(this.index+':rolling: '+this.currentY);
        if(this.index<2&&this.speed>20&&this.isPowered){    //本滚子达到一定的速度后，带动右边滚子的转动。
            tigerMachine.roller[this.index+1].start();
        }
        if(this.isPowered){
            this.speed = this.speed + this.accelerate;
            if(this.speed > this.topSpeed){
                this.speed = this.topSpeed;
            }
        }else{
            if(this.speed<5){
                var dis = this.cardHeight - this.currentY%this.cardHeight;
                if(dis<5){
                    this.speed = 0;
                    this.currentY = this.currentY + dis;
                    this.value = Math.round(this.currentY/this.cardHeight);
                }
            }else{
                this.speed = this.speed - this.damp;            
            }
            
            if(this.speed < 0){
                this.speed = 0;
            }
        }
        
        this.currentY = Math.round(this.currentY + this.speed);
        if(this.currentY>this.wholeHeight){
            this.currentY = this.currentY - this.wholeHeight;
        }
        this.$target.css({transform:"translateY(-"+(this.currentY)+"px)"});
            
    }
};
RollingCard.roller = [];
RollingCard.handle = null;
RollingCard.stepCaller = function(){
    var isNoRolling = true;
    for(var i=0; i<RollingCard.roller.length; i++){
        if(RollingCard.roller[i].speed!=0||RollingCard.roller[i].isPowered==true){
           isNoRolling = false;
           RollingCard.roller[i].rolling();
        }
    }
    console.debug(isNoRolling);
    if(!isNoRolling){
        RollingCard.handle = setTimeout(RollingCard.stepCaller, 25); //还有进行中的滚动，所以需要计时器。
    }else{
        RollingCard.handle = null;
        tigerMachine.finish();
    }
};



var tigerMachine = new TigerMachine();



$("#pole_bar").bind("mousedown touchstart", function(){
    $(this).addClass('active');
    tigerMachine.start();
}).bind('mouseup touchend', function(){
    $(this).removeClass('active');
    tigerMachine.stop();
});
