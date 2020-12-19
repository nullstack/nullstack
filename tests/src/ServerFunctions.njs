import Nullstack from 'nullstack';

class ServerFunctions extends Nullstack {

  count = 0;
  year = null;
  statement = '';
  response = '';

  static async getCountAsOne() {
    return 1;
  }

  async setCountToOne() {
    this.count = await this.getCountAsOne();
  }

  static async getCount({to}) {
    return to;
  }

  async setCountToTwo() {
    this.count = await this.getCount({to: 2});
  }

  
  static async getDate({input}) {
    return input;
  }

  async setDate() {
    const input = new Date('1992-10-16');
    const output = await this.getDate({input});
    this.year = output.getFullYear();
  }

  static async useNodeFileSystem() {
    const {readFileSync} = await import('fs');
    const text = readFileSync('src/ServerFunctions.njs', 'utf-8');
    return text.split(`\n`)[0].trim();
  }

  static async useFetchInNode() {
    const response = await fetch('http://localhost:6969/robots.txt');
    const text = await response.text();
    return text.split(`\n`)[0].trim();
  }

  async initiate() {
    this.statement = await this.useNodeFileSystem();
    this.response = await this.useFetchInNode();
  }
  
  render() {
    return (
      <div> 
        <button class="set-count-to-one" onclick={this.setCountToOne}>1</button>
        <button class="set-count-to-two" onclick={this.setCountToTwo}>2</button>
        <button class="set-date" onclick={this.setDate}>1992</button>
        <div data-count={this.count} />
        <div data-year={this.year} />
        <div data-statement={this.statement} />
        <div data-response={this.response} />
      </div>
    )
  }

}

export default ServerFunctions;