var Marker = cc.Node.extend({
    ctor:function (game,orderNum,columnNum,itemData) {
        this._super();
        this.game = game;
        this.orderNum = orderNum;
        this.columnNum = columnNum;
        this.itemData = itemData;
        this.attackCnt = 0;

        this.name     = itemData['name'];
        this.hp       = itemData['hp'];
        this.maxHp    = itemData['hp'];
        this.attack   = itemData['attack'];
        this.defence  = itemData['defence'];
        this.lv       = itemData['lv'];
        this.image_png    = itemData['image'];

        this.width = 256/2;
        this.height = 200;
        this.height2 = 150;

        //ランダムで色を決める
        this.changeColorNum();

        //marker
        this.markerSprite = cc.Sprite.create(
            this.marker_png
        );
        this.markerSprite.setAnchorPoint(0.5,0.5);
        this.addChild(this.markerSprite);

        //item
        this.itemSprite = cc.Sprite.create(
            this.image_png
        );
        this.itemSprite.setAnchorPoint(0.5,0.2);
        this.addChild(this.itemSprite);

        //sprite
        /*
        var frameSeq  = [];
        for (var i = 0; i < 1; i++) {
            var frame = cc.SpriteFrame.create(this.image_png,cc.rect(this.width*i,0,this.width,this.height));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.markerSprite = cc.Sprite.create(this.image_png,cc.rect(0,0,this.width,this.height));
        this.markerSprite.runAction(this.ra);
        this.markerSprite.setAnchorPoint(0.5,0.2);
        this.addChild(this.markerSprite);
        this.markerSprite.setScale(1.3,1.3);
        */

        this.hpLabel = cc.LabelTTF.create(this.hp,"Arial",45);
        this.hpLabel.setFontFillColor(new cc.Color(250,250,250,255));
        this.hpLabel.setAnchorPoint(0.5,0.5);
        this.hpLabel.enableStroke(new cc.Color(169,169,169,255),5,true);
        this.addChild(this.hpLabel);

        this._debugNum = cc.LabelTTF.create(this.name,"Arial",80);
        this._debugNum.setFontFillColor(new cc.Color(255,0,0,255));
        this._debugNum.setAnchorPoint(0.5,0.5);
        this.addChild(this._debugNum);
/*
        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
*/
        this.setMarkerPos();
    },

    setMarkerPos:function(){
        this.posX = this.columnNum * (this.width + 20) + 30;
        this.posY = this.orderNum * this.height2 * -1 + 450;
        this.setPosition(this.posX,this.posY);
    },

    update:function(){
        this.posY = this.orderNum * this.height2 * -1 + 450;
        if(this.getPosition().y != this.posY){
            this.setPosition(this.posX,this.getPosition().y+=5);
        }

        if(this.orderNum >= 3){
            this.setVisible(false);
        }else{
            this.setVisible(true);
        }
        return true;
    },

    changeColorNum:function(){
        //ランダムで色を決める
        //this.colorNum = getRandNumberFromRange(1,4);
        this.colorNum = 1;
        if(this.colorNum == 1){
            this.marker_png = res.Marker_red_png;
        }
        if(this.colorNum == 2){
            this.marker_png = res.Marker_blue_png;
        }
        if(this.colorNum == 3){
            this.marker_png = res.Marker_yellow_png;
        }
        if(this.colorNum == 4){
            this.marker_png = res.Marker_green_png;
        }
        //this.markerSprite.setTexture();
    },

    attackUpdate:function(){
        this.attackCnt++;
        this.speed = 20;

        if(this.attackCnt < 30 * 2){
            var enemyPos = this.game.enemy.getPosition();
            if(enemyPos.x > this.getPosition().x){
                this.setPosition(this.getPosition().x + this.speed,this.getPosition().y);
            }
            if(enemyPos.x < this.getPosition().x){
                this.setPosition(this.getPosition().x - this.speed,this.getPosition().y);
            }
            if(enemyPos.y > this.getPosition().y){
                this.setPosition(this.getPosition().x,this.getPosition().y + this.speed);
            }
            if(enemyPos.y < this.getPosition().y){
                this.setPosition(this.getPosition().x,this.getPosition().y - this.speed);
            }
        }

        if(this.attackCnt == 30 * 2){
            this.game.enemy.damage(this.attack,this.colorNum);
            this.rtnDirection = getRandNumberFromRange(1,3);
        }

        if(this.attackCnt >= 30 * 3){
            if(this.rtnDirection == 2){
                this.setPosition(this.getPosition().x += 5,this.getPosition().y -= this.speed);
            }else{
                this.setPosition(this.getPosition().x -= 5,this.getPosition().y -= this.speed);
            }
        }

        if(this.attackCnt >= 30 * 4){
            this.setMarkerPos();
            this.attackCnt = 0;
            return false;
        }

        return true;
    },

    remove:function() {
        this.removeChild(this.markerSprite);
        this.removeChild(this.shadow);
    },
});
