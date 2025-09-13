#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
}
// Create Supabase clients
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;
// Create MCP server
const server = new McpServer({
    name: "supabase-app-server",
    version: "0.1.0"
});
// Helper function to make authenticated API calls
async function makeApiCall(endpoint, options = {}) {
    const url = `${APP_BASE_URL}/api${endpoint}`;
    const response = await axios({
        url,
        method: (options.method || 'GET'),
        data: options.body,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    return response.data;
}
// Tool: Get blog posts
server.tool("get_blog_posts", {
    onlyMine: z.boolean().optional().describe("Show only current user's posts"),
    publishedOnly: z.boolean().optional().describe("Show only published posts"),
    draftsOnly: z.boolean().optional().describe("Show only draft posts"),
    limit: z.number().optional().describe("Limit number of posts returned"),
}, async ({ onlyMine, publishedOnly, draftsOnly, limit }) => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        let query = client
            .from('blog_posts')
            .select(`
          id, title, excerpt, slug, featured_image, 
          created_at, updated_at, published, author_id
        `)
            .order('created_at', { ascending: false });
        if (publishedOnly) {
            query = query.eq('published', true);
        }
        else if (draftsOnly) {
            query = query.eq('published', false);
        }
        if (limit) {
            query = query.limit(limit);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching blog posts: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Create blog post
server.tool("create_blog_post", {
    title: z.string().describe("Blog post title"),
    content: z.string().describe("Blog post content"),
    excerpt: z.string().optional().describe("Blog post excerpt"),
    slug: z.string().optional().describe("Custom slug (auto-generated if not provided)"),
    featured_image: z.string().optional().describe("Featured image URL"),
    published: z.boolean().optional().describe("Publish immediately (default: false)"),
}, async ({ title, content, excerpt, slug, featured_image, published = false }) => {
    try {
        const response = await makeApiCall('/blog-posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                content,
                excerpt,
                slug,
                featured_image,
                published,
            }),
        });
        return {
            content: [
                {
                    type: "text",
                    text: `Blog post created successfully:\n${JSON.stringify(response, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Get broadcasts
server.tool("get_broadcasts", {
    status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'failed']).optional().describe("Filter by status"),
    limit: z.number().optional().describe("Limit number of broadcasts returned"),
    offset: z.number().optional().describe("Offset for pagination"),
}, async ({ status, limit = 10, offset = 0 }) => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        let query = client
            .from('sent_mails')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching broadcasts: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Get subscribers
server.tool("get_subscribers", {
    active_only: z.boolean().optional().describe("Show only active subscribers"),
    limit: z.number().optional().describe("Limit number of subscribers returned"),
}, async ({ active_only = true, limit }) => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        let query = client
            .from('subscribe')
            .select('*')
            .order('created_at', { ascending: false });
        if (active_only) {
            query = query.eq('is_active', true);
        }
        if (limit) {
            query = query.limit(limit);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching subscribers: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Get broadcast groups
server.tool("get_broadcast_groups", {
    include_subscriber_count: z.boolean().optional().describe("Include subscriber count for each group"),
}, async ({ include_subscriber_count = false }) => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        if (include_subscriber_count) {
            const { data, error } = await client
                .from('broadcast_groups')
                .select(`
            *,
            group_subscribers(count)
          `);
            if (error)
                throw error;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        else {
            const { data, error } = await client
                .from('broadcast_groups')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching broadcast groups: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Get user profiles
server.tool("get_user_profiles", {
    role: z.string().optional().describe("Filter by user role (admin, editor, etc.)"),
    limit: z.number().optional().describe("Limit number of profiles returned"),
}, async ({ role, limit }) => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        let query = client
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (role) {
            query = query.eq('role', role);
        }
        if (limit) {
            query = query.limit(limit);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching user profiles: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Get images with tags
server.tool("get_images", {
    user_id: z.string().optional().describe("Filter by user ID"),
    with_tags: z.boolean().optional().describe("Include tag information"),
    limit: z.number().optional().describe("Limit number of images returned"),
}, async ({ user_id, with_tags = false, limit }) => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        let query = client
            .from('images')
            .select(with_tags ? `
          *,
          image_tags(
            tag_id,
            tags(name, color)
          )
        ` : '*')
            .order('created_at', { ascending: false });
        if (user_id) {
            query = query.eq('user_id', user_id);
        }
        if (limit) {
            query = query.limit(limit);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching images: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool: Get application statistics
server.tool("get_app_stats", {}, async () => {
    try {
        const client = supabaseAdmin || supabaseAnon;
        // Get counts for various entities
        const [{ count: blogPostsCount }, { count: subscribersCount }, { count: broadcastsCount }, { count: imagesCount }, { count: usersCount }, { count: groupsCount }] = await Promise.all([
            client.from('blog_posts').select('*', { count: 'exact', head: true }),
            client.from('subscribe').select('*', { count: 'exact', head: true }),
            client.from('sent_mails').select('*', { count: 'exact', head: true }),
            client.from('images').select('*', { count: 'exact', head: true }),
            client.from('profiles').select('*', { count: 'exact', head: true }),
            client.from('broadcast_groups').select('*', { count: 'exact', head: true })
        ]);
        const stats = {
            blog_posts: blogPostsCount || 0,
            subscribers: subscribersCount || 0,
            broadcasts: broadcastsCount || 0,
            images: imagesCount || 0,
            users: usersCount || 0,
            broadcast_groups: groupsCount || 0,
            timestamp: new Date().toISOString()
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(stats, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching app statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Supabase App MCP server running on stdio');
//# sourceMappingURL=index.js.map