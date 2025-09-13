# gareev.de App MCP Server

[![NPM Version](https://img.shields.io/npm/v/@gareev/gareev-app-mcp)](https://www.npmjs.com/package/@gareev/gareev-app-mcp)
[![Node.js CI](https://github.com/gareevart/gareev-app-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/gareevart/gareev-app-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **AI-powered tools for Supabase Upload App management** - Blog posts, newsletters, subscribers, and more through natural language commands.

## 🚀 Quick Start

### One-line Installation
```bash
curl -fsSL https://raw.githubusercontent.com/gareevart/gareev-app-mcp/main/install.sh | bash
```

### Manual Installation
```bash
npm install -g @gareev/gareev-app-mcp
```

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **VS Code** or **Cursor** with MCP extension
- **Supabase project** with Upload App schema
- **Running Supabase Upload App** (typically on http://localhost:3000)

## ✨ Features

### 🤖 Natural Language Commands
Talk to your Supabase app using plain English:

```
"Show me the latest 5 blog posts"
"Create a new blog post titled 'My Article'"
"Get all active newsletter subscribers"
"Show me app statistics"
```

### 🛠️ Available Tools

| Tool | Description | Example Usage |
|------|-------------|---------------|
| `get_blog_posts` | Retrieve blog posts with filtering | "Show me published posts from this week" |
| `create_blog_post` | Create new blog posts | "Create a post titled 'Hello World'" |
| `get_broadcasts` | Get email newsletters/broadcasts | "Show me all sent newsletters" |
| `get_subscribers` | Retrieve newsletter subscribers | "Get all active subscribers" |
| `get_broadcast_groups` | Get subscriber groups | "Show me all subscriber groups" |
| `get_user_profiles` | Get user profiles and roles | "Show me all admin users" |
| `get_images` | Retrieve uploaded images | "Get all images with tags" |
| `get_app_stats` | Get comprehensive app statistics | "Show me app statistics" |

## 🔧 Setup

### 1. Get Supabase Credentials

**From Supabase Dashboard:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **API**
3. Copy **Project URL** and **anon public key**

**From your app's .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configure MCP

The installer will automatically configure MCP settings, or you can manually add:

**Location:** `~/Library/../../mcp_settings.json`

```json
{
  "mcpServers": {
    "gareev-app-mcp": {
      "disabled": false,
      "type": "stdio",
      "command": "npx",
      "args": ["@gareev/gareev-app-mcp"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key-here",
        "APP_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 3. Restart Editor

Restart VS Code or Cursor to load the MCP server.

## 💡 Usage Examples

### Blog Management
```
"Show me all draft posts"
"Create a blog post titled 'Getting Started' with content 'Welcome to our blog!'"
"Get the latest 10 published posts"
```

### Newsletter Management
```
"Show me all newsletter subscribers"
"Get broadcast groups with subscriber counts"
"Show me failed email broadcasts"
```

### Analytics & Insights
```
"Show me app statistics"
"Get all uploaded images from this month"
"Show me user profiles with admin role"
```

## 🏗️ Database Schema

Your Supabase project needs these tables:

- `blog_posts` - Blog articles and content
- `sent_mails` - Email broadcasts/newsletters  
- `subscribe` - Newsletter subscribers
- `broadcast_groups` - Subscriber groups
- `group_subscribers` - Group membership
- `profiles` - User profiles and roles
- `images` - Uploaded media files
- `tags` - Content tags
- `image_tags` - Tag relationships

## 🔒 Security

- Uses Supabase Row Level Security (RLS) policies
- Respects your existing authentication and permissions
- No sensitive data stored by the MCP server
- All operations go through your app's secure API endpoints

## 🛠️ Development

### Local Development
```bash
git clone https://github.com/gareevart/gareev-app-mcp.git
cd supabase-app-mcp-server
npm install
npm run build
npm run dev
```

### Testing
```bash
# Test server startup
npm run build
node test-server.cjs

# Test with your credentials
SUPABASE_URL=your-url SUPABASE_ANON_KEY=your-key npm start
```

### Project Structure
```
supabase-app-mcp-server/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript
├── .github/workflows/    # CI/CD automation
├── install.sh           # One-line installer
├── USER_GUIDE.md        # Detailed user documentation
└── package.json         # Package configuration
```

## 🚨 Troubleshooting

### Common Issues

**❌ "Server not found"**
- Restart your editor after installation
- Check MCP settings configuration
- Verify server installation: `npm list -g @gareev/gareev-app-mcp`

**❌ "Environment variables required"**
- Double-check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in MCP settings
- Ensure your Supabase project is active

**❌ "Connection refused"**
- Make sure your Supabase Upload App is running
- Verify `APP_BASE_URL` points to your running app
- Check that API endpoints are accessible

**❌ "Permission denied"**
- Review your Supabase RLS policies
- Ensure anon key has necessary permissions
- Consider adding `SUPABASE_SERVICE_ROLE_KEY` for advanced operations

## 📚 Documentation

- **[User Guide](USER_GUIDE.md)** - Comprehensive setup and usage guide
- **[API Reference](src/index.ts)** - Technical implementation details
- **[Troubleshooting](USER_GUIDE.md#troubleshooting)** - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- Powered by [Supabase](https://supabase.com/)
- Designed for the Supabase Upload App ecosystem

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/gareevart/gareev-app-mcp/issues)
- **Discussions:** [GitHub Discussions](https://github.com/gareevart/gareev-app-mcp/discussions)
- **Documentation:** [User Guide](USER_GUIDE.md)

---

**Made with ❤️ for the Supabase community**

*Transform your Supabase app management with AI-powered natural language commands!*