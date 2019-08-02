// create zip from fileIdList
function createZip(fileIdList, folder, platform) {
  var blobs = [];
  for (var i=0; i<fileIdList.length; i++) {
    var file = DriveApp.getFileById(fileIdList[i]);
    var blob = file.getBlob();
    var parentName = file.getParents().next().getName();
    if (platform == ANDROID) {
      blob.setName(parentName + "/" + blob.getName());
    }
    blobs.push(blob);
  }

  var zip = Utilities.zip(blobs, platform + ".zip");
  var zipFile = folder.createFile(zip);
  return zipFile;
}

// create HTML
function downloadWithHtml(flutterZip, androidZip, iosZip) {
  var token = '&access_token=' + ScriptApp.getOAuthToken();

  var html = HtmlService.createTemplateFromFile("dialog").evaluate();
  // replace {link} and {fileName} with Download URL and file name
  var content = html.getContent();
  if (flutterZip != undefined) {
    var file = DriveApp.getFileById(flutterZip);
    content = content.replace(/{flutterLink}/, file.getDownloadUrl() + token).replace(/{flutterFileName}/, file.getName());
  } else {
    content = content.replace(/{flutterDisplay}/, "none");
  }

  if (androidZip != undefined) {
    var file = DriveApp.getFileById(androidZip);
    content = content.replace(/{androidLink}/, file.getDownloadUrl() + token).replace(/{androidFileName}/, file.getName());
  } else {
    content = content.replace(/{androidDisplay}/, "none");
  }

  if (iosZip != undefined) {
    var file = DriveApp.getFileById(iosZip);
    content = content.replace(/{iosLink}/, file.getDownloadUrl() + token).replace(/{iosFileName}/, file.getName());
  } else {
    content = content.replace(/{iosDisplay}/, "none");
  }

  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(content), "create Resources...");
}
