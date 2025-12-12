import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

// Define the posts collection
const posts = defineCollection({
    name: 'Post', // collection type name
    pattern: 'posts/**/*.md', // content files glob pattern
    schema: s
        .object({
            title: s.string().max(99), // Zod schema for validation
            slug: s.slug('posts'), // validate format, unique in posts collection
            date: s.isodate(), // validate ISO date
            excerpt: s.string().max(200).optional(),
            content: s.markdown(), // transform markdown to html
            metaTitle: s.string().optional(),
            metaDescription: s.string().optional(),
            keywords: s.array(s.string()).optional()
        })
        // more additional fields (computed fields)
        .transform(data => ({ ...data, permalink: `/blog/${data.slug}` }))
})

export default defineConfig({
    root: 'content',
    output: {
        data: '.velite',
        assets: 'public/static',
        base: '/static/',
        name: '[name]-[hash:6].[ext]',
        clean: true
    },
    collections: { posts },
    markdown: {
        rehypePlugins: [
            [rehypePrettyCode, {
                theme: {
                    light: 'min-light',
                    dark: 'dracula'
                }
            }]
        ],
        remarkPlugins: []
    }
})
