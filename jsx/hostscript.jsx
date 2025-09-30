function saveExpressions(data) {
  var file = new File(Folder.userData.fullName + '/ExpressionManager.json');
  file.encoding = 'UTF-8';
  file.open('w');
  file.write(data);
  file.close();
}

function loadExpressions() {
  var file = new File(Folder.userData.fullName + '/ExpressionManager.json');
  if (file.exists) {
    file.encoding = 'UTF-8';
    file.open('r');
    var data = file.read();
    file.close();
    return data;
  }
  return '[]';
}

function copyToClipboard(text) {
  // Use After Effects' built-in clipboard
  try {
    // Create a temporary text layer to use system clipboard
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem) {
      app.project.activeItem.layers.addText(text);
      var tempLayer = app.project.activeItem.layer(1);
      tempLayer.property('Source Text').setValue(text);
      tempLayer.selected = true;
      app.executeCommand(2004); // Edit > Copy
      tempLayer.remove();
    } else {
      // Fallback: use system clipboard command
      if ($.os.indexOf('Windows') !== -1) {
        var cmd = 'cmd.exe /c "echo ' + text.replace(/"/g, '\\"') + ' | clip"';
        system.callSystem(cmd);
      } else {
        // Mac
        var cmd = 'echo "' + text.replace(/"/g, '\\"') + '" | pbcopy';
        system.callSystem(cmd);
      }
    }
    return true;
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}
