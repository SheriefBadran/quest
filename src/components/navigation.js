import React from "react";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import { NavItem, Nav, ButtonGroup } from "react-bootstrap";

let Navigation = (props)=> {
    return (
		<div>
			<Nav bsStyle="pills">
					<IndexLinkContainer to="/"><NavItem>Home</NavItem></IndexLinkContainer>
					<LinkContainer to="/help"><NavItem>Help</NavItem></LinkContainer>
					<NavItem href="https://github.com/MoombaDS/quest" target="_blank">Source Code</NavItem>
			</Nav>

		</div>
	);
};

export default Navigation;