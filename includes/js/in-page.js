/*
  player.on('ready', function handlePlayerReady() {


var experience = window.bcov.gal.getEmbed();
experience.on('player_init', function handlePlayerInit(player) {
  player.on('ready', function () {

    console.log('hey');
  });
});
*/
console.log('dd');
var experience = window.bcov.gal.getEmbed();

experience.on('player_init', function handlePlayerInit() {
  var player = experience.api.player;



  // Wait until the viewer instance is loaded. This only needs to happen for the
  // first video in the experience.
  if (!player.hapyakViewer) {
    player.one('hyViewerLoaded', viewerLoaded);
    return;
  }
}