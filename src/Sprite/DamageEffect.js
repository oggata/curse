//
//  DamageText.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//
var DamageEffect = cc.Node.extend({
    ctor: function(enemy, effectId, damageText, who, hitOption) {
        this._super();
        this.enemy = enemy;
        this.effectTime = 0;
        this.effectImage = res.BattleEffect001;
        this.imageXCnt = 9;
        this.imageYCnt = 0;
        this.imageWidth = 120;
        this.imageHeight = 120;
        this.damageText = damageText;
        this.imgScale = 1;
        this.hitOption = hitOption;
        this.who = who;
        this.effectId = effectId;
        switch (effectId) {
            case 1:
                //縦に切る
                this.effectImage = "res/pipo-btleffect131.png";
                this.imageXCnt = 3;
                this.imageYCnt = 3;
                this.imageWidth = 640;
                this.imageHeight = 480;
                this.imgScale = 1;
                break;
            case 2:
                //横に切る
                this.effectImage = "res/pipo-btleffect132.png";
                this.imageXCnt = 3;
                this.imageYCnt = 3;
                this.imageWidth = 640;
                this.imageHeight = 480;
                this.imgScale = 1;
                break;
            case 3:
                //斜めに切る
                this.effectImage = "res/pipo-btleffect133.png";
                this.imageXCnt = 3;
                this.imageYCnt = 3;
                this.imageWidth = 640;
                this.imageHeight = 480;
                this.imgScale = 1;
                break;
            case 101:
                //切るの必殺
                this.effectImage = "res/pipo-btleffect145.png";
                this.imageXCnt = 1;
                this.imageYCnt = 10;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 4;
                break;
            case 102:
                //切るの必殺
                this.effectImage = "res/pipo-btleffect145.png";
                this.imageXCnt = 1;
                this.imageYCnt = 10;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 4;
                break;
            case 103:
                //切るの必殺
                this.effectImage = "res/pipo-btleffect145.png";
                this.imageXCnt = 1;
                this.imageYCnt = 10;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 4;
                break;
            case 201:
                //爆発
                this.effectImage = "res/pipo-btleffect036.png";
                this.imageXCnt = 7;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 2;
                break;
            case 202:
                //電気
                this.effectImage = "res/pipo-btleffect040.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 2;
                break;
            case 203:
                //氷
                this.effectImage = "res/pipo-btleffect042.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3.5;
                break;
            case 301:
                //爆発(必殺)
                this.effectImage = "res/pipo-btleffect023.png";
                this.imageXCnt = 1;
                this.imageYCnt = 9;
                this.imageWidth = 320;
                this.imageHeight = 120;
                this.imgScale = 5;
                break;
            case 302:
                //電気(必殺)
                this.effectImage = "res/pipo-btleffect033.png";
                this.imageXCnt = 1;
                this.imageYCnt = 5;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 303:
                //氷(必殺)
                this.effectImage = "res/pipo-btleffect035.png";
                this.imageXCnt = 1;
                this.imageYCnt = 9;
                this.imageWidth = 320;
                this.imageHeight = 120;
                this.imgScale = 5;
                break;
            case 99:
                //ガード
                this.effectImage = "res/gard.png";
                this.imageXCnt = 1;
                this.imageYCnt = 1;
                this.imageWidth = 320;
                this.imageHeight = 320;
                this.imgScale = 1.5; 
                break;
        }

        //バトルエフェクト
        var frameSeqEffect2 = [];
        for (var y = 0; y < this.imageYCnt; y++) {
            for (var x = 0; x < this.imageXCnt; x++) {
                var frame = cc.SpriteFrame.create(this.effectImage, cc.rect(this.imageWidth * x, this.imageHeight * y, this.imageWidth, this.imageHeight));
                frameSeqEffect2.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeqEffect2, 0.1);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.attackAnimation = cc.Sprite.create(this.effectImage, cc.rect(0, 0, this.imageWidth, this.imageHeight));
        this.attackAnimation.runAction(this.ra);
        this.addChild(this.attackAnimation);
        this.attackAnimation.setScale(this.imgScale,this.imgScale);
        this.attackAnimation.setOpacity(255*0.9);
        this.effectTime = 0;
        this.testTime = 0;
    },

    update: function() {
        this.effectTime++;
        if (this.effectTime == 20 && this.effectId != 99) {
            this.enemy.game.addDamageText(this.damageText,this.who, this.hitOption);
            this.enemy.hp = this.enemy.hp - this.damageText;
            if (this.enemy.hp < 0) {
                this.enemy.hp = 0;
            }
        }
        if (this.effectTime <= 30*1) {
            return true;
        }
        return false;
    },
});