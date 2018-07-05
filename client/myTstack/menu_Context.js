var csInterface = new CSInterface();
var menu_ContextFlip = false;

var menu_ContextXML = '<Menu> \
   <MenuItem Id="refresh" Label="Refresh panel" Enabled="true" Checked="false"/> \
   <MenuItem Id="console" Label="To Console" > \
     <MenuItem Id="check" Label="Checkbox" Enabled="true" Checkable="true" Checked="false"/> \
     <MenuItem Id="msg" Label="Message" Enabled="true" Checkable="false" Checked="false"/> \
   </MenuItem> \
   <MenuItem Label="---" /> \
  </Menu>';

csInterface.setContextMenu(menu_ContextXML, setContextMenuCallback);

function setContextMenuCallback(event) {
  if (event == "refresh") {
    location.reload();
  } else if (event === 'check') {
    menu_ContextFlip = !menu_ContextFlip;
    console.log(`${event} is ${menu_ContextFlip}`);
  } else {
    console.log(event);
  }
}
