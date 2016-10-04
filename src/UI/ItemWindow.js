var ItemWindow = cc.Node.extend({

    ctor: function(game) {
        this._super();
        this.game = game;

        this.bgLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0), 640, 1400);
        this.addChild(this.bgLayer);

        this.menuBack = cc.Sprite.create(
            "res/menu.png"
        );
        this.menuBack.setAnchorPoint(0.5, 0.5);
        this.menuBack.setPosition(640 / 2, 550);
        this.menuBack.setOpacity(255 * 0.9);
        this.addChild(this.menuBack);

        this.item001Button = new cc.MenuItemFont("item001 x " + this.game.player.item001Cnt, this.onTouchItem001, this);
        this.item001Button.setPosition(320 - 80, 640 - 50 * 0);

        this.item002Button = new cc.MenuItemFont("item002 x " + this.game.player.item002Cnt, this.onTouchItem002, this);
        this.item002Button.setPosition(320 - 80, 640 - 50 * 1);

        this.item003Button = new cc.MenuItemFont("item003 x " + this.game.player.item003Cnt, this.onTouchItem003, this);
        this.item003Button.setPosition(320 - 80, 640 - 50 * 2);

        this.item004Button = new cc.MenuItemFont("item004 x " + this.game.player.item004Cnt, this.onTouchItem004, this);
        this.item004Button.setPosition(320 - 80, 640 - 50 * 3);

        this.item005Button = new cc.MenuItemFont("item005 x " + this.game.player.item005Cnt, this.onTouchItem005, this);
        this.item005Button.setPosition(320 - 80, 640 - 50 * 4);

        var menu = new cc.Menu(
            this.item001Button,
            this.item002Button,
            this.item003Button,
            this.item004Button,
            this.item005Button
        );
        menu.x = 0;
        menu.y = 0;
        this.menuBack.addChild(menu, 1);
    },

    onTouchItem001:function() {
        if(this.game.player.item001Cnt >= 1)
        {
            this.game.storage.saveItemDataToStorage(1,-1);
        }
    },

    onTouchItem002:function() {
        if(this.game.player.item002Cnt >= 1)
        {
            this.game.storage.saveItemDataToStorage(2,-1);
        }
    },

    onTouchItem003:function() {
        if(this.game.player.item003Cnt >= 1)
        {
            this.game.storage.saveItemDataToStorage(3,-1);
        }
    },

    onTouchItem004:function() {
        if(this.game.player.item004Cnt >= 1)
        {
            this.game.storage.saveItemDataToStorage(4,-1);
        }
    },

    onTouchItem005:function() {
        if(this.game.player.item005Cnt >= 1)
        {
            this.game.storage.saveItemDataToStorage(5,-1);
        }
    },

    update: function() {

    },
});