import fs from 'fs';
import Jimp from 'jimp';

export default {

  collection(folder) {

    return {

      async insertOne(options) {
        const prefix = `NULLSTACK_ROOT`
        const path = `/uploads/${folder}-`;
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
        if(!options.extension && options.mimetype) {
          options.extension = options.mimetype.split('/')[1];
        }
        const name = `${options.name || new Date().getTime()}.${options.extension}`;
        const wstream = fs.createWriteStream(`${prefix}${path}${name}`);
        wstream.write(options.buffer);
        wstream.end();
        return `${path}${name}`;
      }

    }

  }

}
