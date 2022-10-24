import React, { PropsWithChildren } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import 'moment/locale/nl'

import Navigation from './Navigation'

import './Layout.sass'

const Layout = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <>
    <Container className={className}>
      <Row>
        <Col>
          <div className="top">
            <img src="/zod-net.png" className="logo" alt="zod-zaalvoetbal" />
          </div>
        </Col>
      </Row>
      <Navigation></Navigation>
      <Row>
        <Col>
          <div className="content">{children}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="footer">
            Copyright © 2022
            <br />
            <a href="https://github.com/erwinsteffens/zod-zaalvoetbal">source code</a>
          </div>
        </Col>
      </Row>
    </Container>
  </>
)

export default Layout
