import Nullstack from 'nullstack';

class JavaScriptExtension extends Nullstack {

  render({ environment }) {
    return (
      <div data-imported >
        {environment.key}
      </div>
    )
  }

}

export default JavaScriptExtension;