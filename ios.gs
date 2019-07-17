// Create a localizable file for iOS
// language: Current language
// data:     Spreadsheet data array
// folder:   Folder where create the file
// column:   Index of the column
function createIOSResources(language, data, folder, column) {
  var region = "";
  var content = "";

  for (var i = ROW_START_INDEX; i < data.length; i++) {
    var key = data[i][COL_FLUTTER_KEY];
    if (key.indexOf('<') == 0) {
      // 区切り位置埋め込むregionタグを一旦保持します
      region = key.slice(1, key.length - 1);
      continue;
    }

    // iOSKeyが空欄の場合はスキップ
    if (data[i][COL_IOS_KEY].length == 0) {
      continue;
    }

    // 文字列定義の先頭ブロックにregionタグをコメントとして埋め込みます
    if (region.length != 0) {
      content += "\n\n// " + region + "";
      region = "";// regionタグのクリア
    }

    // string value
    var value = (data[i][column].length > 0) ? data[i][column] : data[i][3]
    content += '\n' + data[i][COL_IOS_KEY] + ' = "' + value.replace("%s", "%@") + '";';
  }

  var fileName = "Localizable_" + language.toUpperCase() + ".strings";
  var file = createOrGetFile(fileName, folder);
  file.setContent(content);
}

function showIOSExportFinishedMessage() {
  var message = "iOS用ファイルの出力が完了しました。\n";
  message += "Localizable.string内に配置してください。\n";
  Browser.msgBox(message);
}
