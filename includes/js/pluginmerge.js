videojs.registerPlugin('pluginmerge', function(options) {
  var player = this;

  var options_temp = options;
  console.log(options_temp);
  var options = {"var2": "value2"};
  /*console.log("plugin#1");*/
  console.log(options);


    var options2 = options_temp.concat(options); 
  console.log(options2);
});