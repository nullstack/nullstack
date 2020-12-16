import Nullstack from 'nullstack';
import RenderableComponent from './RenderableComponent.njs';
import StatefulComponent from './StatefulComponent.njs';
import FullStackLifecycle from './FullStackLifecycle';
import InstanceSelf from './InstanceSelf';

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
        <StatefulComponent route="/stateful-component" />
        <FullStackLifecycle route="/full-stack-lifecycle" />
        <InstanceSelf route="/instance-self" />
      </main>
    )
  }

}

export default Application;