import Nullstack from 'nullstack';

class FalsyNodes extends Nullstack {

  nullNode = null;
  zeroNode = 0;
  falseNode = false;

  renderNoReturn() {
    
  }

  render() {
    return (
      <>
        <div data-null>{this.nullNode}</div>
        <div data-false>{this.falseNode}</div>
        <div data-no-return><NoReturn /></div>
        <div data-undefined><Undefined /></div>
        <div data-zero>{this.zeroNode}</div>
      </>
    )
  }

}

export default FalsyNodes;