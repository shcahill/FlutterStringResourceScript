
// Create an XML file for Android
// language: Current language
// data:     Spreadsheet data array
// folder:   Folder where create the file
// column:   Index of the column
function createAndroidResources(language, data, folder, column) {

  var folderName = "values-" + language;
  var languageFolder = createOrGetFolder(folderName, folder);

  var region = "";

  // start-tag
  var content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
  content += "\n";
  content += "<resources>";

  for (var i = ROW_START_INDEX; i < data.length; i++) {
    var key = data[i][COL_FLUTTER_KEY];
    if (key.indexOf('<') == 0) {
      // 区切り位置埋め込むregionタグを一旦保持します
      region = key.slice(1, key.length - 1);
      continue;
    }

    // AndroidKeyが空欄の場合はスキップ
    if (data[i][COL_ANDOID_KEY].length == 0) {
      continue;
    }

    // stringsの先頭ブロックにregionタグをコメントとして埋め込みます
    if (region.length != 0) {
      content += "\n\n\t<!-- " + region + " -->";
      region = "";// regionタグのクリア
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
}

function showAndroidExportFinishedMessage() {
  var message = "Android用ファイルの出力が完了しました。\n";
  message += "各言語ごとのresourceディレクトリに配置してください。\n";
  Browser.msgBox(message);
}
