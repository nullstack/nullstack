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
import StaticThis from './StaticThis';
import ChildComponent from './ChildComponent';
import ParentComponent from './ParentComponent';
import Element from './Element';
import Instanceable from './Instanceable';
import PluginAttributes from './PluginAttributes';
import PureComponents from './PureComponents';
import NestedProxy from './NestedProxy';
import FalsyNodes from './FalsyNodes';
import ErrorOnChildNode from './ErrorOnChildNode';
import Vunerability from './Vunerability';
import PersistentComponent from './PersistentComponent';
import UnderscoredAttributes from './UnderscoredAttributes';

import './Application.css';

class Application extends Nullstack {

  async changeInstanceable({ instances }) {
    await instances.instanceable.customMethod();
  }

  static async start(context) {
    ContextProject.start(context);
    ContextSecrets.start(context);
    ContextSettings.start(context);
    ContextWorker.start(context);
    ServerRequestAndResponse.start(context);
  }

  prepare(context) {
    context.string = 'nullstack';
  }

  render({ project, page, environment }) {
    return (
      <main>
        <h1> {project.name} </h1>
        {page.status !== 200 && <div route="*" data-page-status={page.status}></div>}
        <div route="/">
          <a href={`/nullstack/${environment.key}/offline`}> offline </a>
          <a href="/static-this"> static this </a>
          <a href="/routes-and-params/a"> router with params </a>
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
        <ContextWorker route="/context-worker" />
        <InstanceKey route="/instance-key" />
        <RoutesAndParams route="/routes-and-params/*" />
        <ContextPage route="/context-page" />
        <TwoWayBindings route="/two-way-bindings" />
        <ServerRequestAndResponse route="/server-request-and-response" />
        <ContextData route="/context-data" />
        <DateParser route="/date-parser" />
        <RemoveStart route="/remove-start" />
        <StaticThis route="/static-this" />
        <ChildComponent route="/child-component" />
        <ParentComponent route="/parent-component" />
        <Element route="/element" />
        <PluginAttributes route="/plugin-attributes" />
        <PureComponents route="/pure-components" />
        <Instanceable route="/instanceable" key="instanceable" />
        <NestedProxy route="/nested-proxy" />
        <FalsyNodes route="/falsy-nodes" />
        <ErrorOnChildNode route="/error-on-child-node" />
        <Vunerability route="/vunerability" />
        <PersistentComponent route="/persistent-component/:id" persistent />
        <UnderscoredAttributes route="/underscored-attributes" />
        <ErrorPage route="*" />
      </main>
    )
  }

}

export default Application;