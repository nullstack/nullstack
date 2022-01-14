import Nullstack from 'nullstack';

class FalsyNodes extends Nullstack {

  nullNode = null;
  zeroNode = 0;
  falseNode = false;

  render() {
    return (
      <>
        <div data-null>{this.nullNode}</div>
        <div data-false>{this.falseNode}</div>
        <div data-zero>{this.zeroNode}</div>
      </>
    )
  }

}

export default FalsyNodes;