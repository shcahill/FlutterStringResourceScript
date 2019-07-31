
// Create an XML file for Android
// language: Current language
// data:     Spreadsheet data array
// column:   Index of the column
// folder:   Folder where create the file
function createAndroidResources(language, isPrimary, data, column, folder) {

  var folderName = "values";
  if (!isPrimary) {
    folderName +=  "-" + language;
  }
  var languageFolder = createOrGetFolder(folderName, folder);
  
  var region = "";
  
  // start-tag
  var content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
  content += "\n";
  content += "<resources>";
  
  for (var i = ROW_START_INDEX; i < data.length; i++) {
    var key = data[i][COL_FLUTTER_KEY];
    
    // detect comment tag
    if (key.indexOf('<') == 0) {
      // save comment tag while prove this region contains contents.
      region = key.slice(1, key.length - 1);
      continue;
    }

    // skip if AndroidKey is empty
    if (data[i][COL_ANDOID_KEY].length == 0) {
      continue;
    }
    
    // insert comment
    if (region.length != 0) {
      content += "\n\n\t<!-- " + region + " -->";
      region = "";  // clear
    }
    
    // string value
    var formatted = "";
    if (data[i][column].match(/%\d*s/) != null || data[i][column].match(/%\d*d/) != null) {
        formatted = ' formatted="false"';
    }
    
    var escapedContent = convertEscapeCharacter(data[i][column]);
    
    if(escapedContent.length > 0) {
      content += '\n\t<string name="' + data[i][COL_ANDOID_KEY] + '"' + formatted + '>' + escapedContent + '</string>';
    }
  }
  
  // end-tag
  content += "\n\n</resources>";
  
  var file = createOrGetFile("strings.xml", languageFolder);
  file.setContent(content);
  
  return file.getId();
}
