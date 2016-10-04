var StatusWindow = cc.Node.extend({

    ctor: function(game, typeNum) {
        this._super();
        this.game = game;
        this.storage = this.game.storage;
        this.bgLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0), 640, 1400);
        this.addChild(this.bgLayer);

        this.closeButton = new cc.MenuItemImage(
            "res/button_close_menu.png",
            "res/button_close_menu.png",
            function() {
                playSESystem(this.storage);
                this.closeMenu();
            }, this);
        this.closeButton.setAnchorPoint(0.5, 0.5);
        this.closeButton.setPosition(570, 960);

        this.menu = new cc.Menu(
            this.closeButton
        );
        this.menu.x = 0;
        this.menu.y = 0;
        this.addChild(this.menu, 1);

        this.menuSprite = cc.Sprite.create(
            "res/menu.png"
        );
        this.menuSprite.setAnchorPoint(0.5, 0.5);
        this.menuSprite.setPosition(640 / 2, 550);
        this.addChild(this.menuSprite);

        this.buttons = [];

        this.setVisibleAndStatus();

        this.errorLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 640, 1400);
        this.addChild(this.errorLayer);
        this.errorLayer.setVisible(false);

        this.errorWindow = cc.Sprite.create(
            "res/window_item_error.png"
        );
        this.errorWindow.setPosition(320, 600);
        this.errorLayer.addChild(this.errorWindow);

        this.errorButton = new cc.MenuItemImage(
            "res/button_close_error.png",
            "res/button_close_error.png",
            function() {
                playSESystem(this.storage);
                this.errorLayer.setVisible(false);
            }, this);
        this.errorButton.setAnchorPoint(0.5, 0.5);
        this.errorButton.setPosition(100, 100);

        this.menu = new cc.Menu(
            this.errorButton
        );
        this.menu.x = 0;
        this.menu.y = 0;
        this.errorWindow.addChild(this.menu, 1);
    },

    set_visible: function(is_visible) {
        this.setVisibleAndStatus();
        this.setVisible(is_visible);
    },

    setVisibleAndStatus: function() {
        for (var i = 0; i < this.buttons.length; i++) {
            this.menuSprite.removeChild(this.buttons[i]);
            this.buttons.splice(i, 1);
        }
        var stData = this.game.storage.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'].startsWith("status")) {
                    cc.log("add button status");
                    var items = CONFIG.ITEMS;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i]["product_id"] == toObj['id']) {
                            var statusButton = new StatusButtonSprite(this.game, this, items[i]["name"], items[i]["product_id"], toObj['amount']);
                            this.menuSprite.addChild(statusButton);
                            this.buttons.push(statusButton);
                            statusButton.setPosition(310, 730 - 80 * items[i]["id"]);
                        }
                    }
                }
            }
        }
    },

    update: function() {},

    closeMenu: function() {
        this.setVisible(false);
    },
});