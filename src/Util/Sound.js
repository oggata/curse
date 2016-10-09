var playBGM = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic("res/bgm_game_maoudamashii_6_dangeon01.mp3",true); //BGM
    }
};

var playBGM002 = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic("res/bgm_maoudamashii_piano21.mp3",true); //BGM
    }
};

var playBGM003 = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic("res/game_maoudamashii_6_dangeon02.mp3",true); //BGM
    }
};

var playBGM004 = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic("res/se_maoudamashii_jingle01.mp3",false); //BGM
    }
};

var playBattleBGM = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic("res/bgm_game_maoudamashii_1_battle27.mp3",true); //BGM
    }
};

var playBattleBGM002 = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic("res/game_maoudamashii_2_boss01.mp3",true); //BGM
    }
};

//se_maoudamashii_element_darkness01.mp3
var playSE001 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_battle12.mp3",false);
    }
};

var playSE002 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_element_darkness01.mp3",false);
    }
};

var playSE003 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_se_footstep02.mp3",false);
    }
};

var playSE004 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_element_darkness01.mp3",false);
    }
};

var playSE005 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_explosion04.mp3",false);
    }
};

var playSE006 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_magical21.mp3",false);
    }
};
var playSE007 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_magical30.mp3",false);
    }
};

var playSE008 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_retro14.mp3",false);
    }
};

var playSE009 = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_se_door02.mp3",false);
    }
};

//se_maoudamashii_retro02.mp3
//se_maoudamashii_magical30.mp3
//se_maoudamashii_explosion04.mp3
//se_maoudamashii_magical21.mp3
var playSESystem = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect("res/se_maoudamashii_system05.mp3",false);
    }
};