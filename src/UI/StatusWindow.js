var StatusWindow = cc.Node.extend({

    ctor: function(game, typeNum) {
        this._super();
        this.game = game;
        this.storage = this.game.storage;

        this.bgLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 1), 640, 1400);
        this.addChild(this.bgLayer);

        this.tableView = new cc.TableView(this.dataSource, cc.size(640,740));
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableView.setPosition(0,200);

        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this.tableView);

        this.closeButton = new cc.MenuItemImage(
            "res/button_close_menu.png",
            "res/button_close_menu.png",
            function() {
                playSESystem(this.storage);
                this.closeMenu();
            }, this);
        this.closeButton.setAnchorPoint(0.5, 0.5);
        this.closeButton.setPosition(570, 970);

        this.menu = new cc.Menu(
            this.closeButton
        );
        this.menu.x = 0;
        this.menu.y = 0;
        this.addChild(this.menu, 1);

        this.buttons = [];

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
        this.errorButton.setPosition(200, 60);

        this.menu = new cc.Menu(
            this.errorButton
        );
        this.menu.x = 0;
        this.menu.y = 0;
        this.errorWindow.addChild(this.menu, 1);

         this.setFocus();
    },

    setFocus: function() {
        this.dataSource.setGame(this.game);

        //levelを持っているitemだけを表示する
        var hasLevelItems = [];
        for (var i = 0; i < CONFIG.ITEMS.length; i++) {
            if(CONFIG.ITEMS[i]["hasLevel"] == true){
                hasLevelItems.push(CONFIG.ITEMS[i]);
            }
        }

        this.dataSource.setSource(hasLevelItems);
        this.tableView.reloadData();
    },

    dataSource: {
        source: null,
        game : null,
        setGame: function(game) {
            this.game = game;
        },

        setSource: function(source) {
            this.source = source;
        },

        getString2: function(idx, col) {
            var string = "";
            if (col == 0) {
                string = this.source[idx]["name"];
            } else if (col == 1) {
                string = this.source[idx]["name"];
            }
            return string;
        },

        numberOfCellsInTableView: function() {
            if (this.source == null) {
                return 0;
            } else {
                return this.source.length;
            }
        },

        tableCellSizeForIndex: function(table, idx) {
            return cc.size(table.width, 150);
        },

        tableCellAtIndex: function(table, idx) {
            idx = idx.toFixed(0);
            var cell = table.dequeueCell();
            if (!cell) {
                cell = new cc.TableViewCell();
                var statusButton = new StatusButtonSprite(this.game, idx);
                statusButton.setPosition(10,0);
                cell.addChild(statusButton);
                statusButton.tag = 2;

            } else {
                cc.log(idx);
                var statusButton = cell.getChildByTag(2);
                statusButton.setContent(idx);
            }
            return cell;
        }
    },

    set_visible: function(is_visible) {
        this.setVisible(is_visible);
    },

    update: function() {},

    closeMenu: function() {
        this.setVisible(false);
    },
});