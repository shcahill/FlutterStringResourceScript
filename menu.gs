function onOpen(){
  var myMenu=[
    {name: "All", functionName: "exportAllResources"},
    {name: "Flutter", functionName: "exportFlutterResources"},
    {name: "Android", functionName: "exportAndroidResources"},
    {name: "iOS", functionName: "exportIOSResources"},
  ];
 
  // add Menu on SpreadSheet
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Export", myMenu); 
}
