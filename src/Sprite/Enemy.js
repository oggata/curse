var Enemy = cc.Node.extend({

    ctor: function(game, enemyLevel, isBoss, posNum) {
        this._super();
        this.game = game;
        this.posNum = posNum;

        //initialize
        this.level = enemyLevel;
        this.isBoss = isBoss;
        this.initializeParam(enemyLevel);
        this.initSprite();
        this.flashCnt = 0;
        this.isDamageOn = false;
        this.damageCnt = 0;
        this.damageAmount = 0;
        this.deadTime = 0;
        this.attackCnt = 0;
        this.scaleRate = 1;
        //1action cost = 60frame = sec
        this.maxActionCost = this.game.storage.getEnemyActionCost(enemyLevel) * 30 * 3.3;
        this.actionCost = this.maxActionCost;
        this.tmpY = this.sprite.getPosition().y;
        this.moveDirection = "up";
        this.mode = "monster";

        this.scaleCnt = 0;
        this.scaleRate = 1;
        /*
        if(isBoss == 0)
        {
            var _rand = getRandNumberFromRange(1,10);
            if(_rand == 5){
                this.mode = "human";
            }
        }
        */
        this.humanCnt = 0;
        this.setVisible(false);
    },

    initializeParam: function(enemyLevel) {
        //レベルからマスタを取得
        var enemyData = CONFIG.ENEMY[enemyLevel];
        if (this.isBoss == 1) {
            var _bossArrayNum = Math.ceil(this.game._stageNum / 5);
            //cc.log("boss:" + _bossArrayNum);
            enemyData = CONFIG.BOSS[_bossArrayNum];
            this.hp = this.game.storage.getBossHpAmountByLevel(enemyLevel);
            this.maxHp = this.game.storage.getBossHpAmountByLevel(enemyLevel);
            this.coinAmount = Math.ceil(this.game.storage.getBossRewordAmountByLebel(enemyLevel));
        } else {
            this.hp = this.game.storage.getHpAmountByLevel(enemyLevel);
            this.maxHp = this.game.storage.getHpAmountByLevel(enemyLevel);
            this.coinAmount = Math.ceil(this.game.storage.getRewordAmountByLebel(enemyLevel));
        }
        this.id = enemyData["id"];
        this.name = enemyData["name"];
        this.imagePath = enemyData["image"];
        this.weak = enemyData["weak"];
        this.block = enemyData["strong"];
        this.eyeSight = 5;
        this.isCharaVisible = false;
        this.testTime = 0;
    },

    addFlashCnt: function() {
        this.flashCnt++;
        if (this.flashCnt >= 5) {
            this.flashCnt = 0;
            if (this.isCharaVisible) {
                this.isCharaVisible = false;
                this.sprite.setOpacity(255 * 0.2);
            } else {
                this.isCharaVisible = true;
                this.sprite.setOpacity(255 * 1);
            }
        }
    },

    setVisible: function(isVisible) {
        if (isVisible == true) {
            if (this.mode == "human") {
                this.humanSprite.setVisible(isVisible);
                this.sprite.setVisible(false);
            } else {
                this.humanSprite.setVisible(false);
                this.sprite.setVisible(isVisible);
            }
        } else {
            this.humanSprite.setVisible(false);
            this.sprite.setVisible(false);
        }
    },

    getMovePositionFromMaps: function() {
        this.positions = [];
        for (var i = 1; i < this.game.MAP_POSITIONS.length; i++) {
            //mapPositon x E.position = 1のものだけ
            var _dist = this.getDistanceBetweenTwoPositions(this.posNum, i);
            if (_dist <= 1) {
                //mapPosition x P.position の dist
                var _dist2 = this.getDistanceBetweenTwoPositions(this.game.player.posNum, i);
                var obj = {
                    distance: _dist2,
                    mapId: i
                };
                this.positions.push(obj);
            }
        }

        var sortedData = this.object_array_sort(this.positions, 'distance', 'asc');
        for (var j = 0; j < sortedData.length; j++) {
            if (this.game.checkBlockedPositionByEnemy(sortedData[j]['mapId'], this) == false) {
                return sortedData[j]['mapId']
            };
        }

        return null;
    },

    object_array_sort: function(data, key, order) {
        //デフォは降順(DESC)
        var num_a = -1;
        var num_b = 1;

        if (order === 'asc') { //指定があれば昇順(ASC)
            num_a = 1;
            num_b = -1;
        }

        data = data.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            if (x > y) return num_a;
            if (x < y) return num_b;
            return 0;
        });

        //fn(data); // ソート後の配列を返す
        return data;
    },

    getDistanceBetweenTwoPositions: function(posNum1, posNum2) {
        if (posNum1 == posNum2) {
            return 0;
        }
        var posData1 = this.game.getColAndRow2(posNum1);
        var posData2 = this.game.getColAndRow2(posNum2);
        var _w = posData1[0] - posData2[0];
        var _h = posData1[1] - posData2[1];
        var _dist = Math.sqrt(_w * _w) + Math.sqrt(_h * _h);
        return _dist;
    },

    move: function() {
        if (this.getDistanceBetweenTwoPositions(this.game.player.posNum, this.posNum) >= 4) {
            return;
        }
        var nextPos = this.getMovePositionFromMaps();
        if (this.game.checkBlockedPositions(nextPos) == true) {
            return;
        }
        if (nextPos != null) {
            this.posNum = nextPos;
        }
        var Pos = this.game.getColAndRow(this.posNum);
    },

    expendActionCostByPlayerWalking: function() {
        if (this.mode == "human") return;
        this.actionCost -= 60;
        if (this.actionCost <= 0) {
            this.actionCost = this.maxActionCost;
            this.attackToPlayer();
        }
    },

    expendActionCost: function() {
        if (this.mode == "human") return;
        this.actionCost -= 1;
        if (this.actionCost <= 0) {
            this.actionCost = this.maxActionCost;
            this.attackToPlayer();
        }
    },

    attackToPlayer: function() {
        this.scaleCnt=1;
        if (this.getDistanceBetweenTwoPositions(this.game.player.posNum, this.posNum) <= 1) {
            if (this.hp > 0) {
                if (this.isBoss == 1) {
                    var _damage = 0;
                    var _rand = getRandNumberFromRange(1, 2);
                    var _playerHpRate = this.game.player.hp / this.game.player.maxHp;
                    if (_playerHpRate <= 0.3) {
                        _rand = getRandNumberFromRange(1, 3);
                    }
                    if (_rand == 2) {
                        _damage = this.game.storage.getPlayerDamage(this.level);
                        this.game.player.damage(_damage,1);
                        this.attackCnt = 0;
                        this.game.windowScale = 1;
                        this.game.windowNode.setScale(1);
                    } else {
                        this.game.player.damage(0,1);
                    }
                } else {
                    var _rand = getRandNumberFromRange(1, 10);
                    if (_rand == 2) {
                        this.game.player.damage(0,1);
                    } else {
                        var _damage = this.game.storage.getPlayerDamage(this.level);
                        this.game.player.damage(_damage,1);
                        this.attackCnt = 0;
                        this.game.windowScale = 1;
                        this.game.windowNode.setScale(1);
                    }
                }
            }
        }
    },

    update: function() {

        if(this.scaleCnt >= 1){
            this.scaleCnt++;
            this.scaleRate += 0.1;
            if(this.scaleCnt >= 8){
                this.scaleCnt = 0;
                this.scaleRate = 1;
            }
        }
        this.sprite.setScale(this.scaleRate,this.scaleRate);




        //プレイヤーが生きていてかつ、対峙している時のみ、コストが増加する
        if (this.game.player.hp > 0 && this.game.player.targetEnemy == this) {
            this.expendActionCost();
        }
        /*
        if (this.humanCnt >= 1) {
            this.humanCnt++;
            if (this.humanCnt >= 30 * 2) {
                this.humanCnt = 0;
                this.mode = "monster";
                this.game.cutIn.setCutInText("少女:xxxxx\n");
            }
        }
        */

        //上下に揺れる
        if (this.moveDirection == "up") {
            this.sprite.setPosition(
                this.sprite.getPosition().x,
                this.sprite.getPosition().y + 0.5
            );
            if (this.sprite.getPosition().y > this.tmpY + 20) {
                this.moveDirection = "down";
            }
        } else {
            this.sprite.setPosition(
                this.sprite.getPosition().x,
                this.sprite.getPosition().y - 0.5
            );
            if (this.sprite.getPosition().y <= this.tmpY) {
                this.moveDirection = "up";
            }
        }

        //attack
        this.gauge.update(this.hp / this.maxHp);
        //wait
        this.waitGauge.update(1 - (this.actionCost / this.maxActionCost));

        //ダメージ制御
        if (this.isDamageOn == true) {
            this.addFlashCnt();
            this.damageCnt++;
            if (this.damageCnt >= 30 * 1) {
                this.damageCnt = 0;
                this.isDamageOn = false;
                this.sprite.setOpacity(255 * 1);
            }
        }

        //HPが0になったら死亡Cnt上がって行く
        if (this.hp <= 0) {
            this.deadTime++;
            if (this.deadTime == 1) {
                this.humanSprite.setVisible(false);
                this.sprite.setVisible(false);
                this.waitGauge.setVisible(false);
                this.gauge.setVisible(false);
            }
            if (this.deadTime > 30 * 2) {
                this.game.addEnemyKilledEffect();
                playSE005(this.game.storage);
                return false;
            }
        }
        return true;
    },

    damage: function(damagePoint, effectNum, hitOption) {
        if (this.hp <= 0) {
            return;
        }
        if (this.mode == "human") {
            this.humanCnt = 1;
        } else {
            this.isDamageOn = true;
            this.game.addDamageEffect(this, effectNum, damagePoint, hitOption);
        }
    },

    /*
    damageByFriend: function(damagePoint, effectNum) {
        if (this.hp <= 0) {
            return;
        }
        if (this.mode == "human") {
            this.humanCnt = 1;
        } else {
            this.isDamageOn = true;
            this.game.addDamageEffect(this, effectNum, damagePoint, 0);
        }
    },
    */

    setDistanceBetweenPlayer: function(distanceNum) {
        if (this.game.mapDisplayNode.c3 == 1) {
            this.setVisible(false);
        } else if (distanceNum == 1) {
            this.game.windowObjectDisplayNode.reorderChild(
                this,
                1
            );
            this.setScale(1.8);
            this.setVisible(true);
        } else if (distanceNum == 2) {
            //this.setOrder(999);
            this.game.windowObjectDisplayNode.reorderChild(
                this,
                999
            );
            this.sprite.setScale(1);
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    },

    initSprite: function() {
        //キャラクター(人間)
        this.humanSprite = cc.Sprite.create(
            "res/girl.png"
        );
        this.humanSprite.setAnchorPoint(0.5, 0.1);
        this.humanSprite.setPosition(0, 0);
        this.addChild(this.humanSprite);

        //キャラクター
        this.sprite = cc.Sprite.create(
            this.imagePath
        );
        this.sprite.setAnchorPoint(0.5, 0.1);
        this.sprite.setPosition(0, 0);
        this.addChild(this.sprite);

        var size = this.sprite.getContentSize();

        this.nameLabel = cc.LabelTTF.create("lv." + this.level + " " + this.name, "Arial", 13);
        this.nameLabel.setAnchorPoint(0.5, 0);
        this.nameLabel.setPosition(size.width / 2, 35);
        this.nameLabel.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.sprite.addChild(this.nameLabel, 99);

        this.gaugeBack = cc.Sprite.create(
            "res/gauge_back.png"
        );
        this.gaugeBack.setScale(0.5, 0.5);
        this.gaugeBack.setAnchorPoint(0, 0);
        this.gaugeBack.setPosition(size.width / 2 - 80 / 2 - 25, 12);
        this.sprite.addChild(this.gaugeBack);

        //HPゲージ
        var gaugeWidth = 100;
        this.gauge = new Gauge(80, 10, 'white');
        this.gauge.setPosition(size.width / 2 - 80 / 2, 20);
        this.sprite.addChild(this.gauge);

        //Waitゲージ
        var waitGaugeWidth = 60;
        this.waitGauge = new Gauge(80, 7, 'red');
        this.waitGauge.setPosition(size.width / 2 - 80 / 2, 12);
        this.sprite.addChild(this.waitGauge);

        this.gaugeOver = cc.Sprite.create(
            "res/gauge_over.png"
        );
        this.gaugeOver.setScale(0.5, 0.5);
        this.gaugeOver.setAnchorPoint(0, 0);
        this.gaugeOver.setPosition(size.width / 2 - 80 / 2, 11);
        this.sprite.addChild(this.gaugeOver);
    },

});