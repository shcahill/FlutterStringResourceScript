// Extract tags from string
// tag: String enclosed in '{}' parentheses
function getTags(str) {
  var tags = str.match( /\{.*?(?=\})/g );
  if (tags == null) {
    return null;
  }
  for (var i = 0; i < tags.length; i++) {
    // FIXME: I cannot remove first `{`
    tags[i] = tags[i].replace('{', '');
  }
  return tags;
}

function createArgumentString(list) {
  return list.map(function( value ) {
    return "String " + value;
  }).join(", ");
}

function joinAsJsonChildren(items) {
  return items.map(function ( value ) {
    return "\"" + value + "\": {}";
  }).join(", ");
}