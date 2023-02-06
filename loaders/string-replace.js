/*
Copyright (c) 2015 Valentyn Barmashyn
MIT Licensed
Original: https://npmjs.com/package/string-replace-loader
*/
module.exports = function (source, map) {
  const optionsArray = this.getOptions().multiple
  let newSource = source

  for (const options of optionsArray) {
    newSource = newSource.replace(
      new RegExp(options.search, options.search.flags || options.flags || ''),
      options.replace,
    )
  }

  this.callback(null, newSource, map)
}
