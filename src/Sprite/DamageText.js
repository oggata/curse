var DamageText = cc.Node.extend({
    ctor: function(damageText, who, type) {
        this._super();
        this.effectTime = 0;
        this.dx = 0;
        this.dy = 2;
        this.txt = damageText;

        this._damage = cc.LabelTTF.create(this.txt, CONFIG.FONT, 70);
        this._damage.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this._damage.setAnchorPoint(0.5, 0);
        this._damage.enableStroke(new cc.Color(0, 0, 0, 255), 5, false);
        this.addChild(this._damage);

        if (type == "weak") {
            this._damage.setFontFillColor(new cc.Color(255, 0, 0, 255));

            this.weakTxt = cc.Sprite.create("res/weak.png");
            this.weakTxt.retain();
            this.weakTxt.setPosition(70, -5);
            //this.weakTxt.setAnchorPoint(0, 0);
            this._damage.addChild(this.weakTxt);
        }
    },

    update: function() {
        this.effectTime++;
        if (this.effectTime <= 30 * 1.5) {
            var pp = this.getPosition();
            //y = 1/2gt vot－数字gt2
            var _y = 8 * (this.effectTime) - 1 / 2 * 9.8 * (this.effectTime / 5) * (this.effectTime / 5) + 200;
            this.setPosition(pp.x + this.dx, _y);
            return true;
        }
        this.removeChild(this._damage);
        return false;
    },

    set_text: function(text) {
        this.damageNumLabel.setString(text);
    },

    remove: function() {
        this.removeChild(this._damage);
    }
});

var DamageText2 = cc.Node.extend({
    ctor: function(damageText, who) {
        this._super();
        this.effectTime = 0;
        this.dx = 0;
        this.dy = 2;
        if (damageText != null) {
            //this.txt = who + "から" + damageText + "のダメージを受けた."
            this.txt = damageText;
        } else {
            //this.txt = who + "の攻撃は外れた..."
            this.txt = "miss";
        }
        this._damage = cc.LabelTTF.create(this.txt, CONFIG.FONT, 70);
        this._damage.setFontFillColor(new cc.Color(255, 0, 0, 255));
        this._damage.setAnchorPoint(0.5, 0);
        this._damage.enableStroke(new cc.Color(0, 0, 0, 255), 5, false);
        //this.addChild(this._damage);
    },

    update: function() {
        this.effectTime++;
        if (this.effectTime <= 30 * 1.5) {
            var pp = this.getPosition();
            var _y = 8 * (this.effectTime) - 1 / 2 * 9.8 * (this.effectTime / 5) * (this.effectTime / 5) + 200;
            this.setPosition(pp.x + this.dx, _y);
            return true;
        }
        //this.removeChild(this._damage);
        return false;
    },

    set_text: function(text) {
        this.damageNumLabel.setString(text);
    },

    remove: function() {
        //this.removeChild(this._damage);
    }
});