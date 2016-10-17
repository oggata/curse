var QuestLayer = cc.Layer.extend({
    ctor: function(storage) {
        //cc.sys.localStorage.clear();
        //////////////////////////////
        // 1. super init first
        this._super();
        this.viewSize = cc.director.getVisibleSize();
        this.messages = [];

        this.storage = storage;

        if (this.storage.maxUnlockedStage == 0) {
            this.storage.maxUnlockedStage = 1;
        }
        this.maxClearedFloor = this.storage.maxUnlockedStage;
        //this.maxClearedFloor = 90;
        if(this.maxClearedFloor > 5 * 12){
            this.maxClearedFloor = 5 * 12;
        }

        if (this.storage.lastFloorNum > 0) {
            this.floorNumber = this.storage.lastFloorNum;
        } else {
            this.floorNumber = this.storage.maxUnlockedStage;
        }

        playBGM002(this.storage);
        var _getData = this.storage.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage", _getData);
        this.clearedStageData = this.storage.clearedStageData;
        this.forceReturnStageNumNumber = 1;
        this.isforceReturnStageNumLocked = false;

        //defaultのデータを用意
        this.storage.saveItemDataToStorage("status_hp", 0);
        this.storage.saveItemDataToStorage("status_attack", 0);
        this.storage.saveItemDataToStorage("status_defence", 0);
        this.storage.saveItemDataToStorage("status_magic_fire", 0);
        this.storage.saveItemDataToStorage("status_magic_light", 0);
        this.storage.saveItemDataToStorage("status_magic_water", 0);
        this.storage.saveItemDataToStorage("status_recover", 0);
        this.storage.saveItemDataToStorage("status_fast", 0);
        this.storage.saveItemDataToStorage("status_luck", 0);

        //メニューを用意
        this.StatusWindow = new StatusWindow(this, 1);
        this.addChild(this.StatusWindow, 999);
        this.StatusWindow.setVisible(false);

        this.LeftHandWindow = new StatusWindow(this, 2);
        this.addChild(this.LeftHandWindow, 999);
        this.LeftHandWindow.setVisible(false);

        this.RightHandWindow = new StatusWindow(this, 3);
        this.addChild(this.RightHandWindow, 999);
        this.RightHandWindow.setVisible(false);

        //タワーの図をセット
        this.backSprite = cc.Sprite.create("res/quest_back.png");
        this.backSprite.setAnchorPoint(0, 0);
        this.addChild(this.backSprite);

        this.towerBgLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 1), 640, 1400);
        this.addChild(this.towerBgLayer);
        this.towerBgLayer.setVisible(false);

        this.towerBgBlueLayer = cc.LayerColor.create(new cc.Color(0, 0, 128, 255 * 0.3), 640, 1400);
        this.addChild(this.towerBgBlueLayer);
        this.towerBgBlueLayer.setVisible(false);

        this.towerBgRedLayer = cc.LayerColor.create(new cc.Color(128, 0, 0, 255 * 0.3), 640, 1400);
        this.addChild(this.towerBgRedLayer);
        this.towerBgRedLayer.setVisible(false);

        this.towerBgYellowLayer = cc.LayerColor.create(new cc.Color(255, 215, 0, 255 * 0.3), 640, 1400);
        this.addChild(this.towerBgYellowLayer);
        this.towerBgYellowLayer.setVisible(false);

        this.towerBgGreenLayer = cc.LayerColor.create(new cc.Color(85, 107, 47, 255 * 0.3), 640, 1400);
        this.addChild(this.towerBgGreenLayer);
        this.towerBgGreenLayer.setVisible(false);

        this.towerBgBlackLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.3), 640, 1400);
        this.addChild(this.towerBgBlackLayer);
        this.towerBgBlackLayer.setVisible(false);

        //タワーの図をセット
        this.tower001Sprite = cc.Sprite.create("res/tower_map_001.png");
        this.tower001Sprite.setPosition(320, 720);
        this.addChild(this.tower001Sprite);

        this.tower002Sprite = cc.Sprite.create("res/tower_map_002.png");
        this.tower002Sprite.setPosition(320, 720);
        this.addChild(this.tower002Sprite);

        this.tower003Sprite = cc.Sprite.create("res/tower_map_003.png");
        this.tower003Sprite.setPosition(320, 720);
        this.addChild(this.tower003Sprite);

        this.tower004Sprite = cc.Sprite.create("res/tower_map_004.png");
        this.tower004Sprite.setPosition(320, 720);
        this.addChild(this.tower004Sprite);

        this.tower005Sprite = cc.Sprite.create("res/tower_map_005.png");
        this.tower005Sprite.setPosition(320, 720);
        this.addChild(this.tower005Sprite);

        //キャラクターをセット
        this.charactorSprite = cc.Sprite.create("res/aomanto.png");
        this.charactorSprite.setPosition(320, 600);
        this.charactorSprite.setScale(1.5, 1.5);
        this.addChild(this.charactorSprite);

        this.setMessage1Window();
        this.setMessage2Window();
        this.setMessage3Window();
        this.setMessage4Window();

        //header
        this.header = new Header(this);
        this.header.setPosition(15, 1136 - 100);
        this.header.setAnchorPoint(0, 0);
        this.addChild(this.header, 999);

        this.cutIn2 = new CutIn2(this);
        this.addChild(this.cutIn2, 999);

        if (this.maxClearedFloor == 1) {
            this.messages = CONFIG.GUIDE_MESSAGE_001;
        }
        if (this.maxClearedFloor == 2) {
            this.messages = CONFIG.GUIDE_MESSAGE_002;
        }
        if (this.maxClearedFloor == 3) {
            this.messages = CONFIG.GUIDE_MESSAGE_003;
        }
        if (this.maxClearedFloor == 4) {
            this.messages = CONFIG.GUIDE_MESSAGE_004;
        }
        if (this.maxClearedFloor == 5) {
            this.messages = CONFIG.GUIDE_MESSAGE_005;
        }

        this.isSendedMsg = false;
        this.tmpY = this.charactorSprite.getPosition().y;
        this.moveDirection = "up";

        /*
        if ("undefined" != typeof(sdkbox)) {
            sdkbox.PluginSdkboxPlay.signin();
            this.sendGameCenter();
            cc.log("send gamecenter");
        }
        */

        this.admobInit();
        //this.sdkboxPlayInit();

        this.updateCnt = 0;
        this.isAdAvailable = false;

        this.scheduleUpdate();
        return true;
    },

    update: function(dt) {
        //adを表示する
        this.updateCnt++;
        if(this.updateCnt >= 30 * 3 && this.isAdAvailable == false){
            this.isAdAvailable = true;
            this.updateCnt = 0;
            if ('undefined' == typeof(sdkbox)) {
                this.showInfo('sdkbox is undefined')
                return;
            }else{
                if (sdkbox.PluginAdMob.isAvailable("home") ) {
                    sdkbox.PluginAdMob.show("home");
                } else {
                    cc.log('adMob: admob interstitial ad is not ready');
                }
            }
        }

        var floorData = this.storage.getStageNumber(this.floorNumber);
        this.header.stageLabel.setString(floorData['visibleNum']);

        this.towerBgLayer.setVisible(false);
        this.tower001Sprite.setVisible(false);
        this.tower002Sprite.setVisible(false);
        this.tower003Sprite.setVisible(false);
        this.tower004Sprite.setVisible(false);
        this.tower005Sprite.setVisible(false);

        this.towerBgBlueLayer.setVisible(false);
        this.towerBgYellowLayer.setVisible(false);
        this.towerBgRedLayer.setVisible(false);
        this.towerBgGreenLayer.setVisible(false);
        this.towerBgBlackLayer.setVisible(false);

       // var floorData = this.game.storage.getStageNumber(this.game._stageNum);
        var floorNum = floorData['floorNum'];
        var floorImageId = floorNum % 5;
        if (floorImageId == 0) {
            this.towerBgBlackLayer.setVisible(true);
        } else if(floorImageId == 1) {
            this.towerBgBlueLayer.setVisible(true);
        } else if(floorImageId == 2) {
            this.towerBgYellowLayer.setVisible(true);
        } else if(floorImageId == 3) {
            this.towerBgRedLayer.setVisible(true);
        } else if(floorImageId == 4) {
            this.towerBgGreenLayer.setVisible(true);
        }


        if (this.message2Sprite.isVisible() == true) {
            this.charactorSprite.setVisible(false);
            if (this.floorNumber % 5 == 1) {
                this.tower001Sprite.setVisible(true);
            }
            if (this.floorNumber % 5 == 2) {
                this.tower002Sprite.setVisible(true);
            }
            if (this.floorNumber % 5 == 3) {
                this.tower003Sprite.setVisible(true);
            }
            if (this.floorNumber % 5 == 4) {
                this.tower004Sprite.setVisible(true);
            }
            if (this.floorNumber % 5 == 0) {
                this.tower005Sprite.setVisible(true);
            }
            this.towerBgLayer.setVisible(true);
        } else {
            this.charactorSprite.setVisible(true);
        }

        if (this.message3Sprite.isVisible()) {
            this.messageSprite.setVisible(false);
            this.message2Sprite.setVisible(false);
        }

        if (this.moveDirection == "up") {
            this.charactorSprite.setPosition(
                this.charactorSprite.getPosition().x,
                this.charactorSprite.getPosition().y + 0.5
            );
            if (this.charactorSprite.getPosition().y > this.tmpY + 20) {
                this.moveDirection = "down";
            }
        } else {
            this.charactorSprite.setPosition(
                this.charactorSprite.getPosition().x,
                this.charactorSprite.getPosition().y - 0.5
            );
            if (this.charactorSprite.getPosition().y <= this.tmpY) {
                this.moveDirection = "up";
            }
        }

        //メッセージを送る
        if (this.messages && this.storage.forceReturnStageNum == 0) {
            if (this.messages.length >= 1 && this.isSendedMsg == false) {
                this.cutIn2.setCutInText(this.messages[0]);
                this.isSendedMsg = true;
            }
        }

        //カットインをフェードアウト
        this.cutIn2.update();

        this.header.coinCnt.setString(this.storage.tmpSoulsAmount);
        this.header.hpGauge.update(1);
        this.header.mpGauge.update(this.storage.lastPlayerMp / 100);
        var _vFloorNum = ("000" + this.floorNumber).slice(-3);
        var floorData = this.storage.getStageNumber(this.floorNumber);
        this.nextFloorLable.setString("START " + floorData['visibleNum'] + "F");
    },


    showInfo: function(text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },

    admobInit: function() {
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginAdMob)) {
            this.showInfo('sdkbox.PluginAdMob is undefined')
            return;
        }

        var self = this
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function(name) {
                self.showInfo('adViewDidReceiveAd name=' + name);
            },
            adViewDidFailToReceiveAdWithError: function(name, msg) {
                self.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
            },
            adViewWillPresentScreen: function(name) {
                self.showInfo('adViewWillPresentScreen name=' + name);
            },
            adViewDidDismissScreen: function(name) {
                self.showInfo('adViewDidDismissScreen name=' + name);
            },
            adViewWillDismissScreen: function(name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function(name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
            }
        });
        sdkbox.PluginAdMob.init();

        // just for test
        var plugin = sdkbox.PluginAdMob
        if ("undefined" != typeof(plugin.deviceid) && plugin.deviceid.length > 0) {
            this.showInfo('deviceid=' + plugin.deviceid);
            // plugin.setTestDevices(plugin.deviceid);
        }
    },

    sdkboxPlayInit: function() {
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginSdkboxPlay)) {
            this.showInfo('sdkbox.PluginSdkboxPlay is undefined')
            return;
        }

        if ("undefined" != typeof(sdkbox.PluginSdkboxPlay)) {
            var plugin = sdkbox.PluginSdkboxPlay
            plugin.setListener({
                onScoreSubmitted: function(leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
                    cc.log("on score " + score + " submitted to leaderboard: " + leaderboard_name);
                    cc.log("all time hi " + maxScoreAllTime ? 1 : 0);
                    cc.log("weekly hi " + maxScoreWeek ? 1 : 0);
                    cc.log("daily hi " + maxScoreToday ? 1 : 0);
                },
                onIncrementalAchievementUnlocked: function(achievement_name) {
                    cc.log("incremental achievement " + achievement_name + " unlocked.");
                },
                onIncrementalAchievementStep: function(achievement_name, step) {
                    cc.log("incremental achievent " + achievement_name + " step: " + step);
                },
                onAchievementUnlocked: function(achievement_name, newlyUnlocked) {
                    cc.log("achievement " + achievement_name + " unlocked (new " + newlyUnlocked ? 1 : 0 + ")");
                },
                onConnectionStatusChanged: function(connection_status) {
                    cc.log("connection status change: " + connection_status + " connection_status");
                }
            });
            plugin.init();

        } else {
            printf("no plugin init")
        }
    },

    sendGameCenter: function() {
        var floorData = this.storage.getStageNumber(this.maxClearedFloor);
        var floorNum = floorData['floorNum'];
        sdkbox.PluginSdkboxPlay.submitScore("max_floor", floorNum);

        if (floorNum == 2) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("1_floor");
        }
        if (floorNum == 6) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("5_floor");
        }
        if (floorNum == 11) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("10_floor");
        }
        if (floorNum == 16) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("15_floor");
        }
        if (floorNum == 21) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("20_floor");
        }
        if (floorNum == 26) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("25_floor");
        }
        if (floorNum == 31) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("30_floor");
        }
        if (floorNum == 36) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("35_floor");
        }
        if (floorNum == 41) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("40_floor");
        }
        if (floorNum == 46) {
            sdkbox.PluginSdkboxPlay.unlockAchievement("45_floor");
        }
    },

    setMessage1Window: function() {
        this.messageSprite = cc.Sprite.create("res/message.png");
        this.messageSprite.setPosition(320, 300);
        this.addChild(this.messageSprite);

        this.item001Button = new cc.MenuItemImage(
            "res/button_go.png",
            "res/button_go.png",
            function() {
                this.onTouchMsg001();
            }, this);
        this.item001Button.setAnchorPoint(0, 0);
        this.item001Button.setPosition(0, 90);

        this.item002Button = new cc.MenuItemImage(
            "res/button_go_hint.png",
            "res/button_go_hint.png",
            function() {
                this.onTouchMsg002();
            }, this);
        this.item002Button.setAnchorPoint(0, 0);
        this.item002Button.setPosition(0, 0);

        this.item003Button = new cc.MenuItemImage(
            "res/button_go_soul.png",
            "res/button_go_soul.png",
            function() {
                this.onTouchMsg003();
            }, this);
        this.item003Button.setAnchorPoint(0, 0);
        this.item003Button.setPosition(300, 0);

        this.item004Button = new cc.MenuItemImage(
            "res/button_go_avi.png",
            "res/button_go_avi.png",
            function() {
                this.onTouchMsg004();
            }, this);
        this.item004Button.setAnchorPoint(0, 0);
        this.item004Button.setPosition(300, 90);

        var menu1 = new cc.Menu(
            this.item001Button,
            this.item002Button,
            this.item003Button,
            this.item004Button
        );
        menu1.x = 0;
        menu1.y = 0;
        this.messageSprite.addChild(menu1, 1);
    },

    setMessage2Window: function() {
        this.message2Sprite = cc.Sprite.create("res/message.png");
        this.message2Sprite.setPosition(320, 300);
        this.addChild(this.message2Sprite);

        this.infoText = "...";
        var _soulFloor = this.storage.getSavedLastSoulFloor();
        if (_soulFloor != 0) {
            var _msg = "";
            //_msg += this.storage.lastFloorNum + "Fに" + Math.ceil(this.storage.droppedSoulsAmount) + " の魂を落としている...\n";
            var _floorData = this.storage.getStageNumber(this.storage.lastFloorNum);
            _msg += _floorData['visibleNum'] + "に" + Math.ceil(this.storage.droppedSoulsAmount) + " の魂を落としている...\n";
            this.infoText = _msg;
        }

        this.droppedInfoLable = cc.LabelTTF.create(this.infoText, "Arial", CONFIG.CUTIN_FONT_SIZE);
        this.droppedInfoLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.droppedInfoLable.setAnchorPoint(0.5, 0);
        this.droppedInfoLable.setPosition(320, 240);
        this.droppedInfoLable.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.message2Sprite.addChild(this.droppedInfoLable);

        this.item201Button = new cc.MenuItemImage(
            "res/button_go_by_floor.png",
            "res/button_go_by_floor.png",
            function() {
                this.onTouchMsg201();
            }, this);
        this.item201Button.setAnchorPoint(0, 0);
        this.item201Button.setPosition(0, 90);

        this.soulText = "F" + this.floorNumber + "に行く";
        this.nextFloorLable = cc.LabelTTF.create(this.soulText, "Arial", CONFIG.CUTIN_FONT_SIZE);
        this.nextFloorLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.nextFloorLable.setAnchorPoint(0, 0);
        this.nextFloorLable.setPosition(60, 30);
        this.item201Button.addChild(this.nextFloorLable);

        this.item202Button = new cc.MenuItemImage(
            "res/button_up_floor.png",
            "res/button_up_floor.png",
            function() {
                this.onTouchMsg202();
            }, this);
        this.item202Button.setAnchorPoint(0, 0);
        this.item202Button.setPosition(300, 90);

        this.item203Button = new cc.MenuItemImage(
            "res/button_down_floor.png",
            "res/button_down_floor.png",
            function() {
                this.onTouchMsg203();
            }, this);
        this.item203Button.setAnchorPoint(0, 0);
        this.item203Button.setPosition(300, 0);

        this.item204Button = new cc.MenuItemImage(
            "res/button_goback.png",
            "res/button_goback.png",
            function() {
                this.onTouchMsg204();
            }, this);
        this.item204Button.setAnchorPoint(0, 0);
        this.item204Button.setPosition(0, 0);

        var menu2 = new cc.Menu(
            this.item201Button,
            this.item202Button,
            this.item203Button,
            this.item204Button
        );
        menu2.x = 0;
        menu2.y = 0;
        this.message2Sprite.addChild(menu2, 1);
        this.message2Sprite.setVisible(false);

    },

    setMessage3Window: function() {
        this.message3Sprite = cc.Sprite.create("res/message.png");
        this.message3Sprite.setPosition(320, 300);
        this.addChild(this.message3Sprite);

        this.item301Button = new cc.MenuItemImage(
            "res/buttern_answer_004.png",
            "res/buttern_answer_004.png",
            function() {
                this.onTouchMsg301();
            }, this);
        this.item301Button.setAnchorPoint(0.5, 0);
        this.item301Button.setPosition(320, 5);

        var menu2 = new cc.Menu(
            this.item301Button
        );
        menu2.x = 0;
        menu2.y = 0;
        this.message3Sprite.addChild(menu2, 1);
        if (this.storage.forceReturnStageNum == 0) {
            this.message3Sprite.setVisible(false);
        } else {
            this.message3Sprite.setVisible(true);
        }
    },

    setMessage4Window: function() {
        this.message4Sprite = cc.Sprite.create("res/message.png");
        this.message4Sprite.setPosition(320, 300);
        this.addChild(this.message4Sprite);
        this.message4Sprite.setVisible(false);

        this.soulText = "....";
        this.droppedInfoLable2 = cc.LabelTTF.create(this.soulText, "Arial", CONFIG.CUTIN_FONT_SIZE);
        this.droppedInfoLable2.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.droppedInfoLable2.setAnchorPoint(0, 0);
        this.droppedInfoLable2.setPosition(50, 120);
        this.message4Sprite.addChild(this.droppedInfoLable2);

        this.soulText = "...まだ魂はたまっていない.....";
        if (this.storage.getSoulAmount() > 0) {
            this.soulText = "...ふむ...." + this.storage.getSoulAmount() + "/" + this.storage.getMaxSoul() + "の魂を受け取ることができよう...";
        }
        this.droppedInfoLable2.setString(this.soulText);

        this.item401Button = new cc.MenuItemImage(
            "res/button_go_accept.png",
            "res/button_go_accept.png",
            function() {
                this.onTouchMsg401();
            }, this);
        this.item401Button.setAnchorPoint(0, 0);
        this.item401Button.setPosition(300, 0);

        this.item402Button = new cc.MenuItemImage(
            "res/button_goback.png",
            "res/button_goback.png",
            function() {
                this.onTouchMsg402();
            }, this);
        this.item402Button.setAnchorPoint(0, 0);
        this.item402Button.setPosition(0, 0);

        var menu4 = new cc.Menu(
            this.item401Button,
            this.item402Button
        );
        menu4.x = 0;
        menu4.y = 0;
        this.message4Sprite.addChild(menu4, 1);
    },

    onTouchMsg001: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.messageSprite.setVisible(false);
        this.message2Sprite.setVisible(true);
    },
    onTouchMsg002: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);

        this.messages = CONFIG.GUIDE_MESSAGE_101;
        var _rand = getRandNumberFromRange(1, 7);
        if (_rand == 1) {
            this.messages = CONFIG.GUIDE_MESSAGE_101;
        }
        if (_rand == 2) {
            this.messages = CONFIG.GUIDE_MESSAGE_102;
        }
        if (_rand == 3) {
            this.messages = CONFIG.GUIDE_MESSAGE_103;
        }
        if (_rand == 4) {
            this.messages = CONFIG.GUIDE_MESSAGE_104;
        }
        if (_rand == 5) {
            this.messages = CONFIG.GUIDE_MESSAGE_105;
        }
        if (_rand == 6) {
            this.messages = CONFIG.GUIDE_MESSAGE_106;
        }
        if (_rand == 7) {
            this.messages = CONFIG.GUIDE_MESSAGE_107;
        }
        this.isSendedMsg = false;
    },
    onTouchMsg003: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        //cc.sys.localStorage.clear();
        var _second = this.storage.getPastSecond();
        cc.log("経過した時間は" + _second + "secです.");
        this.message4Sprite.setVisible(true);
    },
    onTouchMsg004: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.onTouchStatus();
    },
    onTouchMsg005: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.onTouchLeftHandStatus();
    },
    onTouchMsg006: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.onTouchRightHandStatus();
    },
    onTouchMsg201: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        playSESystem(this.storage);
        this.goToGameLayer();
    },
    onTouchMsg202: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.floorNumber += 1;
        if (this.floorNumber >= this.maxClearedFloor) {
            this.floorNumber = this.maxClearedFloor;
        }

        this.soulText = "F" + this.floorNumber + "に行く";
        this.nextFloorLable.setString(this.soulText);
    },
    onTouchMsg203: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.floorNumber -= 1;
        if (this.floorNumber <= 1) {
            this.floorNumber = 1;
        }

        this.soulText = "F" + this.floorNumber + "に行く";
        this.nextFloorLable.setString(this.soulText);
    },
    onTouchMsg204: function() {
        if (this.isSetMenus()) return;
        playSESystem(this.storage);
        this.messageSprite.setVisible(true);
        this.message2Sprite.setVisible(false);
    },

    onTouchMsg301: function() {
        playSESystem(this.storage);
        this.floorNumber = this.storage.forceReturnStageNum;
        this.goToGameLayer();
    },

    onTouchMsg401: function() {
        playSESystem(this.storage);
        this.storage.setSoulByPastTime();
        this.soulText = "...まだ魂はたまっていない.....";
        this.droppedInfoLable2.setString(this.soulText);
    },

    onTouchMsg402: function() {
        playSESystem(this.storage);
        this.message4Sprite.setVisible(false);
    },

    isSetMenus: function() {
        if (this.StatusWindow.isVisible()) {
            return true;
        }
        if (this.LeftHandWindow.isVisible()) {
            return true;
        }
        if (this.RightHandWindow.isVisible()) {
            return true;
        }
        if (this.message3Sprite.isVisible()) {
            return true;
        }
        if (this.cutIn2.isVisible()) {
            return true;
        }
        return false;
    },

    onTouchStatus: function(sender) {
        cc.log("Touch Button1");
        if (this.StatusWindow.isVisible() == true) {
            this.StatusWindow.set_visible(false, "status");
            this.LeftHandWindow.set_visible(false, "left_hand");
            this.RightHandWindow.set_visible(false, "right_hand");
        } else {
            this.StatusWindow.set_visible(true, "status");
            this.LeftHandWindow.set_visible(false, "left_hand");
            this.RightHandWindow.set_visible(false, "right_hand");
        }
    },

    onTouchLeftHandStatus: function(sender) {
        cc.log("Touch Button2");
        if (this.LeftHandWindow.isVisible() == true) {
            this.StatusWindow.set_visible(false, "status");
            this.LeftHandWindow.set_visible(false, "left_hand");
            this.RightHandWindow.set_visible(false, "right_hand");
        } else {
            this.StatusWindow.set_visible(false, "status");
            this.LeftHandWindow.set_visible(true, "left_hand");
            this.RightHandWindow.set_visible(false, "right_hand");
        }
    },

    onTouchRightHandStatus: function(sender) {
        cc.log("Touch Button3");
        if (this.StatusWindow.isVisible() == true) {
            this.StatusWindow.set_visible(false, "status");
            this.LeftHandWindow.set_visible(false, "left_hand");
            this.RightHandWindow.set_visible(false, "right_hand");
        } else {
            this.StatusWindow.set_visible(false, "status");
            this.LeftHandWindow.set_visible(false, "left_hand");
            this.RightHandWindow.set_visible(true, "right_hand");
        }
    },

    //シーンの切り替え----->
    goToGameLayer: function(pSender) {
        var scene = cc.Scene.create();
        scene.addChild(
            GameLayer.create(
                this.storage,
                this.floorNumber
            )
        );
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
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

});

