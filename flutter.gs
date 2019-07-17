// primary言語のarbファイルと、大元のStrings.dartの定義部分を出力します
// data:     Spreadsheet data array
// folder:   Folder where create the file
// col:      翻訳のあるカラムindex
function createFlutterPrimaryResources(data, folder, col) {

  var region = "";
  var isRegionHasContents = false;// endregionを書き込むために使います

  var strings = "";  // Strings.txt内のコンテンツ
  var intlMessages = "{\n  \"@@locale\": \"messages\"";  // intl_messages.arb内のコンテンツ

  // 翻訳の数だけループ
  for(var i = ROW_START_INDEX; i < data.length; i++){
    var key = data[i][COL_FLUTTER_KEY];

    // FlutterKeyが空欄の場合はスキップ
    if (key.length == 0) {
      continue;
    }

    // 区切り位置にregionタグを埋め込みます
    if (key.indexOf('<') == 0) {
      region = key.slice(1, key.length - 1);
      continue;
    }

    // stringsの先頭ブロックにregionタグをコメントとして埋め込みます
    if (region.length > 0) {
      if (isRegionHasContents) {
        strings += "  /// endregion\n\n";
        isRegionHasContents = false;
      }
      strings += "  /// region " + region + "\n";
      region = "";// regionタグのクリア
    }

    var en = convertEscapeCharacter(data[i][col]);
    // for Strings.txt
    var tags = getTags(en);
    if (tags == null) {
      strings += "  String get " + key + " => Intl.message(\'" + en + "\', name: \"" + key +"\");\n";
    } else {
      // Stringを引数にとる文字列
      strings += "  String " + key + "(" + createArgumentString(tags) + ") => Intl.message(\'" + en + "\', name: \"" + key + "\", args: [" + tags.join(", ") + "]);\n";
    }
    isRegionHasContents = true;

    // for intl_messages.arb
    var isLast = (i == data.length - 1);
    intlMessages += createMessagesArbString(key, en, isLast, tags);
  }

  if (isRegionHasContents) {
    strings += "  /// endregion\n\n";
  }

  // Strings.dartの書き込み
  var header = "Strings.dartの文字列定義部分にコピーしてください\n";
  var file = createOrGetFile("Strings.txt", folder);
  file.setContent(header + strings);

  // intl_messages.arbの書き込み
  var fileIntlEn = createOrGetFile("intl_messages.arb", folder);
  fileIntlEn.setContent(intlMessages + "\n}");
}

// その他の言語のarbファイルを出力します
// language: 言語
// data:     Spreadsheet data array
// folder:   Folder where create the file
// col:      翻訳のあるカラムindex
function createFlutterResources(language, data, folder, col) {
  var intl = "{\n  \"@@locale\": \"" + language + "\"";

  for(var i = ROW_START_INDEX; i < data.length; i++){
    var key = data[i][COL_FLUTTER_KEY];
    // FlutterKeyが空欄の場合はスキップ
    if (key.length == 0) {
      continue;
    }

    // 区切り位置も使用しないためスキップ
    if (key.indexOf('<') == 0) {
      continue;
    }

    // 定義なしの場合はPrimary言語を入れる
    var str = (data[i][col].length > 0) ? convertEscapeCharacter(data[i][col]) : convertEscapeCharacter(data[i][COL_PRIMARY_LANG]);

    // for .arb
    var isLast = i == data.length - 1;
    intl += createArbString(key, str, isLast);
  }

  // intl
  var fileIntl = createOrGetFile("intl_" + language.toLowerCase() + ".arb", folder);
  fileIntl.setContent(intl + "\n}");
}

// arbファイル用に以下の文字列を生成します
// "key": "string",
function createArbString(key, string, isLast) {
  return ",\n  \"" + key + "\": \"" + string + "\"";
}

// intl_messages.arb用の文字列を生成します
function createMessagesArbString(key, string, isLast, tags) {
  var ret = ",\n  \"" + key + "\": \"" + string + "\",\n";
  ret += "  \"@" + key + "\": {\n";
  ret += "    \"type\": \"text\",\n";
  ret += "    \"placeholders\": {\n";
  if (tags != null) {
    ret += "      " + joinAsJsonChildren(tags) + "\n";
  }
  ret += "    }\n";
  ret += "  }";

  return ret;
}

function showFlutterExportFinishedMessage() {
  var message = "Flutter用ファイルの出力が完了しました。\n";
  message += "Strings.txtはStrings.dartの文字列定義部分に貼り付けてformatterをかけてください。\n";
  message += "各言語のarbファイルは、そのまま差し替えてください。";
  Browser.msgBox(message);
}
