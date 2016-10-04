var MenuWindow = cc.Node.extend({

    ctor:function (game) {
        this._super();
        this.game = game;
        this.messageSprite = cc.Sprite.create("res/message.png");
        this.messageSprite.setAnchorPoint(0.5, 0);
        this.messageSprite.setPosition(320, 0);
        this.addChild(this.messageSprite);
    },

    update:function() {
        if(this.game.player.isOwnKey == true)
        {
            this.errMessage.setVisible(false);

            this.yesButton.setOpacity(1 * 255);

        }else{
            this.errMessage.setVisible(true);

            this.yesButton.setOpacity(0.3 * 255);
        }
    },
});
