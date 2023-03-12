import $runtime from "nullstack/runtime";
import Nullstack from "nullstack";
import { clientOnly, clientOnly as clientOnlyAlias, serverOnly, serverOnly as serverOnlyAlias } from "./helpers";
import * as namespacedImport from "./helpers";
class IsomorphicImport extends Nullstack {
    static hash = "src__IsomorphicImport__njs";
    static async serverFunction() {
        return {
            serverOnly: serverOnly(),
            serverOnlyAlias: serverOnlyAlias(),
            namespacedServerOnly: namespacedImport.serverOnly()
        };
    }
    async initiate() {
        const data = await this.serverFunction();
        Object.assign(this, data);
        this.clientOnly = clientOnly();
        this.clientOnlyAlias = clientOnlyAlias();
    }
    render() {
        return /*#__PURE__*/ $runtime.element("div", {
            "data-hydrated": this.hydrated,
            "data-server-only": this.serverOnly,
            "data-server-only-alias": this.serverOnlyAlias,
            "data-client-only": this.clientOnly,
            "data-client-only-alias": this.clientOnlyAlias,
            "data-namespaced-server-only": this.namespacedServerOnly,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\IsomorphicImport.njs",
                lineNumber: 25,
                columnNumber: 7
            },
            __self: this
        });
    }
}
export default IsomorphicImport;
$runtime.accept(module, "src\\IsomorphicImport.njs", [
    "nullstack/runtime",
    "nullstack",
    "./helpers",
    "./helpers"
], [
    {
        klass: IsomorphicImport,
        initiate: "10360bee694589106fb3170e1f9cf080"
    }
]);
$runtime.register(IsomorphicImport, "serverFunction");
$runtime.register(IsomorphicImport);
