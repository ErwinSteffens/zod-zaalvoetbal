import React from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'
import Navbar from './Navbar'

import './layout.sass'

export default ({ children }) => (
    <Container>
        <Navbar></Navbar>
        <Row>
            <Col>
                <Breadcrumb>
                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                        Library
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Data</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
        </Row>
        <Row>
            <Col>{children}</Col>
        </Row>
    </Container>
)
