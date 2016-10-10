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
        this.game = this.enemy.game;
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
                playSE001(this.game.storage);
                //縦に切る
                this.effectImage = "res/pipo-btleffect131.png";
                this.imageXCnt = 3;
                this.imageYCnt = 3;
                this.imageWidth = 640;
                this.imageHeight = 480;
                this.imgScale = 1;
                break;
            case 2:
                playSE001(this.game.storage);
                //横に切る
                this.effectImage = "res/pipo-btleffect132.png";
                this.imageXCnt = 3;
                this.imageYCnt = 3;
                this.imageWidth = 640;
                this.imageHeight = 480;
                this.imgScale = 1;
                break;
            case 3:
                playSE001(this.game.storage);
                //斜めに切る
                this.effectImage = "res/pipo-btleffect133.png";
                this.imageXCnt = 3;
                this.imageYCnt = 3;
                this.imageWidth = 640;
                this.imageHeight = 480;
                this.imgScale = 1;
                break;
            case 101:
                playSE001(this.game.storage);
                //切るの必殺
                this.effectImage = "res/pipo-btleffect145.png";
                this.imageXCnt = 1;
                this.imageYCnt = 10;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 4;
                break;
            case 102:
                playSE001(this.game.storage);
                //切るの必殺
                this.effectImage = "res/pipo-btleffect145.png";
                this.imageXCnt = 1;
                this.imageYCnt = 10;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 4;
                break;
            case 103:
                playSE001(this.game.storage);
                //切るの必殺
                this.effectImage = "res/pipo-btleffect145.png";
                this.imageXCnt = 1;
                this.imageYCnt = 10;
                this.imageWidth = 320;
                this.imageHeight = 240;
                this.imgScale = 4;
                break;
            case 201:
                playSE007(this.game.storage);
                //爆発
                this.effectImage = "res/pipo-btleffect024.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 202:
                //電気
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect027.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 203:
                //水
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect025.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 204:
                //風
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect026.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 205:
                //氷
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect029.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 301:
                //爆発(必殺)
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect037.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 302:
                //電気(必殺)
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect040.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 303:
                //水(必殺)
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect038.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 304:
                //風(必殺)
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect039.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
                break;
            case 305:
                //氷(必殺)
                playSE007(this.game.storage);
                this.effectImage = "res/pipo-btleffect042.png";
                this.imageXCnt = 8;
                this.imageYCnt = 1;
                this.imageWidth = 240;
                this.imageHeight = 240;
                this.imgScale = 3;
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