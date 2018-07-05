var doc;
var exist = app.documents.length > 0;

// function colorPicker(){
//   return $.colorPicker(-1);
// }


function docName() {
  var data = {
    name: "none",
    path: "none"
  };
  var newData = [];
  if (exist) {
    doc = app.activeDocument;
    newData.push(doc.name);
    newData.push(doc.path);
    return newData;
  }
}

function doesExist() {
  if (app.documents.length > 0) {
    doc = app.activeDocument;
    return true;
  } else {
    return false;
  }
}

function colorFromApp() {
  if (app.isFillActive()) {
    defaultColor = fillColorFromAI();
  } else {
    defaultColor = strokeColorFromAI();
  }
  return defaultColor;
}

function fillColorFromAI() {
  if (exist) {
    var convertColor = rgbToHex(doc.defaultFillColor.red, doc.defaultFillColor.green, doc.defaultFillColor.blue);
    return convertColor;
  } else {
    return "ffffff";
  }
}
function strokeColorFromAI() {
  if (exist) {
    var convertColor = rgbToHex(doc.defaultStrokeColor.red, doc.defaultStrokeColor.green, doc.defaultStrokeColor.blue);
    return convertColor;
  } else {
    return "231f20";
  }
}
