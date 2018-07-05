(function () {
  'use strict';

  var csInterface = new CSInterface();

  csInterface.addEventListener('com.init', function(evt) {
    console.log("Initializing console");
  });

  dispatchEvent("com.plug", "Plugged In")
  function dispatchEvent(name, data) {
  	var event = new CSEvent(name, 'APPLICATION');
  	event.data = data;
  	csInterface.dispatchEvent(event);
  }

  csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", log);
    function log(event){
    console.log(event);
  }

  csInterface.addEventListener("com.adobe.csxs.events", log);
    function log(event){
    console.log(event);
    console.log(" triggered ");
  }


  //  btn.addEventListener("click", function(evt){
  // 	dispatchEvent(name, data)
  // }, false);


}());
