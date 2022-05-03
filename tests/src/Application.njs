import Nullstack from 'nullstack';
import AnchorModifiers from './AnchorModifiers';
import './Application.css';
import ChildComponent from './ChildComponent';
import ComponentTernary from './ComponentTernary';
import Context from './Context';
import ContextData from './ContextData';
import ContextEnvironment from './ContextEnvironment';
import ContextPage from './ContextPage';
import ContextProject from './ContextProject';
import ContextSecrets from './ContextSecrets';
import ContextSettings from './ContextSettings';
import ContextWorker from './ContextWorker';
import DateParser from './DateParser';
import Element from './Element';
import ErrorOnChildNode from './ErrorOnChildNode';
import ErrorPage from './ErrorPage';
import ExternalServerFunctions from './ExternalServerFunctions';
import FalsyNodes from './FalsyNodes';
import FullStackLifecycle from './FullStackLifecycle';
import Instanceable from './Instanceable';
import InstanceKey from './InstanceKey';
import InstanceSelf from './InstanceSelf';
import IsomorphicStartup from './IsomorphicStartup';
import LazyComponentLoader from './LazyComponentLoader';
import NestedProxy from './NestedProxy';
import ParentComponent from './ParentComponent';
import PersistentComponent from './PersistentComponent';
import PluginAttributes from './PluginAttributes';
import PublicServerFunctions from './PublicServerFunctions.njs';
import PureComponents from './PureComponents';
import WebpackCustomPlugin from './WebpackCustomPlugin';
import RenderableComponent from './RenderableComponent';
import RoutesAndParams from './RoutesAndParams';
import ServerFunctions from './ServerFunctions';
import ServerRequestAndResponse from './ServerRequestAndResponse';
import StatefulComponent from './StatefulComponent';
import StaticThis from './StaticThis';
import TwoWayBindings from './TwoWayBindings';
import TypeScript from './TypeScript';
import UndefinedNodes from './UndefinedNodes';
import UnderscoredAttributes from './UnderscoredAttributes';
import Vunerability from './Vunerability';
import WindowDependency from './WindowDependency';
import WorkerVerbs from './WorkerVerbs';
import MetatagState from './MetatagState';
import TypeScriptExtension from './TypeScriptExtension';
import JavaScriptExtension from './JavaScriptExtension';

class Application extends Nullstack {

  async changeInstanceable({ instances }) {
    await instances.instanceable.customMethod();
  }

  prepare(context) {
    context.string = 'nullstack';
  }

  render({ project, page, environment }) {
    return (
      <main data-window={WindowDependency.key}>
        <h1> {project.name} </h1>
        {page.status !== 200 && <div route="*" data-page-status={page.status}></div>}
        <div route="/">
          <a href={`/nullstack/${environment.key}/offline`}> offline </a>
          <a href="/static-this"> static this </a>
          <a href="/routes-and-params/a"> router with params </a>
          <a href="/undefined-nodes"> undefined nodes </a>
          <a href="/full-stack-lifecycle"> lifecycle </a>
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
        <IsomorphicStartup route="/isomorphic-startup" />
        <WorkerVerbs route="/worker-verbs" />
        <TypeScript route="/typescript" />
        <LazyComponentLoader route="/lazy-component" />
        <PublicServerFunctions key="publicServerFunctions" />
        <ExternalServerFunctions route="/external-server-functions" />
        <UndefinedNodes route="/undefined-nodes" />
        <WebpackCustomPlugin route="/webpack-custom-plugin" />
        <ComponentTernary route="/component-ternary" />
        <AnchorModifiers route="/anchor-modifiers" />
        <MetatagState route="/metatag-state" />
        <JavaScriptExtension route="/javascript-extension" />
        <TypeScriptExtension route="/typescript-extension" generic />
        <ErrorPage route="*" />
      </main>
    )
  }

}

export default Application;