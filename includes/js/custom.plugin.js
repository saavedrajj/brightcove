videojs.plugin('customplugin', function(options) {
  var player = this;
  console.log("You are accesing the custom plugin");
  console.log(options);      
});