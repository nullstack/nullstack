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
import ContextWorker from './ContextWorker';
import InstanceKey from './InstanceKey';
import RoutesAndParams from './RoutesAndParams';
import ContextPage from './ContextPage';
import TwoWayBindings from './TwoWayBindings';
import ServerRequestAndResponse from './ServerRequestAndResponse';
import ErrorPage from './ErrorPage';
import ContextData from './ContextData';
import DateParser from './DateParser';
import RemoveStart from './RemoveStart';
import StaticRendering from './StaticRendering';
import StaticThis from './StaticThis';
import './Application.css';

class Application extends Nullstack {

  static async start(context) {
    ContextProject.start(context);
    ContextSecrets.start(context);
    ContextSettings.start(context);
    ContextWorker.start(context);
    ServerRequestAndResponse.start(context);
  }

  render({project, page, environment}) {
    return (
      <main>
        <h1> {project.name} </h1>
        {page.status !== 200 && <div route="*" data-page-status={page.status}></div>}
        <div route="/">
          <a href={`/offline-${environment.key}`}> offline </a>
          <a href="/static-this"> static this </a>
        </div>
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
        <ContextWorker route="/context-worker" />
        <InstanceKey route="/instance-key" />
        <RoutesAndParams route="/routes-and-params/*" />
        <ContextPage route="/context-page" />
        <TwoWayBindings route="/two-way-bindings" />
        <ServerRequestAndResponse route="/server-request-and-response" />
        <ContextData route="/context-data" />
        <DateParser route="/date-parser" />
        <RemoveStart route="/remove-start" />
        <StaticRendering route="/static-rendering" />
        <StaticThis route="/static-this" />
        <ErrorPage route="*" />
      </main>
    )
  }

}

export default Application;