import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import {
  GatsbyImage,
  getImage,
  StaticImage,
  withArtDirection,
} from "gatsby-plugin-image"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div className="slider">
        <div className="slider-content">
          <div className="slider-content-text">
            <div className="slider-content-text-title">
              하일의 작업실에 오신 걸 환영합니다!
            </div>
            <p>
              안녕하세요, <strong>하일</strong>이라는 닉네임으로 활동하고 있는{" "}
              <br /> <em>개발자</em>
              <strong> 김형우</strong>입니다. <br />
            </p>
          </div>
          <div className="slider-content-img">
            <StaticImage src="../images/js-256x256.png" alt="Slider picture" />
          </div>
        </div>
      </div>
      <ol className="post-list" style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const images = withArtDirection(
            getImage(
              post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData
            ),
            [
              {
                media: "(max-width: 558px)",
                image: getImage(
                  post.frontmatter.mobileImage?.childImageSharp?.gatsbyImageData
                ),
              },
            ]
          )

          return (
            <li key={post.fields.slug}>
              <GatsbyImage className="art-directed" image={images} />
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          featuredImage {
            childImageSharp {
              gatsbyImageData(width: 256, height: 256)
            }
          }
          mobileImage {
            childImageSharp {
              gatsbyImageData(width: 512, height: 256)
            }
          }
        }
      }
    }
  }
`
