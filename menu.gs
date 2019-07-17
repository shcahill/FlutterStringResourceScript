function onOpen(){
  //メニュー配列
  var myMenu=[
    {name: "All", functionName: "exportAllResources"},
    {name: "Flutter", functionName: "exportFlutterResources"},
    {name: "Android", functionName: "exportAndroidResources"},
    {name: "iOS", functionName: "exportIOSResources"},
  ];

  // スプレッドシートにメニューを追加
  SpreadsheetApp.getActiveSpreadsheet().addMenu("エクスポート",myMenu);
}
