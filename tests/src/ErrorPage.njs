import Nullstack from 'nullstack';

class ErrorPage extends Nullstack {

  async initiate({page, params}) {
    if(params.status == 500) {
      this.error.simulate;
    } else {
      page.status = 404;
    }
  }

}

export default ErrorPage;