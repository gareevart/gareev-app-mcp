# Supabase App MCP Server - User Guide

> **MCP Server for managing Supabase Upload App** - Provides AI tools for blog posts, newsletters, subscribers, and more.

## Quick Installation

### Option 1: One-line install (Recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/your-username/supabase-app-mcp-server/main/install.sh | bash
```

### Option 2: Manual installation
```bash
npm install -g @your-username/supabase-app-mcp-server
```

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **VS Code** or **Cursor** with MCP extension
- **Supabase project** with the Upload App schema
- **Running Supabase Upload App** (usually on http://localhost:3000)

## Setup

### 1. Get your Supabase credentials

**From Supabase Dashboard:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → Your `SUPABASE_URL`
   - **anon public key** → Your `SUPABASE_ANON_KEY`

**From your app's .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configure MCP

If you used the install script, configuration is automatic. Otherwise, add this to your MCP settings:

**VS Code:** `~/Library/Application Support/Code/User/globalStorage/viknet.intelliboba/settings/mcp_settings.json`
**Cursor:** `~/Library/Application Support/Cursor/User/globalStorage/viknet.intelliboba/settings/mcp_settings.json`

```json
{
  "mcpServers": {
    "supabase-app-server": {
      "disabled": false,
      "timeout": 60,
      "alwaysAllow": [
        "get_blog_posts",
        "create_blog_post",
        "get_broadcasts",
        "get_subscribers",
        "get_broadcast_groups",
        "get_user_profiles",
        "get_images",
        "get_app_stats"
      ],
      "type": "stdio",
      "command": "npx",
      "args": ["@your-username/supabase-app-mcp-server"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key-here",
        "APP_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 3. Restart your editor

Restart VS Code or Cursor to load the new MCP server.

## Available Tools

### 📝 Blog Management
- **`get_blog_posts`** - Retrieve blog posts with filtering options
- **`create_blog_post`** - Create new blog posts

### 📧 Newsletter Management  
- **`get_broadcasts`** - Get email broadcasts/newsletters
- **`get_subscribers`** - Retrieve newsletter subscribers
- **`get_broadcast_groups`** - Get subscriber groups

### 👥 User Management
- **`get_user_profiles`** - Get user profiles and roles

### 🖼️ Media Management
- **`get_images`** - Retrieve uploaded images with metadata

### 📊 Analytics
- **`get_app_stats`** - Get comprehensive app statistics

## Usage Examples

### Natural Language Commands

```
Show me the latest 5 blog posts
```

```
Get all active newsletter subscribers
```

```
Create a new blog post titled "My New Article" with content "This is the content"
```

```
Show me app statistics
```

```
Get all sent newsletters from this month
```

```
Show me all uploaded images with tags
```

### Advanced Filtering

```
Show me only published blog posts from the last week
```

```
Get draft posts that I created
```

```
Show me newsletter subscribers in the "VIP" group
```

```
Get all failed email broadcasts
```

## Troubleshooting

### ❌ "Server not found" or "Tool not available"
- Restart your editor after installation
- Check that `"disabled": false` in MCP settings
- Verify the server is installed: `npm list -g @your-username/supabase-app-mcp-server`

### ❌ "Environment variables required" error
- Double-check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in MCP settings
- Ensure your Supabase project is active and accessible

### ❌ "Connection refused" or API errors
- Make sure your Supabase Upload App is running on the specified `APP_BASE_URL`
- Check that the app's API endpoints are accessible
- Verify your Supabase project has the correct database schema

### ❌ "Permission denied" errors
- Ensure your Supabase Row Level Security (RLS) policies allow the operations
- Check that your anon key has the necessary permissions
- For advanced operations, you might need to add `SUPABASE_SERVICE_ROLE_KEY`

## Database Schema Requirements

Your Supabase project should have these tables:
- `blog_posts` - Blog articles
- `sent_mails` - Email broadcasts  
- `subscribe` - Newsletter subscribers
- `broadcast_groups` - Subscriber groups
- `group_subscribers` - Group membership
- `profiles` - User profiles
- `images` - Uploaded images
- `tags` - Image tags
- `image_tags` - Image-tag relationships

## Security Notes

- The server uses your Supabase anon key, which respects RLS policies
- All operations go through your app's API endpoints
- No sensitive data is stored by the MCP server
- Environment variables are handled securely by the MCP system

## Support

### Getting Help
1. Check this guide for common issues
2. Verify your Supabase project setup
3. Ensure your Upload App is running and accessible
4. Check the MCP server logs in your editor's output panel

### Reporting Issues
- Include your Node.js version (`node --version`)
- Include your editor (VS Code/Cursor) and MCP extension version
- Describe the exact error message and steps to reproduce
- **Do not include** your Supabase keys or sensitive data

## Advanced Configuration

### Adding Service Role Key (Optional)
For enhanced capabilities like creating posts with custom authors:

```json
{
  "env": {
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_ANON_KEY": "your-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key",
    "APP_BASE_URL": "http://localhost:3000"
  }
}
```

⚠️ **Warning:** Service role key has full database access. Use carefully.

### Custom App URL
If your app runs on a different port or domain:

```json
{
  "env": {
    "APP_BASE_URL": "https://your-app-domain.com"
  }
}
```

## What's Next?

- 🔄 **Auto-updates:** The server will notify you of new versions
- 🚀 **New features:** More tools and capabilities are being added
- 🤝 **Community:** Join discussions and share feedback

---

**Made with ❤️ for the Supabase community**
