var csInterface = new CSInterface();
var isFlipped = false;

var menu_FlyoutXML = '<Menu> \
  <MenuItem Id="refresh" Label="Refresh panel" Enabled="true" Checked="false"/> \
</Menu>';
// \
// <MenuItem Label="---" /> \
// \

csInterface.setPanelFlyoutMenu(menu_FlyoutXML);
csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", setPanelCallback);


function setPanelCallback(event) {
  if (event.data.menuId == "refresh") {
    location.reload();
  }
}
