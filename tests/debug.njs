import $runtime from "nullstack/runtime"; // server function works
import Nullstack from "nullstack";
import { readFileSync } from "fs";
const decodedString = "! * ' ( ) ; : @ & = + $ , / ? % # [ ]";
class ServerFunctions extends Nullstack {
    static hash = "3f6b569ca5fd55ed";
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
            "data-hydrated": this.hydrated
        }, /*#__PURE__*/ $runtime.element("button", {
            class: "set-count-to-one",
            onclick: this.setCountToOne,
            source: this
        }, "1"), /*#__PURE__*/ $runtime.element("button", {
            class: "set-count-to-two",
            onclick: this.setCountToTwo,
            source: this
        }, "2"), /*#__PURE__*/ $runtime.element("button", {
            class: "set-date",
            onclick: this.setDate,
            source: this
        }, "1992"), /*#__PURE__*/ $runtime.element("div", {
            "data-count": this.count
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-year": this.year
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-statement": this.statement
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-response": this.response
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-double-plus-one-server": this.doublePlusOneServer === 69
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-double-plus-one-client": this.doublePlusOneClient === 69
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-accepts-special-characters": this.acceptsSpecialCharacters
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-underline-removed-from-client": this.underlineRemovedFromClient
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-underline-stay-on-server": this.underlineStayOnServer
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-hydrated-original-url": this.hydratedOriginalUrl
        }), /*#__PURE__*/ $runtime.element("div", {
            "data-original-url": this.originalUrl
        }));
    }
}
export default ServerFunctions;
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
