let expect = require("chai").expect,
	initialState = require("./../src/initialstate"),
	constants = require("./../src/constants"),
	reducer;

describe("input reducer", ()=> {
	before (()=> {
		reducer = require("./../src/reducers/inputReducer");
	});
	it("should return the initial state", ()=> {
		expect(reducer(undefined, {})).to.deep.equal(initialState().input);
	});
	it("should return initial state on reset", ()=> {
		expect(
			reducer(initialState().input, { type: constants.RESET })
		).to.deep.equal(initialState().input);
	});
	it("should update awaiting and previous on receiving a non-reset action", ()=> {
		expect(
			reducer(initialState().input, { type: constants.SET_INPUT, input: constants.EXPECTING_CONF })
		).to.deep.equal({
			awaiting: constants.EXPECTING_CONF,
			previous: constants.EXPECTING_NAME,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_NAME
		});
		expect(
			reducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_NAME,
					beforeReset: constants.EXPECTING_NAME,
					beforeResetIfConf: constants.EXPECTING_NAME
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RACE 
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_RACE,
			previous: constants.EXPECTING_CONF,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_NAME
		});
	});
});