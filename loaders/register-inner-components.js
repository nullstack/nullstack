const crypto = require('crypto');

module.exports = function(source) {
  if(source.indexOf('extends Nullstack') == -1) {
    return source;
  }
  const hash = crypto.createHash('md5').update(source).digest("hex");
  const LOOKUP = 'static async ';
  let first = source.search(LOOKUP);
  while(first > -1) {
    let characters = source.split('');
    let last = first + LOOKUP.length;
    let completed = false;
    let name = '';
    let foundParametersEnd = false;
    let foundFirstBracket = false;
    let bracketsMissingClosure = 0;
    while(!completed) {
      if(!name) {
        if(characters[last] === '(') {
          name = characters.slice(first + LOOKUP.length, last).join('').trim();
        }
      } else if(!foundParametersEnd) {
        if(characters[last] === ')') {
          foundParametersEnd = true;
        }
      } else if (!foundFirstBracket) {
        if(characters[last] === '{') {
          foundFirstBracket = true;
          bracketsMissingClosure = 1;
        }
      } else {
        if(bracketsMissingClosure == 0) {
          completed = true;
        } else if(characters[last] === '{') {
          bracketsMissingClosure++;
        } else if(characters[last] === '}') {
          bracketsMissingClosure--;
        }
      }
      if(completed) {
        const signature = characters.slice(first, last).join("");
        const replacement = `static ${name} = true;`;
        source = source.replace(signature, replacement);
        first = source.search(LOOKUP);
      } else {
        last++;
      }
    }
  }
  const fragments = source.split(' extends Nullstack')[0].split(' ');
  const klassName = fragments[fragments.length - 1];
  source += `\n${klassName}.hash = '${hash}';`;
  return source;
}