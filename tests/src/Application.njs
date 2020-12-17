import Nullstack from 'nullstack';
import RenderableComponent from './RenderableComponent.njs';
import StatefulComponent from './StatefulComponent.njs';
import FullStackLifecycle from './FullStackLifecycle';
import InstanceSelf from './InstanceSelf';
import ContextProject from './ContextProject';

class Application extends Nullstack {

  static async start(context) {
    ContextProject.start(context);
  }

  render() {
    return (
      <main>
        <h1> Nullstack Tests </h1>
        <RenderableComponent route="/renderable-component" />
        <StatefulComponent route="/stateful-component" />
        <FullStackLifecycle route="/full-stack-lifecycle" />
        <InstanceSelf route="/instance-self" />
        <ContextProject route="/context-project" />
      </main>
    )
  }

}

export default Application;