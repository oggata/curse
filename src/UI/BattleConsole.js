var battleCard = cc.Node.extend({
    ctor: function(game, battleConsole, _productId) {
        this._super();
        this.game = game;

        this.battleConsole = battleConsole;

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

        this.card = new cc.MenuItemImage(
            this.image,
            this.image,
            function() {
                if (this.game.isSetMenuWindow()) return;
                if (this.game.player.hp <= 0) return;
                if (this.game.player.targetEnemy.hp <= 0) return;
                if (this.battleConsole.rCount < 60) return;
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
                this.game.player.mp-=CONFIG.CARD_SPEND_COST;
            },
            this);

        var menu = new cc.Menu(this.card);
        menu.x = 0;
        menu.y = 250;
        this.addChild(menu, 1);

        this.rightGauge = new Gauge2(170, 170, 'black');
        this.rightGauge.setAnchorPoint(0, 0);
        this.rightGauge.setOpacity(255 * 0.5);
        this.rightGauge.setPosition(0, 0);
        this.card.addChild(this.rightGauge, 999);
        this.cardScale = 1;
        this.cardOpacity = 1;
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
            this.rightGauge.update(this.battleConsole.rCount / 60);
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
                if (this.productId == "status_attack") {
                    this.game.player.attack(this.productId,this.isCritical,this.battleConsole.formerProductCnt);
                    this.game.rightHandAttack();
                }
                if (this.productId == "status_magic_fire") {
                    this.game.player.attack(this.productId ,this.isCritical,this.battleConsole.formerProductCnt);
                    this.game.leftHandAttack();
                }
                if (this.productId == "status_magic_light") {
                    this.game.player.attack(this.productId ,this.isCritical,this.battleConsole.formerProductCnt);
                    this.game.leftHandAttack();
                }
                if (this.productId == "status_magic_snow") {
                    this.game.player.attack(this.productId ,this.isCritical,this.battleConsole.formerProductCnt);
                    this.game.leftHandAttack();
                }
                if (this.productId == "status_killed") {
                    var _damage = Math.floor(this.game.player.maxHp / 6);
                    if(this.isCritical == true){
                        _damage = _damage * 5;
                    }
                    if(_damage > this.game.player.hp){
                        _damage = this.game.player.hp - 10;
                    }
                    this.game.player.damage(_damage,2);
                }
                if (this.productId == "status_recover") {
                    var _recover = this.game.player.maxHp / 6;
                    if(this.isCritical == true){
                        _recover = _recover * 5;
                    }
                    this.game.player.hp += _recover;
                }
                if (this.productId == "status_miss") {

                }
                if (this.productId == "status_reset") {
                    this.battleConsole.allUse();
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
        var _product_id = "";
        var _cards = [];
        for (var i = 0; i < _items.length; i++) {
            if(_items[i]['skill_num'] != null){
                var _rand = getRandNumberFromRange(1,5);
                // 1/5の確率で回復/死亡
                if(_items[i]['product_id'] == 'status_killed' && _rand == 1){
                    _cards.push(_items[i]);
                }
                var _rand2 = getRandNumberFromRange(1,5);
                if(_items[i]['product_id'] == 'status_recover' && _rand2 == 1){
                    _cards.push(_items[i]);
                }
                // 1/6でリセットカード
                var _rand3 = getRandNumberFromRange(1, 6);
                if(_items[i]['product_id'] == 'status_reset' && _rand3 == 1){
                    _cards.push(_items[i]);
                }

                var _rand4 = getRandNumberFromRange(1, 3);
                if(_items[i]['product_id'] == 'status_miss' && _rand3 == 1){
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

        //var mpRate = this.game.player.getMpRate();
/*
        //スタミナの残り量によってkilledが発生しない
        if(mpRate >= 0.5){
            if(_cards[0]['product_id'] == "status_killed"){
                return "status_attack";
            }
        }
*/
        //スタミナの残り量によって3つ揃うように
//        if(mpRate >= 0.5){
            //var maxRandNum = Math.floor(10 - mpRate * 10) + 1;
            var _rand = getRandNumberFromRange(1, 5);
            var _productId = null;
            if(_rand == 1){
                if(this.cards.length >= 2){
                    if(this.cards[0].product_id == this.cards[1].product_id){
                        _productId = this.cards[0].product_id;
                        return _productId;
                    }
                }
            }
//        }

        return _cards[0]['product_id'];
    },

    allUse: function() {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].useCnt = 1;
            this.rCount = 0;
        }
    },

    update: function() {
        var hash = {};
        this.isCritical = false;
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

        this.rCount += 1;
        if (this.rCount >= 60) {
            this.rCount = 60;
        }
    },
});