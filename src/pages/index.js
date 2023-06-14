import * as React from "react"
import { Link, graphql } from "gatsby"
import {
  GatsbyImage,
  getImage,
  StaticImage,
  withArtDirection,
} from "gatsby-plugin-image"
import { useState } from "react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const [currentCategory, setCurrentCategory] = useState("전체")
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const categories = data.allMarkdownRemark.distinct
  const renderPosts = e => {
    console.log()
    const list = e.target.closest("li")
    const category = list.dataset.category

    return setCurrentCategory(category)
  }
  const posts =
    currentCategory === "전체"
      ? data.allMarkdownRemark.nodes
      : data.allMarkdownRemark.nodes.filter(
          post => post.frontmatter.category === currentCategory
        )

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
      <h2 className="categories-title">카테고리</h2>
      <ol className="categories-container" style={{ listStyle: `none` }}>
        <li
          className="category-container"
          key="all-posts"
          onClick={renderPosts}
          data-category="전체"
        >
          <StaticImage
            src="../images/category/all-post.png"
            alt="category-image"
          />
          <span>all</span>
        </li>
        {categories.map(category => {
          return (
            <li
              className="category-container"
              key={category}
              onClick={renderPosts}
              data-category={category}
            >
              {category === "Algorithm" ? (
                <StaticImage
                  src="../images/category/Algorithm.png"
                  alt="category-image"
                ></StaticImage>
              ) : null}
              {category === "JavaScript" ? (
                <StaticImage
                  src="../images/category/JavaScript.png"
                  alt="category-image"
                />
              ) : null}
              {category === "MarkDown" ? (
                <StaticImage
                  src="../images/category/MarkDown.png"
                  alt="category-image"
                />
              ) : null}
              {category === "Project" ? (
                <StaticImage
                  src="../images/category/Project.png"
                  alt="category-image"
                />
              ) : null}
              <span>{category}</span>
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
