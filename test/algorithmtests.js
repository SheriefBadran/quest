import { expect } from "chai";
import sinon from "sinon";
import algorithms from "./../src/algorithms";

describe("algorithms", ()=> {
	beforeEach(function() {
		this.sinon = sinon.sandbox.create();
	});
	afterEach(function(){
		this.sinon.restore();
	});
	it("should return -1 in the event of a miss", ()=> {
		let stub = sinon.stub(Math, "random");
		stub.returns(1);
		const attackerStats = { dex: 1 };
		const defenderStats = { dex: 2 };
		expect(algorithms.calculatePhysicalDamage(attackerStats, defenderStats)).to.equal(-1);
		stub.restore();
	});
	it("should return no less than 0 if it's not a miss", ()=> {
		let stub = sinon.stub(Math, "random");
		stub.returns(0);
		const attackerStats = { dex: 2, str: 0 };
		const defenderStats = { dex: 1, def: 100 };
		expect(algorithms.calculatePhysicalDamage(attackerStats, defenderStats)).to.equal(0);
		stub.restore();
	});
});