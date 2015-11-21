var React = require('react'),
	Navigation = require("./navigation"),
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Col = require("react-bootstrap").Col;

var Wrapper = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
            <Grid>
            	<Col xs={18} md={12}>
            		<Panel>
            			<Navigation />
            		</Panel>
               		<Col xs={18} md={12}>
               			<Panel>
               			<div className="text-center">
                		{this.props.children}
                		</div>
                		</Panel>
                	</Col>
            	</Col>
            </Grid>
            </div>
        );
    }
});

module.exports = Wrapper;