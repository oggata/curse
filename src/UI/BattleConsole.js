var battleCard = cc.Node.extend({
    ctor: function(game, battleConsole, _productId) {
        this._super();
        this.game = game;
        this.battleConsole = battleConsole;

        this.isStrongMode = false;

        var _items = CONFIG.ITEMS;
        this.productId = _productId;
        var _image = "res/card001.png";
        for (var i = 0; i < _items.length; i++) {
            if(_items[i]['product_id'] == _productId){
                this.productId = _items[i]['product_id'];
                _image = _items[i]['image'];
            }
        }
        this.image = _image;
        this.useCnt = 0;
        this.posNum = 0;
        this.tmpPosX = 0;
        this.tmpPosY = 0;
        this.posY = -100;
        this.isMain = false;
        this.isCritical = false;

        this.card = new ccui.Button(this.image, this.image);
        this.card.addTouchEventListener(this.touchEvent, this);
        this.card.setPosition(0,250);
        this.addChild(this.card);

        this.waitGauge = new Gauge2(162, 213, 'black');
        this.waitGauge.setAnchorPoint(0, 0);
        this.waitGauge.setOpacity(255 * 0.5);
        this.waitGauge.setPosition(0, 0);
        this.card.addChild(this.waitGauge, 999);
        this.cardScale = 1;
        this.cardOpacity = 1;

        this.damageSprite = cc.Sprite.create("res/card_damage.png");
        this.damageSprite.retain();
        this.damageSprite.setAnchorPoint(0, 0);
        this.card.addChild(this.damageSprite);
        this.damageSprite.setVisible(false);

        //バトルエフェクト
        this.imageWidth = 170;
        this.imageHeight = 1440/6;
        this.imageXCnt = 1;
        this.imageYCnt = 6;
        var frameSeqEffect2 = [];
        for (var y = 0; y < this.imageYCnt; y++) {
            for (var x = 0; x < this.imageXCnt; x++) {
                var frame = cc.SpriteFrame.create("res/card_animation.png", cc.rect(this.imageWidth * x, this.imageHeight * y, this.imageWidth, this.imageHeight));
                frameSeqEffect2.push(frame);
            }
        }
        /*
        this.wa = cc.Animation.create(frameSeqEffect2, 0.1);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.attackAnimation = cc.Sprite.create("res/card_animation.png", cc.rect(0, 0, this.imageWidth, this.imageHeight));
        this.attackAnimation.runAction(this.ra);
        this.attackAnimation.setAnchorPoint(0,0);
        this.card.addChild(this.attackAnimation);
        //this.attackAnimation.setScale(this.imgScale,this.imgScale);
        //this.attackAnimation.setOpacity(255*0.9);
        //this.effectTime = 0;
        //this.testTime = 0;
        */
    },

    touchEvent: function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                cc.log("Touch Down");
                break;
 
            case ccui.Widget.TOUCH_MOVED:
                cc.log("Touch Move");
                break;
 
            case ccui.Widget.TOUCH_ENDED:
                if (this.game.isSetMenuWindow()) return;
                if (this.game.player.hp <= 0) return;
                if (this.game.player.targetEnemy.hp <= 0) return;
                if (this.battleConsole.rCount < 60) return;

                if(this.battleConsole.isMaxSpCnt >= 1){
                    this.battleConsole.isMaxSpCnt -= 1;
                    var _rand = getRandNumberFromRange(1,5);
                    if(_rand == 1){
                        this.battleConsole.maxSpProductId = "status_attack";
                    }else if(_rand == 2){
                        this.battleConsole.maxSpProductId = "status_magic_fire";
                    }else if(_rand == 3){
                        this.battleConsole.maxSpProductId = "status_magic_light";
                    }else if(_rand == 4){
                        this.battleConsole.maxSpProductId = "status_magic_snow";
                    }else{
                        this.battleConsole.maxSpProductId = "status_attack";
                    }
                }

                if(this.battleConsole.isCritical == true){
                    this.battleConsole.allUse();
                    this.isCritical = true;
                    this.battleConsole.formerProductId = null;
                    this.battleConsole.formerProductCnt = 0;
                }else{
                    if(this.battleConsole.formerProductId == this.productId){
                        this.battleConsole.formerProductCnt += 1;
                    }else{
                        this.battleConsole.formerProductId = this.productId;
                        this.battleConsole.formerProductCnt = 1;
                    }
                }
                this.useCnt = 1;
                this.isMain = true;
                this.battleConsole.rCount = 0;
                this.game.player.mp+=CONFIG.CARD_SPEND_COST;
                break;
 
            case ccui.Widget.TOUCH_CANCELED:
                cc.log("Touch Cancelled");
                break;
 
            default:
                break;
        }
    },

    setCardPos: function(posNum) {
        this.posNum = posNum;
        this.setPosition(175 * posNum + 150, -100);
        this.tmpPosX = 175 * posNum + 150;
        this.tmpPosY = 50;
    },

    update: function() {

        if (this.posY <= this.tmpPosY && this.useCnt == 0) {
            this.posY = this.posY + 8;
            this.setPosition(this.tmpPosX, this.posY);
        }

        if(this.useCnt == 0){
            this.waitGauge.update(this.battleConsole.rCount / 60);
        }

        if (this.useCnt >= 1) {
            this.useCnt++;
        }

        if (this.useCnt >= 1 && this.useCnt <= 10) {
            this.cardScale += 0.05;
            this.setPosition(this.tmpPosX, this.getPosition().y + 1);
            this.setScale(this.cardScale, this.cardScale);
        }

        if (this.useCnt >= 20 && this.useCnt <= 30) {
            this.cardOpacity -= 0.1;
            this.card.setOpacity(255 * this.cardOpacity);
            this.cardScale += 0.05;
            this.setScale(this.cardScale, this.cardScale);
        }

        if (this.useCnt >= 30) {
            if (this.game.player.targetEnemy != null && this.isMain == true) {
                switch (this.productId){
                    case "status_attack":
                        this.game.player.attack(this.productId,this.isCritical,this.battleConsole.formerProductCnt);
                        this.game.rightHandAttack();
                        break;
                    case "status_magic_fire":
                        this.game.player.attack(this.productId ,this.isCritical,this.battleConsole.formerProductCnt);
                        this.game.leftHandAttack();
                        break;
                    case "status_magic_light":
                        this.game.player.attack(this.productId ,this.isCritical,this.battleConsole.formerProductCnt);
                        this.game.leftHandAttack();
                        break;
                    case "status_magic_snow":
                        this.game.player.attack(this.productId ,this.isCritical,this.battleConsole.formerProductCnt);
                        this.game.leftHandAttack();
                        break;
                    case "status_killed":
                        var _damage = Math.floor(this.game.player.maxHp / 6);
                        if(this.isCritical == true){
                            _damage = _damage * 5;
                        }
                        if(_damage > this.game.player.hp){
                            _damage = this.game.player.hp - 10;
                        }
                        this.game.player.damage(_damage,2);
                        break;
                    case "status_recover":
                        var _recover = this.game.player.maxHp / 6;
                        if(this.isCritical == true){
                            _recover = _recover * 5;
                        }
                        this.game.player.hp += _recover;
                        break;
                    case "status_miss":
                        break;
                    case "status_guard":
                        break;
                    case "status_reset":
                        this.battleConsole.allUse();
                        break;
                    case "status_sp":
                        this.game.player.mp = 0;
                        this.battleConsole.isMaxSpCnt = 5;
                        this.battleConsole.allUse();
                        break;
                }
            }
            return false;
        }
        return true;
    }
});

