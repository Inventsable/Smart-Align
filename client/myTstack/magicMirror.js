var cs = new CSInterface();
var docExist;

window.onload = init;
// window.onload = logSkin;

function init(){
  var appSkin = cs.hostEnvironment.appSkinInfo;
  logSkin(appSkin);
  loadBorderWidth();
  callDoc();
  cs.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
  // cs.addEventListener('documentAfterActivate', reset);
  cs.addEventListener('applicationActive', callDoc);
  appUI.data.name = cs.hostEnvironment.appName;
  if (navigator.platform.indexOf('Win') > -1) {
    appUI.data.os = 'Win';
  } else if (navigator.platform.indexOf('Mac') > -1) {
    appUI.data.os = 'Mac';
  }

  buildUI();
}

function reset(){
  // console.log("reload!");
  location.reload();
}

function callDoc() {
  if (cs.hostEnvironment.appName === 'ILST') {
    cs.evalScript('app.documents[0].name', function(e){
      appUI.data.doc = e;
      cs.evalScript('app.documents[0].path', function(i){
        appUI.data.docPath = i;
      })
    })
  }
  // console.log(appUI.data);
}

function updateThemeWithAppSkinInfo() {
    reColorUI();
  }

const appUI = {
  global : {
    BorderWidth: "1.35px",
  },
  color : {
    PanelBG: "#323232",
    Border: "#3e3e3e",
    Icon: "#b4b4b4",
    Font: "#b7b7b7",
    Hover: "#292929",
    Active: "#1f1f1f",
    Focus: "#46a0f5",
    Disabled: "#393939",
    FontDisabled: "#525252",
    FontActive: "#000000",
    InputIdle: "#262626",
    InputActive: "#fcfcfc",
  },
  btn : {
    Padding: ".0625rem .5rem",
    Margin: "auto .035rem",
    Height: "1.75rem",
    Width: "1.25rem",
    Border: "1.5px solid transparent",
  },
  input : {
    Height: "1.5rem",
    WidthMD : "2rem",
    WidthLG : "4rem",
    Width1X : "100%"
  },
  font: {
    Family: "Adobe Clean",
    Size: "10px"
  },
  data : {
    name: cs.hostEnvironment.appName,
    doc: "none",
    docPath: "none",
    theme: "none",
    extPath: cs.getSystemPath(SystemPath.EXTENSION),
    panelWidth: window.innerWidth,
    panelHeight: window.innerHeight,
    system: cs.getOSInformation('--user-agent'),
    version: cs.hostEnvironment.appVersion,
    os: "none"
  }
};


function reColorUI(){
  for (let [key, value] of Object.entries(appUI)) {
    if (key === 'data') continue;
    for (let [index, data] of Object.entries(appUI[key])) {
      document.documentElement.style.setProperty('--' + key + index, data);
    }
  }
}


function buildUI(){
  var btnToggles = ['switch', 'switch-on', 'switch-off'];
  for (var i = 0; i < btnToggles.length; i++) {
    var toggleBtn = [].slice.call(document.getElementsByClassName('adobe-btn-' + btnToggles[i]));
    toggleBtn.forEach(function(v,i,a) {
      v.addEventListener("click", function(e){
        var classN, target;
        if (e.target.classList.contains('adobe')) {
          classN = e.target.classList;
          target = e.target;
        } else {
          classN = e.target.parentNode.classList;
          target = e.target.parentNode;
        }
        if (classN.contains('adobe-btn-switch-on')) {
          classN.remove('adobe-btn-switch-on');
          classN.add('adobe-btn-switch-off')
        } else {
          classN.remove('adobe-btn-switch-off', 'adobe-btn-switch');
          classN.add('adobe-btn-switch-on');
        }
        toolbarToggle(target);
      }, false);
    });
  }
  var inputGroup = [].slice.call(document.getElementsByClassName('adobe-inputGroup'));
  inputGroup.forEach(function(v,i,a) {
    var target = "none";
    for (var u = 0; u < v.children.length; u++) {
      if (v.children[u].classList.contains('adobe-inputNumber')){
        target = v.children[u];
      }
    }
    if (target !== "none") {addWheelScrollTo(v, target);}
  });
}

function addWheelScrollTo(v, target) {
  v.addEventListener("mouseover", function(evtTier){
    console.log(evtTier);
  });
  v.addEventListener("wheel", function(evt){
    var newNum = target.textContent;
    if (evt.deltaY < 0) {
      newNum++;
    } else {
      newNum--;
    }
    console.log(evt);
    target.textContent = newNum;
  }, false)
}

  // var scrollCount = 1;
  //   window.addEventListener('mousewheel', function(e){
  //
  //     if(e.wheelDelta<0 && scrollCount<5){
  //       scrollCount++;
  //     }
  //
  //     else if(e.wheelDelta>0 && scrollCount>1){
  //       scrollCount--;
  //     }
  //     document.querySelector('.number').innerHTML = scrollCount;
  //   })


