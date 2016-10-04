var Friend = cc.Node.extend({
    ctor: function(game, friendNum) {
        this._super();
        this.game = game;
        this.friendNum = friendNum;

        this.maxHp = this.game.storage.getMaxHp();
        this.maxMp = this.maxHp;
        this.hp = this.maxHp;
        this.mp = this.maxMp;

        this.image = "res/icon_friend2.png";
        if(friendNum == 2){
            this.image = "res/icon_friend1.png";
        }
        this.friend = cc.Sprite.create(this.image);
        this.friend.retain();
        this.friend.setAnchorPoint(0, 0);
        this.addChild(this.friend);

        this.attackSprite = cc.Sprite.create("res/icon_attack.png");
        this.attackSprite.retain();
        this.attackSprite.setAnchorPoint(0, 0);
        this.addChild(this.attackSprite);
        this.attackSprite.setVisible(false);
        this.attackIconVisibleCnt = 0;

        //ゲージの生成
        this.hpGauge = new Gauge(80, 15, 'white');
        this.hpGauge.setAnchorPoint(0, 0);
        this.hpGauge.setPosition(0, -15);
        this.addChild(this.hpGauge);

        this._isDamageOn = false;
        this._damageCnt = 0;

        this.tmpX = 640;
        this.tmpY = 20;
        this.setPosition(this.tmpX, this.tmpY);

        this.attackWaitTime = 0;
    },

    damage: function(damagePoint) {
        //this._isDamageOn = true;
        playSE004(this.game.storage);
        this.hp = this.hp - damagePoint;
        if (this.hp < 0) {
            this.hp = 0;
            return;
        }

        if (damagePoint > 0) {
            this._isDamageOn = true;
        } else {
            if(this.game.targetEnemy != null){
                this.game.addDamageText2(null,this.game.targetEnemy.name);
            }
        }
    },

    _damageWindowEffect: function() {
        //プレイヤーのダメージがONになっている場合は画面を揺らす
        if (this._isDamageOn == true) {
            this.windowPosY += 5;
            if (this.tmpY >= 30) {
                this.tmpY = 20;
            }
            this.setPosition(
                this.tmpX, this.tmpY
            );
        }
    },

    attack: function() {
        playSE001(this.game.storage);
        cc.log("friend attack");
        if (this.game.player.targetEnemy != null && this.hp > 0) {
            var _damage = this.game.storage.getEnemyDamage(this.game.player.targetEnemy.level) / 2;
            this.game.player.targetEnemy.damageByFriend(_damage, 1);
        }
    },

    update: function() {

        this._damageWindowEffect();

        if (this.attackSprite.isVisible() == true) {
            this.attackIconVisibleCnt++;
            if (this.attackIconVisibleCnt >= 30) {
                this.attackIconVisibleCnt = 0;
                this.attackSprite.setVisible(false);
            }
        }

        this.attackWaitTime++;
        if (this.game.player.targetEnemy != null) {
            if (this.attackWaitTime >= 30 * 5 && this.game.player.hp > 0 && this.game.player.targetEnemy.hp > 0) {
                this.attackWaitTime = 0;
                this.attack();
            }
        }

        this.hpGauge.update(this.hp / this.maxHp);

        if (this._isDamageOn == true) {
            this._damageCnt++;
            if (this._damageCnt >= 30 * 2) {
                this._damageCnt = 0;
                this._isDamageOn = false;
            }
        }

        this.tmpX -= 5;
        if (this.tmpX <= 350 + this.friendNum * 90) {
            this.tmpX = 350 + this.friendNum * 90;
        }
        this.setPosition(this.tmpX, this.tmpY);

        if (this.game.player.targetEnemy == null) {
            return false;
        }
        if (this.hp > 0) {
            return true;
        }
        return false;
    },
});