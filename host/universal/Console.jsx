var pathTo = {
  sand: "none"
};

function logData(sandPath){
  pathTo.sand = sandPath;
  // alert(pathTo.sand)
}

var err = {
  name: "none",
  line: "0",
  full: "no errors",
  data: "errors",
  ifIs: 0
};

JSXEvent(err, "com.init")

function runScript(path) {
  try {
  $.evalFile(path)
  } catch (e) {
    JSXEvent(e.name + "," + e.line + "," + e + "," + e.message, "com.playwrite.error")
  }
}

function console(evalObj){
  try {
    JSXEvent(evalObj, "com.playwrite.console")

  } catch(e) {
    JSXEvent(e, "com.playwrite.error")
  }
}


function JSXEvent(payload, eventType) {
  try {
    var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
  } catch (e) {
    JSXEvent(e, "com.playwrite.error")
  }
  if (xLib) {
  var eventObj = new CSXSEvent();
  eventObj.type = eventType;
  eventObj.data = payload;
  eventObj.dispatch();
  }
  return;
}

// function triggerJSXFunction(isOn) {
//   if (isOn) {
//     // there's a returning value from JS
//     alert("Returning value: " + isOn);
//   } else {
//     if (Math.random() > 0.5) {
//       // payload is a regular string
//       JSXEvent(somePayload, "ConsoleEvent");
//     } else {
//       // payload is a stringified function to be evaluated
//       JSXEvent(someOtherPayload, "Custom Event 2");
//     }
//   }
// }


/// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
