function getTags(str) {
  // FIXME: 先頭の{を削れない…
  var tags = str.match( /\{.*?(?=\})/g );
  if (tags == null) {
    return null;
  }
  for (var i = 0; i < tags.length; i++) {
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
