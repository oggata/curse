var miniMap = cc.Node.extend({
    ctor: function(game) {
        this._super();
        this.game = game;

        this.isZoom = true;

        this.miniMapNode = cc.Node.create();
        this.addChild(this.miniMapNode, 99999999);
        this.miniMapNode.setAnchorPoint(0.5, 0.5);
        this.miniMapNode.setPosition(0, 960);
        this.miniMapNode.setScale(0.4, 0.4);
        //this.miniMapNode.setScale(1, 1);
        this.miniMapNode.setOpacity(255 * 0.5);
        this.hideMapChips = [];
        this.wallChips = [];
        this.enemyChips = [];
        this.itemChips = [];
        this.hiddenChips = [];
        this.playerPassedMapIds = [];

        //マップチップ
        this.mini_map_chip = cc.Sprite.create(
            "res/ui_mini_map.png"
        );
        //this.mini_map_chip.setAnchorPoint(0, 0);
        this.mini_map_chip.setPosition(300,-300+50);
        this.miniMapNode.addChild(this.mini_map_chip, 1);
        this.mini_map_chip.setOpacity(255*0.7);

        for (var i = 1; i <= 81; i++) {
            var _col = ((i + 9) % 9);
            if (_col == 0) {
                _col = 9;
            }
            var _row = Math.floor((i - 1) / 9) + 1;
/*
            //マップチップ
            this.mini_map_chip = cc.Sprite.create(
                res.Icon_load_png
            );
            this.mini_map_chip.setAnchorPoint(0, 0);
            this.mini_map_chip.setPosition(_col * 55 * 1, _row * 55 * -1);
            this.miniMapNode.addChild(this.mini_map_chip, 1);
*/
            //壁
            this.mini_wall_chip = cc.Sprite.create(
                "res/icon_wall.png"
            );
            this.mini_wall_chip.setAnchorPoint(0, 0);
            this.mini_wall_chip.setPosition(_col * 55 * 1, _row * 55 * -1);
            this.miniMapNode.addChild(this.mini_wall_chip, 2);
            this.mini_wall_chip.setOpacity(255*0.7);
            this.wallChips.push(this.mini_wall_chip);

            this.mini_enemy_chip = cc.Sprite.create(
                "res/icon_enemy.png"
            );
            this.mini_enemy_chip.setAnchorPoint(0, 0);
            this.mini_enemy_chip.setPosition(_col * 55 * 1, _row * 55 * -1);
            this.miniMapNode.addChild(this.mini_enemy_chip, 2);
            this.mini_enemy_chip.setOpacity(255*0.7);
            this.enemyChips.push(this.mini_enemy_chip);

            this.mini_item_chip = cc.Sprite.create(
                "res/icon_item.png"
            );
            this.mini_item_chip.setAnchorPoint(0, 0);
            this.mini_item_chip.setPosition(_col * 55 * 1, _row * 55 * -1);
            this.miniMapNode.addChild(this.mini_item_chip, 2);
            this.mini_item_chip.setOpacity(255*0.7);
            this.itemChips.push(this.mini_item_chip);

/*
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create("res/icon_hidden.png", cc.rect(0, 50 * i, 50, 50));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.1);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
*/
            this.mini_hiddden_chip = cc.Sprite.create("res/icon_hidden.png", cc.rect(0, 0, 50, 50));
            //this.mini_hiddden_chip.runAction(this.ra);
/*
            //マップチップ
            this.mini_hiddden_chip = cc.Sprite.create(
                "res/icon_hidden.png"
            );
*/
            this.mini_hiddden_chip.setAnchorPoint(0, 0);
            this.mini_hiddden_chip.setPosition(_col * 55 * 1, _row * 55 * -1);
            this.miniMapNode.addChild(this.mini_hiddden_chip,99);
            this.hiddenChips.push(this.mini_hiddden_chip);
        }

        this.Icon_Start = cc.Sprite.create(
            "res/icon_start.png"
        );
        this.miniMapNode.addChild(this.Icon_Start, 3);
        this.Icon_Start.setAnchorPoint(0, 0);

        this.Icon_Goal = cc.Sprite.create(
            "res/icon_goal.png"
        );
        this.miniMapNode.addChild(this.Icon_Goal, 3);
        this.Icon_Goal.setAnchorPoint(0, 0);

        this.Icon_playerSoul = cc.Sprite.create(
            "res/icon_player_soul.png"
        );
        this.miniMapNode.addChild(this.Icon_playerSoul, 999);
        this.Icon_playerSoul.setAnchorPoint(0, 0);

        //上下左右のプレイヤーアイコンを設定
        this.miniMapPlayer1 = cc.Sprite.create(
            "res/icon_player_1.png"
        );
        this.miniMapPlayer1.setAnchorPoint(0, 0);
        this.miniMapPlayer1.setPosition(0, 0);
        this.miniMapNode.addChild(this.miniMapPlayer1, 10);

        this.miniMapPlayer2 = cc.Sprite.create(
            "res/icon_player_2.png"
        );
        this.miniMapPlayer2.setAnchorPoint(0, 0);
        this.miniMapPlayer2.setPosition(0, 0);
        this.miniMapNode.addChild(this.miniMapPlayer2, 10);

        this.miniMapPlayer3 = cc.Sprite.create(
            "res/icon_player_3.png"
        );
        this.miniMapPlayer3.setAnchorPoint(0, 0);
        this.miniMapPlayer3.setPosition(0, 0);
        this.miniMapNode.addChild(this.miniMapPlayer3, 10);

        this.miniMapPlayer4 = cc.Sprite.create(
            "res/icon_player_4.png"
        );
        this.miniMapPlayer4.setAnchorPoint(0, 0);
        this.miniMapPlayer4.setPosition(0, 0);
        this.miniMapNode.addChild(this.miniMapPlayer4, 10);
    },

    setZoom:function(isZoom){
        this.isZoom = isZoom;
    },

    setZoomMap:function(){
        if(this.isZoom){
            this.miniMapNode.setPosition(75, 920);
            this.miniMapNode.setScale(0.8, 0.8);
        }else{
            this.miniMapNode.setPosition(0, 960);
            this.miniMapNode.setScale(0.4, 0.4);
        }
    },

    findByTargetPosNum:function(targetPosNum){
        for (var t = 0; t < this.isRadarVisibleMapIds.length; t++) {
            if( this.isRadarVisibleMapIds[t] == targetPosNum ){
                return this.getColAndRow(t+1);
            }
        }
        return null
    },

    getColAndRow: function(mapPosNum) {
        var _col = ((mapPosNum + 9) % 9);
        if (_col == 0) {
            _col = 9;
        }
        var _row = Math.floor((mapPosNum - 1) / 9) + 1;
        return [_col * 55 * 1, _row * 55 * -1];
    },

    setDisplay: function() {
        this.isRadarVisibleMapIds = [];
        var pl = this.game.player.posNum;

        //レーダーに表示するmapIdを配列として持つ
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl - 30 * 4) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl - 30 * 3) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl - 30 * 2) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl - 30 * 1) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl - 30 * 0) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl + 30 * 1) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl + 30 * 2) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl + 30 * 3) - 4 + t);
        }
        for (var t = 0; t < 9; t++) {
            this.isRadarVisibleMapIds.push((pl + 30 * 4) - 4 + t);
        }

        //Stair
        var po = this.findByTargetPosNum(this.game.finishPosNum);
        if(po != null)
        {
            this.Icon_Goal.setVisible(true);
            this.Icon_Goal.setPosition(po[0], po[1]);
        }else{
            this.Icon_Goal.setVisible(false);
        }

        //Stair
        var po = this.findByTargetPosNum(this.game.startPosNum);
        if(po != null)
        {
            this.Icon_Start.setVisible(true);
            this.Icon_Start.setPosition(po[0], po[1]);
        }else{
            this.Icon_Start.setVisible(false);
        }

        //PlayerSoul
        this.Icon_playerSoul.setVisible(false);
        if(this.game.storage.lastDroppedSoulPos > 0 && this.game.storage.droppedSoulsAmount > 0){
            var po = this.findByTargetPosNum(this.game.storage.lastDroppedSoulPos);
            if(po != null)
            {
                this.Icon_playerSoul.setVisible(true);
                this.Icon_playerSoul.setPosition(po[0], po[1]);
            }else{
                this.Icon_playerSoul.setVisible(false);
            }
        }

        //Wall
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            this.wallChips[i].setVisible(false);
        }
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            if (this.game.MAP_POSITIONS[this.isRadarVisibleMapIds[i]]) {
                if (this.game.MAP_POSITIONS[this.isRadarVisibleMapIds[i]] == 1) {
                    this.wallChips[i].setVisible(true);
                }
            }
        }

        //Enemy
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            this.enemyChips[i].setVisible(false);
        }
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
	        for (var g = 0; g < this.game.enemies.length; g++) {
	            if(this.game.enemies[g].posNum == this.isRadarVisibleMapIds[i])
	            {
	            	this.enemyChips[i].setVisible(true);
	            }
	        }
        }

        //Item
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            this.itemChips[i].setVisible(false);
        }
        
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            for (var g = 0; g < this.game.items.length; g++) {
                if(this.game.items[g].posNum == this.isRadarVisibleMapIds[i])
                {
                    /*
                    if(this.game.items[g].itemId == "player_soul"){
                        this.Icon_playerSoul.setPosition(
                            this.game.items[g].getPosition().x,
                            this.game.items[g].getPosition().y
                        );
                    }*/
                    this.itemChips[i].setVisible(true);
                }
            }
        }
        
