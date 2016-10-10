var TopLayer = cc.Layer.extend({
    sprite: null,
    ctor: function() {
        //cc.sys.localStorage.clear();
        //////////////////////////////
        // 1. super init first
        this._super();
        this.viewSize = cc.director.getVisibleSize();

        //キャラクターをセット
        this.back = cc.Sprite.create("res/default.png");
        this.back.setPosition(0, 0);
        this.back.setAnchorPoint(0, 0);
        this.addChild(this.back);

        this.messages = [];
        this.storage = new Storage();
        try {
            var _data = cc.sys.localStorage.getItem("gameStorage");
            cc.log("...1");
            if (_data == null) {
                cc.log("dataはnullなので新たに作成します.");
                var _getData = this.storage.getDataFromStorage();
                cc.sys.localStorage.setItem("gameStorage", _getData);
                var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                this.storage.setDataToStorage(JSON.parse(_acceptData));
            }
            if (_data != null) {
                var storageData = JSON.parse(cc.sys.localStorage.getItem("gameStorage"));
                cc.log("...2");
                if (storageData["saveData"] == true) {
                    cc.log("保存されたデータがあります");
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    cc.log(_acceptData);
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                } else {
                    cc.log("保存されたデータはありません");
                    var _getData = this.storage.getDataFromStorage();
                    cc.sys.localStorage.setItem("gameStorage", _getData);
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                }
            }
        } catch (e) {
            cc.log("例外..");
            cc.sys.localStorage.clear();
        }

        var gameButton = new cc.MenuItemImage(
            "res/button_start.png",
            "res/button_start_on.png",
            function() {
                this.goToQuesetLayer();
            }, this);
        gameButton.setPosition(320, 200);

        var scoreButton = new cc.MenuItemImage(
            "res/button_score.png",
            "res/button_score.png",
            function() {
                sdkbox.PluginSdkboxPlay.signin();
                //sdkbox.PluginSdkboxPlay.showLeaderboard("max_floor");
                sdkbox.PluginSdkboxPlay.showAchievements();
            }, this);
        scoreButton.setPosition(320, 200);

        //var menu = new cc.Menu(gameButton, scoreButton);
        var menu = new cc.Menu(gameButton);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        this.touchingFlg = 0;

        var initSDK = function() {
            if ("undefined" == typeof(sdkbox)) {
                console.log("sdkbox is not exist")
                return
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
        }

        initSDK();
        this.scheduleUpdate();
        return true;
    },

    //シーンの切り替え----->
    goToQuesetLayer: function(pSender) {
        var scene = cc.Scene.create();
        scene.addChild(
            QuestLayer.create(
                this.storage
            )
        );
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },

    update: function(dt) {

    },
});

TopLayer.create = function() {
    return new TopLayer();
};

var TopLayerScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new TopLayer();
        this.addChild(layer);
    }
});