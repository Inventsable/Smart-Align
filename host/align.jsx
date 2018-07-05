// ArtboardCenterAroundSelectedPaths.jsx
// works with CS5
// http://forums.adobe.com/thread/1336506?tstart=0
// (title: script to align selected objects to artboard)
// quick & dirty, all selected items will be centered at the active artboard
// (include clipping paths  !visible result can be different)

// regards pixxxelschubser  19.Nov. 2013


/** @pixxxelschubser **/
function alignArtboardToSelection(){
  var aDoc = app.activeDocument;
  var Sel = aDoc.selection;

  if (Sel.length >0 ) {
    var abIdx = aDoc.artboards.getActiveArtboardIndex();
    var actAbBds = aDoc.artboards[abIdx].artboardRect;

    var vBounds = Sel[0].visibleBounds;
    vBounds_Li = vBounds[0];
    vBounds_Ob = vBounds[1];
    vBounds_Re = vBounds[2];
    vBounds_Un = vBounds[3];

    if (Sel.length > 1) {
      for (var i = 1; i < Sel.length; i++) {
        vBdsI = Sel[i].visibleBounds;
        if( vBounds_Li > vBdsI[0] ) {vBounds_Li = vBdsI[0]};
        if( vBounds_Ob < vBdsI[1] ) {vBounds_Ob = vBdsI[1]};
        if( vBounds_Re < vBdsI[2] ) {vBounds_Re = vBdsI[2]};
        if( vBounds_Un > vBdsI[3] ) {vBounds_Un = vBdsI[3]};
      }

      aDoc.artboards[abIdx].artboardRect = [vBounds_Li +((vBounds_Re - vBounds_Li)/2-(actAbBds[2]-actAbBds[0])/2), vBounds_Ob -((vBounds_Ob - vBounds_Un)/2+(actAbBds[3]-actAbBds[1])/2), vBounds_Li +((vBounds_Re - vBounds_Li)/2-(actAbBds[2]-actAbBds[0])/2)+(actAbBds[2]-actAbBds[0]), vBounds_Ob -((vBounds_Ob - vBounds_Un)/2+(actAbBds[3]-actAbBds[1])/2)+(actAbBds[3]-actAbBds[1])];
    }
  } else {
    alert ("No selection");
  }
}

alignSelection();

/** @TenA
https://forums.adobe.com/thread/2111711  **/
function alignSelection(){
  var refBnds = app.activeDocument.selection[0].geometricBounds;
  for (var i = 0; i < app.selection.length; i++) {
    var target = app.selection[i];
    var ct = refBnds[0] + (refBnds[2] - refBnds[0]) / 2;
    var md = refBnds[1] + (refBnds[3] - refBnds[1]) / 2;
    var wd = target.width;
    var ht = target.height;
    target.position = [ct - wd / 2, md + ht / 2];
  }
}
