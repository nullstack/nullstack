function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import $runtime from "nullstack/runtime";
import Nullstack from "nullstack";
import { clientOnly, clientOnly as clientOnlyAlias, serverOnly, serverOnly as serverOnlyAlias } from "./helpers";
class IsomorphicImport extends Nullstack {
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
            "data-namespaced-server-only": this.namespacedServerOnly
        });
    }
}
_defineProperty(IsomorphicImport, "hash", "296665dcd3fa1944e0896c010a8dec82");
_defineProperty(IsomorphicImport, "serverFunction", $runtime.invoke("serverFunction", IsomorphicImport.hash));
export default IsomorphicImport;