var StageButtonSprite = cc.Node.extend({
    ctor: function(current, stageNum) {
        this._super();
        this.isLocked = false;

        this.cardSprite = cc.Sprite.create(res.Ui_Stage_Card_png);
        this.cardSprite.setAnchorPoint(0.5, 0.5);
        this.cardSprite.setPosition(320, 0);
        this.addChild(this.cardSprite);

        //var tag = pTag || 1;
        var titleButton = new cc.MenuItemImage(res.Button_Stage_Start_png, res.Button_Stage_Start_png, function() {
            current.goToGameLayer();
        }, this);
        var menu = new cc.Menu(titleButton);
        menu.setPosition(420 / 2, 120);
        this.cardSprite.addChild(menu);

        this.titleLable = cc.LabelTTF.create("xxx", "Arial", 45);
        this.titleLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.titleLable.setAnchorPoint(0.5, 0);
        this.titleLable.setPosition(420 / 2, 400);
        this.cardSprite.addChild(this.titleLable);

        this.detailLable = cc.LabelTTF.create("xxx", "Arial", 35);
        this.detailLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.detailLable.setAnchorPoint(0.5, 0);
        this.detailLable.setPosition(420 / 2, 350);
        this.cardSprite.addChild(this.detailLable);

        this.maxClearedFloorLable = cc.LabelTTF.create("xxx", "Arial", 35);
        this.maxClearedFloorLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.maxClearedFloorLable.setAnchorPoint(0.5, 0);
        this.maxClearedFloorLable.setPosition(420 / 2, 300);
        this.cardSprite.addChild(this.maxClearedFloorLable);

        this.titleLable.setString(current.stageData[stageNum]['title']);
        this.detailLable.setString(current.stageData[stageNum]['detail']);
    },
    update: function() {}
});
QuestLayer.create = function(storage) {
    return new QuestLayer(storage);
};
var QuestLayerScene = cc.Scene.extend({
    onEnter: function(storage) {
        this._super();
        var layer = new QuestLayer(storage);
        this.addChild(layer);
    }
});