import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import { Head as DefaultHead } from '../components/Head';

const PageTemplate = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return (
    <Layout>
      <div className={cn('page', frontmatter.className)}>
        <h3>{frontmatter.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  );
};

export function Head({ data }) {
  const { markdownRemark } = data;
  const { frontmatter } = markdownRemark;
  return <DefaultHead title={frontmatter.title} />;
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
`;

export default PageTemplate;
