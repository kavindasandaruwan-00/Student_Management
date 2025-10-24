import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function NavbarComponent() {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
                    Student Management
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Students</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/subjects">
                            <Nav.Link>Subjects</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
