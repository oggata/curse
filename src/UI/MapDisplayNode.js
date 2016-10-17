var mapDisplayNode = cc.Node.extend({

    ctor: function(game) {
        this._super();
        this.game = game;

        var floorData = this.game.storage.getStageNumber(this.game._stageNum);
        var floorNum = floorData['floorNum'];
        this.imageSide = "res/map_object_blue_001.png";
        this.imageBack = "res/map_object_blue_003.png";
        this.imageDoor = "res/map_object_blue_002.png";
        var floorImageId = floorNum % 5;
        if (floorImageId == 0) {
            this.imageSide = "res/map_object_black_001.png";
            this.imageBack = "res/map_object_black_003.png";
            this.imageDoor = "res/map_object_black_002.png";
        } else if(floorImageId == 1) {
            this.imageSide = "res/map_object_blue_001.png";
            this.imageBack = "res/map_object_blue_003.png";
            this.imageDoor = "res/map_object_blue_002.png";
        } else if(floorImageId == 2) {
            this.imageSide = "res/map_object_yellow_001.png";
            this.imageBack = "res/map_object_yellow_003.png";
            this.imageDoor = "res/map_object_yellow_002.png";
        } else if(floorImageId == 3) {
            this.imageSide = "res/map_object_red_001.png";
            this.imageBack = "res/map_object_red_003.png";
            this.imageDoor = "res/map_object_red_002.png";
        } else if(floorImageId == 4) {
            this.imageSide = "res/map_object_green_001.png";
            this.imageBack = "res/map_object_green_003.png";
            this.imageDoor = "res/map_object_green_002.png";
        }

        var frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageBack, cc.rect(0, 542 * i, 632, 542));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.backgroundSprite = cc.Sprite.create(this.imageBack, cc.rect(0, 0, 660, 480));
        this.backgroundSprite.runAction(this.ra);

        this.backgroundSprite.setAnchorPoint(0, 0);
        this.backgroundSprite.setPosition(0, 0);
        this.addChild(this.backgroundSprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480*i, 660, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.15);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectL1Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 660, 480));
        this.mapObjectL1Sprite.runAction(this.ra);
        this.mapObjectL1Sprite.setScale(0.4);
        this.mapObjectL1Sprite.setAnchorPoint(0, 0);
        this.mapObjectL1Sprite.setPosition(-20, 180);
        this.mapObjectL1Sprite.setVisible(false);
        this.addChild(this.mapObjectL1Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480*i, 660, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.08);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectR1Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 660, 480));
        this.mapObjectR1Sprite.runAction(this.ra);
        this.mapObjectR1Sprite.setFlippedX(true);
        this.mapObjectR1Sprite.setScale(0.4);
        this.mapObjectR1Sprite.setAnchorPoint(0, 0);
        this.mapObjectR1Sprite.setPosition(380, 180);
        this.mapObjectR1Sprite.setVisible(false);
        this.addChild(this.mapObjectR1Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480 * i, 555, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.12);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectC1Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 555, 480));
        this.mapObjectC1Sprite.runAction(this.ra);

        this.mapObjectC1Sprite.setScale(0.38);
        this.mapObjectC1Sprite.setAnchorPoint(0, 0);
        this.mapObjectC1Sprite.setPosition(210, 180);
        this.mapObjectC1Sprite.setVisible(false);
        this.addChild(this.mapObjectC1Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480*i, 660, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.14);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectL2Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 660, 480));
        this.mapObjectL2Sprite.runAction(this.ra);
        this.mapObjectL2Sprite.setScale(0.64,0.64);
        this.mapObjectL2Sprite.setAnchorPoint(0,0);
        this.mapObjectL2Sprite.setPosition(-215,120);
        this.mapObjectL2Sprite.setVisible(false);
        this.addChild(this.mapObjectL2Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480*i, 660, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.19);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectR2Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 660, 480));
        this.mapObjectR2Sprite.runAction(this.ra);
        this.mapObjectR2Sprite.setFlippedX(true);
        this.mapObjectR2Sprite.setScale(0.64,0.64);
        this.mapObjectR2Sprite.setAnchorPoint(0, 0);
        this.mapObjectR2Sprite.setPosition(420, 120);
        this.mapObjectR2Sprite.setVisible(false);
        this.addChild(this.mapObjectR2Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480 * i, 555, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.12);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectC2Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 555, 480));
        this.mapObjectC2Sprite.runAction(this.ra);

        this.mapObjectC2Sprite.setScale(0.64);
        this.mapObjectC2Sprite.setAnchorPoint(0, 0);
        this.mapObjectC2Sprite.setPosition(135, 120);
        this.mapObjectC2Sprite.setVisible(false);
        this.addChild(this.mapObjectC2Sprite);


        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480*i, 660, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.09);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));

        this.mapObjectL3Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 660, 480));
        this.mapObjectL3Sprite.runAction(this.ra);

        this.mapObjectL3Sprite.setAnchorPoint(0,0);
        this.mapObjectL3Sprite.setPosition(-520,40);
        this.mapObjectL3Sprite.setVisible(false);
        this.addChild(this.mapObjectL3Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480*i, 660, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectR3Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 660, 480));
        this.mapObjectR3Sprite.runAction(this.ra);

        this.mapObjectR3Sprite.setFlippedX(true);
        this.mapObjectR3Sprite.setAnchorPoint(0, 0);
        this.mapObjectR3Sprite.setPosition(485,40);
        this.mapObjectR3Sprite.setVisible(false);
        this.addChild(this.mapObjectR3Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageSide, cc.rect(0, 480 * i, 555, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.07);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectC3Sprite = cc.Sprite.create(this.imageSide, cc.rect(0, 0, 555, 480));
        this.mapObjectC3Sprite.runAction(this.ra);

        this.mapObjectC3Sprite.setAnchorPoint(0, 0);
        this.mapObjectC3Sprite.setPosition(40, 40);
        this.mapObjectC3Sprite.setVisible(false);
        this.addChild(this.mapObjectC3Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/map_start.png", cc.rect(530 * i, 0, 530, 376));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.07);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectS2Sprite = cc.Sprite.create("res/map_start.png", cc.rect(0, 0, 530, 376));
        this.mapObjectS2Sprite.runAction(this.ra);
        this.mapObjectS2Sprite.setOpacity(255 * 0.5);
        this.mapObjectS2Sprite.setAnchorPoint(0, 0);
        this.mapObjectS2Sprite.setPosition(140, 130);
        this.mapObjectS2Sprite.setScale(0.64);
        this.mapObjectS2Sprite.setVisible(false);
        this.addChild(this.mapObjectS2Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/map_start.png", cc.rect(530 * i, 0, 530, 376));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.07);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectS3Sprite = cc.Sprite.create("res/map_start.png", cc.rect(0, 0, 530, 376));
        this.mapObjectS3Sprite.runAction(this.ra);
        this.mapObjectS3Sprite.setOpacity(255 * 0.5);
        this.mapObjectS3Sprite.setAnchorPoint(0, 0);
        this.mapObjectS3Sprite.setPosition(40, 40);
        this.mapObjectS3Sprite.setVisible(false);
        this.addChild(this.mapObjectS3Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/map_finish.png", cc.rect(530 * i, 0, 530, 376));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.07);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectF2Sprite = cc.Sprite.create("res/map_finish.png", cc.rect(0, 0, 530, 376));
        this.mapObjectF2Sprite.runAction(this.ra);
        this.mapObjectF2Sprite.setOpacity(255 * 0.5);
        this.mapObjectF2Sprite.setAnchorPoint(0, 0);
        this.mapObjectF2Sprite.setPosition(140, 130);
        this.mapObjectF2Sprite.setScale(0.64);
        this.mapObjectF2Sprite.setVisible(false);
        this.addChild(this.mapObjectF2Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create("res/map_finish.png", cc.rect(530 * i, 0, 530, 376));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.07);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectF3Sprite = cc.Sprite.create("res/map_finish.png", cc.rect(0, 0, 530, 376));
        this.mapObjectF3Sprite.runAction(this.ra);
        this.mapObjectF3Sprite.setOpacity(255 * 0.5);
        this.mapObjectF3Sprite.setAnchorPoint(0, 0);
        this.mapObjectF3Sprite.setPosition(40, 40);
        this.mapObjectF3Sprite.setVisible(false);
        this.addChild(this.mapObjectF3Sprite);


        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageDoor, cc.rect(0, 480 * i, 555, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.07);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectD3Sprite = cc.Sprite.create(this.imageDoor, cc.rect(0, 0, 555, 480));
        this.mapObjectD3Sprite.runAction(this.ra);
        this.mapObjectD3Sprite.setAnchorPoint(0, 0);
        this.mapObjectD3Sprite.setPosition(40, 40);
        this.mapObjectD3Sprite.setVisible(false);
        this.addChild(this.mapObjectD3Sprite);

        frameSeq = [];
        for (var i = 0; i < 5; i++) {
            var frame = cc.SpriteFrame.create(this.imageDoor, cc.rect(0, 480 * i, 555, 480));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.12);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.mapObjectD2Sprite = cc.Sprite.create(this.imageDoor, cc.rect(0, 0, 555, 480));
        this.mapObjectD2Sprite.runAction(this.ra);
        this.mapObjectD2Sprite.setScale(0.64);
        this.mapObjectD2Sprite.setAnchorPoint(0, 0);
        this.mapObjectD2Sprite.setPosition(135, 120);
        this.mapObjectD2Sprite.setVisible(false);
        this.addChild(this.mapObjectD2Sprite);
    },

    setDisplay: function(tpos) {

        this.l1 = this.game.MAP_POSITIONS[tpos[0]];
        this.c1 = this.game.MAP_POSITIONS[tpos[1]];
        this.r1 = this.game.MAP_POSITIONS[tpos[2]];

        this.l2 = this.game.MAP_POSITIONS[tpos[3]];
        this.c2 = this.game.MAP_POSITIONS[tpos[4]];
        this.r2 = this.game.MAP_POSITIONS[tpos[5]];

        this.l3 = this.game.MAP_POSITIONS[tpos[6]];
        this.c3 = this.game.MAP_POSITIONS[tpos[7]];
        this.r3 = this.game.MAP_POSITIONS[tpos[8]];

        if (this.l1 == 1) {
            this.mapObjectL1Sprite.setVisible(true);
        } else {
            this.mapObjectL1Sprite.setVisible(false);
        }

        if (this.c1 == 1) {
            this.mapObjectC1Sprite.setVisible(true);
        } else {
            this.mapObjectC1Sprite.setVisible(false);
        }

        if (this.r1 == 1) {
            this.mapObjectR1Sprite.setVisible(true);
        } else {
            this.mapObjectR1Sprite.setVisible(false);
        }

        if (this.l2 == 1) {
            this.mapObjectL2Sprite.setVisible(true);
        } else {
            this.mapObjectL2Sprite.setVisible(false);
        }

        if (this.c2 == 1) {
            this.mapObjectC2Sprite.setVisible(true);
        } else {
            this.mapObjectC2Sprite.setVisible(false);
        }

        if (this.c2 == 2) {
            this.mapObjectD2Sprite.setVisible(true);
        } else {
            this.mapObjectD2Sprite.setVisible(false);
        }

        if (this.r2 == 1) {
            this.mapObjectR2Sprite.setVisible(true);
        } else {
            this.mapObjectR2Sprite.setVisible(false);
        }

        if (this.l3 == 1) {
            this.mapObjectL3Sprite.setVisible(true);
        } else {
            this.mapObjectL3Sprite.setVisible(false);
        }

        if (this.c3 == 1) {
            this.mapObjectC3Sprite.setVisible(true);
        } else {
            this.mapObjectC3Sprite.setVisible(false);
        }

        if (this.c3 == 2) {
            this.mapObjectD3Sprite.setVisible(true);
        } else {
            this.mapObjectD3Sprite.setVisible(false);
        }

        if (this.r3 == 1) {
            this.mapObjectR3Sprite.setVisible(true);
        } else {
            this.mapObjectR3Sprite.setVisible(false);
        }

        if (tpos[4] == this.game.finishPosNum) {
            this.mapObjectF2Sprite.setVisible(true);
        } else {
            this.mapObjectF2Sprite.setVisible(false);
        }

        if (tpos[7] == this.game.finishPosNum) {
            this.mapObjectF3Sprite.setVisible(true);
        } else {
            this.mapObjectF3Sprite.setVisible(false);
        }

        if (tpos[4] == this.game.startPosNum) {
            this.mapObjectS2Sprite.setVisible(true);
        } else {
            this.mapObjectS2Sprite.setVisible(false);
        }

        if (tpos[7] == this.game.startPosNum) {
            this.mapObjectS3Sprite.setVisible(true);
        } else {
            this.mapObjectS3Sprite.setVisible(false);
        }
    },
});