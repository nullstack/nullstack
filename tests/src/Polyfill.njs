import assert from 'assert';
import buffer from 'buffer';
import constants from 'constants';
import crypto from 'crypto';
import domain from 'domain';
import events from 'events';
import http from 'http';
import https from 'https';
import Nullstack from 'nullstack';
import os from 'os';
import path from 'path';
import process from 'process';
import punycode from 'punycode';
import querystring from 'querystring';
import stream from 'stream';
import stringDecoder from 'string_decoder';
import sys from 'sys';
import timers from 'timers';
import tty from 'tty';
import url from 'url';
import util from 'util';
import vm from 'vm';
import zlib from 'zlib';

class Polyfill extends Nullstack {

  async hydrate() {
    this.buffer = Buffer.from("nullstack").toString()
  }

  render() {
    return (
      <div
        data-buffer-global={this.buffer}
        data-assert={typeof assert}
        data-buffer={typeof buffer}
        data-constants={typeof constants}
        data-crypto={typeof crypto}
        data-domain={typeof domain}
        data-events={typeof events}
        data-http={typeof http}
        data-https={typeof https}
        data-os={typeof os}
        data-path={typeof path}
        data-punycode={typeof punycode}
        data-process={typeof process}
        data-querystring={typeof querystring}
        data-stream={typeof stream}
        data-string-decoder={typeof stringDecoder}
        data-sys={typeof sys}
        data-timers={typeof timers}
        data-tty={typeof tty}
        data-url={typeof url}
        data-util={typeof util}
        data-vm={typeof vm}
        data-zlib={typeof zlib}
      > Polyfill </div>
    )
  }

}

export default Polyfill;