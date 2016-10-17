var CutIn = cc.Node.extend({
    ctor: function(game) {
        this._super();
        this.effectTime = 0;
        this.game = game;
        this.storage = this.game.storage;
        //buttonNodeを作る
        this.baseNode = cc.Node.create();
        this.addChild(this.baseNode);

        this.messageSprite = cc.Sprite.create("res/message.png");
        this.messageSprite.setAnchorPoint(0.5, 0);
        this.messageSprite.setPosition(320, 0);
        this.addChild(this.messageSprite);

        this.messageLabel = cc.LabelTTF.create("", CONFIG.FONT, CONFIG.CUTIN_FONT_SIZE);
        this.messageLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.messageLabel.setPosition(50, 150);
        this.messageLabel.setAnchorPoint(0, 1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.messageLabel.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.messageSprite.addChild(this.messageLabel);

        this.enterSprite = cc.Sprite.create("res/ui_enter.png");
        this.enterSprite.setAnchorPoint(0, 0);
        this.enterSprite.setPosition(550, 30);
        this.addChild(this.enterSprite);

        this.Okbutton = new cc.MenuItemImage(
            "res/message_ok.png",
            "res/message_ok.png",
            function() {
                this.onTouchOkButton();
            }, this);
        this.Okbutton.setAnchorPoint(0, 0);
        this.Okbutton.setPosition(0, 0);

        this.yesButton = new cc.MenuItemFont("Yes", this.onTouchHelpHuman, this);
        this.yesButton.fontSize = CONFIG.CUTIN_FONT_SIZE;
        this.yesButton.setPosition(500, -50);

        this.noButton = new cc.MenuItemFont("No", this.onTouchKillHuman, this);
        this.noButton.fontSize = CONFIG.CUTIN_FONT_SIZE;
        this.noButton.setPosition(500, -100);

        this.RestButton = new cc.MenuItemImage(
            "res/button_move_menu.png",
            "res/button_move_menu.png",
            function() {
                if(this.RestButton.isVisible() == true){
                    this.onTouchRestButton();
                }
            }, this);
        this.RestButton.setAnchorPoint(0, 0);
        this.RestButton.setPosition(300, 0);

        this.NextButton = new cc.MenuItemImage(
            "res/button_move_menu.png",
            "res/button_move_menu.png",
            function() {
                if(this.NextButton.isVisible() == true){
                    this.onTouchRestButton();
                }
            }, this);
        this.NextButton.setAnchorPoint(0, 0);
        this.NextButton.setPosition(300, 0);

        this.cancelButton = new cc.MenuItemImage(
            "res/button_move_cancel.png",
            "res/button_move_cancel.png",
            function() {
                if(this.cancelButton.isVisible() == true){
                    this.onCancelButton();
                }
            }, this);
        this.cancelButton.setAnchorPoint(0, 0);
        this.cancelButton.setPosition(0, 0);

        this.stageButton = new cc.MenuItemImage(
            "res/message_ok.png",
            "res/message_ok.png",
            function() {
                if(this.stageButton.isVisible() == true){
                    this.onTouchStageButton();
                }
            }, this);
        this.stageButton.setAnchorPoint(0, 0);
        this.stageButton.setPosition(0, 0);

        var menu = new cc.Menu(
            this.Okbutton,
            this.NextButton,
            this.RestButton,
            this.cancelButton,
            this.stageButton,
            this.yesButton,
            this.noButton
        );
        menu.setPosition(0, 0);
        this.messageSprite.addChild(menu);

        this.setCutInVisible(false);
        this.tmpPosY = this.getPosition().y + 220 - 50 - 7;
        this.spriteOpacity = 0;

        this.cutInText = "";
        this.messageTime = 0;
        this.visibleStrLenght = 0;

        this.setVisible(false);
        this.seTime = 0;
    },

    onTouchOkButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onTouchOkButton");
        this.setVisible(false);
        this.game.miniMap.setZoom(false);
    },

    onTouchHelpHuman: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.setVisible(false);
        if (this.game.player.targetEnemy) {
            this.game.player.targetEnemy.hp = 0;
            this.setCutInText("助かったわ、ありがとう....");
        }
    },

    onTouchKillHuman: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.setVisible(false);
        this.setCutInText("ううううう..........");
        this.game.player.targetEnemy.mode = "monster";
    },

    onTouchNextButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onTouchNextButton");

        this.game.saveData(0);
        this.game.goNextFloor();
    },

    onTouchRestButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onTouchRestButton");
        this.game.goQuestFloor2();
    },

    onCancelButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onCancelButton");
        this.setVisible(false);
    },

    onTouchRecoverButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onTouchRecoverButton");
        this.game.player.recover(100);
        this.game.cutIn.setVisible(false);
    },

    onTouchStageButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onTouchStageButton");
        this.game.goQuestFloor2();
    },
