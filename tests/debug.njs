import $runtime from "nullstack/runtime";
import Nullstack from "nullstack";
const AnchorModifiers = $runtime.lazy("src__AnchorModifiers", ()=>import("./AnchorModifiers"));
const ArrayAttributes = $runtime.lazy("src__ArrayAttributes", ()=>import("./ArrayAttributes"));
const BodyFragment = $runtime.lazy("src__BodyFragment", ()=>import("./BodyFragment"));
const CatchError = $runtime.lazy("src__CatchError", ()=>import("./CatchError"));
const ChildComponent = $runtime.lazy("src__ChildComponent", ()=>import("./ChildComponent"));
const ComponentTernary = $runtime.lazy("src__ComponentTernary", ()=>import("./ComponentTernary"));
const Context = $runtime.lazy("src__Context", ()=>import("./Context"));
const ContextData = $runtime.lazy("src__ContextData", ()=>import("./ContextData"));
const ContextEnvironment = $runtime.lazy("src__ContextEnvironment", ()=>import("./ContextEnvironment"));
const ContextPage = $runtime.lazy("src__ContextPage", ()=>import("./ContextPage"));
const ContextProject = $runtime.lazy("src__ContextProject", ()=>import("./ContextProject"));
const ContextSecrets = $runtime.lazy("src__ContextSecrets", ()=>import("./ContextSecrets"));
const ContextSettings = $runtime.lazy("src__ContextSettings", ()=>import("./ContextSettings"));
const ContextWorker = $runtime.lazy("src__ContextWorker", ()=>import("./ContextWorker"));
const DateParser = $runtime.lazy("src__DateParser", ()=>import("./DateParser"));
const DynamicHead = $runtime.lazy("src__DynamicHead", ()=>import("./DynamicHead"));
const Element = $runtime.lazy("src__Element", ()=>import("./Element"));
const ErrorOnChildNode = $runtime.lazy("src__ErrorOnChildNode", ()=>import("./ErrorOnChildNode"));
const ErrorPage = $runtime.lazy("src__ErrorPage", ()=>import("./ErrorPage"));
const ExposedServerFunctions = $runtime.lazy("src__ExposedServerFunctions", ()=>import("./ExposedServerFunctions"));
const ExternalServerFunctions = $runtime.lazy("src__ExternalServerFunctions", ()=>import("./ExternalServerFunctions"));
const FalsyNodes = $runtime.lazy("src__FalsyNodes", ()=>import("./FalsyNodes"));
const FullStackLifecycle = $runtime.lazy("src__FullStackLifecycle", ()=>import("./FullStackLifecycle"));
const Instanceable = $runtime.lazy("src__Instanceable", ()=>import("./Instanceable"));
const InstanceKey = $runtime.lazy("src__InstanceKey", ()=>import("./InstanceKey"));
const InstanceSelf = $runtime.lazy("src__InstanceSelf", ()=>import("./InstanceSelf"));
const IsomorphicImport = $runtime.lazy("src__IsomorphicImport", ()=>import("./IsomorphicImport"));
const IsomorphicStartup = $runtime.lazy("src__IsomorphicStartup", ()=>import("./IsomorphicStartup"));
const JavaScriptExtension = $runtime.lazy("src__JavaScriptExtension", ()=>import("./JavaScriptExtension"));
const Logo = $runtime.lazy("src__Logo", ()=>import("./Logo"));
const MetatagState = $runtime.lazy("src__MetatagState", ()=>import("./MetatagState"));
const NestedProxy = $runtime.lazy("src__NestedProxy", ()=>import("./NestedProxy"));
const OptimizedEvents = $runtime.lazy("src__OptimizedEvents", ()=>import("./OptimizedEvents"));
const ParentComponent = $runtime.lazy("src__ParentComponent", ()=>import("./ParentComponent"));
const PersistentComponent = $runtime.lazy("src__PersistentComponent", ()=>import("./PersistentComponent"));
const PluginAttributes = $runtime.lazy("src__PluginAttributes", ()=>import("./PluginAttributes"));
const PublicServerFunctions = $runtime.lazy("src__PublicServerFunctions", ()=>import("./PublicServerFunctions"));
const PureComponents = $runtime.lazy("src__PureComponents", ()=>import("./PureComponents"));
const Refs = $runtime.lazy("src__Refs", ()=>import("./Refs"));
const RenderableComponent = $runtime.lazy("src__RenderableComponent", ()=>import("./RenderableComponent"));
const ReqRes = $runtime.lazy("src__ReqRes", ()=>import("./ReqRes"));
const RoutesAndParams = $runtime.lazy("src__RoutesAndParams", ()=>import("./RoutesAndParams"));
const RouteScroll = $runtime.lazy("src__RouteScroll", ()=>import("./RouteScroll"));
const ServerFunctions = $runtime.lazy("src__ServerFunctions", ()=>import("./ServerFunctions"));
const ServerRequestAndResponse = $runtime.lazy("src__ServerRequestAndResponse", ()=>import("./ServerRequestAndResponse"));
const StatefulComponent = $runtime.lazy("src__StatefulComponent", ()=>import("./StatefulComponent"));
const StaticThis = $runtime.lazy("src__StaticThis", ()=>import("./StaticThis"));
const TextObserver = $runtime.lazy("src__TextObserver", ()=>import("./TextObserver"));
const TwoWayBindings = $runtime.lazy("src__TwoWayBindings", ()=>import("./TwoWayBindings"));
const TypeScript = $runtime.lazy("src__TypeScript", ()=>import("./TypeScript"));
const TypeScriptExtension = $runtime.lazy("src__TypeScriptExtension", ()=>import("./TypeScriptExtension"));
const UndefinedNodes = $runtime.lazy("src__UndefinedNodes", ()=>import("./UndefinedNodes"));
const UnderscoredAttributes = $runtime.lazy("src__UnderscoredAttributes", ()=>import("./UnderscoredAttributes"));
const Vunerability = $runtime.lazy("src__Vunerability", ()=>import("./Vunerability"));
const WebpackCustomPlugin = $runtime.lazy("src__WebpackCustomPlugin", ()=>import("./WebpackCustomPlugin"));
const WorkerVerbs = $runtime.lazy("src__WorkerVerbs", ()=>import("./WorkerVerbs"));
class Application extends Nullstack {
    static hash = "src__Application___Application";
    async changeInstanceable({ instances  }) {
        await instances.instanceable.customMethod();
    }
    prepare(context) {
        context.string = "nullstack";
        context.refInstanceCount = 0;
    }
    render({ project , page , environment , refInstanceCount  }) {
        const LazyComponent = this/*#__PURE__*/ .renderLazyComponent;
        return /*#__PURE__*/ $runtime.element("body", {
            "data-application-hydrated": this.hydrated,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 74,
                columnNumber: 7
            },
            __self: this
        }, /*#__PURE__*/ $runtime.element("h1", {
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 75,
                columnNumber: 9
            },
            __self: this
        }, " ", project.name, " "), page.status !== 200 && /*#__PURE__*/ $runtime.element("div", {
            route: "*",
            "data-page-status": page.status,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 76,
                columnNumber: 33
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            route: "/",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 77,
                columnNumber: 9
            },
            __self: this
        }, /*#__PURE__*/ $runtime.element("a", {
            href: "/lazy-component",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 78,
                columnNumber: 11
            },
            __self: this
        }, " go lazy go home "), /*#__PURE__*/ $runtime.element("a", {
            href: "/lazy-importer",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 79,
                columnNumber: 11
            },
            __self: this
        }, " import "), /*#__PURE__*/ $runtime.element("a", {
            href: `/nullstack/${environment.key}/offline`,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 80,
                columnNumber: 11
            },
            __self: this
        }, " offline "), /*#__PURE__*/ $runtime.element("a", {
            href: "/static-this",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 81,
                columnNumber: 11
            },
            __self: this
        }, " static this "), /*#__PURE__*/ $runtime.element("a", {
            href: "/routes-and-params/a",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 82,
                columnNumber: 11
            },
            __self: this
        }, " router with params "), /*#__PURE__*/ $runtime.element("a", {
            href: "/undefined-nodes",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 83,
                columnNumber: 11
            },
            __self: this
        }, " undefined nodes "), /*#__PURE__*/ $runtime.element("a", {
            href: "/full-stack-lifecycle",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 84,
                columnNumber: 11
            },
            __self: this
        }, " lifecycle "), /*#__PURE__*/ $runtime.element("a", {
            href: "/refs",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 85,
                columnNumber: 11
            },
            __self: this
        }, " refs "), /*#__PURE__*/ $runtime.element("a", {
            href: "/error-on-child-node?dom=true",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 86,
                columnNumber: 11
            },
            __self: this
        }, " error-on-child-node?dom=true "), /*#__PURE__*/ $runtime.element("a", {
            href: "/error-on-child-node?serialization=true",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 87,
                columnNumber: 11
            },
            __self: this
        }, " error-on-child-node?serialization=true "), /*#__PURE__*/ $runtime.element("a", {
            href: "/route-scroll/class?changed=1#bottom",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 88,
                columnNumber: 11
            },
            __self: this
        }, "#bottom")), $runtime.element(LazyComponent, {
            route: "/lazy-importer",
            prop: "works",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 90,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(RenderableComponent, {
            route: "/renderable-component",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 91,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(StatefulComponent, {
            route: "/stateful-component",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 92,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(FullStackLifecycle, {
            route: "/full-stack-lifecycle",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 93,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(InstanceSelf, {
            route: "/instance-self",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 94,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextProject, {
            route: "/context-project",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 95,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ServerFunctions, {
            route: "/server-functions",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 96,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(Context, {
            route: "/context",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 97,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextSecrets, {
            route: "/context-secrets",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 98,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextSettings, {
            route: "/context-settings",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 99,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextEnvironment, {
            route: "/context-environment",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 100,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextWorker, {
            route: "/context-worker",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 101,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(InstanceKey, {
            route: "/instance-key",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 102,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(RoutesAndParams, {
            route: "/routes-and-params/*",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 103,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextPage, {
            route: "/context-page",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 104,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(TwoWayBindings, {
            route: "/two-way-bindings",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 105,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ServerRequestAndResponse, {
            route: "/server-request-and-response",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 106,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ContextData, {
            route: "/context-data",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 107,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(DateParser, {
            route: "/date-parser",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 108,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(StaticThis, {
            route: "/static-this",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 109,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ChildComponent, {
            route: "/child-component",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 110,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ParentComponent, {
            route: "/parent-component",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 111,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(Element, {
            route: "/element",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 112,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(PluginAttributes, {
            route: "/plugin-attributes",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 113,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(PureComponents, {
            route: "/pure-components",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 114,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(Instanceable, {
            route: "/instanceable",
            key: "instanceable",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 115,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(NestedProxy, {
            route: "/nested-proxy",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 116,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(FalsyNodes, {
            route: "/falsy-nodes",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 117,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ErrorOnChildNode, {
            route: "/error-on-child-node",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 118,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(Vunerability, {
            route: "/vunerability",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 119,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(UnderscoredAttributes, {
            route: "/underscored-attributes",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 120,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(PersistentComponent, {
            route: "/persistent-component/:id",
            persistent: true,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 121,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(IsomorphicStartup, {
            route: "/isomorphic-startup",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 122,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(WorkerVerbs, {
            route: "/worker-verbs",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 123,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(TypeScript, {
            route: "/typescript",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 124,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(PublicServerFunctions, {
            key: "publicServerFunctions",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 126,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ExternalServerFunctions, {
            route: "/external-server-functions",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 127,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(UndefinedNodes, {
            route: "/undefined-nodes",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 128,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(WebpackCustomPlugin, {
            route: "/webpack-custom-plugin",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 129,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ComponentTernary, {
            route: "/component-ternary",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 130,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(AnchorModifiers, {
            route: "/anchor-modifiers",
            key: "anchorModifiers",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 131,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(MetatagState, {
            route: "/metatag-state",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 132,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(JavaScriptExtension, {
            route: "/javascript-extension",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 133,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(TypeScriptExtension, {
            route: "/typescript-extension",
            generic: true,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 134,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(Refs, {
            route: "/refs",
            key: `refs${refInstanceCount}`,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 135,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(OptimizedEvents, {
            route: "/optimized-events",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 136,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(DynamicHead, {
            route: "/dynamic-head",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 137,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(TextObserver, {
            route: "/text-observer",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 138,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(BodyFragment, {
            route: "/body-fragment",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 139,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ArrayAttributes, {
            route: "/array-attributes",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 140,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(RouteScroll, {
            route: "/route-scroll/*",
            key: "routeScroll",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 141,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(IsomorphicImport, {
            route: "/isomorphic-import",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 142,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ExposedServerFunctions, {
            route: "/exposed-server-functions",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 143,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(CatchError, {
            route: "/catch-error",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 144,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ReqRes, {
            route: "/reqres",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 145,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(Logo, {
            route: "/logo",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 146,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element(ErrorPage, {
            route: "*",
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\Application.njs",
                lineNumber: 147,
                columnNumber: 9
            },
            __self: this
        }));
    }
}
export default Application;
$runtime.accept(module, "src\\Application.njs", [
    "nullstack/runtime",
    "nullstack",
    "./AnchorModifiers",
    "./ArrayAttributes",
    "./BodyFragment",
    "./CatchError",
    "./ChildComponent",
    "./ComponentTernary",
    "./Context",
    "./ContextData",
    "./ContextEnvironment",
    "./ContextPage",
    "./ContextProject",
    "./ContextSecrets",
    "./ContextSettings",
    "./ContextWorker",
    "./DateParser",
    "./DynamicHead",
    "./Element",
    "./ErrorOnChildNode",
    "./ErrorPage",
    "./ExposedServerFunctions",
    "./ExternalServerFunctions",
    "./FalsyNodes",
    "./FullStackLifecycle",
    "./Instanceable",
    "./InstanceKey",
    "./InstanceSelf",
    "./IsomorphicImport",
    "./IsomorphicStartup",
    "./JavaScriptExtension",
    "./Logo",
    "./MetatagState",
    "./NestedProxy",
    "./OptimizedEvents",
    "./ParentComponent",
    "./PersistentComponent",
    "./PluginAttributes",
    "./PublicServerFunctions",
    "./PureComponents",
    "./Refs",
    "./RenderableComponent",
    "./ReqRes",
    "./RoutesAndParams",
    "./RouteScroll",
    "./ServerFunctions",
    "./ServerRequestAndResponse",
    "./StatefulComponent",
    "./StaticThis",
    "./TextObserver",
    "./TwoWayBindings",
    "./TypeScript",
    "./TypeScriptExtension",
    "./UndefinedNodes",
    "./UnderscoredAttributes",
    "./Vunerability",
    "./WebpackCustomPlugin",
    "./WorkerVerbs",
    "./Application.css"
], [
    {
        klass: Application,
        initiate: [],
        hashes: {}
    }
]);
