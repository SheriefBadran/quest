let expect = require("chai").expect,
	initialState = require("./../src/initialstate"),
	constants = require("./../src/constants"),
	reducer;

describe("input reducer", ()=> {
	before(()=> {
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
	it("should set before reset parameter if going into reset mode", ()=> {
		expect(
			reducer(
				{
					awaiting: constants.EXPECTING_WEAPON,
					previous: constants.EXPECTING_CONF,
					beforeReset: constants.EXPECTING_RACE,
					beforeResetIfConf: constants.EXPECTING_NAME
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_RESET,
			previous: constants.EXPECTING_WEAPON,
			beforeReset: constants.EXPECTING_WEAPON,
			beforeResetIfConf: constants.EXPECTING_NAME
		});
	});
	it("should set before reset parameter and before reset conf if going into reset mode during confirmation", ()=> {
		expect(
			reducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_WEAPON,
					beforeReset: constants.EXPECTING_RACE,
					beforeResetIfConf: constants.EXPECTING_NAME
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_RESET,
			previous: constants.EXPECTING_CONF,
			beforeReset: constants.EXPECTING_CONF,
			beforeResetIfConf: constants.EXPECTING_WEAPON
		});
	});
	it("should set revert to before reset if receiving another reset command", ()=> {
		expect(
			reducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_RESET,
					beforeReset: constants.EXPECTING_CONF,
					beforeResetIfConf: constants.EXPECTING_WEAPON
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_CONF,
			previous: constants.EXPECTING_WEAPON,
			beforeReset: constants.EXPECTING_CONF,
			beforeResetIfConf: constants.EXPECTING_WEAPON
		});
		expect(
			reducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_RESET,
					beforeReset: constants.EXPECTING_NAME,
					beforeResetIfConf: constants.EXPECTING_WEAPON
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_NAME,
			previous: constants.EXPECTING_CONF,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_WEAPON
		});
	});
});