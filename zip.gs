// create zip from fileIdList
function createZip(fileIdList, folder) {
  var blobs = [];
  for (var i=0; i<fileIdList.length; i++) {
    var file = DriveApp.getFileById(fileIdList[i]);
    var blob = file.getBlob();
    blobs.push(blob);
  }

  var zip = Utilities.zip(blobs, "flutterResources.zip");
  var zipFile = folder.createFile(zip);
  return zipFile;
}

// create HTML
function downloadWithHtml(fileId) {
  var file = DriveApp.getFileById(fileId);
  var token = '&access_token=' + ScriptApp.getOAuthToken();
  var url = file.getDownloadUrl() + token;
  
  var html = HtmlService.createTemplateFromFile("dialog").evaluate();
  // replace {link} and {fileName} with Download URL and file name
  var content = html.getContent().replace(/{link}/, url).replace(/{fileName}/, file.getName());
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(content), "create Resources...");
}
