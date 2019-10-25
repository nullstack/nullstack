import fs from 'fs';
import Jimp from 'jimp';
import AWS from 'aws-sdk';
import {config} from './server-entry';

async function saveOnAmazon(options) {
  const s3 = new AWS.S3({
    accessKeyId: config('storage.key'),
    secretAccessKey: config('storage.secret'),
    region: config('storage.region')
  });
  const response = await s3.putObject({
    Bucket: config('storage.bucket'),
    Key: options.key,
    Body: options.buffer,
    ACL: 'public-read',
    ContentType: options.mimetype,
  }).promise();
  console.log('resp', response);
  return `https://s3-${config('storage.region')}.amazonaws.com/${config('storage.bucket')}/${options.key}`;
}

async function saveOnDisk(options) {
  const wstream = fs.createWriteStream(`NULLSTACK_ROOT` + '/' + options.key);
  wstream.write(options.buffer);
  wstream.end();
  return `${config('default.protocol')}://${config('default.domain')}/` + options.key;
}

export default {

  collection(folder) {

    return {

      async insertOne(options) {
        const path = `uploads/${folder}-`;
        if(options.width || options.height) {
          let buffer = await Jimp.read(options.buffer);
          const width = options.width || Jimp.AUTO;
          const height = options.height || Jimp.AUTO;
          options.buffer = await buffer.resize(width, height).getBufferAsync(options.mimetype);
        }
        if(options.quality) {
          let buffer = await Jimp.read(options.buffer);
          options.buffer = await buffer.quality(options.quality).getBufferAsync('image/jpeg');
          options.mimetype = 'image/jpeg';
        }
        if(!options.extension) {
          const extensions = options.originalname.split('.');
          options.extension = extensions[extensions.length - 1];
        }
        const name = `${options.name || new Date().getTime()}.${options.extension}`;
        options.key = `${path}${name}`;
        if(config('storage.type') == 's3') {
          return await saveOnAmazon(options);
        } else {
          return await saveOnDisk(options);
        }
      }

    }

  }

}
