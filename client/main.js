var csInterface = new CSInterface();
var appSkin = csInterface.hostEnvironment.appSkinInfo;
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";
// var actionPath = sysPath + "/resources/SmartAlign.aia";
var hostPath = sysPath + "/host/";
var appName = csInterface.hostEnvironment.appName;
var suffix;
var typeSA = document.getElementById('def');
var alignBtn = document.getElementById('align');
var distBtn = document.getElementById('dist');

loadUniversalJSXLibraries();
console.log(`Loading for ${appName}`);
// loadJSX(`align.jsx`);
// loadJSX(`${appName}.jsx`);
console.log(appUI);
scanningToggle(true)
var toggle = {
  alignTo: "selection",
  direction: "align"
};

var frameS = document.getElementById('frameSolid');
var frameD = document.getElementById('frameDash')
var frameNodes = document.getElementById('frameNodes');

// frameD.style.opacity = 0;
var scanRes;

function scanningToggle(state) {
  var res, here;
  var parm = ["x", "y", "w", "h"];
	if (state) {
		timer = setInterval(function(){csInterface.evalScript('selectScanner();', function(a){
      if (a == scanRes) return;
      console.log(a);
      if (a > 0) {
        // (a > 1) ? toggle.alignTo = "selection" : toggle.alignTo = "artboard";
        // (a > 1) ? a = 1 : a = a;
        frameNodes.style.opacity = 1;
        if (a > 1) {
          frameD.style.opacity = 1;
          console.log(a + " objects selected");
        } else {
          frameS.style.opacity = 1;
          console.log("Something is selected");
        }
      } else {
        frameNodes.style.opacity = 0;
        frameS.style.opacity = 0;
        frameD.style.opacity = 0;
        console.log("Nothing is selected");
      }
      scanRes = a;
    })}, 50);
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


// var controls = {
//   NW:null,
//   N:null,
//   NE:null,
//   W:null,
//   center:null,
//   E:null,
//   SW:null,
//   S:null,
//   SE:null,
// }
//
// var bBox = {
//   frameDash: null,
//   frameSolid: null,
//   frameNodes: null,
// };
//
// for (var d in controls) {
//   controls[d] = this[d];
//   controls[d].addEventListener("mouseover", function(e){
//     // console.log(e.target);
//     // console.log(this.style);
//     // this.style.fill = "#ff0000";
//   }, false)
// }
//
// for (var b in bBox) {
//   bBox[b] = this[b];
//   bBox[b].addEventListener("mouseover", function(e){
//     console.log(e.target);
//   }, false)
// }