/*
    onTouchStageCleareButton: function(sender) {
        playSESystem(this.storage);
        this.cutInText = "";
        cc.log("onTouchStageCleareButton");
        //this.game.goToQuesetSelect();
    },
*/
    update: function() {
        if (this.RestButton.isVisible() == true) {
            this.NextButton.setVisible(false);
            if (this.game.finishPosNum == this.game.player.posNum) {
                this.NextButton.setVisible(true);
            }
        }

        if (this.isVisible() == true) {
            this.game.bgLayer.setVisible(true);
            this.messageTime++;
            if (this.messageTime >= 1) {
                this.messageTime = 0;
                this.visibleStrLenght++;
            }
            if (this.visibleStrLenght >= this.cutInText.length) {
                this.visibleStrLenght = this.cutInText.length;
                this.enterSprite.setVisible(true);
            } else {
                this.seTime++;
                if (this.seTime >= 15) {
                    this.seTime = 0;
                }
                this.enterSprite.setVisible(false);
            }
            var _visibleString = this.cutInText.substring(0, this.visibleStrLenght);
            this.messageLabel.setString(_visibleString);
            this.messageLabel.setAnchorPoint(0, 1);
        } else {
            this.game.bgLayer.setVisible(false);
        }

        if (this.tmpPosY < this.getPosition().y && this.effectTime < 30 * 1.5) {
            this.spriteOpacity += 0.1;
            if (this.spriteOpacity >= 1) {
                this.spriteOpacity = 1;
            }
            this.setPosition(
                this.getPosition().x, this.getPosition().y
            );
        }

        if (this.effectTime >= 30 * 1.5) {
            this.spriteOpacity -= 0.1;
            if (this.spriteOpacity < 0) {
                this.spriteOpacity = 0;
            }
        }

        this.effectTime++;
        this.setOpacity(this.spriteOpacity);
    },

    setCutInText: function(text) {
        this.setPosition(
            this.getPosition().x, this.tmpPosY + 50
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        this.cutInText = text;
        this.spriteOpacity = 0;
        this.visibleStrLenght = 0;

        this.Okbutton.setVisible(true);
        this.NextButton.setVisible(false);
        this.RestButton.setVisible(false);
        this.cancelButton.setVisible(false);
        this.stageButton.setVisible(false);
        //this.stageClearedButton.setVisible(false);
        this.yesButton.setVisible(false);
        this.noButton.setVisible(false);
    },

    setCutInNextFloor: function(text) {
        this.setPosition(
            this.getPosition().x, this.tmpPosY + 50
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        this.cutInText = text;
        this.spriteOpacity = 0;
        this.visibleStrLenght = 0;
        this.Okbutton.setVisible(false);
        this.NextButton.setVisible(true);
        this.RestButton.setVisible(true);
        this.cancelButton.setVisible(true);
        this.stageButton.setVisible(false);
        //this.stageClearedButton.setVisible(false);
        this.yesButton.setVisible(false);
        this.noButton.setVisible(false);
    },

    setCutInPlayerDead: function(text) {
        this.setPosition(
            this.getPosition().x, this.tmpPosY + 50
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        this.cutInText = text;
        this.spriteOpacity = 0;
        this.visibleStrLenght = 0;
        this.Okbutton.setVisible(false);
        this.NextButton.setVisible(false);
        this.RestButton.setVisible(false);
        this.cancelButton.setVisible(false);
        this.stageButton.setVisible(true);
        //this.stageClearedButton.setVisible(false);
        this.yesButton.setVisible(false);
        this.noButton.setVisible(false);
    },

    setCutInHumanAppeared: function(text) {
        this.setPosition(
            this.getPosition().x, this.tmpPosY + 50
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        this.cutInText = text;
        this.spriteOpacity = 0;
        this.visibleStrLenght = 0;
        this.Okbutton.setVisible(false);
        this.NextButton.setVisible(false);
        this.RestButton.setVisible(false);
        this.cancelButton.setVisible(false);
        this.stageButton.setVisible(false);
        //this.stageClearedButton.setVisible(false);
        this.yesButton.setVisible(true);
        this.noButton.setVisible(true);
    },

    setCutInStageCleared: function(text) {
        this.setPosition(
            this.getPosition().x, this.tmpPosY + 50
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        //this.message.setString(text);
        this.cutInText = text;
        this.spriteOpacity = 0;
        this.visibleStrLenght = 0;

        this.Okbutton.setVisible(false);
        this.NextButton.setVisible(false);
        this.RestButton.setVisible(false);
        this.cancelButton.setVisible(false);
        //this.recoverButton.setVisible(false);
        this.stageButton.setVisible(false);
        //this.stageClearedButton.setVisible(true);
        this.yesButton.setVisible(false);
        this.noButton.setVisible(false);
    },

    setCutInVisible: function(isTrue) {
        if (isTrue) {
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    },
});

var CutIn2 = cc.Node.extend({
    ctor: function(questLayer) {
        this._super();
        this.effectTime = 0;
        this.questLayer = questLayer;
        this.storage = this.questLayer.storage;

        //buttonNodeを作る
        this.baseNode = cc.Node.create();
        this.addChild(this.baseNode);

        this.messageSprite = cc.Sprite.create("res/message.png");
        this.messageSprite.setAnchorPoint(0.5, 0);
        this.messageSprite.setPosition(320, 0);
        this.addChild(this.messageSprite);

        this.messageLabel = cc.LabelTTF.create("", CONFIG.FONT, CONFIG.CUTIN_FONT_SIZE);
        this.messageLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.messageLabel.setPosition(50, 150);
        this.messageLabel.setAnchorPoint(0, 1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.messageLabel.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.messageSprite.addChild(this.messageLabel);

        this.enterSprite = cc.Sprite.create("res/ui_enter.png");
        this.enterSprite.setAnchorPoint(0, 0);
        this.enterSprite.setPosition(550, 30);
        this.addChild(this.enterSprite);

        this.Okbutton = new cc.MenuItemImage(
            "res/message_ok.png",
            "res/message_ok.png",
            function() {
                this.onTouchOkButton();
            }, this);
        this.Okbutton.setAnchorPoint(0, 0);
        this.Okbutton.setPosition(0, 0);

        var menu = new cc.Menu(
            this.Okbutton
        );
        menu.setPosition(0, 0);
        this.messageSprite.addChild(menu);

        this.setCutInVisible(false);
        this.tmpPosY = this.getPosition().y + 220 - 50 - 7;
        this.spriteOpacity = 0;

        this.cutInText = "";
        this.messageTime = 0;
        this.visibleStrLenght = 0;
        this.seTime = 0;

        this.setVisible(false);
    },

    onTouchOkButton: function(sender) {
        if(this.enterSprite.isVisible() == false) return;
        playSESystem(this.storage);
        this.cutInText = "";
        if (this.questLayer.messages.length > 1) {
            this.questLayer.messages.splice(0, 1);
            this.questLayer.isSendedMsg = false;
        }
        cc.log("onTouchOkButton");
        this.setVisible(false);
    },

    update: function() {
        if (this.isVisible() == true) {
            this.messageTime++;
            if (this.messageTime >= 1) {
                this.messageTime = 0;
                this.visibleStrLenght++;
            }
            if (this.visibleStrLenght >= this.cutInText.length) {
                //textが最大まで表示されたケース
                this.visibleStrLenght = this.cutInText.length;
                this.enterSprite.setVisible(true);
            } else {
                //textを表示している途中
                this.seTime++;
                if (this.seTime >= 22) {
                    this.seTime = 0;
                    //playSE008(this.questLayer.storage);
                }
                this.enterSprite.setVisible(false);
            }
            var _visibleString = this.cutInText.substring(0, this.visibleStrLenght);
            this.messageLabel.setString(_visibleString);
            this.messageLabel.setAnchorPoint(0, 1);
        }

        this.effectTime++;
        this.setOpacity(this.spriteOpacity);
    },

    setCutInText: function(text) {
        this.setPosition(
            this.getPosition().x, this.tmpPosY + 48
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        this.cutInText = text;
        this.spriteOpacity = 0;
        this.visibleStrLenght = 0;
    },

    setCutInVisible: function(isTrue) {
        if (isTrue) {
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    },
});