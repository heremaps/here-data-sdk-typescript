import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import { KeyValueCache } from "@here/olp-sdk-dataservice-read/lib";
chai.use(sinonChai);
const expect = chai.expect;

describe("KeyValueCache", () => {
    let sandbox: sinon.SinonSandbox;
    let keyValueCache1 = new KeyValueCache();

    beforeEach(() => {
        keyValueCache1.put("key1", "value1");
        keyValueCache1.put("key2", "value2");
    });

    it("Should put new key value", async () => {
        keyValueCache1.put("key3", "value3");

        expect(keyValueCache1.get("key1")).equal("value1");
        expect(keyValueCache1.get("key2")).equal("value2");
        expect(keyValueCache1.get("key3")).equal("value3");
    });

    it("Should get key value", async () => {
        expect(keyValueCache1.get("key1")).equal("value1");
        expect(keyValueCache1.get("key2")).equal("value2");
    });

    it("Should remove key value", async () => {
        keyValueCache1.remove("key1");

        expect(keyValueCache1.get("key1")).equal(undefined);
        expect(keyValueCache1.get("key2")).equal("value2");
    });
});
