import React, { PropsWithChildren } from 'react'
import { Container } from 'react-bootstrap'
import cn from 'classnames'
import 'moment/locale/nl'

import './Layout.sass'
import { Head as DefaultHead } from './Head'
import { PluginOptions, RenderBodyArgs } from 'gatsby'

const SheetLayout = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <Container fluid className={cn('content', className)}>
    {children}
  </Container>
)

export function Head() {
  return <DefaultHead />
}

exports.onRenderBody = ({ setBodyAttributes }: RenderBodyArgs) => {
  setBodyAttributes({
    className: 'sheet',
  })
}

export default SheetLayout
