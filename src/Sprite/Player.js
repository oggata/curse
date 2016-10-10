var Player = cc.Node.extend({
    imagePath: null,
    imageType: null,
    imgWidth: 0,
    imgHeight: 0,
    directionNum: 1,
    targetEnemy: null,
    isDamageOn: false,
    damageCnt: 0,
    isOwnKey: false,
    maxMp : 100,
    mp : 100,
    posNum : 0,
    comboCnt : 0,

    ctor: function(game, code) {
        this._super();
        this.game = game;
        this.initializeParam(code);
        this.initSprite();
        this.maxHp = this.game.storage.getMaxHp();
        this.maxMp = 100;
    },

    addMp : function(mpCnt){
        this.mp += mpCnt;
        if(this.mp >= this.maxMp)
        {
            this.mp = this.maxMp;
        }
        if(this.mp <= 0)
        {
            this.mp = 0;
        }
    },

    checkIsCritical:function(enemy,productId){
        if (enemy.weak.indexOf(productId) >= 0){
            return "weak";
        }
        if (enemy.block.indexOf(productId) >= 0){
            return "block";
        }
        return null;
    },

    getEffectType: function(productId){
        var _effectNum = 0;
        switch (productId) {
            case "status_attack":
                _effectNum = 3;
                break;
            case "status_magic_fire":
                _effectNum = 201;
                break;
            case "status_magic_light":
                _effectNum = 202;
                break;
            case "status_magic_water":
                _effectNum = 203;
                break;
        }
        return _effectNum;
    },

    getCriticalEffectType: function(productId){
        var _effectNum = 0;
        switch (productId) {
            case "status_attack":
                _effectNum = 101;
                break;
            case "status_magic_fire":
                _effectNum = 301;
                break;
            case "status_magic_light":
                _effectNum = 302;
                break;
            case "status_magic_water":
                _effectNum = 303;
                break;
        }
        return _effectNum;
    },

    attack: function(productId,isClitical,comboCnt) {
        //cc.log("attack");
        this.comboCnt = comboCnt;
        var _damage = this.game.storage.getEnemyDamage(this.targetEnemy.level,productId);
        var _effectNum = 0;
        if(isClitical == true){
            _effectNum = this.getCriticalEffectType(productId);
            _damage = _damage * 4;
        }else{
            _effectNum = this.getEffectType(productId);
        }
        if (this.targetEnemy != null && this.hp > 0) {
            var _hitOption = null;
            if(this.checkIsCritical(this.targetEnemy,productId) == "weak"){
                _damage = Math.floor(_damage * 1.7);
                _hitOption = "weak";
            }else if(this.checkIsCritical(this.targetEnemy,productId) == "block"){
                _damage = Math.floor(_damage / 10);
                _hitOption = "block";
            }
            this.targetEnemy.damage(_damage, _effectNum, _hitOption);
        }
    },

    initializeParam: function(code) {},

    update: function() {

        if(this.targetEnemy){
            if(this.targetEnemy.isDamageOn == true){
                if(this.comboCnt <= 1){
                    //this.game.comboSprite.setVisible(false);
                }else{
                    //this.game.comboSprite.setVisible(true);
                }
            }else{
                //this.game.comboSprite.setVisible(false);
            } 
        }else{
            //this.game.comboSprite.setVisible(false);
        }

        if (this.hp <= 0) {
            this.hp = 0;
        }
        if (this.hp >= this.maxHp) {
            this.hp = this.maxHp;
        }
        if (this.mp <= 0) {
            this.mp = 0;
        }
        if (this.mp >= this.maxMp) {
            this.mp = this.maxMp;
        }
        //ゲージの制御
        this.game.header.hpGauge.update(this.hp / this.maxHp);
        this.game.header.mpGauge.update(this.mp / this.maxMp);
        if (this.isDamageOn == true) {
            this.damageCnt++;
            if (this.damageCnt >= 30) {
                this.damageCnt = 0;
                this.isDamageOn = false;
            }
        }
        if (this.hp <= 0) {
            this.hp = 0;
            return false;
        }
        return true;
    },

    damage: function(damagePoint,damagetype) {
        playSE004(this.game.storage);

        //もし手持ちにguardカードがあった場合、そちらがダメージを受けて、無くなる
        if(this.game.battleConsole.isDefence() == true){
            return;
        }

        this.hp = this.hp - damagePoint;
        if (this.hp < 0) {
            this.hp = 0;
            return;
        }
        if(damagePoint > 0) {
            this.isDamageOn = true;
            if(damagetype == 1){
                this.game.addPlayerDamangedEffect();
            }else{
                this.game.addPlayerDamangedEffect2();
            }
            this.game.addDamageText2(damagePoint);
        } else {
            this.game.addDamageText2(null);
        }
    },

    initSprite: function() {},

    recover: function(point) {
        this.hp += point;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
    },

    spendActionCost: function() {
        //this.mp-=CONFIG.CARD_SPEND_COST;
        this.game.enemyExpendCost();
    },

    getMpRate:function(){
        return this.mp / this.maxMp;
    },

    walkFront: function() {
        //正面が壁の場合は進めない
        if (this.game.MAP_POSITIONS[this.game.tpos[7]] == 1) {
            this.game.enemyMove();
            return;
        }
        if (this.directionNum == 1) {
            this.posNum -= 30;
        };
        if (this.directionNum == 2) {
            this.posNum += 1;
        };
        if (this.directionNum == 3) {
            this.posNum += 30;
        };
        if (this.directionNum == 4) {
            this.posNum -= 1;
        };
        //playerが動いてからenemyが動く
        this.game.enemyMove();

        //アイテムを取得する
        for (var i = 0; i < this.game.items.length; i++) {
            //this.blockedPositions.push(this.items[i].posNum);
            if(this.posNum == this.game.items[i].posNum){
                this.game.items[i].attached();
            }
        }
    },
});