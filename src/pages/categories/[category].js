import * as React from "react"
import { Link, graphql } from "gatsby"
import {
  GatsbyImage,
  getImage,
  StaticImage,
  withArtDirection,
} from "gatsby-plugin-image"

import Bio from "../../components/bio"
import Layout from "../../components/layout"
import Seo from "../../components/seo"

export default function CategoryPage({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const category = data.allMarkdownRemark.distinct
  const categories = ["project", "javascript", "algorithm"]
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
    <Layout location={location} title={siteTitle} category={category}>
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
            <StaticImage
              src="../../images/js-256x256.png"
              alt="Slider picture"
            />
          </div>
        </div>
      </div>
      <h2 className="categories-title">카테고리</h2>
      <ol className="categories-container" style={{ listStyle: `none` }}>
        <li className="category-container" key="all-posts" data-category="전체">
          <Link to={`/`} itemProp="url">
            <StaticImage
              src="../../images/category/all-post.png"
              alt="category-image"
            />
            <span>all</span>
          </Link>
        </li>
        {categories.map(category => {
          return (
            <li
              className="category-container"
              key={category}
              data-category={category}
            >
              <Link to={`/categories/${category.toLowerCase()}`} itemProp="url">
                {category === "algorithm" ? (
                  <StaticImage
                    src="../../images/category/Algorithm.png"
                    alt="category-image"
                  ></StaticImage>
                ) : null}
                {category === "javascript" ? (
                  <StaticImage
                    src="../../images/category/JavaScript.png"
                    alt="category-image"
                  />
                ) : null}
                {category === "markdown" ? (
                  <StaticImage
                    src="../../images/category/MarkDown.png"
                    alt="category-image"
                  />
                ) : null}
                {category === "project" ? (
                  <StaticImage
                    src="../../images/category/Project.png"
                    alt="category-image"
                  />
                ) : null}
                {category === "design" ? (
                  <StaticImage
                    src="../../images/category/Desgin.png"
                    alt="category-image"
                  />
                ) : null}
                <span>{category}</span>
              </Link>
            </li>
          )
        })}
      </ol>
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
              <Link to={post.fields.slug} itemProp="url">
                <GatsbyImage
                  className="art-directed"
                  image={images}
                  alt="Art directed image"
                />
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <span itemProp="headline">{title}</span>
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
              </Link>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  query ($category: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { category: { eq: $category } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
          featuredImage {
            childImageSharp {
              gatsbyImageData(width: 128, height: 128, layout: CONSTRAINED)
            }
          }
          mobileImage {
            childImageSharp {
              gatsbyImageData(width: 512, height: 256, layout: CONSTRAINED)
            }
          }
        }
      }
      distinct(field: { frontmatter: { category: SELECT } })
    }
  }
`
