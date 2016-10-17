var Tower = cc.Node.extend({

    ctor: function(game, enemyLevel, isBoss, posNum) {
        this._super();
        this.game = game;

        //背景をset
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
    },

    update:function(){
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

    },
});