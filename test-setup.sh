#!/bin/bash

# Quick test of the auto-commit feature

echo "🧪 Testing Auto-Commit Feature..."
echo ""

# Check if git is configured
echo "1️⃣ Checking Git configuration..."
GIT_NAME=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo "   ⚠️  Git is not configured!"
    echo ""
    echo "   Please run:"
    echo "   git config --global user.name \"Your Name\""
    echo "   git config --global user.email \"your.email@example.com\""
    echo ""
    exit 1
else
    echo "   ✅ Git configured as: $GIT_NAME <$GIT_EMAIL>"
fi

# Check if we can connect to GitHub
echo ""
echo "2️⃣ Testing GitHub connectivity..."
if git ls-remote origin &> /dev/null; then
    echo "   ✅ GitHub connection successful"
else
    echo "   ⚠️  Cannot connect to GitHub"
    echo "   Please ensure you have:"
    echo "   - Internet connectivity"
    echo "   - GitHub authentication configured"
    exit 1
fi

# Check if videos directory exists
echo ""
echo "3️⃣ Checking videos directory..."
if [ -d "videos" ]; then
    VIDEO_COUNT=$(ls -1 videos 2>/dev/null | wc -l)
    echo "   ✅ Videos directory exists ($VIDEO_COUNT files)"
else
    echo "   📁 Creating videos directory..."
    mkdir -p videos
    echo "   ✅ Videos directory created"
fi

# Check Node.js
echo ""
echo "4️⃣ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

# Check if node_modules exists
echo ""
echo "5️⃣ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Dependencies installed"
else
    echo "   📦 Installing dependencies..."
    npm install
    echo "   ✅ Dependencies installed"
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "🚀 Ready to start! Run:"
echo "   ./start-all.sh"
echo ""
echo "Or test individually:"
echo "   node server.js              # Start upload server"
echo "   node sync-from-wigdosxp.js  # Start sync service"
echo ""
echo "📖 Documentation:"
echo "   - AUTO_COMMIT_SETUP.md   # Detailed auto-commit guide"
echo "   - README.md              # General overview"
echo "   - API_DOCUMENTATION.md   # API reference"
