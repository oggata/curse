var StatusButtonSprite = cc.Node.extend({
    ctor: function(game, targetId) {
        this._super();
        this.game = game;
        this.storage = this.game.storage;
        
        this.productName = CONFIG.ITEMS[targetId]['name'];
        this.productId = CONFIG.ITEMS[targetId]['product_id'];
        this.descriptionTxt = CONFIG.ITEMS[targetId]['description'];

        this.itemButtonSprite = cc.Sprite.create(
            "res/item_list.png"
        );
        this.itemButtonSprite.setAnchorPoint(0, 0);
        this.addChild(this.itemButtonSprite);

        this.titleLabel = cc.LabelTTF.create(this.productName, CONFIG.FONT, 21);
        this.titleLabel.setAnchorPoint(0, 0.5);
        this.titleLabel.setPosition(140, 110);
        this.titleLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.itemButtonSprite.addChild(this.titleLabel);

        this.descriptionLabel = cc.LabelTTF.create(this.descriptionTxt, CONFIG.FONT, 21);
        this.descriptionLabel.setAnchorPoint(0, 1);
        this.descriptionLabel.setPosition(140, 80);
        this.descriptionLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.itemButtonSprite.addChild(this.descriptionLabel);

        this.itemButton = new cc.MenuItemImage(
            "res/button_update.png",
            "res/button_update.png",
            function() {
                playSESystem(this.storage);
                this.nextCoinAmount = this.storage.getAmountFromData(this.productId);
                if (game.storage.tmpSoulsAmount >= this.nextCoinAmount) {
                    game.storage.tmpSoulsAmount -= this.nextCoinAmount;
                    game.storage.useSouls(this.nextCoinAmount);
                    this.game.storage.saveItemDataToStorage(this.productId, 1);
                    this.addLevel();
                } else {
                    //game.statusWindow.errorLayer.setVisible(true);
                }
            }, this);
        this.itemButton.setAnchorPoint(0, 0);
        this.itemButton.setPosition(470, 20);

        var menuSetting = new cc.Menu(this.itemButton);
        menuSetting.setPosition(0, 0);
        this.itemButtonSprite.addChild(menuSetting);

        this.levelLabel = cc.LabelTTF.create("lv12", CONFIG.FONT, 24);
        this.levelLabel.setAnchorPoint(1, 0);
        this.levelLabel.setPosition(590, 100);
        this.levelLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.itemButtonSprite.addChild(this.levelLabel);

        this.amountLabel = cc.LabelTTF.create("x10000", CONFIG.FONT, 24);
        //this.amountLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.amountLabel.setAnchorPoint(1, 0);
        this.amountLabel.setPosition(590, 70);
        this.levelLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.itemButtonSprite.addChild(this.amountLabel);

        //this.amountLabel.setString(this.storage.getAmountFromData(this.productId));
        this.nextCoinAmount = this.storage.getAmountFromData(this.productId);

        this.setCardImage();

        this.setCardVisible(this.productId);
    },
/*
    setGaugeImage : function(){
        //buttonNodeを作る
        this.gaugeBaseNode = cc.Node.create();
        this.addChild(this.gaugeBaseNode);

        this.gauge001Sprite = cc.Sprite.create("res/ui_level_001.png");
        this.gaugeBaseNode.addChild(this.gauge001Sprite);
        this.gauge002Sprite = cc.Sprite.create("res/ui_level_002.png");
        this.gaugeBaseNode.addChild(this.gauge002Sprite);
        this.gauge003Sprite = cc.Sprite.create("res/ui_level_003.png");
        this.gaugeBaseNode.addChild(this.gauge003Sprite);
        this.gauge004Sprite = cc.Sprite.create("res/ui_level_004.png");
        this.gaugeBaseNode.addChild(this.gauge004Sprite);
        this.gauge005Sprite = cc.Sprite.create("res/ui_level_005.png");
        this.gaugeBaseNode.addChild(this.gauge005Sprite);
        this.gauge006Sprite = cc.Sprite.create("res/ui_level_006.png");
        this.gaugeBaseNode.addChild(this.gauge006Sprite);
        this.gauge007Sprite = cc.Sprite.create("res/ui_level_007.png");
        this.gaugeBaseNode.addChild(this.gauge007Sprite);
    },

    setGaugeVisible : function(level){
        this.gauge001Sprite.setVisible(false);
        this.gauge002Sprite.setVisible(false);
        this.gauge003Sprite.setVisible(false);
        this.gauge004Sprite.setVisible(false);
        this.gauge005Sprite.setVisible(false);
        this.gauge006Sprite.setVisible(false);
        this.gauge007Sprite.setVisible(false);

        switch (level){
          case 1:
            this.gauge001Sprite.setVisible(true);
            break;
          case 2:
            this.gauge002Sprite.setVisible(true);
            break;
          case 3:
            this.gauge003Sprite.setVisible(true);
            break;
          case 4:
            this.gauge004Sprite.setVisible(true);
            break;
          case 5:
            this.gauge005Sprite.setVisible(true);
            break;
          case 6:
            this.gauge006Sprite.setVisible(true);
            break;
          case 7:
            this.gauge007Sprite.setVisible(true);
            break;
        }
    },
*/

    setCardImage : function(){
        //buttonNodeを作る
        this.cardBaseNode = cc.Node.create();
        this.addChild(this.cardBaseNode);

        this.card001Sprite = cc.Sprite.create("res/card001.png");
        this.cardBaseNode.addChild(this.card001Sprite);
        this.card004Sprite = cc.Sprite.create("res/card004.png");
        this.cardBaseNode.addChild(this.card004Sprite);
        this.card005Sprite = cc.Sprite.create("res/card005.png");
        this.cardBaseNode.addChild(this.card005Sprite);
        this.card006Sprite = cc.Sprite.create("res/card006.png");
        this.cardBaseNode.addChild(this.card006Sprite);
        this.card007Sprite = cc.Sprite.create("res/card007.png");
        this.cardBaseNode.addChild(this.card007Sprite);
        this.card008Sprite = cc.Sprite.create("res/card008.png");
        this.cardBaseNode.addChild(this.card008Sprite);
        this.card009Sprite = cc.Sprite.create("res/card009.png");
        this.cardBaseNode.addChild(this.card009Sprite);
        this.card010Sprite = cc.Sprite.create("res/card010.png");
        this.cardBaseNode.addChild(this.card010Sprite);
        this.card011Sprite = cc.Sprite.create("res/card011.png");
        this.cardBaseNode.addChild(this.card011Sprite);
        this.card012Sprite = cc.Sprite.create("res/card012.png");
        this.cardBaseNode.addChild(this.card012Sprite);
        this.card201Sprite = cc.Sprite.create("res/card201.png");
        this.cardBaseNode.addChild(this.card201Sprite);
        this.card202Sprite = cc.Sprite.create("res/card202.png");
        this.cardBaseNode.addChild(this.card202Sprite);
        this.card203Sprite = cc.Sprite.create("res/card203.png");
        this.cardBaseNode.addChild(this.card203Sprite);
        this.card204Sprite = cc.Sprite.create("res/card204.png");
        this.cardBaseNode.addChild(this.card204Sprite);
        this.card205Sprite = cc.Sprite.create("res/card205.png");
        this.cardBaseNode.addChild(this.card205Sprite);

        this.cardBaseNode.setScale(0.6,0.6);
        this.cardBaseNode.setPosition(60,72);
    },

    setCardVisible : function(productId){
        this.card001Sprite.setVisible(false);
        this.card004Sprite.setVisible(false);
        this.card005Sprite.setVisible(false);
        this.card006Sprite.setVisible(false);
        this.card007Sprite.setVisible(false);
        this.card008Sprite.setVisible(false);
        this.card009Sprite.setVisible(false);
        this.card010Sprite.setVisible(false);
        this.card011Sprite.setVisible(false);
        this.card012Sprite.setVisible(false);
        this.card201Sprite.setVisible(false);
        this.card202Sprite.setVisible(false);
        this.card203Sprite.setVisible(false);
        this.card204Sprite.setVisible(false);
        this.card205Sprite.setVisible(false);

        switch (productId){
          case "status_hp":
            this.card201Sprite.setVisible(true);
            break;
          case "status_attack":
            this.card001Sprite.setVisible(true);
            break;
          case "status_defence":
            this.card205Sprite.setVisible(true);
            break;
          case "status_magic_fire":
            this.card004Sprite.setVisible(true);
            break;
          case "status_magic_light":
            this.card005Sprite.setVisible(true);
            break;
          case "status_magic_snow":
            this.card006Sprite.setVisible(true);
            break;
          case "status_recover":
            this.card008Sprite.setVisible(true);
            break;
          case "status_fast":
            this.card203Sprite.setVisible(true);
            break;
          case "status_luck":
            this.card204Sprite.setVisible(true);
            break;
          case "status_killed":
            this.card007Sprite.setVisible(true);
            break;
          case "status_miss":
            this.card010Sprite.setVisible(true);
            break;
          case "status_reset":
            this.card011Sprite.setVisible(true);
            break;
          case "status_sp":
            this.card012Sprite.setVisible(true);
            break;
        }
    },

    setContent:function(targetId){
        this.productName = CONFIG.ITEMS[targetId]['name'];
        this.productId = CONFIG.ITEMS[targetId]['product_id'];
        this.descriptionTxt = CONFIG.ITEMS[targetId]['description'];
        this.level = this.storage.getLevelFromData(this.productId);

        this.titleLabel.setString(this.productName);
        this.levelLabel.setString("lv." + this.level);
        this.setCardVisible(this.productId);
        this.descriptionLabel.setString(this.descriptionTxt);

        var _amount = this.storage.getAmountFromData(this.productId);
        if(_amount > 0){
            this.amountLabel.setString(_amount);
            this.nextCoinAmount = _amount;
        }
    },

    addLevel: function() {
        this.level += 1;
        this.levelLabel.setString("lv." + this.level);

        var _amount = this.storage.getAmountFromData(this.productId);
        if(_amount > 0){
            this.amountLabel.setString(_amount);
            this.nextCoinAmount = _amount;
        }
    }
});