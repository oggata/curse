var StatusButtonSprite = cc.Node.extend({
    ctor: function(game, statusWindow, productName, productId, level) {
        this._super();
        this.game = game;
        this.storage = this.game.storage;
        this.level = level;

        this.itemButtonSprite = cc.Sprite.create(
            "res/button_quest_list_update.png"
        );
        this.itemButtonSprite.setAnchorPoint(0.5, 0);
        this.addChild(this.itemButtonSprite);

        if (productId == "status_hp") {
            this.image = "res/card201.png";
        } else if (productId == "status_attack") {
            this.image = "res/card001.png";
        } else if (productId == "status_defence") {
            this.image = "res/card202.png";
        } else if (productId == "status_magic_fire") {
            this.image = "res/card004.png";
        } else if (productId == "status_magic_light") {
            this.image = "res/card005.png";
        } else if (productId == "status_magic_snow") {
            this.image = "res/card006.png";
        } else if (productId == "status_recover") {
            this.image = "res/card008.png";
        } else if (productId == "status_fast") {
            this.image = "res/card203.png";
        } else if (productId == "status_luck") {
            this.image = "res/card204.png";
        } else {
            this.image = "res/card001.png";
        }


        this.cardSprite = cc.Sprite.create(
            this.image
        );
        this.cardSprite.setAnchorPoint(0, 0);
        this.cardSprite.setScale(0.35, 0.35);
        this.cardSprite.setPosition(5, 7);
        this.itemButtonSprite.addChild(this.cardSprite);

        this.titleLabel = cc.LabelTTF.create(productName, CONFIG.FONT, 20);
        this.titleLabel.setAnchorPoint(0, 0.5);
        this.titleLabel.setPosition(70, 70 / 2);
        this.titleLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.itemButtonSprite.addChild(this.titleLabel);

        this.levelLabel = cc.LabelTTF.create("lv." + level, CONFIG.FONT, 20);
        this.levelLabel.setAnchorPoint(0, 0.5);
        this.levelLabel.setPosition(335, 45);
        this.levelLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.itemButtonSprite.addChild(this.levelLabel);

        this.powerImage = this.getPowerSpriteImage();
        this.powerSprite = cc.Sprite.create(
            this.powerImage
        );
        this.powerSprite.setAnchorPoint(0, 0);
        this.powerSprite.setPosition(180, 14);
        this.itemButtonSprite.addChild(this.powerSprite);

        this.setNextGemAndCoinAmount();

        this.itemButton = new cc.MenuItemImage(
            "res/button_stage_lebel_update_selected.png",
            "res/button_stage_lebel_update_selected.png",
            function() {
                if (this.levelUptype == "coin") {
                    playSESystem(this.storage);
                    if (game.storage.tmpSoulsAmount >= this.nextCoinAmount) {
                        //game.storage.tmpSoulsAmount -= this.nextCoinAmount;
                        game.storage.useSouls(this.nextCoinAmount);
                        this.game.storage.saveItemDataToStorage(productId, 1);
                        this.addLevel();
                    } else {
                        statusWindow.errorLayer.setVisible(true);
                    }
                }
                if (this.levelUptype == "gem") {
                    playSESystem(this.storage);
                    if (game.storage.totalGemAmount >= this.nextGemAmount) {
                        game.storage.totalGemAmount -= this.nextGemAmount;
                        this.game.storage.saveItemDataToStorage(productId, 1);
                        this.addLevel();
                    } else {
                        statusWindow.errorLayer.setVisible(true);
                    }
                }

            }, this);
        this.itemButton.setAnchorPoint(0, 0);
        this.itemButton.setPosition(390, 10);

        this.icon001Sprite = this.getPowerSpriteImage();
        this.icon001Sprite = cc.Sprite.create(
            "res/ui_item_type_001.png"
        );
        this.icon001Sprite.setAnchorPoint(0, 0);
        this.icon001Sprite.setPosition(5, 3);
        this.itemButton.addChild(this.icon001Sprite);

        this.icon002Sprite = this.getPowerSpriteImage();
        this.icon002Sprite = cc.Sprite.create(
            "res/ui_item_type_002.png"
        );
        this.icon002Sprite.setAnchorPoint(0, 0);
        this.icon002Sprite.setPosition(5, 3);
        this.itemButton.addChild(this.icon002Sprite);

        var menuSetting = new cc.Menu(this.itemButton);
        menuSetting.setPosition(0, 0);
        this.itemButtonSprite.addChild(menuSetting);

        var _amountLabel = this.getAmountLabel();
        this.amountLabel = cc.LabelTTF.create(_amountLabel, CONFIG.FONT, 20);
        this.amountLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.amountLabel.setAnchorPoint(0, 0);
        this.amountLabel.setPosition(60, 12);
        //this.amountLabel.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.itemButton.addChild(this.amountLabel);
    },

    getAmountLabel: function() {
        this.icon001Sprite.setVisible(true);
        this.icon002Sprite.setVisible(false);
        var _amountLabel = "x" + "" + this.nextCoinAmount + "";
        if (this.levelUptype == "gem") {
            this.icon001Sprite.setVisible(false);
            this.icon002Sprite.setVisible(true);
            _amountLabel = "x" + "" + this.nextGemAmount + "";
        }
        return _amountLabel;
    },

    setNextGemAndCoinAmount: function() {
        this.levelUptype = "coin";
        /*
        this.levelUpNum = this.level % 2;
        if (this.levelUpNum == 1) {
            this.levelUptype = "gem";
        }
        if (this.level <= 10) {
            this.levelUptype = "coin";
        }
        */
        this.nextCoinAmount = this.game.storage.getExpAmountByLevel(this.level);
        this.nextGemAmount = this.game.storage.getExpAmountByLevel(this.level);
    },

    getPowerSpriteImage: function() {
        this.powerImage = "res/ui_level_001.png";
        if (this.level % 6 == 1) {
            this.powerImage = "res/ui_level_001.png";
        }
        if (this.level % 6 == 2) {
            this.powerImage = "res/ui_level_002.png";
        }
        if (this.level % 6 == 3) {
            this.powerImage = "res/ui_level_003.png";
        }
        if (this.level % 6 == 4) {
            this.powerImage = "res/ui_level_004.png";
        }
        if (this.level % 6 == 5) {
            this.powerImage = "res/ui_level_005.png";
        }
        if (this.level % 6 == 6) {
            this.powerImage = "res/ui_level_006.png";
        }
        return this.powerImage;
    },

    addLevel: function() {
        this.nextLebel = this.level += 1;
        this.level = this.nextLebel;
        this.levelLabel.setString("lv." + this.nextLebel);

        this.itemButtonSprite.removeChild(this.powerSprite);
        this.powerImage = this.getPowerSpriteImage();
        this.powerSprite = cc.Sprite.create(
            this.powerImage
        );
        this.powerSprite.setAnchorPoint(0, 0);
        this.powerSprite.setPosition(180, 14);
        this.itemButtonSprite.addChild(this.powerSprite);

        this.setNextGemAndCoinAmount();
        var _amountLabel = this.getAmountLabel();
        this.amountLabel.setString(_amountLabel);
    }
});