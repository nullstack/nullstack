import $runtime from "nullstack/runtime"; // server function works
import Nullstack from "nullstack";
import { readFileSync } from "fs";
const decodedString = "! * ' ( ) ; : @ & = + $ , / ? % # [ ]";
class ServerFunctions extends Nullstack {
    static hash = "src__ServerFunctions___ServerFunctions";
    count = 0;
    year = null;
    statement = "";
    response = "";
    clientOnly = "";
    static async getCountAsOne() {
        return 1;
    }
    async setCountToOne() {
        this.count = await this.getCountAsOne();
    }
    static async getCount({ to  }) {
        return to;
    }
    async setCountToTwo() {
        this.count = await this.getCount({
            to: 2
        });
    }
    static async getDate({ input  }) {
        return input;
    }
    async setDate() {
        const input = new Date("1992-10-16");
        const output = await this.getDate({
            input
        });
        this.year = output.getFullYear();
    }
    static async useNodeFileSystem() {
        const text = readFileSync("src/ServerFunctions.njs", "utf-8");
        return text.split(`\n`)[0].trim();
    }
    static async useFetchInNode() {
        const response = await fetch("http://localhost:6969/robots.txt");
        const text = await response.text();
        return text.split(`\n`)[0].trim();
    }
    static async getDoublePlusOne({ number  }) {
        return number * 2 + 1;
    }
    static async getEncodedString({ string  }) {
        return string === decodedString;
    }
    static async _privateFunction() {
        return true;
    }
    static async getPrivateFunction({ request  }) {
        return this._privateFunction();
    }
    static async getRequestUrl({ request  }) {
        return request.originalUrl.startsWith("/");
    }
    async initiate() {
        this.statement = await this.useNodeFileSystem();
        this.response = await this.useFetchInNode();
        this.doublePlusOneServer = await ServerFunctions.getDoublePlusOne({
            number: 34
        });
        this.originalUrl = await ServerFunctions.getRequestUrl();
    }
    async hydrate() {
        this.underlineRemovedFromClient = !ServerFunctions._privateFunction;
        this.underlineStayOnServer = await ServerFunctions.getPrivateFunction();
        this.doublePlusOneClient = await ServerFunctions.getDoublePlusOne({
            number: 34
        });
        this.acceptsSpecialCharacters = await this.getEncodedString({
            string: decodedString
        });
        this.hydratedOriginalUrl = await ServerFunctions.getRequestUrl();
    }
    render() {
        return /*#__PURE__*/ $runtime.element("div", {
            "data-hydrated": this.hydrated,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 90,
                columnNumber: 7
            },
            __self: this
        }, /*#__PURE__*/ $runtime.element("button", {
            class: "set-count-to-one",
            onclick: this.setCountToOne,
            source: this,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 91,
                columnNumber: 9
            },
            __self: this
        }, "1"), /*#__PURE__*/ $runtime.element("button", {
            class: "set-count-to-two",
            onclick: this.setCountToTwo,
            source: this,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 94,
                columnNumber: 9
            },
            __self: this
        }, "2"), /*#__PURE__*/ $runtime.element("button", {
            class: "set-date",
            onclick: this.setDate,
            source: this,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 97,
                columnNumber: 9
            },
            __self: this
        }, "1992"), /*#__PURE__*/ $runtime.element("div", {
            "data-count": this.count,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 100,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-year": this.year,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 101,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-statement": this.statement,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 102,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-response": this.response,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 103,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-double-plus-one-server": this.doublePlusOneServer === 69,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 104,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-double-plus-one-client": this.doublePlusOneClient === 69,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 105,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-accepts-special-characters": this.acceptsSpecialCharacters,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 106,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-underline-removed-from-client": this.underlineRemovedFromClient,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 107,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-underline-stay-on-server": this.underlineStayOnServer,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 108,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-hydrated-original-url": this.hydratedOriginalUrl,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 109,
                columnNumber: 9
            },
            __self: this
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-original-url": this.originalUrl,
            __source: {
                fileName: "C:\\Repositories\\nullstack\\nullstack\\tests\\src\\ServerFunctions.njs",
                lineNumber: 110,
                columnNumber: 9
            },
            __self: this
        }));
    }
}
export default ServerFunctions;
$runtime.accept(module, "src\\ServerFunctions.njs", [
    "nullstack/runtime",
    "nullstack",
    "fs"
], [
    {
        klass: ServerFunctions,
        initiate: [
            "useNodeFileSystem",
            "useFetchInNode",
            "getDoublePlusOne",
            "getRequestUrl"
        ],
        hashes: {
            getCount: "64ef23a80103627bea3edaeb8f533934",
            useFetchInNode: "3b93e3a8e5dc19945360e9523e0ded32",
            getCountAsOne: "771a1b57771dd29a59b9c155a8d8db56",
            getPrivateFunction: "f0f780a14ce2ed58903e2b33ccf0c955",
            getDate: "4f8e7ea6c02ae89b19432d3e3a73da8e",
            getDoublePlusOne: "1dd6a327579482f27a02eaf5a4bf8ac0",
            useNodeFileSystem: "243b666d0b221adf5809bf54d21829d5",
            getEncodedString: "88a0ffa79f8ec5a5d9aa928d61f79e68",
            _privateFunction: "c0990f04929c14e0294dcefcfc80fab4",
            getRequestUrl: "7ee4471ded1f135c3cfce3544a56c3a2"
        }
    }
]);
$runtime.register(ServerFunctions, "getCountAsOne");
$runtime.register(ServerFunctions, "getCount");
$runtime.register(ServerFunctions, "getDate");
$runtime.register(ServerFunctions, "useNodeFileSystem");
$runtime.register(ServerFunctions, "useFetchInNode");
$runtime.register(ServerFunctions, "getDoublePlusOne");
$runtime.register(ServerFunctions, "getEncodedString");
$runtime.register(ServerFunctions, "getPrivateFunction");
$runtime.register(ServerFunctions, "getRequestUrl");
$runtime.register(ServerFunctions);
