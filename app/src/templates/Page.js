import React from 'react'
import { graphql } from 'gatsby'
import cn from 'classnames'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'

const PageTemplate = ({ data }) => {
    const { markdownRemark } = data
    const { frontmatter, html } = markdownRemark

    return (
        <Layout>
            <Helmet>
                <title>ZOD Zaalvoetbal - {frontmatter.title}</title>
            </Helmet>
            <div className={cn('page', frontmatter.className)}>
                <h3>{frontmatter.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </Layout>
    )
}

export const pageQuery = graphql`
    query ($path: String!) {
        markdownRemark(frontmatter: { path: { eq: $path } }) {
            html
            frontmatter {
                path
                title
                className
            }
        }
    }
`

export default PageTemplate
