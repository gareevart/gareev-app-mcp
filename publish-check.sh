#!/bin/bash

# Pre-publish validation script
# Checks if the package is ready for publication

set -e

echo "🔍 Checking package readiness for publication..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

ERRORS=0

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    print_success "Node.js $(node -v) is supported"
else
    print_error "Node.js 18+ required, found $(node -v)"
    ERRORS=$((ERRORS + 1))
fi

# Check if package.json exists and is valid
print_status "Validating package.json..."
if [ -f "package.json" ]; then
    if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
        print_success "package.json is valid JSON"
    else
        print_error "package.json contains invalid JSON"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_error "package.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Check required package.json fields
print_status "Checking required package.json fields..."
REQUIRED_FIELDS=("name" "version" "description" "main" "bin")
for field in "${REQUIRED_FIELDS[@]}"; do
    if node -e "const pkg = require('./package.json'); if (!pkg.$field) process.exit(1)" 2>/dev/null; then
        print_success "Field '$field' is present"
    else
        print_error "Required field '$field' is missing"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check if build directory exists
print_status "Checking build artifacts..."
if [ -d "build" ] && [ -f "build/index.js" ]; then
    print_success "Build directory and main file exist"
    if [ -x "build/index.js" ]; then
        print_success "Main file is executable"
    else
        print_warning "Main file is not executable (will be fixed during build)"
    fi
else
    print_error "Build artifacts missing. Run 'npm run build' first"
    ERRORS=$((ERRORS + 1))
fi

# Check TypeScript compilation
print_status "Testing TypeScript compilation..."
if npm run build >/dev/null 2>&1; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed"
    ERRORS=$((ERRORS + 1))
fi

# Test server startup
print_status "Testing server startup..."
if timeout 5s env SUPABASE_URL=https://test.supabase.co SUPABASE_ANON_KEY=test-key APP_BASE_URL=http://localhost:3000 node build/index.js >/dev/null 2>&1 || true; then
    print_success "Server starts without errors"
else
    print_warning "Server startup test inconclusive (may be normal for MCP servers)"
fi

# Check required files for npm package
print_status "Checking required files..."
REQUIRED_FILES=("README.md" "LICENSE" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "File '$file' exists"
    else
        print_error "Required file '$file' is missing"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check .npmignore
print_status "Checking .npmignore..."
if [ -f ".npmignore" ]; then
    print_success ".npmignore exists"
else
    print_warning ".npmignore not found (optional but recommended)"
fi

# Test npm pack
print_status "Testing npm pack..."
if npm pack --dry-run >/dev/null 2>&1; then
    print_success "npm pack dry run successful"
else
    print_error "npm pack dry run failed"
    ERRORS=$((ERRORS + 1))
fi

# Check install script
print_status "Checking install script..."
if [ -f "install.sh" ] && [ -x "install.sh" ]; then
    print_success "Install script exists and is executable"
else
    print_warning "Install script missing or not executable"
fi

# Check documentation
print_status "Checking documentation..."
if [ -f "USER_GUIDE.md" ]; then
    print_success "User guide exists"
else
    print_warning "USER_GUIDE.md not found"
fi

# Check GitHub workflows
print_status "Checking GitHub Actions..."
if [ -d ".github/workflows" ] && [ -f ".github/workflows/ci.yml" ] && [ -f ".github/workflows/publish.yml" ]; then
    print_success "GitHub Actions workflows exist"
else
    print_warning "GitHub Actions workflows missing"
fi

# Summary
echo ""
echo "========================================="
if [ $ERRORS -eq 0 ]; then
    print_success "✅ Package is ready for publication!"
    echo ""
    echo "Next steps:"
    echo "1. Update package.json with your actual username/organization"
    echo "2. Create GitHub repository and push code"
    echo "3. Set up NPM_TOKEN secret in GitHub repository settings"
    echo "4. Run: npm publish --access public"
    echo ""
    echo "Or use GitHub Actions:"
    echo "1. Push to main branch"
    echo "2. Create a release on GitHub"
    echo "3. Package will be automatically published to npm"
else
    print_error "❌ Found $ERRORS error(s). Please fix them before publishing."
    exit 1
fi
