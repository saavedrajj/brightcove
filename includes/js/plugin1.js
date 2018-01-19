videojs.plugin('plugin1', function(options) {
  var player = this;

  console.log("plugin#1");
  console.log(options);
});