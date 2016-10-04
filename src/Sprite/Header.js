var Header = cc.Node.extend(
{
    ctor : function (game) 
    {
        this._super();
        this.game = game;
    
        this.header = cc.Sprite.create("res/header.png");
        this.header.retain();
        this.header.setAnchorPoint(0, 0);
        this.addChild(this.header);

        //ゲージの生成
        this.hpGauge = new Gauge(270, 22, 'white');
        this.hpGauge.setAnchorPoint(0, 0);
        this.hpGauge.setPosition(184, 38);
        this.header.addChild(this.hpGauge);

        //ゲージの生成
        this.mpGauge = new Gauge(270, 10, 'white');
        this.mpGauge.setAnchorPoint(0, 0);
        this.mpGauge.setPosition(184, 18);
        this.header.addChild(this.mpGauge);

        this.coinCnt = cc.LabelTTF.create("xxx", "Arial", CONFIG.CUTIN_FONT_SIZE);
        this.coinCnt.setAnchorPoint(1, 0);
        this.coinCnt.setPosition(600,20);
        this.coinCnt.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.header.addChild(this.coinCnt);

        this.stageLabel = cc.LabelTTF.create("xxx", "Arial", CONFIG.CUTIN_FONT_SIZE);
        this.stageLabel.setAnchorPoint(0.5, 0);
        this.stageLabel.setPosition(70,20);
        this.stageLabel.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.header.addChild(this.stageLabel);

        this.header = cc.Sprite.create("res/header_over.png");
        this.header.retain();
        this.header.setAnchorPoint(0, 0);
        this.addChild(this.header);

        this.hpLabel = cc.LabelTTF.create("xxx", "Arial", 12);
        this.hpLabel.setAnchorPoint(1, 0);
        this.hpLabel.setPosition(430,95);
        //this.header.addChild(this.hpLabel);

        this.mpLabel = cc.LabelTTF.create("xxx", "Arial", 12);
        this.mpLabel.setAnchorPoint(1, 0);
        this.mpLabel.setPosition(430,45);
        //this.header.addChild(this.mpLabel);
    },

    update : function () {}, 
});
