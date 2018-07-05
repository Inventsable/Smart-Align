var csInterface = new CSInterface();
var appSkin = csInterface.hostEnvironment.appSkinInfo;
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";
var actionPath = sysPath + "/resources/SmartAlign.aia";
var hostPath = sysPath + "/host/";
var appName = csInterface.hostEnvironment.appName;
var suffix;
var typeSA = document.getElementById('def');
var alignBtn = document.getElementById('align');
var distBtn = document.getElementById('dist');

loadUniversalJSXLibraries();
console.log(`Loading for ${appName}`);
loadJSX(`${appName}.jsx`);
console.log(appUI);
scanningToggle("On")
var toggle = {
  selection: "selection",
  direction: "align"
};

// csInterface.evalScript(`bootActions('${actionPath}')`)

function scanningToggle(params) {
	if (params === "On") {
		timer = setInterval(function(){csInterface.evalScript('selectScanner();', function(a){
      if (a > 0) {
        if (typeSA.classList.contains('icon-selection')) {
          toggle.selection = "artboard";
          typeSA.classList.remove('icon-selection');
          typeSA.classList.add('icon-Center');
        }
      } else {
        if (typeSA.classList.contains('icon-Center')) {
          toggle.selection = "selection";
          typeSA.classList.remove('icon-Center');
          typeSA.classList.add('icon-selection');
        }
      }
    })}, 200);
		console.log("Scanning on");
	} else {
		clearInterval(timer);
		console.log("Scanning off");
	}
}

alignBtn.addEventListener("click", function(e){
  if (e.target.classList.contains('adobe-btn-switch-on')) {
    return;
  } else {
    toggle.direction = "align";
  }
  console.log(toggle.direction);
}, false)

distBtn.addEventListener("click", function(e){
  if (e.target.classList.contains('adobe-btn-switch-on')) {
    return;
  } else {
    toggle.direction = "dist";
  }
  console.log(toggle.direction);
}, false)


var SAbtn = [].slice.call(document.getElementsByClassName('adobe-btn-sp'));
SAbtn.forEach(function(v,i,a) {
  v.addEventListener("click", function(e){
    var classN, target;
    if (e.target.classList.contains('adobe')) {
      classN = e.target.classList;
      target = e.target;
    } else {
      classN = e.target.parentNode.classList;
      target = e.target.parentNode;
    }
    action = toggle.direction + target.id;
    csInterface.evalScript(`app.doScript('${action}', 'SmartAlign');`)
    console.log(`Action to trigger: ${action}`);
  }, false)
});
