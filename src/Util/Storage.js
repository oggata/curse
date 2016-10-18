var Storage = cc.Class.extend({

    ctor: function() {
        this.itemData = new Object();
        this.playerName = "xxxxx";
        this.totalExp = 0;
        this.totalCoinAmount = 0;
        this.totalGemAmount = 0;
        this.maxUnlockedStage = 0;
        this.bgmVolume = 10;
        this.seVolume = 10;
        this.tmpSoulsAmount = 0;
        this.droppedSoulsAmount = 0;
        this.forceReturnStageNum = 0;
        this.lastDroppedSoulPos = 0;
        this.lastStartPos = 0;
        this.lastFinishPos = 0;
        this.lastFloorNum = 0;
        this.lastMapId = 0;
        this.lastPlayerPosNum = 0;
        this.lastPlayerHp = 100;
        this.lastPlayerMp = 0;
        this.lastUpdatedTime = parseInt(new Date() / 1000);
    },

    init: function() {},

    getStageNumber:function(stageNum){
        var floorNum = Math.ceil(stageNum / 5);
        var roomNum = stageNum % 5;
        if(roomNum == 0){
            roomNum = 5;
        }
        var data = new Object();
        data['floorNum'] = floorNum;
        data['roomNum']  = roomNum;
        data['visibleNum']  = "" + ("000" + stageNum).slice(-3) + "F";
        return data;
    },

    getPastSecond: function() {
        var diffSecond = parseInt(new Date() / 1000) - this.lastUpdatedTime;
        //cc.log(diffSecond);
        return diffSecond;
    },

    /*
    ------------------------ 以下データストレージへの保存------------------------ 
    */

    getSoulAmount:function(){
        var _pastSecond = this.getPastSecond();
        var _soul = Math.floor(_pastSecond / 60 / 60) * 50;
        var _maxSoul = this.getMaxSoul();
        if(_soul > _maxSoul){
            _soul = _maxSoul;
        }
        return _soul;
    },

    setSoulByPastTime:function(){
        var _soul = this.getSoulAmount();
        this.tmpSoulsAmount += _soul;
        this.lastUpdatedTime = parseInt(new Date() / 1000);
        this.saveCurrentData();
    },

    addSouls: function(amount) {
        this.tmpSoulsAmount += Math.ceil(amount);
        this.saveCurrentData();
    },

    useSouls: function(amount) {
        this.tmpSoulsAmount -= Math.ceil(amount);
        this.saveCurrentData();
    },

    addGem: function(amount) {
        this.totalGemAmount += amount;
        this.saveCurrentData();
    },

    useGem: function(amount) {
        this.totalGemAmount -= amount;
        this.saveCurrentData();
    },

    isSavedLastPosition:function(stageNum){
        if(
            this.lastMapId != 0 && 
            this.lastStartPos != 0 && 
            this.lastFinishPos != 0 && 
            //this.lastPlayerPosNum != 0 &&
            this.lastFloorNum == stageNum
        ){
            return true;
        }
        return false;
    },

    isSavedLastSoulPosition:function(stageNum){
        if(
            this.lastMapId != 0 && 
            this.lastStartPos != 0 && 
            this.lastFinishPos != 0 && 
            //this.lastPlayerPosNum != 0 &&
            this.lastFloorNum == stageNum &&
            this.lastDroppedSoulPos != 0 &&
            this.droppedSoulsAmount != 0
        ){
            return true;
        }
        return false;
    },

    getSavedLastSoulFloor:function(stageNum){
        if(
            this.lastMapId != 0 && 
            this.lastStartPos != 0 && 
            this.lastFinishPos != 0 && 
            //this.lastPlayerPosNum != 0 &&
            this.lastDroppedSoulPos != 0 &&
            this.droppedSoulsAmount != 0
        ){
            return this.lastFloorNum;
        }
        return 0;
    },

    getPlayerPosition:function(){
        if(this.isSavedLastPosition() == false){
            return 0;
        }
        if(this.lastPlayerPosNum != 0){
            return this.lastPlayerPosNum;
        }
        return 0;
    },

    saveLastPositions : function(game,isDropped){
        this.lastFloorNum = game._stageNum;
        this.lastMapId = game.mapId;
        this.lastStartPos = game.startPosNum;
        this.lastFinishPos = game.finishPosNum;
        this.lastPlayerPosNum = game.player.posNum;
        if(isDropped == true){
            this.lastDroppedSoulPos = game.player.posNum;
            var _souls = this.tmpSoulsAmount;
            this.tmpSoulsAmount = 0;

            //プレイヤーの場所とstatusはリセット
            this.lastPlayerPosNum = 0;
            this.lastPlayerHp = game.player.maxHp;
            this.lastPlayerMp = game.player.mp;

            //位置を保存
            this.lastDroppedSoulPos = game.player.posNum;
            this.droppedSoulsAmount = _souls;
        }else{
            //通常時は何もしない
            this.lastPlayerHp = game.player.hp;
            this.lastPlayerMp = game.player.mp;
        }
    },

    saveLastAlivePlayerStatus: function(game) {
        this.saveLastPositions(game,false);
        this.saveCurrentData();
    },

    saveLastDeadPlayerStatus: function(game) {
        this.saveLastPositions(game,true);
        this.saveCurrentData();
    },

    saveClearedPlayerStatus: function(game) {
        this.lastFloorNum = 0;
        this.lastMapId = 0;
        this.lastStartPos = 0;
        this.lastFinishPos = 0;
        this.lastPlayerPosNum = 0;
        this.lastDroppedSoulPos = 0;
        this.droppedSoulsAmount = 0;
        this.lastPlayerHp = game.player.maxHp;
        this.lastPlayerMp = game.player.mp;
        if (this.maxUnlockedStage < game._stageNum) {
            this.maxUnlockedStage = game._stageNum;
        }
        this.saveCurrentData();
    },

    resetSouls:function(game){
        //if(this.droppedSoulsAmount > 0 ||  this.lastDroppedSoulPos > 0){
            if(game._stageNum != this.lastFloorNum){
                this.droppedSoulsAmount = 0;
                this.lastDroppedSoulPos = 0;
            }
        //}
    },

    saveAndRecoverSoul: function() {
        var _souls = this.droppedSoulsAmount;
        this.lastDroppedSoulPos = 0;
        this.droppedSoulsAmount = 0;
        this.tmpSoulsAmount += _souls;
        this.saveCurrentData();
    },

    saveItemDataToStorage: function(itemNum, addAmount) {
        //すでにある場合は、設定値の変更
        var savedData = this.itemData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputItemNumber = "" + itemNum;

                if (savedDataKey == inputItemNumber) {
                    var savedDataObj = JSON.parse(savedDataValue);
                    var _amount = savedDataObj['amount'] + addAmount;
                    var _txt = '{"id":"' + itemNum + '","amount":' + _amount + ',"updated_at":' + 12345 + '}';
                    this.itemData["" + itemNum] = _txt;
                    _updateCnt += 1;
                }
            }
        }
        if (_updateCnt == 0) {
            //初めて追記する場合はamount = 1となる
            var _txt = '{"id":"' + itemNum + '","amount":' + 1 + ',"updated_at":' + 12345 + '}';
            this.itemData["" + itemNum] = _txt;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage", _getData);
    },

    saveCurrentData: function() {
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage", _getData);
    },

    getJson: function() {

        var rtn = '{';
        rtn += '"saveData"            : true,';
        rtn += '"name"                : "ogahamu",';
        rtn += '"charactorImg"        : "hogehoge",';
        rtn += '"maxStageNumber"      :' + this.maxStageNumber + ',';
        rtn += '"totalExp"      :' + this.totalExp + ',';

        rtn += '"tmpSoulsAmount"     :' + this.tmpSoulsAmount + ',';
        rtn += '"forceReturnStageNum"     :' + this.forceReturnStageNum + ',';
        rtn += '"lastFloorNum"     :' + this.lastFloorNum + ',';
        rtn += '"lastMapId"        :' + this.lastMapId + ',';
        rtn += '"lastStartPos"     :' + this.lastStartPos + ',';
        rtn += '"lastFinishPos"     :' + this.lastFinishPos + ',';
        rtn += '"lastPlayerPosNum" :' + this.lastPlayerPosNum + ',';
        rtn += '"lastDroppedSoulPos" :' + this.lastDroppedSoulPos + ',';
        rtn += '"droppedSoulsAmount"     :' + this.droppedSoulsAmount + ',';      
        rtn += '"lastPlayerHp"     :' + this.lastPlayerHp + ',';
        rtn += '"lastPlayerMp"     :' + this.lastPlayerMp + ',';
        rtn += '"lastUpdatedTime"  :' + this.lastUpdatedTime + ',';

        rtn += '"totalCoinAmount"     :' + this.totalCoinAmount + ',';
        rtn += '"totalGemAmount"     :' + this.totalGemAmount + '';
        rtn += '}';
        return rtn;
    },

    setJson: function(JsonData) {
        this.gameScore = JsonData["gameScore"];
        this.totalExp = JsonData["totalExp"];

        this.totalCoinAmount = JsonData["totalCoinAmount"];
        this.totalGemAmount = JsonData["totalGemAmount"];
        this.maxStageNumber = JsonData["maxStageNumber"];

        this.tmpSoulsAmount = JsonData["tmpSoulsAmount"];
        this.forceReturnStageNum = JsonData["forceReturnStageNum"];
        this.lastFloorNum = JsonData["lastFloorNum"];
        this.lastMapId = JsonData["lastMapId"];
        this.lastStartPos = JsonData["lastStartPos"];
        this.lastFinishPos = JsonData["lastFinishPos"];
        this.lastPlayerPosNum = JsonData["lastPlayerPosNum"];
        this.lastDroppedSoulPos = JsonData["lastDroppedSoulPos"];
        this.droppedSoulsAmount = JsonData["droppedSoulsAmount"];    
        this.lastPlayerHp = JsonData["lastPlayerHp"];
        this.lastPlayerMp = JsonData["lastPlayerMp"];
        this.lastUpdatedTime = JsonData["lastUpdatedTime"];
    },

    resetJson: function() {
        this.gameScore = 0;
        this.totalExp = 0;
        this.totalCoinAmount = 0;
        this.totalGemAmount = 0;
        this.maxStageNumber = 1;

        this.forceReturnStageNum = 0;
        this.tmpSoulsAmount = 0;
        this.droppedSoulsAmount = 0;

        this.lastDroppedSoulPos = 0;
        this.lastStartPos = 0;
        this.lastFinishPos = 0;
        this.lastFloorNum = 0;
        this.lastMapId = 0;
        this.lastPlayerPosNum = 0;
        this.lastPlayerHp = 100;
        this.lastPlayerMp = 500;
        this.lastUpdatedTime = 0;
    },

    getSoulAmountByLevel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level);
    },

    getExpAmountByLevel: function(level) {
        level = level * 5;
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level);
    },

    getHpAmountByLevel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level) * 15;
    },

    getBossHpAmountByLevel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level) * 25;
    },

    getAttackPowerByLevel: function(level) {
        return Math.ceil(3 * (60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level);
    },

    getDefencePowerByLevel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level);
    },

    getRewordAmountByLebel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level) * 2;
    },

    getBossRewordAmountByLebel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level) * 3;
    },

    getStageClearRewordAmountByLebel: function(level) {
        return Math.ceil((60 + (60 * 0.1) * ((((level / 100) + 1) * 2) * level) * (level / 100) + 1) + level * level) * 1.5;
    },

    getEnemyActionCost: function(enemyLevel) {
        var _speed = 1;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == "status_fast") {
                    _speed = toObj['amount'];
                }
            }
        }

        var _diffSpeed = _speed - enemyLevel;
        cc.log(_diffSpeed);
        var _cost = 2;
        if (_diffSpeed >= 5) {
            _cost = 8;
        } else if (_diffSpeed >= 4) {
            _cost = 7;
        } else if (_diffSpeed >= 3) {
            _cost = 6;
        } else if (_diffSpeed >= 2) {
            _cost = 5;
        } else if (_diffSpeed >= 2) {
            _cost = 4;
        } else if (_diffSpeed >= 0) {
            _cost = 3;
        }
        return _cost;
    },

    getMaxSoul: function() {
        var _mp = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == "status_luck") {
                    _mp = this.getHpAmountByLevel(toObj['amount']) / 5;
                }
            }
        }
        return _mp;
    },

    getAmountFromData: function(productId) {
        var _hp = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == productId) {
                    return this.getExpAmountByLevel(toObj['amount']);
                }
            }
        }
        return null;
    },

    getLevelFromData: function(productId) {
        var _hp = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == productId) {
                    return toObj['amount'];
                }
            }
        }
        return null;
    },

    getMaxHp: function() {
        var _hp = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == "status_hp") {
                    _hp = this.getHpAmountByLevel(toObj['amount']);
                }
            }
        }
        return _hp;
    },

    getMaxMp: function() {
        var _mp = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == "status_hp") {
                    _mp = this.getHpAmountByLevel(toObj['amount']);
                }
            }
        }
        return _mp;
    },

    getEnemyDamage: function(enemyDefenceLebel,skillCode) {
        //（攻撃力÷２）ー（防御力÷４）
        var playerAttackPower = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == skillCode) {
                    playerAttackPower = this.getAttackPowerByLevel(toObj['amount']);
                }
            }
        }
        var enemyDefencePower = this.getDefencePowerByLevel(enemyDefenceLebel);
        var _damage = Math.ceil(playerAttackPower / 2 - enemyDefencePower / 4);
        if (_damage <= 0) {
            _damage = 1;
        }
        return _damage;
    },

    getPlayerDamage: function(enemyAttackLevel) {
        //（攻撃力÷２）ー（防御力÷４）
        var playerDefencePower = 0;
        var stData = this.itemData;
        for (var stDataKey in stData) {
            if (stData.hasOwnProperty(stDataKey)) {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (toObj['id'] == "status_defence") {
                    playerDefencePower = this.getDefencePowerByLevel(toObj['amount']);
                }
            }
        }
        var enemyAttackPower = this.getAttackPowerByLevel(enemyAttackLevel);
        var _damage = Math.ceil(enemyAttackPower / 2 - playerDefencePower / 4);
        if (_damage <= 0) {
            _damage = 1;
        }
        return _damage;
    },

    getDataFromStorage: function() {
        var _itemData = '';
        var itemData = this.itemData;
        var keyCnt = Object.keys(itemData).length;
        var incKeyCnt = 1;
        for (var key in itemData) {
            if (itemData.hasOwnProperty(key)) {
                var value = itemData[key];
                _itemData += '"' + key + '":' + JSON.stringify(value);
                if (incKeyCnt != keyCnt) {
                    _itemData += ',';
                }
                incKeyCnt++;
            }
        }

        //return '{"saveData" : true, "clearedStageData":{"111":{"id":1,"score":123},"222":{"id":1,"score":123},"333":{"id":1,"score":123}}}';
        var rtn = '{';
        rtn += '"saveData" : true,';
        rtn += '"maxUnlockedStage"    :' + this.maxUnlockedStage + ',';
        //rtn += '"clearedStageData":{' + _clearedStageData + '},';
        rtn += '"itemData":{' + _itemData + '},';
        rtn += '"playerName" :"' + this.playerName + '",';
        rtn += '"totalExp" :' + this.totalExp + ',';

        rtn += '"totalCoinAmount" :' + this.totalCoinAmount + ',';
        rtn += '"totalGemAmount" :' + this.totalGemAmount + ',';

        rtn += '"tmpSoulsAmount" :' + this.tmpSoulsAmount + ',';
        rtn += '"forceReturnStageNum" :' + this.forceReturnStageNum + ',';
        rtn += '"lastFloorNum" :' + this.lastFloorNum + ',';
        rtn += '"lastMapId" :' + this.lastMapId + ',';
        rtn += '"lastStartPos" :' + this.lastStartPos + ',';
        rtn += '"lastFinishPos" :' + this.lastFinishPos + ',';
        rtn += '"lastPlayerPosNum" :' + this.lastPlayerPosNum + ',';
        rtn += '"lastDroppedSoulPos" :' + this.lastDroppedSoulPos + ',';
        rtn += '"droppedSoulsAmount" :' + this.droppedSoulsAmount + ',';
        rtn += '"lastPlayerHp" :' + this.lastPlayerHp + ',';
        rtn += '"lastPlayerMp" :' + this.lastPlayerMp + ',';
        rtn += '"lastUpdatedTime" :' + this.lastUpdatedTime + '';
        rtn += '}';
        return rtn;
    },

    setDataToStorage: function(getData) {
        this.itemData = new Object();
        var stData = getData['itemData'];
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                this.itemData[key] = value;
            }
        }

        this.maxUnlockedStage = getData["maxUnlockedStage"];
        this.playerName = getData["playerName"];
        this.totalExp = getData["totalExp"];
        
        this.totalCoinAmount = getData["totalCoinAmount"];
        this.totalGemAmount = getData["totalGemAmount"];

        this.tmpSoulsAmount = getData["tmpSoulsAmount"];
        this.forceReturnStageNum = getData["forceReturnStageNum"];
        this.lastFloorNum = getData["lastFloorNum"];
        this.lastMapId = getData["lastMapId"];
        this.lastStartPos = getData["lastStartPos"];
        this.lastFinishPos = getData["lastFinishPos"];
        this.lastPlayerPosNum = getData["lastPlayerPosNum"];
        this.lastDroppedSoulPos = getData["lastDroppedSoulPos"];
        this.droppedSoulsAmount = getData["droppedSoulsAmount"];
        this.lastPlayerHp = getData["lastPlayerHp"];
        this.lastPlayerMp = getData["lastPlayerMp"];
        this.lastUpdatedTime = getData["lastUpdatedTime"];

        this.bgmVolume = getData["bgmVolume"];
        this.seVolume = getData["seVolume"];
    },

    initSDK: function() {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            var plugin = sdkbox.PluginShare
            plugin.setListener({
                onShareState: function(response) {
                    console.log("PluginShare onSharestate:" + response.state + " error:" + response.error)
                    if (response.state == sdkbox.PluginShare.ShareState.ShareStateSuccess) {
                        console.log("post success")
                    }
                }
            })
            plugin.init()
                //plugin.logout()
            console.log('Share plugin initialized')
        } else {
            console.log("no plugin init")
        }
    },

    invokeSDK: function() {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            console.log('share post')
            var plugin = sdkbox.PluginShare
            plugin.share({
                text: "iPhoneアプリ『ネコダン』でにゃんこ大量発生注意報！! https://itunes.apple.com/us/app/id1058265886"
            });
        } else {
            console.log("no plugin invoked")
        }
    },

    invokeSDK2: function() {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            console.log('share post')
            var plugin = sdkbox.PluginShare;
            if (this.totalExp == 0) {
                plugin.share({
                    text: "iPhoneアプリ『ネコダン』を始めたニャ！! https://itunes.apple.com/us/app/id1084127955"
                });
            } else {
                plugin.share({
                    text: "iPhoneアプリ『ネコダン』で" + this.totalExp + "匹集めたニャ！! https://itunes.apple.com/us/app/id1084127955"
                });
            }
        } else {
            console.log("no plugin invoked")
        }
    }
});

var saveData = function(storage) {
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    this.storage = new Storage();
    if (platform == 100 || platform == 101) {
        var toObjString = storage.getJson();
        var toObj = JSON.parse(toObjString);
        window.localStorage.setItem("gameStorage", JSON.stringify(toObj));
    }
};

var changeLoadingImage = function() {
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    if (platform == 100 || platform == 101) {
        //ローディング画像を変更
        var loaderScene = new cc.LoaderScene();
        loaderScene.init();
        loaderScene._logoTexture.src = "res/loading.png";
        loaderScene._logoTexture.width = 104;
        loaderScene._logoTexture.height = 215;
        cc.LoaderScene._instance = loaderScene;
    }
};