import Nullstack from 'nullstack';
import RenderableComponent from './RenderableComponent.njs';

class Application extends Nullstack {

  static async start({project}) {
    project.name = 'Test';
    project.domain = 'nullstack.app';
    project.color = '#D22365';
  }

  render() {
    return (
      <main>
        <h1> Nullstack Tests </h1>
        <RenderableComponent route="/renderable-component" />
      </main>
    )
  }

}

export default Application;