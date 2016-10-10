var GameLayer = cc.Layer.extend({

    windowPosY: 0,
    isHideMapMode: 1,
    isSetRandom: true,

    ctor: function(storage, stageNum) {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.storage = storage;

        this.enemies = [];
        this.items = [];
        this.coins = [];
        this.effects = [];
        this.damages = [];
        this.damageEffecs = [];

        this.setPositions = [];
        this.doorPositions = [];

        this._stageNum = stageNum;
        this.tpos = [];
        this.MAP_DATA = CONFIG.STAGE_LIST['stages'][1]['maps'][stageNum];

        //5Floorごとにボスの部屋
        if (stageNum % 5 == 0) {
            this.isBossFloor = 1;
            playBGM003(this.storage);
        } else {
            this.isBossFloor = 0;
            playBGM(this.storage);
        }

        //MapIDを選択
        this.mapId = this.getMapId();
        this.MAP_POSITIONS = CONFIG.MAP_POSITIONS[this.mapId];
        this.back = cc.Sprite.create("res/back.png");
        this.back.retain();
        this.back.setAnchorPoint(0, 0);
        this.addChild(this.back);

        this.bgLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.4), 640, 1400);
        this.addChild(this.bgLayer, 999);

        //window-base用
        this.windowNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 540);
        this.addChild(this.windowNode);
        this.windowNode.setPosition(0, 440);

        //window-map-display用
        this.mapDisplayNode = new mapDisplayNode(this);
        this.windowNode.addChild(this.mapDisplayNode);
        this.mapDisplayNode.setAnchorPoint(0, 0);
        this.mapDisplayNode.setPosition(0,40);

        //window-object-display用
        this.windowObjectDisplayNode = cc.Node.create();
        this.windowNode.addChild(this.windowObjectDisplayNode);

        //window-trasition用
        this.trasitionCnt = 0;
        this.trasitionOpacity = 0;
        this.windowTrasitionNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 540);
        this.windowNode.addChild(this.windowTrasitionNode);
        this.windowTrasitionNode.setOpacity(0);

        this.miniMap = new miniMap(this);
        this.addChild(this.miniMap, 99999999);
        this.miniMap.setZoom(true);

        //cutinを作成する
        this.cutIn = new CutIn(this);
        this.addChild(this.cutIn, 99999);
        this.cutIn.setCutInText(CONFIG.START_MESSAGE);

        //スタート位置と、敵を配置する
        this._setObjectRandam();

        //ステージの構成要素を読み込む
        this._loadStageObject();

        //Playerを作成する
        this.player = new Player(this, "");
        this.player.totalExp = this.storage.totalExp;
        var _playerPosNum = this.storage.getPlayerPosition();
        if (_playerPosNum == 0) {
            _playerPosNum = this.startPosNum;
        }

        this.player.posNum = _playerPosNum;
        this.player.hp = this.storage.lastPlayerHp;
        this.player.mp = this.storage.lastPlayerMp;

        this.battleConsole = new battleConsole(this);
        this.addChild(this.battleConsole);

        this.moveConsole = new moveConsole(this);
        this.addChild(this.moveConsole);

        this.chkPosNum = this.player.posNum - 10;
        if (this.MAP_POSITIONS[this.chkPosNum] != 1) {
            this.player.directionNum = 1;
        }
        this.chkPosNum = this.player.posNum + 1;
        if (this.MAP_POSITIONS[this.chkPosNum] != 1) {
            this.player.directionNum = 2;
        }
        this.chkPosNum = this.player.posNum + 10;
        if (this.MAP_POSITIONS[this.chkPosNum] != 1) {
            this.player.directionNum = 3;
        }
        this.chkPosNum = this.player.posNum - 1;
        if (this.MAP_POSITIONS[this.chkPosNum] != 1) {
            this.player.directionNum = 4;
        }
        //boss面の場合は、スタートとゴールは決め打ち
        if(this.isBossFloor || this._stageNum == 1){
            this.player.directionNum = 1;
        }

        //ボタン、コントローラーを作成する
        this._setButtons();

        //header
        this.header = new Header(this);
        this.header.setPosition(15, 1136 - 100);
        this.header.setAnchorPoint(0, 0);
        this.addChild(this.header, 99999999);

        this.front = cc.Sprite.create("res/game_front.png");
        this.front.retain();
        this.front.setAnchorPoint(0, 0);
        this.front.setPosition(0, -400);
        this.windowObjectDisplayNode.addChild(this.front, 9999999999);

        this.blockedPositions = [];
        this.scheduleUpdate();

        var floorData = this.storage.getStageNumber(this._stageNum);
        this.header.stageLabel.setString(floorData['visibleNum']);

        this.magicCnt = 0;
        this.isTouching = false;
        this.isTreadStartPos = false;
        this.isTreadFinishPos = false;

        this.updateTime = 0;
        this._refreshWindow();

        this.mapDisplayScale = 1;
        this.trasitionDirection = "center";
        this.trasitionX = 0;

        this.itemWindow = new ItemWindow(this);
        this.itemWindow.setPosition(0, 50);
        this.addChild(this.itemWindow, 999999999);
        this.itemWindow.setVisible(false);

        this.isBattle = false;

        this.isGameClearCount = 0;
        this.isMovedQuestPage = false;

        this.battleTime = 0;
        this.friends = [];

        //storageにsave
        this.storage.resetSouls(this);
        this.storage.forceReturnStageNum = stageNum;
        this.storage.saveLastAlivePlayerStatus(this);

        this.mapDisplayScale2 = 1;
        this.mapDisplayScaleDirection = "up";
