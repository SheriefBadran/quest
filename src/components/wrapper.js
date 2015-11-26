var React = require('react'),
	Navigation = require("./navigation"),
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
    Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var Wrapper = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
            <Grid fluid>
                <Row>
            	<Col mdOffset={3} md={6}>
            		<Panel>
            			<Navigation />
            		</Panel>
            	</Col>
                </Row>
                <Row>
                <Col md={12}>
                    <Panel>
                        <div className="text-center">
                            {this.props.children}
                        </div>
                    </Panel>
                </Col>
                </Row>
            </Grid>
            </div>
        );
    }
});

module.exports = Wrapper;