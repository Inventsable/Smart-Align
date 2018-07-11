var thisDoc = app.documents[0];
var activeAB = thisDoc.artboards.getActiveArtboardIndex();
var lastAB = 0;
var lastABOffset, isOrigin, thisAB, absAB, relAB;

function selectScanner() {
  if (app.selection.length > 0) {
    return app.selection.length;
  } else {
    return 0;
  }
}

function scanCurrentArtboard(){
  activeAB = thisDoc.artboards.getActiveArtboardIndex();
  if (activeAB !== lastAB)
    return activeAB
  else
    return lastAB;
  lastAB = activeAB;
}

function updateArtboardDimensions(index){
  var w, h;
  thisAB = thisDoc.artboards.getActiveArtboardIndex();
  absAB = thisDoc.artboards[index].artboardRect;
  absAB[1] = (absAB[1] * (-1));
  relAB = [];
  for (var inv = 0; inv < 4; inv++) {
    res = (absAB[inv] < 0) ? (absAB[inv] * (-1)) : absAB[inv];
    relAB.push(roundTo(res, 4));
  }
  if (absAB[0] < 0)
    w = (absAB[0] - relAB[2]);
  else
    w = (relAB[0] - relAB[2]);
  if (absAB[1] < 0)
    h = (absAB[1] - absAB[3]);
  else
    h = (relAB[1] - relAB[3]);
  w = (w < 0) ? (w*(-1)) : w;
  h = (h < 0) ? (h*(-1)) : h;
  lastABOffset = [ parseInt((absAB[0] * -1)), parseInt(absAB[1]), thisAB ]
  absAB[1] = (absAB[1] * (-1));
  return rect = [ absAB[0], absAB[1], absAB[2], absAB[3], w, h, thisAB ];
  // return rect = [ absAB[0], absAB[1], w, h ];
}



/** modified from Alexander Ladygin:
https://forums.adobe.com/thread/2109761  **/
function getBounds(arr, bounds) {
    thisAB = thisDoc.artboards.getActiveArtboardIndex();
    var absX1, absY1, absX2, absY2;
    var x1 = [], y1 = [], x2 = [], y2 = [],
        bounds = bounds || 'geometricBounds';

    // relative selection bounding box
    for (var i = 0; i < arr.length; i++) {
      x1.push(lastABOffset[0] + arr[i][bounds][0]);
      x2.push(lastABOffset[0] + arr[i][bounds][2]);
      y1.push((arr[i][bounds][1] + lastABOffset[1]) * -1);
      y2.push((arr[i][bounds][3] + lastABOffset[1]) * -1);
    }

    // find XY min/max, get width and height
    x1 = Math.min.apply(null, x1);
    y1 = Math.min.apply(null, y1);
    x2 = Math.max.apply(null, x2);
    y2 = Math.max.apply(null, y2);
    w = x2 - x1;
    h = y2 - y1;

    // reverse and store for absolute position of selection
    if (thisAB > 0) {
      absX1 = (lastABOffset[0] * -1) + x1;
      absX2 = (lastABOffset[0] * -1) + x2;
      absY1 = (lastABOffset[1] * -1) - y1;
      absY2 = (lastABOffset[1] * -1) - y2;
    } else {
      absX1 = x1;
      absY1 = y1;
      absX2 = x2;
      absY2 = y2;
    }

    // send two arrays with ; delimiter
    return rect = [ x1, y1, x2, y2, w, h ] + ";" + [ absX1, absY1, absX2, absY2, w, h ];
};

// alert(app.documents[0].artboards[0].artboardRect)
// alignSingleToArtboard('NE');
// alignSelection('selection', 'Center', 20, 25, 100, 100)

