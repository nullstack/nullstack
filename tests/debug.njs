import $runtime from "nullstack/runtime";
import Nullstack from "nullstack";
import AnchorModifiers from "./AnchorModifiers";
import ArrayAttributes from "./ArrayAttributes";
import BodyFragment from "./BodyFragment";
import CatchError from "./CatchError";
import ChildComponent from "./ChildComponent";
import ComponentTernary from "./ComponentTernary";
import Context from "./Context";
import ContextData from "./ContextData";
import ContextEnvironment from "./ContextEnvironment";
import ContextPage from "./ContextPage";
import ContextProject from "./ContextProject";
import ContextSecrets from "./ContextSecrets";
import ContextSettings from "./ContextSettings";
import ContextWorker from "./ContextWorker";
import DateParser from "./DateParser";
import DynamicHead from "./DynamicHead";
import Element from "./Element";
import ErrorOnChildNode from "./ErrorOnChildNode";
import ErrorPage from "./ErrorPage";
import ExposedServerFunctions from "./ExposedServerFunctions";
import ExternalServerFunctions from "./ExternalServerFunctions";
import FalsyNodes from "./FalsyNodes";
import FullStackLifecycle from "./FullStackLifecycle";
import Instanceable from "./Instanceable";
import InstanceKey from "./InstanceKey";
import InstanceSelf from "./InstanceSelf";
import IsomorphicImport from "./IsomorphicImport";
import IsomorphicStartup from "./IsomorphicStartup";
import JavaScriptExtension from "./JavaScriptExtension";
import Logo from "./Logo";
import MetatagState from "./MetatagState";
import NestedProxy from "./NestedProxy";
import OptimizedEvents from "./OptimizedEvents";
import ParentComponent from "./ParentComponent";
import PersistentComponent from "./PersistentComponent";
import PluginAttributes from "./PluginAttributes";
import PublicServerFunctions from "./PublicServerFunctions";
import PureComponents from "./PureComponents";
import Refs from "./Refs";
import RenderableComponent from "./RenderableComponent";
import ReqRes from "./ReqRes";
import RoutesAndParams from "./RoutesAndParams";
import RouteScroll from "./RouteScroll";
import ServerFunctions from "./ServerFunctions";
import ServerRequestAndResponse from "./ServerRequestAndResponse";
import StatefulComponent from "./StatefulComponent";
import StaticThis from "./StaticThis";
import TextObserver from "./TextObserver";
import TwoWayBindings from "./TwoWayBindings";
import TypeScript from "./TypeScript";
import TypeScriptExtension from "./TypeScriptExtension";
import UndefinedNodes from "./UndefinedNodes";
import UnderscoredAttributes from "./UnderscoredAttributes";
import Vunerability from "./Vunerability";
import WebpackCustomPlugin from "./WebpackCustomPlugin";
import WorkerVerbs from "./WorkerVerbs";
import LazyComponent from "./LazyComponent";
import LazyComponentLoader from "./LazyComponentLoader";
import NestedFolder from "./nested/NestedFolder.njs";
class Application extends Nullstack {
    static hash = "6b94b59a22c75216";
    async changeInstanceable({ instances  }) {
        await instances.instanceable.customMethod();
    }
    prepare(context) {
        context.string = "nullstack";
        context.refInstanceCount = 0;
    }
    render({ project , page , environment , refInstanceCount  }) {
        return /*#__PURE__*/ $runtime.element("body", {
            "data-application-hydrated": this.hydrated
        }, /*#__PURE__*/ $runtime.element("h1", null, " ", project.name, " "), page.status !== 200 && /*#__PURE__*/ $runtime.element("div", {
            route: "*",
            "data-page-status": page.status
        }), /*#__PURE__*/ $runtime.element("div", {
            route: "/"
        }, /*#__PURE__*/ $runtime.element("a", {
            href: "/lazy-component"
        }, " go lazy go home "), /*#__PURE__*/ $runtime.element("a", {
            href: "/lazy-importer"
        }, " import "), /*#__PURE__*/ $runtime.element("a", {
            href: `/nullstack/${environment.key}/offline`
        }, " offline "), /*#__PURE__*/ $runtime.element("a", {
            href: "/static-this"
        }, " static this "), /*#__PURE__*/ $runtime.element("a", {
            href: "/routes-and-params/a"
        }, " router with params "), /*#__PURE__*/ $runtime.element("a", {
            href: "/undefined-nodes"
        }, " undefined nodes "), /*#__PURE__*/ $runtime.element("a", {
            href: "/full-stack-lifecycle"
        }, " lifecycle "), /*#__PURE__*/ $runtime.element("a", {
            href: "/refs"
        }, " refs "), /*#__PURE__*/ $runtime.element("a", {
            href: "/error-on-child-node?dom=true"
        }, " error-on-child-node?dom=true "), /*#__PURE__*/ $runtime.element("a", {
            href: "/error-on-child-node?serialization=true"
        }, " error-on-child-node?serialization=true "), /*#__PURE__*/ $runtime.element("a", {
            href: "/route-scroll/class?changed=1#bottom"
        }, "#bottom")), /*#__PURE__*/ $runtime.element(RenderableComponent, {
            route: "/renderable-component"
        }), /*#__PURE__*/ $runtime.element(StatefulComponent, {
            route: "/stateful-component"
        }), /*#__PURE__*/ $runtime.element(FullStackLifecycle, {
            route: "/full-stack-lifecycle"
        }), /*#__PURE__*/ $runtime.element(InstanceSelf, {
            route: "/instance-self"
        }), /*#__PURE__*/ $runtime.element(ContextProject, {
            route: "/context-project"
        }), /*#__PURE__*/ $runtime.element(ServerFunctions, {
            route: "/server-functions"
        }), /*#__PURE__*/ $runtime.element(Context, {
            route: "/context"
        }), /*#__PURE__*/ $runtime.element(ContextSecrets, {
            route: "/context-secrets"
        }), /*#__PURE__*/ $runtime.element(ContextSettings, {
            route: "/context-settings"
        }), /*#__PURE__*/ $runtime.element(ContextEnvironment, {
            route: "/context-environment"
        }), /*#__PURE__*/ $runtime.element(ContextWorker, {
            route: "/context-worker"
        }), /*#__PURE__*/ $runtime.element(InstanceKey, {
            route: "/instance-key"
        }), /*#__PURE__*/ $runtime.element(RoutesAndParams, {
            route: "/routes-and-params/*"
        }), /*#__PURE__*/ $runtime.element(ContextPage, {
            route: "/context-page"
        }), /*#__PURE__*/ $runtime.element(TwoWayBindings, {
            route: "/two-way-bindings"
        }), /*#__PURE__*/ $runtime.element(ServerRequestAndResponse, {
            route: "/server-request-and-response"
        }), /*#__PURE__*/ $runtime.element(ContextData, {
            route: "/context-data"
        }), /*#__PURE__*/ $runtime.element(DateParser, {
            route: "/date-parser"
        }), /*#__PURE__*/ $runtime.element(StaticThis, {
            route: "/static-this"
        }), /*#__PURE__*/ $runtime.element(ChildComponent, {
            route: "/child-component"
        }), /*#__PURE__*/ $runtime.element(ParentComponent, {
            route: "/parent-component"
        }), /*#__PURE__*/ $runtime.element(Element, {
            route: "/element"
        }), /*#__PURE__*/ $runtime.element(PluginAttributes, {
            route: "/plugin-attributes"
        }), /*#__PURE__*/ $runtime.element(PureComponents, {
            route: "/pure-components"
        }), /*#__PURE__*/ $runtime.element(Instanceable, {
            route: "/instanceable",
            key: "instanceable"
        }), /*#__PURE__*/ $runtime.element(NestedProxy, {
            route: "/nested-proxy"
        }), /*#__PURE__*/ $runtime.element(FalsyNodes, {
            route: "/falsy-nodes"
        }), /*#__PURE__*/ $runtime.element(ErrorOnChildNode, {
            route: "/error-on-child-node"
        }), /*#__PURE__*/ $runtime.element(Vunerability, {
            route: "/vunerability"
        }), /*#__PURE__*/ $runtime.element(UnderscoredAttributes, {
            route: "/underscored-attributes"
        }), /*#__PURE__*/ $runtime.element(PersistentComponent, {
            route: "/persistent-component/:id",
            persistent: true
        }), /*#__PURE__*/ $runtime.element(IsomorphicStartup, {
            route: "/isomorphic-startup"
        }), /*#__PURE__*/ $runtime.element(WorkerVerbs, {
            route: "/worker-verbs"
        }), /*#__PURE__*/ $runtime.element(TypeScript, {
            route: "/typescript"
        }), /*#__PURE__*/ $runtime.element(LazyComponentLoader, {
            route: "/lazy-component"
        }), /*#__PURE__*/ $runtime.element(PublicServerFunctions, {
            key: "publicServerFunctions"
        }), /*#__PURE__*/ $runtime.element(ExternalServerFunctions, {
            route: "/external-server-functions"
        }), /*#__PURE__*/ $runtime.element(UndefinedNodes, {
            route: "/undefined-nodes"
        }), /*#__PURE__*/ $runtime.element(WebpackCustomPlugin, {
            route: "/webpack-custom-plugin"
        }), /*#__PURE__*/ $runtime.element(ComponentTernary, {
            route: "/component-ternary"
        }), /*#__PURE__*/ $runtime.element(AnchorModifiers, {
            route: "/anchor-modifiers",
            key: "anchorModifiers"
        }), /*#__PURE__*/ $runtime.element(MetatagState, {
            route: "/metatag-state"
        }), /*#__PURE__*/ $runtime.element(JavaScriptExtension, {
            route: "/javascript-extension"
        }), /*#__PURE__*/ $runtime.element(TypeScriptExtension, {
            route: "/typescript-extension",
            generic: true
        }), /*#__PURE__*/ $runtime.element(Refs, {
            route: "/refs",
            key: `refs${refInstanceCount}`
        }), /*#__PURE__*/ $runtime.element(OptimizedEvents, {
            route: "/optimized-events"
        }), /*#__PURE__*/ $runtime.element(DynamicHead, {
            route: "/dynamic-head"
        }), /*#__PURE__*/ $runtime.element(TextObserver, {
            route: "/text-observer"
        }), /*#__PURE__*/ $runtime.element(BodyFragment, {
            route: "/body-fragment"
        }), /*#__PURE__*/ $runtime.element(ArrayAttributes, {
            route: "/array-attributes"
        }), /*#__PURE__*/ $runtime.element(RouteScroll, {
            route: "/route-scroll/*",
            key: "routeScroll"
        }), /*#__PURE__*/ $runtime.element(IsomorphicImport, {
            route: "/isomorphic-import"
        }), /*#__PURE__*/ $runtime.element(ExposedServerFunctions, {
            route: "/exposed-server-functions"
        }), /*#__PURE__*/ $runtime.element(CatchError, {
            route: "/catch-error"
        }), /*#__PURE__*/ $runtime.element(ReqRes, {
            route: "/reqres"
        }), /*#__PURE__*/ $runtime.element(Logo, {
            route: "/logo"
        }), /*#__PURE__*/ $runtime.element(NestedFolder, {
            route: "/nested/folder"
        }), /*#__PURE__*/ $runtime.element(LazyComponent, {
            route: "/lazy-importer",
            prop: "works"
        }), /*#__PURE__*/ $runtime.element(ErrorPage, {
            route: "*"
        }));
    }
}
export default Application;
