import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

// Define the posts collection
const posts = defineCollection({
    name: 'Post', // collection type name
    pattern: 'posts/**/*.md', // content files glob pattern
    schema: s
        .object({
            title: s.string().max(99), // Zod schema for validation
            filePath: s.path(), // will be computed from file path
            slug: s.string().optional(), // allow frontmatter slug overwrite
            date: s.isodate(), // validate ISO date
            excerpt: s.string().max(200).optional(),
            author: s.string().optional(),
            reviewer: s.string().optional(),
            readTime: s.string().optional(),
            content: s.markdown(), // transform markdown to html
            metaTitle: s.string().optional(),
            metaDescription: s.string().optional(),
            keywords: s.array(s.string()).optional(),
            cover: s.string().optional(),
            // hidden field, used for internal logic
            lang: s.string().optional(),
        })
        .transform(data => {
            // path is like "posts/en/hello-world.md" or "posts/en/hello-world"
            // we want to extract "en" as lang, and "hello-world" as slug

            // Note: data.filePath from s.path() gives the relative path without extension
            // e.g. "posts/en/hello-world"

            const parts = data.filePath.split('/');
            // parts[0] is 'posts'
            // parts[1] is lang (e.g., 'en', 'zh')
            // parts[2] is actual slug (file name)

            const lang = parts.length >= 3 ? parts[1] : 'en';
            // Use frontmatter slug if available, otherwise fallback to filename
            const realSlug = data.slug || (parts.length >= 3 ? parts[parts.length - 1] : parts[parts.length - 1]);

            const permalink = lang === 'en'
                ? `/industry-news/${realSlug}`
                : `/${lang}/industry-news/${realSlug}`;

            return {
                ...data,
                slug: realSlug,
                lang,
                permalink
            };
        })
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
