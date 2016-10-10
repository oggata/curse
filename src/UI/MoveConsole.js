var moveConsole = cc.Node.extend({
    ctor: function(game) {
        this._super();
        this.game = game;

        this.leftButton = new cc.MenuItemImage(
            "res/button_move_left.png",
            "res/button_move_left_on.png",
            function() {
                if (this.game.isSetMenuWindow()) return;
                //if (this.wCount < 60) return;
                playSE003(this.game.storage);
                //左回転はnumを1引く
                this.game.player.directionNum -= 1;
                if (this.game.player.directionNum < 1) {
                    this.game.player.directionNum = 4;
                }
                this.game.trasitionCnt = 1;
                this.game.trasitionDirection = "left";
                this.game.player.spendActionCost();
                //this.wCount = 0;
            }, this);
        this.leftButton.setPosition(320 - 170, 0);

        this.rightButton = new cc.MenuItemImage(
            "res/button_move_right.png",
            "res/button_move_right_on.png",
            function() {
                if (this.game.isSetMenuWindow()) return;
                //if (this.wCount < 60) return;
                playSE003(this.game.storage);
                //右回転はnumを足す
                this.game.player.directionNum += 1;
                if (this.game.player.directionNum > 4) {
                    this.game.player.directionNum = 1;
                }
                this.game.trasitionCnt = 1;
                this.game.trasitionDirection = "right";

                this.game.player.spendActionCost();
                //this.wCount = 0;
            }, this);
        this.rightButton.setPosition(320 + 170, 0);

        this.walkButton = new cc.MenuItemImage(
            "res/button_move_center.png",
            "res/button_move_center_on.png",
            function() {
                if (this.game.isSetMenuWindow()) return;
                //if (this.wCount < 60) return;
                if (this.game.player.targetEnemy == null) {
                    playSE003(this.game.storage);
                    this.game.player.walkFront();
                    this.game.trasitionCnt = 1;
                    this.game.trasitionDirection = "center";
                    this.game.player.spendActionCost();
                    //this.wCount = 0;
                    if(this.game.checkIsDoorPositions(this.game.player.posNum) == true){
                        playSE009(this.game.storage);
                    }
                }
            }, this);
        this.walkButton.setPosition(320, 0);

        var menu = new cc.Menu(this.leftButton, this.rightButton, this.walkButton);
        menu.x = 0;
        menu.y = 300;
        this.addChild(menu, 1);
    },

    update: function() {
    },
});