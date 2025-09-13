#!/bin/bash

# Supabase App MCP Server Installation Script
# This script helps users install and configure the MCP server

set -e

echo "🚀 Installing Supabase App MCP Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Install the MCP server globally
print_status "Installing Supabase App MCP Server..."
npm install -g @your-username/supabase-app-mcp-server

# Detect MCP settings file location
MCP_SETTINGS_FILE=""

# Check for VS Code
if [ -d "$HOME/Library/Application Support/Code/User/globalStorage/viknet.intelliboba/settings" ]; then
    MCP_SETTINGS_FILE="$HOME/Library/Application Support/Code/User/globalStorage/viknet.intelliboba/settings/mcp_settings.json"
elif [ -d "$HOME/.config/Code/User/globalStorage/viknet.intelliboba/settings" ]; then
    MCP_SETTINGS_FILE="$HOME/.config/Code/User/globalStorage/viknet.intelliboba/settings/mcp_settings.json"
# Check for Cursor
elif [ -d "$HOME/Library/Application Support/Cursor/User/globalStorage/viknet.intelliboba/settings" ]; then
    MCP_SETTINGS_FILE="$HOME/Library/Application Support/Cursor/User/globalStorage/viknet.intelliboba/settings/mcp_settings.json"
elif [ -d "$HOME/.config/Cursor/User/globalStorage/viknet.intelliboba/settings" ]; then
    MCP_SETTINGS_FILE="$HOME/.config/Cursor/User/globalStorage/viknet.intelliboba/settings/mcp_settings.json"
fi

if [ -z "$MCP_SETTINGS_FILE" ]; then
    print_warning "Could not find MCP settings file. Please configure manually."
    print_status "Add this configuration to your MCP settings:"
    cat << 'EOF'
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
      "disabledTools": [],
      "type": "stdio",
      "command": "npx",
      "args": [
        "@your-username/supabase-app-mcp-server"
      ],
      "env": {
        "SUPABASE_URL": "YOUR_SUPABASE_URL_HERE",
        "SUPABASE_ANON_KEY": "YOUR_SUPABASE_ANON_KEY_HERE",
        "APP_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
EOF
    exit 0
fi

print_status "Found MCP settings file: $MCP_SETTINGS_FILE"

# Prompt for Supabase credentials
echo ""
print_status "Please provide your Supabase credentials:"
read -p "Supabase URL (https://your-project.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "App Base URL (default: http://localhost:3000): " APP_BASE_URL

# Set default for APP_BASE_URL
if [ -z "$APP_BASE_URL" ]; then
    APP_BASE_URL="http://localhost:3000"
fi

# Validate inputs
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    print_error "Supabase URL and Anon Key are required!"
    exit 1
fi

# Create or update MCP settings
print_status "Updating MCP configuration..."

# Create backup
if [ -f "$MCP_SETTINGS_FILE" ]; then
    cp "$MCP_SETTINGS_FILE" "${MCP_SETTINGS_FILE}.backup"
    print_status "Created backup: ${MCP_SETTINGS_FILE}.backup"
fi

# Create settings directory if it doesn't exist
mkdir -p "$(dirname "$MCP_SETTINGS_FILE")"

# Generate MCP configuration
cat > "$MCP_SETTINGS_FILE" << EOF
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
      "disabledTools": [],
      "type": "stdio",
      "command": "npx",
      "args": [
        "@your-username/supabase-app-mcp-server"
      ],
      "env": {
        "SUPABASE_URL": "$SUPABASE_URL",
        "SUPABASE_ANON_KEY": "$SUPABASE_ANON_KEY",
        "APP_BASE_URL": "$APP_BASE_URL"
      }
    }
  }
}
EOF

print_success "MCP configuration updated successfully!"

echo ""
print_status "Testing server connection..."
if npx @your-username/supabase-app-mcp-server --version &> /dev/null; then
    print_success "Server is working correctly!"
else
    print_warning "Server test failed. Please check your configuration."
fi

echo ""
print_success "Installation completed! 🎉"
echo ""
print_status "Next steps:"
echo "1. Restart VS Code or Cursor"
echo "2. Make sure your Supabase app is running on $APP_BASE_URL"
echo "3. Try using commands like: 'Show me app statistics' or 'Get latest blog posts'"
echo ""
print_status "Available tools:"
echo "- get_blog_posts - Get blog posts"
echo "- create_blog_post - Create new blog post"
echo "- get_broadcasts - Get email broadcasts"
echo "- get_subscribers - Get newsletter subscribers"
echo "- get_broadcast_groups - Get broadcast groups"
echo "- get_user_profiles - Get user profiles"
echo "- get_images - Get uploaded images"
echo "- get_app_stats - Get application statistics"
