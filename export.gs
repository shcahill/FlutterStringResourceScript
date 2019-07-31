// row
var ROW_LANG_INDEX = 2;  // language code
var ROW_START_INDEX = 3; // start index of Strings

// column
var COL_FLUTTER_KEY = 0;   // resource key for Flutter
var COL_ANDOID_KEY = 1;    // resource key for Android
var COL_IOS_KEY = 2;       // resource key for iOS
var COL_PRIMARY_LANG = 4;  // 

// メニュー
var ALL = "All";
var ANDROID = "Android";
var FLUTTER = "FLUTTER";
var IOS = "iOS";

function exportAllResources() {
  exportResources(FLUTTER); 
  exportResources(ANDROID);
  exportResources(IOS);  
}

function exportFlutterResources() {
  exportResources(FLUTTER);  
}

function exportAndroidResources() {
  exportResources(ANDROID);  
}

function exportIOSResources() {
  exportResources(IOS);  
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
    if(platform == ANDROID) {
      createAndroidResources(lang, data, folder, i);
    } else if(platform == IOS) {
      createIOSResources(lang, data, folder, i);
    } else {
      if (i == COL_PRIMARY_LANG) {
        // primary-language
        var primaryFiles = createFlutterPrimaryResources(data, folder, i);
        for (var f = 0; f < primaryFiles.length; f++) {
          files.push(primaryFiles[f]);
        }
      } else {
        // other language
        files.push(createFlutterResources(lang, data, folder, i));
      }
    }
  }

  var zip = createZip(files, folder);
  downloadWithHtml(zip.getId());  
}

function convertEscapeCharacter(string) {
  return string.replace(new RegExp("\'", 'g'), "\\'")
  .replace(new RegExp("\"", 'g'), "\\\"")
  .replace(new RegExp("&", 'g'), "&amp;")
  .replace(new RegExp("\\.\\.\\.", 'g'), "&#8230;")
  .replace(new RegExp(">", 'g'), "&gt;")
  .replace(new RegExp("<", 'g'), "&lt;");
}

