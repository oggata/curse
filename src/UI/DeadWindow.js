var DeadWindow = cc.Node.extend({
    //type : 1 => 死亡後　type:2 => 階段を使うかどうか type:3 =>
    //
    ctor:function (game) {
        this._super();
        this.game = game;

        this.messageSprite = cc.Sprite.create("res/message.png");
        //this.messageSprite.setPosition(320,this.game.viewSize.height/2);
        this.messageSprite.setAnchorPoint(0.5,0);
        this.messageSprite.setPosition(320,0);
        this.addChild(this.messageSprite);

        this.menuBack = cc.Sprite.create(
            "res/menu.png"
        );
        this.menuBack.setAnchorPoint(0.5,0.5);
        this.menuBack.setPosition(640/2,960/2);
        this.menuBack.setOpacity(255 * 0.5);
        this.messageSprite.addChild(this.menuBack);

        //retry count
        var noButton = new cc.MenuItemImage(
            res.Menu_button_001_png,
            res.Menu_button_001_png,
            function () {
                //if(this.game.isSetMenu == false) return;
                cc.log("noButton is clicked!");
                this.game.goToQuesetSelect();
            }, this);
        noButton.setPosition(320-150,960/2);
        noButton.setOpacity(255 * 0.7);

        var yesButton = new cc.MenuItemImage(
            res.Menu_button_001_png,
            res.Menu_button_001_png,
            function () {
                //if(this.game.isSetMenu == false) return;
                cc.log("yesButton is clicked!");
                if(this.game.setMenuType == 2){
                    this.game.retryThisFloor();
                }

            }, this);
        yesButton.setPosition(320+150,960/2);
        yesButton.setOpacity(255 * 0.7);

        var menu = new cc.Menu(noButton,yesButton);
        menu.x = 0;
        menu.y = 0;
        this.messageSprite.addChild(menu, 1);

    },

    update:function() {

    },
});