import React from "react";
import Navigation from "./navigation";
import { Panel, Grid, Row, Col } from "react-bootstrap";

let Wrapper = (props)=> {
    return (
        <div className="wrapper">
        <Grid fluid>
            <Row>
        	<Col md={6} mdOffset={3}>
        		<Panel>
        			<Navigation />
        		</Panel>
        	</Col>
            </Row>
            <Row>
            <Col md={12}>
                <Panel>
                    <div className="text-center">
                        {props.children}
                    </div>
                </Panel>
            </Col>
            </Row>
        </Grid>
        </div>
    );
};

export default Wrapper;