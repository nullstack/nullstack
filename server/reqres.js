class ReqRes {

  request = null
  response = null

  set(request, response) {
    this.request = request
    this.response = response
  }

  clear() {
    this.request = null
    this.response = null
  }

}

const reqres = new ReqRes()

export default reqres