function alignSingleToArtboard(alignCompass, x1, y1, x2, y2) {
  // var currAB = app.documents[0].activeArtboard;
  var inverted = false;
  var indexAB = app.documents[0].artboards.getActiveArtboardIndex();
  var boundsAB = app.documents[0].artboards[indexAB].artboardRect;
  if (indexAB < 1)
    inverted = true;
  var minX = x1;
  var maxX = x2;
  var minY = y1;
  var maxY = y2;
  var midX = (minX + (maxX - minX) / 2);
  var midY = (minY + (maxY - minY) / 2);

  var target = app.selection[0];
  var wd = target.width;
  var ht = target.height;
  switch(alignCompass){
    case 'NW':
      if (inverted)
        target.position = [minX, minY * -1];
      else
        target.position = [minX, minY];
      break;
    case 'N':
      if (inverted)
        target.position = [midX - wd / 2, minY * -1];
      else
        target.position = [midX - wd / 2, minY];
      break;
    case 'NE':
      if (inverted)
        target.position = [maxX - wd, minY * -1];
      else
        target.position = [maxX - wd, minY];
      break;
    case 'W':
      if (inverted)
        target.position = [minX, (midY - ht / 2) * -1];
      else
        target.position = [minX, midY + ht / 2];
      break;
    case 'Center':
      if (inverted)
        target.position = [midX - wd / 2, (midY - ht / 2) * -1];
      else
        target.position = [midX - wd / 2, midY + ht / 2];
      break;
    case 'E':
      if (inverted)
        target.position = [maxX - wd, (midY - ht / 2) * -1];
      else
        target.position = [maxX - wd, midY + ht / 2];
      break;
    case 'SW':
      if (inverted)
        target.position = [minX, (maxY - ht) * -1];
      else
        target.position = [minX, maxY + ht];
      break;
    case 'S':
      if (inverted)
        target.position = [midX - wd / 2, (maxY - ht) * -1];
      else
        target.position = [midX - wd / 2, maxY + ht];
      break;
    case 'SE':
      if (inverted)
        target.position = [maxX - wd, (maxY - ht) * -1];
      else
        target.position = [maxX - wd, maxY + ht];
      break;
    case 'alignY':
      if (inverted)
        target.position = [bounds[0], (midY - ht) * -1];
      else
        target.position = [bounds[0], maxY - ht];
      break;
    case 'alignX':
      if (inverted)
        target.position = [midX - wd / 2, bounds[1]];
      else
        target.position = [midX - wd / 2, bounds[1]];
      break;
    default:
      // alert(alignCompass);
      break;
  }
}


