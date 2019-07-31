// Create a localizable file for iOS
// language: Current language
// data:     Spreadsheet data array
// column:   Index of the column
// folder:   Folder where create the file
function createIOSResources(language, data, column, folder) {
  var region = "";
  var content = "";
  
  for (var i = ROW_START_INDEX; i < data.length; i++) {
    var key = data[i][COL_FLUTTER_KEY];
    if (key.indexOf('<') == 0) {
      // save comment tag while prove this region contains contents.
      region = key.slice(1, key.length - 1);
      continue;
    }
    
    // skip if iOSKey is empty
    if (data[i][COL_IOS_KEY].length == 0) {
      continue;
    }
    
    // insert comment
    if (region.length != 0) {
      content += "\n\n// " + region + "";
      region = "";  // clear tag
    }
    
    // string value
    var value = (data[i][column].length > 0) ? data[i][column] : data[i][3]
    content += '\n' + data[i][COL_IOS_KEY] + ' = "' + value.replace("%s", "%@") + '";';
  }
  
  var fileName = "Localizable_" + language.toUpperCase() + ".strings";
  var file = createOrGetFile(fileName, folder);
  file.setContent(content);
  
  return file.getId();
}
