const concurrently = require('concurrently');
const fs = require('fs');

const AWS = require('aws-sdk');

function saveOnAmazon(configs, path, mimetype) {
  const s3 = new AWS.S3({
    accessKeyId: configs.key,
    secretAccessKey: configs.secret,
    region: configs.region
  });
  s3.putObject({
    Bucket: configs.bucket,
    Key: `assets/${path}`,
    Body: fs.readFileSync(`dist/${path}`),
    ACL: 'public-read',
    ContentType: mimetype,
  }).promise().then((data) => {
    console.log(data);
    console.log(`https://s3-${configs.region}.amazonaws.com/${configs.bucket}/assets/${path}`);
  }).catch((e) => {
    console.log(e);
  });
}

module.exports = function() {
  concurrently([{
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.client.prod.js',
    name: 'client'
  }, {
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.server.prod.js',
    name: 'server'
  }]).then(() => {
    const configs = {type: 'distk'};
    fs.readFileSync('src/index.js', 'utf-8').split("\n").filter((line) => {
      return line.indexOf('storage.') > -1;
    }).map((line) => {
      const fragments = line.split('storage.')[1].split("\'");
      configs[fragments[0]] = fragments[2];
    });
    if(configs.type == 's3') {
      saveOnAmazon(configs, 'client.js', 'application/javascript');
      saveOnAmazon(configs, 'client.css', 'text/css');
    }
  });
}
