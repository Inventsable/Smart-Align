var compCheck = app.project.item.length;
var exist = app.project.item.length > 0;
var thisComp;
var isSelected;
var selectedLength;
var count;
var selectedLayer;

// alert(app.project.activeItem)

function activeProject() {
  if (compCheck > 0) {
    return true;
  } else {
    return false;
  }
}

if (compCheck > 0) {
  thisComp = app.project.activeItem;
  isSelected = app.project.activeItem.selectedLayers.length > 0;
  selectedLength = app.project.activeItem.selectedLayers.length;
  count = 0;
  selectedLayer = app.project.activeItem.selectedLayers[0];
}

function textFromClipboard(clipboard) {
  if (app.project.activeItem.selectedLayers.length > 0) {
    for (var a = 0; a < app.project.activeItem.selectedLayers.length; a++) {
      var textLayer = thisComp.selectedLayers[a];
      textLayer.sourceText.setValue(clipboard);
    }
  } else {
    alert("No text layer selected.")
  }
}

function docName() {
  var data = {
    name: "none",
    color: "none"
  };
  if (exist) {
    data.comp = app.project.activeItem.name;
    // data.doc = app.project.file;
    return JSON.stringify(data);
  }
}

// main("color", "0000ff", "ff0000")
// thanks Horshack @https://forums.adobe.com/thread/2317720
function dumpPropTree(rootObj, nestingLevel, selected, type, find, replace) {
    var countProps = rootObj.numProperties;
    for (var propIndex=1; propIndex <= countProps; propIndex++) {
        var prop = rootObj.property(propIndex);
          // thanks Dan Ebberts
          switch(prop.propertyValueType) {
            case PropertyValueType.COLOR:
              if ((type === 'color') && (isVisibleColorPropery(prop))) {
                var newColor = rgbToHex(prop.value[0] * 255, prop.value[1] * 255, prop.value[2] * 255);
                if (newColor === find) {
                  var replaceColor = hexToRgb(replace);
                  prop.setValue([replaceColor.r/255, replaceColor.g/255, replaceColor.b/255])
                }
              }
              break;
            default:
              break;
          }
          if (prop.name === find) {
            if (type === "name") {
              prop.name = replace;
            } else if (type === "select") {
              prop.selected = true;
            }
          }
          if ((type === 'expression') && (prop.canSetExpression)) {
            if (prop.expression) {
              var oldExp = prop.expression;
              var re = new RegExp(find);
              var newExp = oldExp.replace(re, replace);
              prop.expression = newExp;
            }
          }
        if (prop.numProperties > 0)
        dumpPropTree(prop, nestingLevel+1, selected, type, find, replace);
    }
}

function main(selected, type, find, replace) {
    var activeComp = app.project.activeItem;
    var countSelectedLayers = activeComp.layers.length;
    for (selectedLayerIndex = 1; selectedLayerIndex <= countSelectedLayers; selectedLayerIndex++) {
        var layer = activeComp.layers[selectedLayerIndex];
        dumpPropTree(layer, 0, selected, type, find, replace);
    }
}

// thanks Tomas Sinkunas
function isVisibleColorPropery(property) {
    return  property.propertyValueType === PropertyValueType.COLOR && !isHidden(property);
}

function isHidden(property) {
    var oldExpression = property.expression;
    try {
        // try to add some dummy expression;
        // If it errors out - this means property is hidden
        // overwise property can be modified
        property.expression = "value";
    } catch (e) {
        return true;
    }
    // Set expression to it's old value;
    property.expression = oldExpression;
    return false;
}



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