/*
        //combo
        this.comboSprite = cc.Sprite.create("res/combo.png");
        this.comboSprite.retain();
        this.comboSprite.setAnchorPoint(0, 0);
        this.comboSprite.setPosition(250, 500);
        //this.windowObjectDisplayNode.addChild(this.comboSprite, 9999);
        this.comboSprite.setVisible(false);

        this.comboLabel = cc.LabelTTF.create("2", "Arial", 32);
        this.comboLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.comboLabel.setAnchorPoint(1, 0);
        this.comboLabel.enableStroke(new cc.Color(0, 0, 0, 255), 3, false);
        this.comboLabel.setPosition(-7, 0);
        this.comboSprite.addChild(this.comboLabel);

        this.spSprite = cc.Sprite.create("res/combo.png");
        this.spSprite.retain();
        this.spSprite.setAnchorPoint(0, 0);
        this.spSprite.setPosition(250, 500);
        this.windowObjectDisplayNode.addChild(this.spSprite, 9999);
        this.spSprite.setVisible(false);
*/
        this.criticalSprite = cc.Sprite.create("res/card012.png");
        this.criticalSprite.retain();
        this.criticalSprite.setScale(0.4,0.4);
        this.criticalSprite.setAnchorPoint(0, 0);
        this.criticalSprite.setPosition(560, 440);
        this.windowObjectDisplayNode.addChild(this.criticalSprite, 9999);
        this.criticalSprite.setVisible(false);

        this.battleConsolePos = 0;
        this.battleConsoleDirection = "up";
        cc.log("このステージは" + stageNum + "です. mapIdは" + this.mapId + ",startPosは" + this.startPosNum + "finishPosは" + this.finishPosNum + "です.Soulは" + this.storage.lastDroppedSoulPos + "にあります");
        return true;
    },

    update: function(dt) {
        this.cutIn.update();
        this.moveConsole.update();

        if (this.battleConsoleDirection == "up") {
            this.battleConsolePos += 1.5;
        } else {
            this.battleConsolePos -= 1.5;
        }
        if (this.battleConsolePos >= 20) {
            this.battleConsoleDirection = "down";
        }
        if (this.battleConsolePos <= 0) {
            this.battleConsoleDirection = "up";
        }
        this.leftHand3Sprite.setPosition(0, this.battleConsolePos * -1);
        this.rightHand3Sprite.setPosition(0, this.battleConsolePos * -1);

        if (this.battleTime >= 1) {
            this.battleTime++;
        }

        if (this.isGameClearCount >= 1) {
            this.isGameClearCount++;
            if (this.isGameClearCount >= 30 * 7 && this.isMovedQuestPage == false) {
                this.isMovedQuestPage = true;
                this.goQuestFloor();
            }
            return;
        }

        this.header.coinCnt.setString(Math.ceil(this.storage.tmpSoulsAmount));
        var _isEnemyFlg = 0;
        if (this.isTouching == true) {
            this.magicCnt += 1;
        } else {
            this.magicCnt = 0;
        }
        this._damageWindowEffect();
        this.setVisibleMenu();
        this.itemWindow.update();
        this.battleConsole.update();
        this.miniMap.update();
        this._setPlayerLocation();

        if (this.trasitionCnt == 1) {
            this.mapDisplayScale = 1;
            this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);
            var posX = -316 * this.mapDisplayScale + 316 + this.trasitionX * this.mapDisplayScale * 6;
            var posY = -271 * this.mapDisplayScale + 271;
            this.mapDisplayNode.setPosition(posX, posY);
        }

        if (this.trasitionCnt >= 1) {
            this.trasitionCnt += 2;

            if (this.trasitionCnt > 1 && this.trasitionCnt <= 10) {
                this.trasitionOpacity += 0.1;
                if (this.trasitionDirection == "left") {
                    this.trasitionX += 20;
                    this.mapDisplayNode.setPosition(
                        this.mapDisplayNode.getPosition().x + this.trasitionX,
                        this.mapDisplayNode.getPosition().y
                    );
                    this.mapDisplayScale += 0.3;
                    this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);
                    var posX = -316 * this.mapDisplayScale + 316 + this.trasitionX * this.mapDisplayScale * 6;
                    var posY = -271 * this.mapDisplayScale + 271;
                    this.mapDisplayNode.setPosition(posX, posY);
                }
                if (this.trasitionDirection == "right") {
                    this.trasitionX -= 20;
                    this.mapDisplayNode.setPosition(
                        this.mapDisplayNode.getPosition().x + this.trasitionX,
                        this.mapDisplayNode.getPosition().y
                    );
                    this.mapDisplayScale += 0.3;
                    this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);
                    var posX = -316 * this.mapDisplayScale + 316 + this.trasitionX * this.mapDisplayScale * 6;
                    var posY = -271 * this.mapDisplayScale + 271;
                    this.mapDisplayNode.setPosition(posX, posY);
                }
                if (this.trasitionDirection == "center") {
                    this.trasitionX = 0;
                    this.mapDisplayScale += 0.9;
                    this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);
                    var posX = -316 * this.mapDisplayScale + 316;
                    var posY = -271 * this.mapDisplayScale + 271;
                    this.mapDisplayNode.setPosition(posX, posY);
                }
            } else if (this.trasitionCnt > 10 && this.trasitionCnt <= 15) {
                this.mapDisplayScale = 1;
                this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);

                this.trasitionX = 0;
                this.mapDisplayNode.setPosition(this.trasitionX, 0);
                this.mapDisplayNode.setPosition(0, 0);
                this.trasitionOpacity -= 0.1;
            } else {
                this.mapDisplayScale = 1;

                this.trasitionX = 0;
                this.mapDisplayNode.setPosition(this.trasitionX, 0);
                this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);
                this.mapDisplayNode.setPosition(0, 0);
                this.trasitionCnt = 0;
                this.trasitionOpacity = 0;
            }
            if (this.trasitionCnt == 11) {
                this.mapDisplayScale = 1;
                this.mapDisplayNode.setScale(this.mapDisplayScale, this.mapDisplayScale);
                this._refreshWindow();
            }
        }

        //敵との衝突判定
        var _isEnemyCnt = 0;
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].setVisible(false);
            //距離2の状態
            if (this.tpos[4] == this.enemies[i].posNum) {
                this.enemies[i].setVisible(true);
                this.enemies[i].setDistanceBetweenPlayer(2);
                this.enemies[i].setPosition(300, 180);
                this.windowObjectDisplayNode.reorderChild(this.enemies[i], 1);
            } else
            //距離1の状態
            if (this.tpos[7] == this.enemies[i].posNum) {
                this.enemies[i].setVisible(true);
                this.enemies[i].setDistanceBetweenPlayer(1);
                this.enemies[i].setPosition(300, 100);
                this.player.targetEnemy = this.enemies[i];
                this.windowObjectDisplayNode.reorderChild(this.enemies[i], 2);

                if (this.enemies[i].hp > 0 && this.enemies[i].mode == "human" && this.cutIn.isVisible() == false) {
                    var _msg = "??? 「 助けて......」";
                    this.cutIn.setCutInHumanAppeared(_msg);
                }

                _isEnemyCnt += 1;
                if (this.isBattle == false) {
                    this.isBattle = true;
                    //battleの初回に実行
                    this.battleTime = 1;
                    var _rand = getRandNumberFromRange(1, 16);
                    if (this.player.hp <= 50) {
                        _rand = getRandNumberFromRange(1, 8);
                    }
                    if (this.isBossFloor == 1) {
                        playBattleBGM002(this.storage);
                    } else {
                        playBattleBGM(this.storage);
                    }
                }
            }

            //Enemy死亡
            if (this.enemies[i].update() == false) {
                if (this.enemies[i].mode == "human") {
                    this.cutIn.setCutInText("人をたすけた....." + "\n");
                } else {
                    var _addSoulAmount = Math.ceil(this.enemies[i].coinAmount);
                    this.storage.addSouls(_addSoulAmount);
                    this.cutIn.setCutInText("敵を 倒した...\n「魂」を " + _addSoulAmount + "、獲得した....." + "\n");
                }
                this.battleTime = 0;
                this.player.targetEnemy = null;
                this.windowObjectDisplayNode.removeChild(this.enemies[i]);
                this.enemies.splice(i, 1);
                this._refreshWindow();
            }
        }

        //Enemyと対峙していない場合
        if (_isEnemyCnt == 0) {
            this.player.targetEnemy = null;
            if (this.isBattle == true) {
                this.isBattle = false;
                playBGM(this.storage);
            }
        }

        //エフェクト
        for (var i = 0; i < this.effects.length; i++) {
            if (this.effects[i].update() == false) {
                this.windowObjectDisplayNode.removeChild(this.effects[i]);
                this.effects.splice(i, 1);
            }
        }

        //アイテムとの衝突判定
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].update() == false) {
                this.windowObjectDisplayNode.removeChild(this.items[i]);
                this.items.splice(i, 1);
                this._refreshWindow();
                //this.addPlayerRecoverEffect();
            }
        }

        //ダメージ数表示用のtext
        for (var i = 0; i < this.damages.length; i++) {
            if (this.damages[i].update() == false) {
                this.windowObjectDisplayNode.removeChild(this.damages[i]);
                this.damages.splice(i, 1);
            }
        }

        //エフェクト表示用のスプライト
        for (var j = 0; j < this.damageEffecs.length; j++) {
            if (this.damageEffecs[j].update() == false) {
                this.windowObjectDisplayNode.removeChild(this.damageEffecs[j]);
                this.damageEffecs.splice(j, 1);
            }
        }
    },
    getMapId: function() {
        //ボスの時のマップは1を選択。他のマップはランダム。
        var _mapId = 1;
        if (this.isBossFloor == 1) {
            _mapId = 1;
        } else {
            _mapId = getRandNumberFromRange(3, 10);
            if (this.storage.isSavedLastPosition(this._stageNum) == true) {
                _mapId = this.storage.lastMapId;
            }
        }
        //チュートリアルは例外で簡単なマップ
        if (this._stageNum == 1) {
            _mapId = 1;
        }
        if (this._stageNum == 2) {
            _mapId = 2;
        }
        if (this._stageNum == 3) {
            _mapId = 2;
        }
        return _mapId;
    },

    addItemByPos: function(itemId, posNum) {
        var _item = new Item(this, itemId, posNum);
        _item.setPosition(320, 250);
        this.windowObjectDisplayNode.addChild(_item);
        this.items.push(_item);
    },

    addEnemyByPos: function(posNum) {
        var _baseLevel = Math.ceil(this._stageNum / 5);
        var _level = getRandNumberFromRange(_baseLevel, _baseLevel + 2);
        if (this.isBossFloor == 1) {
            _level = _baseLevel + 6;
        }
        var _enemy = new Enemy(this, _level, this.isBossFloor, posNum);
        this.windowObjectDisplayNode.addChild(_enemy);
        this.enemies.push(_enemy);
    },

    addEnemyKilledEffect: function() {
        var _effect = new Effect(this, "killed");
        _effect.setScale(2, 2);
        this.effects.push(_effect);
        _effect.setPosition(320, 200);
        this.windowObjectDisplayNode.addChild(_effect, 99999);
    },

    //敵からのダメージ
    addPlayerDamangedEffect: function() {
        var _effect = new Effect(this, "damaged");
        _effect.setScale(2, 2);
        this.effects.push(_effect);
        _effect.setPosition(320, 300);
        this.windowObjectDisplayNode.addChild(_effect, 99999);
    },

    //カードによるダメージ
    addPlayerDamangedEffect2: function() {
        var _effect = new Effect(this, "damaged2");
        _effect.setScale(2, 2);
        this.effects.push(_effect);
        _effect.setPosition(320, 300);
        this.windowObjectDisplayNode.addChild(_effect, 99999);
    },

    //アイテムと衝突
    addPlayerRecoverEffect: function(effectCode) {
        var _effect = new Effect(this, effectCode);
        _effect.setScale(2, 2);
        this.effects.push(_effect);
        _effect.setPosition(320, 300);
        this.windowObjectDisplayNode.addChild(_effect, 99999);
    },

    addPlayerEscapeEffect: function() {
        var _effect = new Effect(this, "escape");
        _effect.setScale(2, 2);
        this.effects.push(_effect);
        _effect.setPosition(320, 300);
        this.windowObjectDisplayNode.addChild(_effect, 99999);
    },

    addDamageEffect: function(enemy, effectNum, damagePoint, hitOption) {
        var _effect = new DamageEffect(enemy, effectNum, damagePoint, "xxx", hitOption);
        this.windowObjectDisplayNode.addChild(_effect, 999999);
        _effect.setPosition(300, 300);
        this.damageEffecs.push(_effect);

        if (hitOption == "block") {
            var _effect = new DamageEffect(enemy, 99, 0, "xxx", hitOption);
            this.windowObjectDisplayNode.addChild(_effect, 9999999);
            _effect.setPosition(300, 300);
            this.damageEffecs.push(_effect);
        }
    },

    addDamageText: function(damagePoint, who, type) {
        var _effect = new DamageText(damagePoint, who, type);
        this.windowObjectDisplayNode.addChild(_effect, 999999999);
        _effect.setPosition(300, 170);
        this.damages.push(_effect);
    },

    addDamageText2: function(damagePoint) {
        var _effect = new DamageText2(damagePoint, "xxx");
        this.windowObjectDisplayNode.addChild(_effect, 999999999);
        _effect.setPosition(300, 170);
        this.damages.push(_effect);
    },

    enemyMove: function() {
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].move();
        }
    },

    enemyExpendCost: function() {
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].expendActionCostByPlayerWalking();
        }
    },

    getBockedPositions: function() {
        this.blockedPositions = [];
        for (var i = 0; i < this.enemies.length; i++) {
            this.blockedPositions.push(this.enemies[i].posNum);
        }
        for (var i = 0; i < this.items.length; i++) {
            this.blockedPositions.push(this.items[i].posNum);
        }
        for (var i = 1; i < this.MAP_POSITIONS.length; i++) {
            if (this.MAP_POSITIONS[i] == 1) {
                this.blockedPositions.push(i);
            }
        }
        this.blockedPositions.push(this.player.posNum);
    },

    checkBlockedPositions: function(posNum) {
        this.getBockedPositions();
        if (this.blockedPositions.indexOf(posNum) >= 0) {
            return true;
        }
        if (this.doorPositions.indexOf(posNum) >= 0) {
            return true;
        }
        return false;
    },

    checkIsDoorPositions: function(posNum) {
        if (this.doorPositions.indexOf(posNum) >= 0) {
            return true;
        }
        return false;
    },

    getBockedPositionByEnemy: function(inputEnemy) {
        this.blockedPositions = [];
        for (var i = 0; i < this.enemies.length; i++) {
            if (inputEnemy != this.enemies[i]) {
                this.blockedPositions.push(this.enemies[i].posNum);
            }
        }
        for (var i = 1; i < this.MAP_POSITIONS.length; i++) {
            if (this.MAP_POSITIONS[i] == 1) {
                this.blockedPositions.push(i);
            }
        }
        this.blockedPositions.push(this.player.posNum);
    },

    checkBlockedPositionByEnemy: function(posNum, enemy) {
        this.getBockedPositionByEnemy(enemy);
        if (this.blockedPositions.indexOf(posNum) >= 0) {
            return true;
        }
        return false;
    },

    _damageWindowEffect: function() {
        //プレイヤーのダメージがONになっている場合は画面を揺らす
        if (this.player.isDamageOn == true) {
            this.windowPosY += 15;
            if (this.windowPosY >= 50) {
                this.windowPosY = 0;
            }
            this.windowNode.setPosition(
                0, 440 + this.windowPosY
            );
        }else{
            this.windowNode.setPosition(
                0, 440
            ); 
        }
    },

    setVisibleMenu: function() {
        //シーン変更
        if (this.player.update() == false && this.cutIn.isVisible() == false) {
            this.cutIn.setCutInPlayerDead("死亡した...「魂」を " + Math.ceil(this.storage.tmpSoulsAmount) + " 落としてしまった..");
            this.storage.saveLastDeadPlayerStatus(this);
            this.player.hp = 0;
            //playBGM002(this.storage);
            playBGM004(this.storage);
        };

        //スタート地点に戻った時
        if (this.player.posNum == this.startPosNum) {
            if (this.isTreadStartPos == false) {
                if (this.cutIn.isVisible() == false) {
                    this.cutIn.setCutInNextFloor("");
                }
                this.isTreadStartPos = true;
            }
        } else {
            this.isTreadStartPos = false;
        }

        if (this.player.targetEnemy != null) {
            //戦闘中
            if(this.player.hp > 0){
                this.miniMap.miniMapNode.setVisible(false);
            }else{
                this.miniMap.isZoom = true;
                this.miniMap.miniMapNode.setVisible(true);
            }
            this.battleConsole.setVisible(true);
            this.leftHand3Sprite.setVisible(true);
            this.rightHand3Sprite.setVisible(true);
            this.moveConsole.setVisible(false);
        } else {
            //歩行中
            this.miniMap.miniMapNode.setVisible(true);
            this.battleConsole.setVisible(false);
            this.leftHand3Sprite.setVisible(false);
            this.rightHand3Sprite.setVisible(false);
            this.moveConsole.setVisible(true);
        }
    },


    getRandHelpMessage: function() {
        return "??? 「 助けて......」";
    },

    isSetMenuWindow: function() {
        if (this.itemWindow.isVisible()) return true;
        if (this.cutIn.isVisible()) return true;
        if (this.isGameClearCount > 0) return true;
        return false;
    },

    _setPlayerLocation: function() {
        if (this.player.directionNum == 1) {
            this.tpos = this.rtnFront(this.player.posNum, 10);
        }
        if (this.player.directionNum == 2) {
            this.tpos = this.rtnRight(this.player.posNum, 10);
        }
        if (this.player.directionNum == 3) {
            this.tpos = this.rtnBack(this.player.posNum, 10);
        }
        if (this.player.directionNum == 4) {
            this.tpos = this.rtnLeft(this.player.posNum, 10);
        }
    },

    _refreshWindow: function() {
        //tpos = [];
        if (this.player.directionNum == 1) {
            this.tpos = this.rtnFront(this.player.posNum, 10);
        }
        if (this.player.directionNum == 2) {
            this.tpos = this.rtnRight(this.player.posNum, 10);
        }
        if (this.player.directionNum == 3) {
            this.tpos = this.rtnBack(this.player.posNum, 10);
        }
        if (this.player.directionNum == 4) {
            this.tpos = this.rtnLeft(this.player.posNum, 10);
        }
        this.mapDisplayNode.setDisplay(this.tpos);
        this.miniMap.setDisplay();

        if (this.player.posNum == this.finishPosNum && this.isGameClearCount == 0) {
            this.isGameClearCount = 1;
            var _reward = this.storage.getStageClearRewordAmountByLebel(this._stageNum);
            this.storage.addSouls(Math.ceil(_reward));
            var _text = "この階の最終チェックポイントに到着した.\n";
            _text += "報酬として魂を " + Math.ceil(_reward) + " 得た.......\n";
            _text += ".....塔の外に転送しています.............\n";
            _text += ".....................................\n";
            this.addPlayerEscapeEffect();
            this.cutIn.setCutInText(_text);
            playBGM004(this.storage);
        }
    },

    removeItem: function(item) {
        this.windowObjectDisplayNode.removeChild(item);
    },

    _setButtons: function() {
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                event.getCurrentTarget().isTouching = true;
                if (event.getCurrentTarget().isSetMenuWindow()) return;
                for (var i = 0; i < event.getCurrentTarget().items.length; i++) {
                    event.getCurrentTarget().items[i].attached();
                }
            },
            onTouchesMoved: function(touches, event) {
                event.getCurrentTarget().isTouching = true;
            },
            onTouchesEnded: function(touches, event) {
                event.getCurrentTarget().isTouching = false;
                if (touches.length <= 0) return;
            }
        }), this);
    },

    getColAndRow: function(mapPosNum) {
        var _col = ((mapPosNum + 30) % 30);
        if (_col == 0) {
            _col = 30;
        }
        var _row = Math.floor((mapPosNum - 1) / 30) + 1;
        return [_col * 55 * 1, _row * 55 * -1];
    },

    getColAndRow2: function(mapPosNum) {
        var _col = ((mapPosNum + 30) % 30);
        if (_col == 0) {
            _col = 30;
        }
        var _row = Math.floor((mapPosNum - 1) / 30) + 1;
        return [_col, _row];
    },

    _loadStageObject: function() {
        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/left_hand.png", cc.rect(0, 1626 / 3 * i, 632, 1626 / 3));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.2);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.leftHand3Sprite = cc.Sprite.create("res/left_hand.png", cc.rect(0, 0, 632, 1626 / 3));
        this.leftHand3Sprite.runAction(this.ra);

        this.leftHand3Sprite.setAnchorPoint(0, 0);
        this.leftHand3Sprite.setPosition(0, 0);
        this.windowObjectDisplayNode.addChild(this.leftHand3Sprite, 9999);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/right_hand.png", cc.rect(0, 1626 / 3 * i, 632, 1626 / 3));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.2);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.rightHand3Sprite = cc.Sprite.create("res/right_hand.png", cc.rect(0, 0, 632, 1626 / 3));
        this.rightHand3Sprite.runAction(this.ra);

        this.rightHand3Sprite.setAnchorPoint(0, 0);
        this.rightHand3Sprite.setPosition(0, 0);
        this.windowObjectDisplayNode.addChild(this.rightHand3Sprite, 9998);
    },

    leftHandAttack: function() {
        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/left_hand.png", cc.rect(0, 1626 / 3 * i, 632, 1626 / 3));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.08);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.leftHand3Sprite.runAction(this.ra);
    },

    rightHandAttack: function() {
        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/right_hand.png", cc.rect(0, 1626 / 3 * i, 632, 1626 / 3));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.08);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.rightHand3Sprite.runAction(this.ra);
    },

    rtnFront: function(pPos, maxNum) {
        return [
            (pPos - 30 * 3) - 1, (pPos - 30 * 3), (pPos - 30 * 3) + 1, (pPos - 30 * 2) - 1, (pPos - 30 * 2), (pPos - 30 * 2) + 1, (pPos - 30 * 1) - 1, (pPos - 30 * 1), (pPos - 30 * 1) + 1, (pPos - 30 * 0) - 1, (pPos - 30 * 0), (pPos - 30 * 0) + 1,
        ];
    },

    rtnRight: function(pPos, maxNum) {
        return [
            pPos + 3 - 30 * 1,
            pPos + 3,
            pPos + 3 + 30 * 1,
            pPos + 2 - 30 * 1,
            pPos + 2,
            pPos + 2 + 30 * 1,
            pPos + 1 - 30 * 1,
            pPos + 1,
            pPos + 1 + 30 * 1,
            pPos + 0 - 30 * 1,
            pPos + 0,
            pPos + 0 + 30 * 1,
        ];
    },

    rtnLeft: function(pPos, maxNum) {
        return [
            pPos - 3 + 30,
            pPos - 3,
            pPos - 3 - 30,
            pPos - 2 + 30,
            pPos - 2,
            pPos - 2 - 30,
            pPos - 1 + 30,
            pPos - 1,
            pPos - 1 - 30,
            pPos - 0 + 30,
            pPos - 0,
            pPos - 0 - 30,
        ];
    },

    rtnBack: function(pPos, maxNum) {
        return [
            (pPos + 30 * 3) + 1, (pPos + 30 * 3), (pPos + 30 * 3) - 1, (pPos + 30 * 2) + 1, (pPos + 30 * 2), (pPos + 30 * 2) - 1, (pPos + 30 * 1) + 1, (pPos + 30 * 1), (pPos + 30 * 1) - 1, (pPos + 30 * 0) + 1, (pPos + 30 * 0), (pPos + 30 * 0) - 1,
        ];
    },

    shuffle: function() {
        return Math.random() - .5
    },

    _setObjectRandam: function() {
        //まず配置可能な場所をsetPositionsという配列にする
        this.setPositions = [];
        this.doorPositions = [];
        for (var i = 1; i < this.MAP_POSITIONS.length; i++) {
            var _col = ((i + 30) % 30);
            if (_col == 0) {
                _col = 30;
            }
            var _row = Math.floor((i - 1) / 30) + 1;
            //0の場所のみが通れる場所
            if (this.MAP_POSITIONS[i] == 0) {
                this.setPositions.push(i);
            }

            //ドアの場合は、配列に入れる
            if (this.MAP_POSITIONS[i] == 2) {
                this.doorPositions.push(i);
            }
        }

        //ランダムに並び替え
        for (var s = 0; s < 10; s++) {
            this.setPositions.sort(this.shuffle);
        }

        //最も離れた距離をstartとfinishにする
        var _maxDist = 0;
        var _startPos = 0;
        var _finishPos = 0;
        var _positioningArrayCount = this.setPositions.length;
        var _mapRand = getRandNumberFromRange(1, 4);
        _mapRand = 2;
        breakpoint:
            for (var d = 0; d < this.setPositions.length; d++) {
                for (var e = 0; e < this.setPositions.length; e++) {
                    if (this.setPositions[d] != this.setPositions[e]) {
                        var dist = this._distanceBetweenPositions(this.setPositions[d], this.setPositions[e]);
                        if (_maxDist < dist) {
                            _maxDist = dist;
                            _startPos = this.setPositions[d];
                            _finishPos = this.setPositions[e];
                            //if(_mapRand == 2){
                            if (dist >= 18) {
                                //cc.log(_maxDist + "breaksitayo");
                                break breakpoint;
                            }
                            //}
                        }
                    }
                }
            }

        //boss面の場合は、スタートとゴールは決め打ち
        if(this.isBossFloor || this._stageNum == 1){
            _startPos = 673;
            _finishPos = 193;
            //this.player.directionNum = 1;
        }

        for (var f = 0; f < this.setPositions.length; f++) {
            if (this.setPositions[f] == _startPos) {
                this.setPositions.splice(f, 1);
            }
            if (this.setPositions[f] == _finishPos) {
                this.setPositions.splice(f, 1);
            }
        }

        //Setする
        this.startPosNum = _startPos;
        this.finishPosNum = _finishPos;
        //もし保存されていたら、上書き
        if (this.storage.isSavedLastPosition(this._stageNum) == true) {
            this.startPosNum = this.storage.lastStartPos;
            this.finishPosNum = this.storage.lastFinishPos;
        }

        //アイテムの設置
        var _itemCount = Math.ceil(_positioningArrayCount / 20);
        if (this._stageNum == 1) {
            _itemCount = 0;
        }
        if (this._stageNum == 2) {
            _itemCount = 0;
        }
        if (this._stageNum == 3) {
            _itemCount = 5;
        }
        //ボス面はアイテム不要
        if (this.isBossFloor == 1) {
            _itemCount = 0;
        }

        //落下したsoul設置
        if (this.storage.isSavedLastSoulPosition(this._stageNum) == true) {
            var _droppedPos = this.storage.lastDroppedSoulPos;
            //TODO:splice
            cc.log("player_soul" + _droppedPos);
            //cc.log("落下していたsoulを配置した");
            this.addItemByPos(
                "player_soul",
                _droppedPos
            );
        }

        //アイテム設置
        for (var i = 0; i < _itemCount; i++) {
            var rand = getRandNumberFromRange(1, 4);
            var itemId = "recover";
            if (rand == 1) {
                itemId = "magic";
            } else if (rand == 2) {
                itemId = "soul";
            }
            this.addItemByPos(
                itemId,
                this.setPositions[0]
            );
            this.setPositions.splice(0, 1);
        }

        //敵の設置
        var _enemyCount = Math.ceil(_positioningArrayCount / 17);
        if (this._stageNum % 5 == 1) {
            _enemyCount = Math.ceil(_positioningArrayCount / 25);
        }
        if (this._stageNum % 5 == 2) {
            _enemyCount = Math.ceil(_positioningArrayCount / 23);
        }
        if (this._stageNum % 5 == 3) {
            _enemyCount = Math.ceil(_positioningArrayCount / 20);
        }
        if (this._stageNum % 5 == 4) {
            _enemyCount = Math.ceil(_positioningArrayCount / 17);
        }
        //ボスの時は1体
        if (this.isBossFloor == 1) {
            _enemyCount = 1;
        }
        //stg1は敵はいない //stg2は2体
        if (this._stageNum == 1) {
            _enemyCount = 0;
        }
        if (this._stageNum == 2) {
            _enemyCount = 2;
        }
        if (this._stageNum == 3) {
            _enemyCount = 2;
        }
        if (this._stageNum == 3) {
            _enemyCount = 4;
        }
        //_enemyCount = 30;
        for (var i = 0; i < _enemyCount; i++) {
            var _enemyPos = this.setPositions[0];
            this.addEnemyByPos(_enemyPos);
            this.setPositions.splice(0, 1);
        }
    },

    _distanceBetweenPositions: function(p1, p2) {
        var _p1Col = ((p1 + 30) % 30);
        if (_p1Col == 0) {
            _p1Col = 30;
        }
        var _p1Row = Math.floor((p1 - 1) / 30) + 1;

        var _p2Col = ((p2 + 30) % 30);
        if (_p2Col == 0) {
            _p2Col = 30;
        }
        var _p2Row = Math.floor((p2 - 1) / 30) + 1;
        return Math.sqrt((_p1Col - _p2Col) * (_p1Col - _p2Col) + (_p1Row - _p2Row) * (_p1Row - _p2Row));
    },

    goQuestFloor: function(pSender) {
        var scene = cc.Scene.create();
        //stageNumがステージ数を超えたらクリア!
        if (this.player.posNum == this.finishPosNum) {
            this._stageNum = this._stageNum + 1;
        }
        this.storage.forceReturnStageNum = 0;
        this.storage.saveClearedPlayerStatus(this);
        var scene = cc.Scene.create();
        scene.addChild(
            QuestLayer.create(
                this.storage
            )
        );
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },

    goQuestFloor2: function(pSender) {
        var scene = cc.Scene.create();
        this.storage.forceReturnStageNum = 0;
        var scene = cc.Scene.create();
        scene.addChild(
            QuestLayer.create(
                this.storage
            )
        );
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
});

var getRandNumberFromRange = function(min, max) {
    var rand = min + Math.floor(Math.random() * (max - min));
    return rand;
};

GameLayer.create = function(storage, stageNum) {
    return new GameLayer(storage, stageNum);
};

var GameLayerScene = cc.Scene.extend({
    onEnter: function(stageNum) {
        this._super();
        var layer = new GameLayer(stageNum);
        this.addChild(layer);
    }
});