var battleConsole = cc.Node.extend({

    ctor: function(game) {
        this._super();
        this.game = game;

        this.isCritical = false;
        this.cards = [];
        this.rCount = 60;

        this.formerProductId = null;
        this.formerProductCnt = 0;

        this.isMaxSpCnt = 0;
        this.maxSpProductId = "status_attack";

        for (var j = 0; j < 3; j++) {
            var _nextCardProductId = this.getNextCardProductId();
            var _card = new battleCard(this.game, this, _nextCardProductId);
            _card.setCardPos(j);
            this.cards.push(_card);
            this.addChild(_card);
        }
    },

    getNextCardProductId : function(){
        //まずはランダムに決める
        var _items = CONFIG.ITEMS;
        var _cards = [];
        for (var i = 0; i < _items.length; i++) {
            if(_items[i]['type'] == "battle"){
                var _rand = getRandNumberFromRange(1,5);
                // 1/5の死亡
                if(_items[i]['product_id'] == 'status_killed' && _rand == 1){
                    _cards.push(_items[i]);
                }
                // 1/5で回復
                var _rand2 = getRandNumberFromRange(1,5);
                if(_items[i]['product_id'] == 'status_recover' && _rand2 == 1){
                    _cards.push(_items[i]);
                }
                // 1/6でリセットカード
                var _rand3 = getRandNumberFromRange(1, 6);
                var _isSet3 = this.isSetToDeck('status_reset');
                if(_items[i]['product_id'] == 'status_reset' && _rand3 == 1 && _isSet3 == false){
                    _cards.push(_items[i]);
                }
                // 1/3でミスカード
                var _rand4 = getRandNumberFromRange(1, 3);
                if(_items[i]['product_id'] == 'status_miss' && _rand3 == 1){
                    _cards.push(_items[i]);
                }
                // 1/3で防御カード
                var _rand5 = getRandNumberFromRange(1, 3);
                var _isSet5 = this.isSetToDeck('status_guard');
                if(_items[i]['product_id'] == 'status_guard' && _rand5 == 1 && _isSet5 == false){
                    _cards.push(_items[i]);
                }

                if(_items[i]['product_id'] == 'status_hp'){
                    _cards.push(_items[i]);
                }
                if(_items[i]['product_id'] == 'status_attack'){
                    _cards.push(_items[i]);
                }
                if(_items[i]['product_id'] == 'status_magic_fire'){
                    _cards.push(_items[i]);
                }
                if(_items[i]['product_id'] == 'status_magic_light'){
                    _cards.push(_items[i]);
                }
                if(_items[i]['product_id'] == 'status_magic_snow'){
                    _cards.push(_items[i]);
                }
            }
        }
        for (var s = 0; s < 15; s++) {
            _cards.sort(this.game.shuffle);
        }

        //skill発動中の場合は、これを返す
        if(this.isMaxSpCnt >= 1){
            return this.maxSpProductId;
        }

        //mpがたまっていたらspのカードを返す && 今出ていない場合のみ
        var _rand6 = getRandNumberFromRange(1, 5);
        var _isSet6 = this.isSetToDeck('status_sp');
        if(this.game.player.mp == this.game.player.maxMp && _rand6 == 1 && _isSet6 == false){
            return "status_sp";
        }

        // 20%の確率で2枚揃っていたら3枚目も揃う
        var _rand = getRandNumberFromRange(1, 5);
        var _productId = null;
        if(_rand == 1){
            if(this.cards.length >= 2){
                if(this.cards[0].productId == this.cards[1].productId){
                    _productId = this.cards[0].productId;
                    return _productId;
                }
            }
        }

        return _cards[0]['product_id'];
    },

    allUse: function() {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].useCnt = 1;
            this.rCount = 60;
            this.cards[i].waitGauge.update(1);
        }
    },

    isSetToDeck:function(productId) {
        for (var i = 0; i < this.cards.length; i++) {
            if(this.cards[i].productId ==  productId){
                return true;
            }
        }
        return false;
    },

    isDefence:function(){
        for (var i = 0; i < this.cards.length; i++) {
            cc.log(this.cards[i].productId);
            if(this.cards[i].productId == "status_guard"){
                this.cards[i].useCnt = 1;
                //this.rCount = 60;
                this.cards[i].waitGauge.update(1);
                this.cards[i].damageSprite.setVisible(true);
                return true;
            }
        }
        return false;
    },

    update: function() {
        var hash = {};
        this.isCritical = false;

        if(this.isMaxSpCnt >= 1){
            this.game.criticalSprite.setVisible(true);
            //this.game.spLabel.setString("SPx" + this.isMaxSpCnt + "");
        }else{
            //this.game.spLabel.setString("");
            this.game.criticalSprite.setVisible(false);
        }

        for (var i = 0; i < this.cards.length; i++) {
            if(this.cards[i].isMain == true){
                this.reorderChild(this.cards[i],999);
            }
            var _product_id = this.cards[i].productId;
            if (_product_id in hash) {
                hash[_product_id] += 1;
            }else{
                hash[_product_id] = 1;
            }

            if (this.cards[i].update() == false) {
                var _tmpPosNum = this.cards[i].posNum;
                this.removeChild(this.cards[i]);
                this.cards.splice(i, 1);

                var _nextCardProductId = this.getNextCardProductId();
                var _card = new battleCard(this.game, this, _nextCardProductId);
                _card.setCardPos(_tmpPosNum);
                this.cards.push(_card);
                this.addChild(_card);
            }
        }
        //3つそろった場合はcritical
        for (var key in hash) {
            if(hash[key] == 3){
                this.isCritical = true;
            }
        }

        if(this.rCount == 30){
            cc.log(hash);
        }

        this.rCount += 1;
        if (this.rCount >= 60) {
            this.rCount = 60;
        }
    },
});