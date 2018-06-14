var BumperVideo = function() { 
var _player = this; 
var _bumperVideo = {}; 
_player.one('loadedmetadata',function(){ 
console.log(this.mediainfo); 
var _bumperId = "bumpertest"; 
this.catalog.getVideo('ref:' + _bumperId,function(e,v){ 
if(e){ 
// handle errors 
} else { 
_bumperVideo = v; 
} 
}); 
}); 
_player.one('play',function(){ 
var _originalVideo = this.mediainfo; 
this.catalog.load(_bumperVideo); 
this.play(); 

//Hide controls and remove vjs-tech 
_player.controlBar.el_.style.visibility = "hidden"; 

_player.controls_ = "false"; 
this.one('ended',function(){ 
this.catalog.load(_originalVideo); 
this.play(); 
_player.controlBar.el_.style.visibility = "visible"; 
}); 
}); 
} 
var registerPlugin = videojs.registerPlugin || videojs.plugin; 
registerPlugin('BumperVideo', BumperVideo); 