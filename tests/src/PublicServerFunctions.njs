import Nullstack from 'nullstack';

class PublicServerFunctions extends Nullstack {

  static async serverFunction({ number }) {
    return number * 2 + 1
  }

}

export default PublicServerFunctions;