/** based on @TenA's response from
https://forums.adobe.com/thread/2111711  **/
function alignSelection(alignType, alignTarget, alignCompass, x1, y1, x2, y2) {
  var refBnds;
  var inverted = false;
  if (alignTarget === 'selectionKey') {
    refBnds = app.activeDocument.selection[0].geometricBounds;
  } else {
    refBnds = [ x1, y1, x2, y2 ]
  }
  if (thisDoc.artboards.getActiveArtboardIndex() < 1)
    inverted = true;

  var minX = refBnds[0];
  var minY = refBnds[1];
  var maxX = refBnds[2];
  var maxY = refBnds[3];
  var midX = (minX + (maxX - minX) / 2);
  var midY = (minY + (maxY - minY) / 2);
  var boxW = maxX - minX;
  var boxH = maxY - minY;
  boxW = (boxW < 0) ? boxW * -1 : boxW;
  boxH = (boxH < 0) ? boxH * -1 : boxH;

// calculate for Distributes
  var first = 0;
  var last = app.selection.length - 1;
  var startX = app.selection[0].width + minX;
  var endX = maxX - app.selection[last].width;
  var startY = app.selection[0].height + minY;
  var endY = maxY - app.selection[last].height;
  // var blendRect = [startX, startY, endX, endY];
  // var blendW = blendRect[2] - blendRect[0];
  // var blendH = blendRect[3] - blendRect[1];
  var childrenW = app.selection[first].width + app.selection[last].width;
  var childrenH = app.selection[first].height + app.selection[last].height;
  for (var ii = 1; ii < last; ii++) {
    childrenW = childrenW + app.selection[ii].width;
    childrenH = childrenH + app.selection[ii].height;
  }
  var remainderW = boxW - childrenW;
  var remainderH = boxH - childrenH;
  var evenX = remainderW / (app.selection.length - 1);
  var evenY = remainderH / (app.selection.length - 1);

  // alert(boxH + " - " + childrenH + " = " + remainderH + " / " + last + " = " + evenY)
  // alert("totalW: " + boxW + ", childW: " + childrenW + ", remainder: " + remainderW + "\rtotalH: " + boxH + "childH: " + childrenH + ", remainder: " + remainderH);

  for (var i = 0; i < app.selection.length; i++) {
    var target = app.selection[i];
    var wd = target.width;
    var ht = target.height;
    var bounds = target.geometricBounds;
    if (alignType === 'align') {
      switch(alignCompass){
        case 'NW':
          if (inverted)
            target.position = [minX, minY * -1];
          else
            target.position = [minX, minY];
          break;
        case 'N':
          if (inverted)
            target.position = [midX - wd / 2, minY * -1];
          else
            target.position = [midX - wd / 2, minY];
          break;
        case 'NE':
          if (inverted)
            target.position = [maxX - wd, minY * -1];
          else
            target.position = [maxX - wd, minY];
          break;
        case 'W':
          if (inverted)
            target.position = [minX, (midY - ht / 2) * -1];
          else
            target.position = [minX, midY + ht / 2];
          break;
        case 'Center':
          if (inverted)
            target.position = [midX - wd / 2, (midY - ht / 2) * -1];
          else
            target.position = [midX - wd / 2, midY + ht / 2];
          break;
        case 'E':
          if (inverted)
            target.position = [maxX - wd, (midY - ht / 2) * -1];
          else
            target.position = [maxX - wd, midY + ht / 2];
          break;
        case 'SW':
          if (inverted)
            target.position = [minX, (maxY - ht) * -1];
          else
            target.position = [minX, maxY + ht];
          break;
        case 'S':
          if (inverted)
            target.position = [midX - wd / 2, (maxY - ht) * -1];
          else
            target.position = [midX - wd / 2, maxY + ht];
          break;
        case 'SE':
          if (inverted)
            target.position = [maxX - wd, (maxY - ht) * -1];
          else
            target.position = [maxX - wd, maxY + ht];
          break;
        case 'verticalCenter':
          if (inverted)
            target.position = [bounds[0], (midY - ht / 2) * -1];
          else
            target.position = [bounds[0], midY + ht / 2];
          break;
        case 'verticalTop':
          if (inverted)
            target.position = [bounds[0], minY * -1];
          else
            target.position = [bounds[0], minY];
          break;
        case 'verticalBottom':
          if (inverted)
            target.position = [bounds[0], (maxY - ht) * -1];
          else
            target.position = [bounds[0], maxY + ht];
          break;
        case 'horizontalCenter':
          if (inverted)
            target.position = [midX - wd / 2, bounds[1]];
          else
            target.position = [midX - wd / 2, bounds[1]];
          break;
        case 'horizontalLeft':
          if (inverted)
            target.position = [minX, bounds[1]];
          else
            target.position = [minX, bounds[1]];
          break;
        case 'horizontalRight':
        if (inverted)
            target.position = [maxX - wd, bounds[1]];
          else
            target.position = [maxX - wd, bounds[1]];
          break;
        default:
          // alert(alignCompass);
          break;
      }
    } else if (alignType === 'distribute') {
      var offsetWNum = boxW / (app.selection.length - 1);
      var offsetHNum = boxH / (app.selection.length - 1);
      switch(alignCompass){
        case 'NW':
          if (inverted) {
            if (i == first) {
              target.position = [minX, minY];
            } else if (i == last) {
              target.position = [maxX - wd, (maxY * -1) + ht];
            } else {
              target.position = [minX + (offsetWNum * i) - (wd / 2), minY + ((offsetHNum * i) - (ht / 2)) * -1];
            }
          } else {
            if (i == first) {
              target.position = [minX, minY];
            } else if (i == last) {
              target.position = [maxX - wd, (maxY) + ht];
            } else {
              target.position = [minX + (offsetWNum * i) - (wd / 2), minY - ((offsetHNum * i) + (ht / 2))];
            }
          }
          break;
      }
    } else if (alignType === 'distributeEven') {
      // var offsetWNum = boxW / (app.selection.length - 1);
      // var offsetHNum = boxH / (app.selection.length - 1);
      switch(alignCompass){
        case 'verticalCenter':
          if (inverted) {
            if (i == first) {
              target.position = [minX, minY];
            } else if (i == last) {
              target.position = [maxX - wd, (maxY * -1) + ht];
            } else {
              var prevXPos = app.selection[i-1].geometricBounds[0];
              var prevWidth = app.selection[i-1].width;
              var prevYPos = app.selection[i-1].geometricBounds[1];
              var prevHeight = app.selection[i-1].height;
              prevYPos = (prevYPos < 0) ? prevYPos * -1 : prevYPos;
              target.position = [bounds[0], (prevYPos + prevHeight + evenY) * -1];
            }
          } else {
            if (i == first) {
              target.position = [minX, minY];
            } else if (i == last) {
              target.position = [maxX - wd, (maxY) + ht];
            } else {
              var prevXPos = app.selection[i-1].geometricBounds[0];
              var prevWidth = app.selection[i-1].width;
              var prevYPos = app.selection[i-1].geometricBounds[1];
              var prevHeight = app.selection[i-1].height;
              // alert(prevYPos + " " + prevHeight + " " + evenY)
              target.position = [bounds[0], prevYPos - prevHeight - evenY];
              // target.position = [startX + (offsetWNum * i) - ]
              // alt:
              // target.position = [startX + (offsetWNum * i) + (wd / 2), (startY + (offsetHNum * i) + (ht / 2)) * -1];
            }
          }
          break;
          case 'horizontalCenter':
              if (i == first) {
                target.position = [minX, minY];
              } else if (i == last) {
                target.position = [maxX - wd, (maxY * -1) + ht];
              } else {
                var prevXPos = app.selection[i-1].geometricBounds[0];
                var prevWidth = app.selection[i-1].width;
                var prevYPos = app.selection[i-1].geometricBounds[1];
                var prevHeight = app.selection[i-1].height;
                prevYPos = (prevYPos < 0) ? prevYPos * -1 : prevYPos;
                target.position = [prevXPos + prevWidth + evenX, bounds[1]];
              }
            break;
          default:
            break;
      }
    }
  }
}

// alert(app.selection[app.selection.length - 1].width - app.selection[0].width)
// alignSelection('distributeEven', 'selection', 'verticalCenter', 0, 0, 100, 100)


function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}
