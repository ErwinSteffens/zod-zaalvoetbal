import React, { PropsWithChildren } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'moment/locale/nl';

import Navigation from './Navigation';

import './Layout.sass';
import TemporaryWarning from './TemporaryWarning';

const Layout = ({
  children,
  showNavigation = true,
  showTemporary = true,
  className,
}: PropsWithChildren<{
  className?: string;
  showNavigation?: boolean;
  showTemporary?: boolean;
}>) => (
  <Container className={className}>
    <Row>
      <Col>
        <div className="top">
          <img src="/zod-net.png" className="logo" alt="zod-zaalvoetbal" />
        </div>
      </Col>
    </Row>
    {showNavigation && <Navigation></Navigation>}
    <Row>
      <Col>
        <div className="content">
          {showTemporary && <TemporaryWarning />}
          {children}
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <div className="footer">
          Copyright © 2023
          <br />
          <a href="https://github.com/erwinsteffens/zod-zaalvoetbal">
            source code
          </a>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Layout;
