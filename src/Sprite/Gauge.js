var Gauge = cc.Node.extend({
    ctor:function (width,height,color) {
        this._super();
        this.width  = width;
        this.height = height;

        this.rectBase = cc.LayerColor.create(new cc.Color(0,0,0,255),this.width,this.height);
        this.rectBase.setPosition(0,0);
        this.addChild(this.rectBase,1);

        this.rectBack = cc.LayerColor.create(new cc.Color(105,105,105,255),this.width - 1,this.height - 1);
        this.rectBack.setPosition(1,1);
        this.addChild(this.rectBack,2);

        var colorCode = new cc.Color(255,255,255,255);
        if(color == "red"){
            colorCode = new cc.Color(178,34,34,255);
        }
        if(color == "blue"){
            colorCode = new cc.Color(255,255,255,255);
        }
        if(color == "lime"){
            colorCode = new cc.Color(128,128,0,255);
        }
        if(color == "white"){
            colorCode = new cc.Color(255,255,255,255);
        }
        this.rectBar = cc.LayerColor.create(colorCode,this.width - 2,this.height - 2);
        this.rectBar.setPosition(2,2);
        this.addChild(this.rectBar,3);
        this.rectBar.setAnchorPoint(0,0);
    },
    init:function () {
    },
    update:function(scaleNum) {
        this.rectBar.setScale(scaleNum,1);
    },
    setVisible:function(isVisible){
        this.rectBase.setVisible(isVisible);
        this.rectBack.setVisible(isVisible);
        this.rectBar.setVisible(isVisible);
    }
});

var Gauge2 = cc.Node.extend({
    ctor:function (width,height,color) {
        this._super();
        this.width  = width;
        this.height = height;
/*
        this.rectBase = cc.LayerColor.create(new cc.Color(0,0,0,255),this.width,this.height);
        this.rectBase.setPosition(0,0);
        this.addChild(this.rectBase,1);

        this.rectBack = cc.LayerColor.create(new cc.Color(105,105,105,255),this.width - 1,this.height - 1);
        this.rectBack.setPosition(1,1);
        this.addChild(this.rectBack,2);
*/
        var colorCode = new cc.Color(255,255,255,255);
        if(color == "red"){
            colorCode = new cc.Color(178,34,34,255);
        }
        if(color == "blue"){
            colorCode = new cc.Color(255,255,255,255);
        }
        if(color == "lime"){
            colorCode = new cc.Color(128,128,0,255);
        }
        if(color == "white"){
            colorCode = new cc.Color(255,255,255,255);
        }
        if(color == "black"){
            colorCode = new cc.Color(0,0,0,255);
        }
        this.rectBar = cc.LayerColor.create(colorCode,this.width - 6,this.height - 6);
        this.rectBar.setPosition(2,2);
        //this.rectBar.setOpacity(255*0.8);
        this.addChild(this.rectBar,3);
        this.rectBar.setAnchorPoint(1,0);
    },
    init:function () {
    },
    update:function(scaleNum) {
        this.rectBar.setScale(1-scaleNum,1);
    },
    setVisible:function(isVisible){
        this.rectBase.setVisible(isVisible);
        this.rectBack.setVisible(isVisible);
        this.rectBar.setVisible(isVisible);
    }
});

