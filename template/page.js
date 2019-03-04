import {server, Page, React, ObjectID} from 'nullstack';

export default class {{PAGE_NAME}} extends Page {

  @server
  historyDidUpdate() {
    this.set({title: '{{PROJECT_NAME}}'});
  }

  render() {
    return (
      <>
        <h1> Welcome to Nullstack! </h1>
        <a href="https://github.com/Mortaro/nullstack" target="_blank"> Read the documentation </a>
      </>
    )
  }

}
