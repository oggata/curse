var Effect = cc.Node.extend({
    ctor: function(game, itemId) {
        this._super();
        this.game = game;
        if (itemId == "killed") {
            this.image = "res/pipo-lightburst1.png";
            this.itemWidth = 320;
            this.itemHeight = 240;
            this.widthCount = 1;
            this.heightCount = 10;
            this.effectInterval = 0.05;
            this.scale = 2;
        } else if (itemId == "damaged") {
            this.image = "res/pipo-btleffect048.png";
            this.itemWidth = 240;
            this.itemHeight = 240;
            this.widthCount = 5;
            this.heightCount = 1;
            this.effectInterval = 0.08;
            this.scale = 2;
        } else if (itemId == "damaged2") {
            this.image = "res/pipo-btleffect049.png";
            this.itemWidth = 240;
            this.itemHeight = 240;
            this.widthCount = 10;
            this.heightCount = 1;
            this.effectInterval = 0.08;
            this.scale = 2;
        } else if (itemId == "recover_hp"){
            this.image = "res/promin_pipo003_yellow.png";
            this.itemWidth = 256;
            this.itemHeight = 256;
            this.widthCount = 5;
            this.heightCount = 5;
            this.effectInterval = 0.08;
            this.scale = 1;
        } else if(itemId == "recover_mp"){
            this.image = "res/promin_pipo003_blue.png";
            this.itemWidth = 256;
            this.itemHeight = 256;
            this.widthCount = 5;
            this.heightCount = 5;
            this.effectInterval = 0.08;
            this.scale = 1;
        }else if(itemId == "got_soul"){
            this.image = "res/promin_pipo003_purple.png";
            this.itemWidth = 256;
            this.itemHeight = 256;
            this.widthCount = 5;
            this.heightCount = 5;
            this.effectInterval = 0.08;
            this.scale = 1;
        }else if(itemId == "got_my_soul"){
            this.image = "res/promin_pipo003.png";
            this.itemWidth = 256;
            this.itemHeight = 256;
            this.widthCount = 5;
            this.heightCount = 5;
            this.effectInterval = 0.08;
            this.scale = 1;
        } else if(itemId == "escape"){
            this.image = "res/warp_320.png";
            this.itemWidth = 320;
            this.itemHeight = 240;
            this.widthCount = 2;
            this.heightCount = 13;
            this.effectInterval = 0.08;
            this.scale = 2;
        }
        this.initializeWalkAnimation();
        this.effectTime = 0;
    },

    init: function() {},

    update: function() {
        this.effectTime++;
        if (this.effectTime >= 30 * 2) {
            this.effectTime = 0;
            return false;
        }
        return true;
    },

    initializeWalkAnimation: function() {
        var frameSeq = [];
        for (var i = 0; i < this.heightCount; i++) {
            for (var j = 0; j < this.widthCount; j++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.itemWidth * j, this.itemHeight * i, this.itemWidth, this.itemHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.effectInterval);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        //this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.itemWidth, this.itemHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setScale(this.scale,this.scale);
        this.addChild(this.sprite);
    },
});