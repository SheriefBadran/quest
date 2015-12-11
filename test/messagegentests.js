import { expect } from "chai";
import constants from "./../src/constants";
import messageGen from "./../src/components/messagegen";
import sinon from "sinon";

//TODO: Rest of these tests for random and for concatenating options etc

describe("messageGen", ()=> {
	beforeEach(function() {
		this.sinon = sinon.sandbox.create();
	});
	afterEach(function(){
		this.sinon.restore();
	});
	it("should not throw an error when random in getPlayerFail returns any value between 0 and 1", ()=> {
		let stub = sinon.stub(Math, "random");
		stub.onFirstCall().returns(0);
		stub.onSecondCall().returns(0.2);
		stub.onThirdCall().returns(1);

		for (let i = 0; i < 3; ++i) {
			expect(messageGen.getPlayerFail.bind(messageGen)).to.not.throw(Error);
		}

		expect(stub.callCount).to.equal(3);
	});
});