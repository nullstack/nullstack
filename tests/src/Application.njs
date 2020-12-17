import Nullstack from 'nullstack';
import RenderableComponent from './RenderableComponent';
import StatefulComponent from './StatefulComponent';
import FullStackLifecycle from './FullStackLifecycle';
import InstanceSelf from './InstanceSelf';
import ContextProject from './ContextProject';
import ServerFunctions from './ServerFunctions';
import Context from './Context';
import ContextSecrets from './ContextSecrets';
import ContextSettings from './ContextSettings';
import ContextEnvironment from './ContextEnvironment';
import ContextLoading from './ContextLoading';

class Application extends Nullstack {

  static async start(context) {
    ContextProject.start(context);
    ContextSecrets.start(context);
    ContextSettings.start(context);
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
        <ServerFunctions route="/server-functions" />
        <Context route="/context" />
        <ContextSecrets route="/context-secrets" />
        <ContextSettings route="/context-settings" />
        <ContextEnvironment route="/context-environment" />
        <ContextLoading route="/context-loading" />
      </main>
    )
  }

}

export default Application;