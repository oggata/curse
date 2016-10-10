var Item = cc.Node.extend({
    ctor: function(game, itemId, posNum) {
        this._super();
        this.game = game;
        this.stageNum = this.game._stageNum;
        this.itemId = itemId;
        this.posNum = posNum;
        if (itemId == "recover") {
            this.effectImage = "res/pipo-crystal02a.png";
            this.imageXCnt = 5;
            this.imageYCnt = 5;
            this.imageWidth = 500;
            this.imageHeight = 500;
            this.scaleRate = 0.7;
        }
        if (itemId == "magic") {
            this.effectImage = "res/pipo-crystal01a.png";
            this.imageXCnt = 5;
            this.imageYCnt = 5;
            this.imageWidth = 500;
            this.imageHeight = 500;
            this.scaleRate = 0.7;
        }
        if (itemId == "soul") {
            this.effectImage = "res/pipo-nazoobj03a.png";
            this.imageXCnt = 5;
            this.imageYCnt = 6;
            this.imageWidth = 192;
            this.imageHeight = 192;
            this.scaleRate = 2;
        }
        if (itemId == "player_soul") {
            this.effectImage = "res/pipo-nazoobj03b.png";
            this.imageXCnt = 5;
            this.imageYCnt = 6;
            this.imageWidth = 192;
            this.imageHeight = 192;
            this.scaleRate = 2;
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
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.itemSprite = cc.Sprite.create(this.effectImage, cc.rect(0, 0, this.imageWidth, this.imageHeight));
        this.itemSprite.runAction(this.ra);
        this.itemSprite.setScale(this.scaleRate,this.scaleRate);
        this.addChild(this.itemSprite);
        this.returnType = true;
    },

    setVisible: function(isVisible) {
        this.itemSprite.setVisible(isVisible);
    },

    update: function() {
        if (this.game.mapDisplayNode.c3 == 1) {
            //目の前に壁
            this.itemSprite.setVisible(false);
        } else if (this.game.tpos[4] == this.posNum) {
            //距離2
            this.game.windowObjectDisplayNode.reorderChild(
                    this,
                    1
            );

            this.itemSprite.setVisible(true);
            this.setScale(0.8, 0.8);
        } else if (this.game.tpos[7] == this.posNum) {
            //距離1
            this.game.windowObjectDisplayNode.reorderChild(
                    this,
                    999
            );
            this.itemSprite.setVisible(true);
            this.setScale(1.5, 1.5);
        } else {
            this.itemSprite.setVisible(false);
        }

        return this.returnType;
    },

    attached: function() {
        if (this.game.tpos[7] == this.posNum) {
            playSE006(this.game.storage);

            if (this.itemId == "recover") {
                this.game.cutIn.setCutInText("「体力」が " + Math.ceil(this.game.player.maxHp / 4) + " 回復した");
                this.game.player.hp += Math.ceil(this.game.player.maxHp / 4);
                this.game.addPlayerRecoverEffect("recover_hp");
            } else if (this.itemId == "magic") {
                this.game.cutIn.setCutInText("「SP(SkillPoint)」が " + Math.ceil(this.game.player.maxMp / 4) + " 回復した");
                this.game.player.mp += Math.ceil(this.game.player.maxMp / 4);
                this.game.addPlayerRecoverEffect("recover_mp");
            } else if (this.itemId == "soul") {
                var _addSoulsAmount = Math.ceil(this.game.storage.getSoulAmountByLevel(this.stageNum));
                this.game.cutIn.setCutInText("「魂」を " + _addSoulsAmount + " 拾った");
                this.game.storage.addSouls(_addSoulsAmount/10);
                this.game.addPlayerRecoverEffect("got_soul");
            } else if (this.itemId == "player_soul") {
                this.game.cutIn.setCutInText("落とした「魂」を" + this.game.storage.droppedSoulsAmount + " 取り戻した.");
                this.game.storage.saveAndRecoverSoul();
                this.game.addPlayerRecoverEffect("got_my_soul");
            }
            this.returnType = false;
        }
    },
});