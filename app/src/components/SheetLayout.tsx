import React, { PropsWithChildren } from 'react';
import { Container } from 'react-bootstrap';
import cn from 'classnames';
import 'moment/locale/nl';

import './Layout.sass';

const SheetLayout = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className="sheet">
    <Container fluid className={cn('content', className)}>
      {children}
    </Container>
  </div>
);

export default SheetLayout;
