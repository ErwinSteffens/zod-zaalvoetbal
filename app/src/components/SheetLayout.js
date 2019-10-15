import React from 'react'
import { Helmet } from 'react-helmet'
import { Container } from 'react-bootstrap'
import cn from 'classnames'
import 'moment/locale/nl'

import './Layout.sass'

export default ({ children, className }) => (
    <>
        <Helmet
            bodyAttributes={{
                class: 'sheet'
            }}
        >
            <title>ZOD Zaalvoetbal</title>

            <link
                href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
                rel="stylesheet"
            />
        </Helmet>
        <Container fluid className={cn(className)}>
            {children}
        </Container>
    </>
)
