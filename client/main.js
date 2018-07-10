var frameS = document.getElementById('frameSolid');
var frameD = document.getElementById('frameDash')
var frameNodes = document.getElementById('frameNodes');

var csInterface = new CSInterface();
var appSkin = csInterface.hostEnvironment.appSkinInfo;
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";
var hostPath = sysPath + "/host/";
var appName = csInterface.hostEnvironment.appName;
var alignSolo, lastNum;

var coords = {
  rel : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
  },
  artB : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
    index:null,
  },
  abs : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
  },
  which: "selection"
};

loadUniversalJSXLibraries();
console.log(`Loading for ${appName}`);
loadJSX(`smartAlign.jsx`);
loadJSX(`${appName}.jsx`);
console.log(appUI);
var scanSel, scanAB, lastA;
scanningSelection(true);
scanningArtboard(true);

function scanningArtboard(state) {
  var res, here;
  var parm = ["x1", "y1", "x2", "y2", "w", "h", "index"];
  if (state) {
		timerAB = setInterval(function(){csInterface.evalScript('scanCurrentArtboard();', function(a){
      if (a == scanAB) return;
      if (a !== scanAB) {
        console.log('Artboard changed');
        csInterface.evalScript(`updateArtboardDimensions(${a});`, function(aa){
          var res = aa.split(',');
          for (var m = 0; m < res.length; m++) {
            here = parm[m];
            coords.artB[here] = parseInt(res[m]);
          };
          console.log(coords.artB);
        });
      }
      scanAB = a;
    })}, 50);
    console.log("Scanning artboard on");
	} else {
		clearInterval(timerAB);
		console.log("Scanning artboard off");
	}
}

function scanningSelection(state) {
	if (state) {
		timer = setInterval(function(){csInterface.evalScript('selectScanner();', function(a){
      if (a == scanSel) return;
      scanResults(a);
      scanSel = a;
    })}, 50);
		console.log("Scanning on");
	} else {
		clearInterval(timer);
		console.log("Scanning off");
	}
}

function scanResults(a) {
  var res, here, type;
  var parm = ["x1", "y1", "x2", "y2", "w", "h"];
    if (a == 1)
      alignSolo = true;
    if (a > 0) {
      if (a > 1) {
        csInterface.evalScript(`getBounds(selection, 'geometricBounds')`, function(e){
          alignSolo = false;
          type = e.split(";")
          res = type[0].split(",");
          for (var m = 0; m < res.length; m++) {
            if (res[m] == null) break;
            here = parm[m];
            coords.rel[here] = parseInt(res[m]);
          };
          absRes = type[1].split(",");
          for (var m = 0; m < absRes.length; m++) {
            if (res[m] == null) break;
            here = parm[m];
            coords.abs[here] = parseInt(absRes[m])
          };
        })
        frameS.style.opacity = 1;
      } else {
        frameD.style.opacity = 1;
      }
      frameNodes.style.opacity = 1;
    } else {
      res = ["", "", "", "", "", ""];
      frameS.style.opacity = 0;
      frameD.style.opacity = 0;
      frameNodes.style.opacity = 0;
    }
  lastNum = a;
  console.log(a);
}


var SAbtn = [].slice.call(document.getElementsByClassName('SAbtn'));
SAbtn.forEach(function(v,i,a) {
  v.addEventListener("click", function(e){
    var yOff;
    if (alignSolo) {
      yOff = (coords.artB.index < 1) ? coords.artB.y2 * -1 : coords.artB.y2;    
      csInterface.evalScript(`alignSingleToArtboard('${v.id}', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
    } else {
      if (e.shiftKey) {
        console.log(coords.artB);
        yOff = (coords.artB.index < 1) ? coords.artB.y2 * -1 : coords.artB.y2;
        switch(v.id) {
          case 'N':
            csInterface.evalScript(`alignSelection('align', 'artboard', 'verticalTop', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
          case 'W':
            csInterface.evalScript(`alignSelection('align', 'artboard', 'horizontalLeft', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
          case 'E':
            csInterface.evalScript(`alignSelection('align', 'artboard', 'horizontalRight', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
          case 'S':
            csInterface.evalScript(`alignSelection('align', 'artboard', 'verticalBottom', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
          case 'distHori':
            csInterface.evalScript(`alignSelection('distributeEven', 'artboard', 'verticalCenter', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
          case 'distVert':
            csInterface.evalScript(`alignSelection('distributeEven', 'artboard', 'horizontalCenter', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
          default:
            csInterface.evalScript(`alignSelection('align', 'artboard', '${v.id}', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
            break;
        }
      } else if (e.altKey) {
        yOff = (coords.abs.index < 1) ? coords.abs.y2 * -1 : coords.abs.y2;
        csInterface.evalScript(`alignSelection('distribute', 'selection', '${v.id}', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
      } else if (e.ctrlKey) {
        yOff = (coords.abs.index < 1) ? coords.abs.y2 * -1 : coords.abs.y2;
        csInterface.evalScript(`alignSelection('distributeEven', 'selection', '${v.id}', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
      } else {
        yOff = (coords.abs.index < 1) ? coords.rel.y2 : coords.abs.y2;
        switch(v.id) {
          case 'N':
            csInterface.evalScript(`alignSelection('align', 'selection', 'verticalTop', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
          case 'W':
            csInterface.evalScript(`alignSelection('align', 'selection', 'horizontalLeft', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
          case 'E':
            csInterface.evalScript(`alignSelection('align', 'selection', 'horizontalRight', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
          case 'S':
            csInterface.evalScript(`alignSelection('align', 'selection', 'verticalBottom', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
          case 'distHori':
            csInterface.evalScript(`alignSelection('distributeEven', 'selection', 'horizontalCenter', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
          case 'distVert':
            csInterface.evalScript(`alignSelection('distributeEven', 'selection', 'verticalCenter', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
          default:
            csInterface.evalScript(`alignSelection('align', 'selection', '${v.id}', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
            break;
        }
      }
    }
  }, false)
})