function toolbarToggle(elt) {
  var btnToggles = ['switch', 'switch-on', 'switch-off'];
  var toolbar = [].slice.call(document.getElementsByClassName('adobe-toolbar'));
  toolbar.forEach(function(v,i,a) {
    var child = v.children;
    for (var ee = 0; ee < v.children.length; ee++) {
      for (var u = 0; u < btnToggles.length; u++) {
        if (child[ee].classList.contains('adobe-btn-' + btnToggles[u])) {
          if (child[ee] !== elt) {
            child[ee].classList.remove('adobe-btn-switch-off', 'adobe-btn-switch', 'adobe-btn-switch-on');
            child[ee].classList.add('adobe-btn-switch-off');
          }
        }
      }
    }
  })
}

function loadBorderWidth() {
  if (appUI.data.name === 'PHXS') {
    appUI.borderWidth = "1.25px";
  } else {
    appUI.data.borderWidth = "1.25px";
  }
}


function logSkin(params) {
    var csInterface = new CSInterface();
    var appSkin = params;
    appUI.data.system = csInterface.getOSInformation('--user-agent');
    appUI.data.name = csInterface.hostEnvironment.appName;
    appUI.data.version = csInterface.hostEnvironment.appVersion;
    // appUI.color.PanelBG = toHex(appSkin.panelBackgroundColor.color);
    var baseColor = appSkin.panelBackgroundColor.color;
    // appUI.color.Font = appSkin.baseFontFamily;
    appUI.font.Size = appSkin.baseFontSize;

    if (appSkin.panelBackgroundColor.color.red > 220) {
      appUI.data.theme = 'Lightest';
      switch(appUI.data.name) {
        case 'PHXS':
          appUI.color.Disabled = toHex(baseColor, -10);
          appUI.color.FontDisabled = toHex(baseColor, -72);
          appUI.color.Focus = '#0f64d2';
          appUI.color.Font = toHex(baseColor, -168);
          appUI.color.BorderDisabled = toHex(baseColor, -18);
          appUI.color.BorderActive = toHex(baseColor, -72);
          appUI.color.Border = toHex(baseColor, -36);
          appUI.color.Icon = toHex(baseColor, -190);
          appUI.color.Hover = toHex(baseColor, 12);
          appUI.color.Active = toHex(baseColor, -49);
          appUI.color.InputIdle = toHex(baseColor, 15);
          appUI.color.InputActive = toHex(baseColor, 15);
          appUI.color.FontActive = appUI.color.Font;
          break;
        case 'ILST':
          appUI.color.Disabled = toHex(baseColor, -10);
          appUI.color.FontDisabled = toHex(baseColor, -42);
          appUI.color.Focus = '#0f64d2';
          appUI.color.Font = toHex(baseColor, -168);
          appUI.color.Border = toHex(baseColor, -20);
          appUI.color.Icon = toHex(baseColor, -153);
          appUI.color.Hover = toHex(baseColor, 9);
          appUI.color.Active = toHex(baseColor, -51);
          appUI.color.InputIdle = toHex(baseColor, 15);
          appUI.color.InputActive = toHex(baseColor, 15);
          appUI.color.FontActive = appUI.color.Font;
          break;
        default:

          appUI.color.Focus = toHex(appSkin.systemHighlightColor);
          break;
      }
    } else if (appSkin.panelBackgroundColor.color.red > 150) {
      appUI.data.theme = 'Light';
      switch(appUI.data.name) {
        case 'PHXS':

          appUI.color.Disabled = toHex(baseColor, 5);
          appUI.color.FontDisabled = toHex(baseColor, -74);
          appUI.color.Focus = '#0f64d2';
          appUI.color.Font = toHex(baseColor, -128);
          appUI.color.BorderDisabled = toHex(baseColor, -11);
          appUI.color.BorderActive = toHex(baseColor, -72);
          appUI.color.Border = toHex(baseColor, -36);
          appUI.color.Icon = toHex(baseColor, -158);
          appUI.color.Hover = toHex(baseColor, 25);
          appUI.color.Active = toHex(baseColor, -56);
          appUI.color.InputIdle = toHex(baseColor, 25);
          appUI.color.InputActive = toHex(baseColor, 25);
          appUI.color.FontActive = appUI.color.Font;
          break;
        case 'ILST':
          appUI.color.Disabled = toHex(baseColor, -8);
          appUI.color.FontDisabled = toHex(baseColor, -32);
          appUI.color.Focus = '#0f64d2';
          appUI.color.Font = toHex(baseColor, -168);
          appUI.color.Border = toHex(baseColor, -16);
          appUI.color.Icon = toHex(baseColor, -107);
          appUI.color.Hover = toHex(baseColor, 36);
          appUI.color.Active = toHex(baseColor, -34);
          appUI.color.InputIdle = toHex(baseColor, 43);
          appUI.color.InputActive = toHex(baseColor, 43);
          appUI.color.FontActive = appUI.color.Font;
          break;
        default:
          appUI.color.Focus = toHex(appSkin.systemHighlightColor);
          break;
      }
    } else if (appSkin.panelBackgroundColor.color.red > 100) {
      appUI.data.theme = 'Dark';
      appUI.color.Disabled = toHex(baseColor, 6);
      switch(appUI.data.name) {
        case 'PHXS':
          appUI.color.FontDisabled = toHex(baseColor, 69);
          appUI.color.Focus = '#0f64d2';
          appUI.color.Font = toHex(baseColor, 133);
          appUI.color.Border = toHex(baseColor, 19);
          appUI.color.Icon = toHex(baseColor, 135);
          appUI.color.Hover = toHex(baseColor, -14);
          appUI.color.Active = toHex(baseColor, -27);
          appUI.color.InputIdle = toHex(baseColor, -14);
          appUI.color.InputActive = toHex(baseColor, -14);
          appUI.color.FontActive = appUI.color.Font;
          break;
        case 'ILST':
          appUI.color.FontDisabled = toHex(baseColor, 30);
          appUI.color.Focus = '#46a0f5';
          appUI.color.Font = toHex(baseColor, 133);
          appUI.color.Border = toHex(baseColor, 12);
          appUI.color.Active = toHex(baseColor, -35);
          appUI.color.Hover = toHex(baseColor, -22);
          appUI.color.Icon = toHex(baseColor, 104);
          appUI.color.InputIdle = toHex(baseColor, -14);
          appUI.color.InputActive = toHex(baseColor, 202);
          appUI.color.FontActive = toHex(baseColor, -255);
          break;
        default:
          appUI.color.Focus = toHex(appSkin.systemHighlightColor);
          break;
      }
    } else {
      appUI.data.theme = 'Darkest';
      appUI.color.FontDisabled = toHex(baseColor, 32);
      appUI.color.Hover = toHex(baseColor, -9);
      appUI.color.Disabled = toHex(baseColor, 7);
      appUI.color.Active = toHex(baseColor, -19);
      switch(appUI.data.name) {
        case 'PHXS':
          appUI.color.Focus = '#0f64d2';
          appUI.color.Font = toHex(baseColor, 162);
          appUI.color.Border = toHex(baseColor, 21);
          appUI.color.Icon = toHex(baseColor, 162);
          appUI.color.InputIdle = toHex(baseColor, -9);
          appUI.color.InputActive = appUI.color.InputIdle;
          appUI.color.FontActive = appUI.color.Font;
          break;
        case 'ILST':
          appUI.color.Focus = '#46a0f5';
          appUI.color.Font = toHex(baseColor, 133);
          appUI.color.Border = toHex(baseColor, 12);
          appUI.color.Icon = toHex(baseColor, 130);
          appUI.color.InputIdle = toHex(baseColor, -12);
          appUI.color.InputActive = toHex(baseColor, 202);
          appUI.color.FontActive = toHex(baseColor, -255);
          break;
        default:
          appUI.color.Focus = toHex(appSkin.systemHighlightColor);
          // appUI.color.Focus = '#46a0f5';
          appUI.color.Font = toHex(baseColor, 133);
          appUI.color.Border = toHex(baseColor, 12);
          appUI.color.Icon = toHex(baseColor, 130);
          appUI.color.InputIdle = toHex(baseColor, -12);
          appUI.color.InputActive = toHex(baseColor, 202);
          appUI.color.FontActive = toHex(baseColor, -255);
          break;
      }
    }
    updateThemeWithAppSkinInfo();
}



/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = Math.round(computedValue).toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with (color) {
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return "#" + hex;
}

function onAppThemeColorChanged(event) {
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    logSkin(skinInfo);
    console.log(`Theme changed to ${appUI.data.theme}`);
}



// for (value in appUI.color) {
//   console.log('--color' + value, appUI.color);
// }

// $$$ // document.documentElement.style.setProperty('--color' + value, 'red');

// var sheets = [].slice.call(document.styleSheets);
// sheets.forEach(function(e){
//   if (e.href.includes('adobeStyle.css')) {
//     var style = e.cssRules.style;
//     e.cssRules[1].style.setProperty('--colorPanelBG', 'red');
//     // console.log(e.cssRules[1].style);
//     // console.log(e.cssRules.style[0]);
//
//     // e.cssRules[1].style.setProperty('--colorPanelBG', '#ff0000')
//   }
//
// })

  // var jsSheet = document.styleSheets[7];
  // var jsRules = jsSheet.cssRules;
  // console.log(sheet);
//   for (var i = 0; i < document.styleSheets.length; i++){
//
//   }
// }
