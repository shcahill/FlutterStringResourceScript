// row
var ROW_LANG_INDEX = 2;  // language code
var ROW_START_INDEX = 3; // start index of Strings

// column
var COL_FLUTTER_KEY = 0;   // resource key for Flutter
var COL_ANDOID_KEY = 1;    // resource key for Android
var COL_IOS_KEY = 2;       // resource key for iOS
var COL_PRIMARY_LANG = 4;  //

// menu
var ALL = "All";
var ANDROID = "Android";
var FLUTTER = "FLUTTER";
var IOS = "iOS";

function exportAllResources() {
  var flutterZip = exportResources(FLUTTER);
  var androidZip = exportResources(ANDROID);
  var iosZip = exportResources(IOS);
  downloadWithHtml(flutterZip, androidZip, iosZip);
}

function exportFlutterResources() {
  var flutterZip = exportResources(FLUTTER);
  downloadWithHtml(flutterZip, undefined, undefined);
}

function exportAndroidResources() {
  var androidZip = exportResources(ANDROID);
  downloadWithHtml(undefined, androidZip, undefined);
}

function exportIOSResources() {
  var iosZip = exportResources(IOS);
  downloadWithHtml(undefined, undefined, iosZip);
}

function exportResources(platform) {

  // Data
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();

  // Folders
  var appFolder = createOrGetFolder(sheet.getName()); // create root-Folder named by sheet's name
  var folderName = platform;
  var folder = createOrGetFolder(folderName, appFolder); // create sub-Folder inside appFolder

  var files = [];
  var langNum = data[ROW_LANG_INDEX].length;
  for (var i = 3; i < langNum; i++) {
    var lang = data[ROW_LANG_INDEX][i];
    var isPrimary = (i == COL_PRIMARY_LANG);
    if(platform == ANDROID) {
      files.push(createAndroidResources(lang, isPrimary, data, i, folder));
    } else if(platform == IOS) {
      files.push(createIOSResources(lang, data, i, folder));
    } else {
      if (isPrimary) {
        // primary-language
        var primaryFiles = createFlutterPrimaryResources(data, i, folder);
        for (var f = 0; f < primaryFiles.length; f++) {
          files.push(primaryFiles[f]);
        }
      } else {
        // other language
        files.push(createFlutterResources(lang, data, i, folder));
      }
    }
  }

  return createZip(files, folder, platform).getId();
}

function convertEscapeCharacter(string) {
  return string.replace(new RegExp("\'", 'g'), "\\'")
  .replace(new RegExp("\"", 'g'), "\\\"")
  .replace(new RegExp("&", 'g'), "&amp;")
  .replace(new RegExp("\\.\\.\\.", 'g'), "&#8230;")
  .replace(new RegExp(">", 'g'), "&gt;")
  .replace(new RegExp("<", 'g'), "&lt;");
}
