// row番号定義
var ROW_LANG_INDEX = 2;// 文字列定義行
var ROW_START_INDEX = 3; // 文字列定義の開始行

// column番号定義
var COL_FLUTTER_KEY = 0;     // Flutterのkey列
var COL_ANDOID_KEY = 1;    // Androidのkey列
var COL_IOS_KEY = 2;       // iOSのkey列
var COL_PRIMARY_LANG = 4;

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
  var appFolder = createOrGetFolder(sheet.getName()); // シート名のフォルダ
  var folderName = platform;
  var folder = createOrGetFolder(folderName, appFolder);

  var files = [];
  var length = data[ROW_LANG_INDEX].length;
  for (var i = 3; i < length; i++) {
    var lang = data[ROW_LANG_INDEX][i];
    if(platform == ANDROID) {
      createAndroidResources(lang, data, folder, i);
    } else if(platform == IOS) {
      createIOSResources(lang, data, folder, i);
    } else {
      if (i == COL_PRIMARY_LANG) {
        // primary言語の出力
        var primaryFiles = createFlutterPrimaryResources(data, folder, i);
        for (var f=0; f<primaryFiles.length; f++) {
          files.push(primaryFiles[f]);
        }
      } else {
        // その他の言語の出力
        files.push(createFlutterResources(lang, data, folder, i));
      }
    }
  }
  
  if (platform == ANDROID) {
    showAndroidExportFinishedMessage();
  } else if(platform == IOS) {
    showIOSExportFinishedMessage();
  } else {
    var zip = createZip(files, folder);
    downloadWithHtml(zip.getId());
  }
}

function convertEscapeCharacter(string) {
  return string.replace(new RegExp("\'", 'g'), "\\'")
  .replace(new RegExp("\"", 'g'), "\\\"")
  .replace(new RegExp("&", 'g'), "&amp;")
  .replace(new RegExp("\\.\\.\\.", 'g'), "&#8230;")
  .replace(new RegExp(">", 'g'), "&gt;")
  .replace(new RegExp("<", 'g'), "&lt;");
}
