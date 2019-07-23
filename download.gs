// ファイルのDLをhtml経由で実行します
// @param FileのIDリスト
function downloadList(fileIdList) {
  var html = HtmlService.createTemplateFromFile("dialog").evaluate();
  var listString = "";
  for (var i = 0; i<fileIdList.length; i++){
    if (i != 0) {
      listString += ', ';
    }
    listString += '"' + fileIdList[i] + '"';
  }
  // htmlの{fileIdList}を実際のFile IDのリストでreplaceします
  var content = html.getContent().replace(/{fileIdList}/, '[' + listString + ']');
  // 上記HTMLファイルをダイアログ出力 
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(content), "File Downloading...");
}

// htmlからDLする際に必要なファイル名とファイルの内容を二次元配列にして返却します
// @param FileのIDリスト
function getFileDownloadInfo(fileIdList) {
  var ret = [];
  for (var i=0; i<fileIdList.length; i++) {
    var file = DriveApp.getFileById(fileIdList[i]);
    var blob = file.getBlob()
    var data = blob.getDataAsString();
    var name = file.getName();
    var array = [data, name];
    ret.push(array);
  }
  return ret;
}