/*
        this.l1 = this.game.MAP_POSITIONS[tpos[0]];
        this.c1 = this.game.MAP_POSITIONS[tpos[1]];
        this.r1 = this.game.MAP_POSITIONS[tpos[2]];

        this.l2 = this.game.MAP_POSITIONS[tpos[3]];
        this.c2 = this.game.MAP_POSITIONS[tpos[4]];
        this.r2 = this.game.MAP_POSITIONS[tpos[5]];

        this.l3 = this.game.MAP_POSITIONS[tpos[6]];
        this.c3 = this.game.MAP_POSITIONS[tpos[7]];
        this.r3 = this.game.MAP_POSITIONS[tpos[8]];
*/

        //playerPassedMapIds
        var tpos = this.game.tpos;
        if (this.playerPassedMapIds.indexOf(this.game.player.posNum) == -1){
            this.playerPassedMapIds.push(this.game.player.posNum);
        }
        /*
        if (this.playerPassedMapIds.indexOf(tpos[0]) == -1){
            this.playerPassedMapIds.push(tpos[0]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[1]) == -1){
            this.playerPassedMapIds.push(tpos[1]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[2]) == -1){
            this.playerPassedMapIds.push(tpos[2]);
        }
        */
        if (this.playerPassedMapIds.indexOf(tpos[3]) == -1){
            this.playerPassedMapIds.push(tpos[3]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[4]) == -1){
            this.playerPassedMapIds.push(tpos[4]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[5]) == -1){
            this.playerPassedMapIds.push(tpos[5]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[6]) == -1){
            this.playerPassedMapIds.push(tpos[6]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[7]) == -1){
            this.playerPassedMapIds.push(tpos[7]);
        }
        if (this.playerPassedMapIds.indexOf(tpos[8]) == -1){
            this.playerPassedMapIds.push(tpos[8]);
        }

        //hidden
        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            this.hiddenChips[i].setVisible(true);
        }

        for (var i = 0; i < this.isRadarVisibleMapIds.length; i++) {
            if(this.playerPassedMapIds.indexOf(this.isRadarVisibleMapIds[i]) >= 0){
                this.hiddenChips[i].setVisible(false);
            }
        }

        //Player
		if (this.game.player.directionNum == 1) {
            this.miniMapPlayer1.setVisible(true);
            this.miniMapPlayer2.setVisible(false);
            this.miniMapPlayer3.setVisible(false);
            this.miniMapPlayer4.setVisible(false);
        }
        if (this.game.player.directionNum == 2) {
            this.miniMapPlayer1.setVisible(false);
            this.miniMapPlayer2.setVisible(true);
            this.miniMapPlayer3.setVisible(false);
            this.miniMapPlayer4.setVisible(false);
        }
        if (this.game.player.directionNum == 3) {
            this.miniMapPlayer1.setVisible(false);
            this.miniMapPlayer2.setVisible(false);
            this.miniMapPlayer3.setVisible(true);
            this.miniMapPlayer4.setVisible(false);
        }
        if (this.game.player.directionNum == 4) {
            this.miniMapPlayer1.setVisible(false);
            this.miniMapPlayer2.setVisible(false);
            this.miniMapPlayer3.setVisible(false);
            this.miniMapPlayer4.setVisible(true);
        }
    },

    update: function() {
        this.setZoomMap();

        var _pCol = ((this.game.player.posNum + 9) % 9);
        if (_pCol == 0) {
            _pCol = 9;
        }
        var _pRow = Math.floor((this.game.player.posNum - 1) / 9) + 1;


        _pCol = 5;
        _pRow = 5;
        this.miniMapPlayer1.setPosition(_pCol * 55 * 1, _pRow * 55 * -1);
        this.miniMapPlayer2.setPosition(_pCol * 55 * 1, _pRow * 55 * -1);
        this.miniMapPlayer3.setPosition(_pCol * 55 * 1, _pRow * 55 * -1);
        this.miniMapPlayer4.setPosition(_pCol * 55 * 1, _pRow * 55 * -1);
    },
});