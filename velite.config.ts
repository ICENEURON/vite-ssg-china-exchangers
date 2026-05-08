import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

const DEFAULT_CONTENT_COMPANY = 'heatex-direct'
const DEFAULT_CONTENT_TYPE = 'posts'
const CONTENT_TYPES = new Set(['news', 'posts'])

// Define the posts collection
const posts = defineCollection({
    name: 'Post', // collection type name
    pattern: '{news,posts}/**/*.md', // content files glob pattern
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
            contentType: s.string().optional(),
            company: s.string().optional(),
        })
        .transform(data => {
            // New path: "posts/heatex-direct/en/hello-world" or "news/company/zh/update".
            // Legacy path "posts/en/hello-world" is still accepted and mapped to heatex-direct.

            // Note: data.filePath from s.path() gives the relative path without extension
            // e.g. "posts/heatex-direct/en/hello-world"

            const parts = data.filePath.split('/');
            const pathContentType = parts[0];
            const hasScopedPath = CONTENT_TYPES.has(pathContentType) && parts.length >= 4;

            const contentType = hasScopedPath ? pathContentType : data.contentType || DEFAULT_CONTENT_TYPE;
            const company = hasScopedPath ? parts[1] : data.company || DEFAULT_CONTENT_COMPANY;
            const lang = hasScopedPath ? parts[2] : parts.length >= 3 ? parts[1] : 'en';
            // Use frontmatter slug if available, otherwise fallback to filename
            const realSlug = data.slug || (parts.length >= 3 ? parts[parts.length - 1] : parts[parts.length - 1]);
            const articlePath = `/industry-news/${contentType}/${realSlug}`;

            const permalink = lang === 'en'
                ? articlePath
                : `/${lang}${articlePath}`;

            return {
                ...data,
                slug: realSlug,
                lang,
                contentType,
                company,
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
