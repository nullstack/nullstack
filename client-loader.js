module.exports = function(source) {
  source = source.replace(/^.*database\.url.*$/mg, "");
  source = source.replace(/^.*database\.name.*$/mg, "");
  if(source.indexOf('@server') > 0) {
    blocks = source.split("\r\n\r\n");
    source = blocks.map((block) => {
      if(block.indexOf('@server') > 0) {
        let lines = block.split("\r\n");
        lines.splice(2, lines.length - 3);
        return lines.join("\r\n");
      } else {
        return block;
      }
    }).join("\r\n\r\n");
    return source;
  } else {
    return source;
  }
}
