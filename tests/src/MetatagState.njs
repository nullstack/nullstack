import Nullstack from 'nullstack';

class MetatagState extends Nullstack {

  html = '&quot;nullstack&quot;';

  render() {
    return (
      <div html={this.html}/>
    )
  }

}

export default MetatagState;