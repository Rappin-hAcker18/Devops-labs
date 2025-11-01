#!/usr/bin/env pwsh
# CloudCrew Academy - Deployment Helper Script
# This script helps you deploy to different environments

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('staging', 'production', 'local')]
    [string]$Environment = 'local',
    
    [Parameter(Mandatory=$false)]
    [switch]$BuildOnly,
    
    [Parameter(Mandatory=$false)]
    [switch]$Help
)

function Show-Help {
    Write-Host @"

CloudCrew Academy - Deployment Helper
=====================================

Usage:
  .\deploy.ps1 -Environment <env> [-BuildOnly] [-Help]

Environments:
  local       - Start local development server (default)
  staging     - Deploy to staging environment
  production  - Deploy to production environment

Options:
  -BuildOnly  - Only build, don't deploy
  -Help       - Show this help message

Examples:
  .\deploy.ps1                          # Start local dev server
  .\deploy.ps1 -Environment staging     # Deploy to staging
  .\deploy.ps1 -Environment production  # Deploy to production
  .\deploy.ps1 -BuildOnly               # Build for production

Prerequisites:
  - Node.js 18+ installed
  - Vercel CLI installed (for staging/production)
  - Environment variables configured

"@
    exit 0
}

function Start-LocalDev {
    Write-Host "🚀 Starting local development server..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Server will be available at: http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Quick Links:" -ForegroundColor Yellow
    Write-Host "  Homepage:    http://localhost:3000" -ForegroundColor Gray
    Write-Host "  Courses:     http://localhost:3000/courses/aws-fundamentals" -ForegroundColor Gray
    Write-Host "  Pricing:     http://localhost:3000/pricing" -ForegroundColor Gray
    Write-Host "  Dashboard:   http://localhost:3000/dashboard" -ForegroundColor Gray
    Write-Host "  Admin:       http://localhost:3000/admin/dashboard" -ForegroundColor Gray
    Write-Host "  Forum:       http://localhost:3000/community/forum" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    npm run dev
}

function Build-Project {
    Write-Host "🔨 Building project..." -ForegroundColor Cyan
    
    if (-not (Test-Path ".env.local")) {
        Write-Host "⚠️  Warning: .env.local not found!" -ForegroundColor Yellow
        Write-Host "   Copy .env.example to .env.local and configure it" -ForegroundColor Yellow
    }
    
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
}

function Deploy-Staging {
    Write-Host "🚀 Deploying to STAGING environment..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check if Vercel CLI is installed
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
        Write-Host "   Install it with: npm i -g vercel" -ForegroundColor Yellow
        exit 1
    }
    
    # Checkout staging branch
    Write-Host "📦 Switching to staging branch..." -ForegroundColor Cyan
    git checkout staging
    
    # Merge from master
    Write-Host "🔄 Merging latest changes from master..." -ForegroundColor Cyan
    git merge master --no-edit
    
    # Push to remote
    Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
    git push origin staging
    
    # Deploy with Vercel
    Write-Host "🚀 Deploying to Vercel staging..." -ForegroundColor Cyan
    vercel
    
    Write-Host ""
    Write-Host "✅ Staging deployment complete!" -ForegroundColor Green
    Write-Host "   Check Vercel dashboard for deployment URL" -ForegroundColor Gray
    
    # Return to master branch
    git checkout master
}

function Deploy-Production {
    Write-Host "🚀 Deploying to PRODUCTION environment..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  WARNING: This will deploy to PRODUCTION!" -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "Are you sure you want to deploy to production? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 0
    }
    
    # Check if Vercel CLI is installed
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
        Write-Host "   Install it with: npm i -g vercel" -ForegroundColor Yellow
        exit 1
    }
    
    # Run tests
    Write-Host "🧪 Running tests..." -ForegroundColor Cyan
    npm test -- --passWithNoTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Tests failed! Aborting deployment." -ForegroundColor Red
        exit 1
    }
    
    # Build
    Write-Host "🔨 Building for production..." -ForegroundColor Cyan
    Build-Project
    
    # Push to GitHub
    Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
    git push origin master
    
    # Deploy with Vercel
    Write-Host "🚀 Deploying to Vercel production..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ Production deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Post-deployment checklist:" -ForegroundColor Yellow
    Write-Host "  [ ] Check deployment URL" -ForegroundColor Gray
    Write-Host "  [ ] Test user signup/login" -ForegroundColor Gray
    Write-Host "  [ ] Test payment flow" -ForegroundColor Gray
    Write-Host "  [ ] Verify video playback" -ForegroundColor Gray
    Write-Host "  [ ] Check admin dashboard" -ForegroundColor Gray
    Write-Host "  [ ] Monitor error logs" -ForegroundColor Gray
    Write-Host ""
}

# Main script logic
if ($Help) {
    Show-Help
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                              ║" -ForegroundColor Cyan
Write-Host "║        CloudCrew Academy Deployment          ║" -ForegroundColor Cyan
Write-Host "║                                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($BuildOnly) {
    Build-Project
    exit 0
}

switch ($Environment) {
    'local' {
        Start-LocalDev
    }
    'staging' {
        Deploy-Staging
    }
    'production' {
        Deploy-Production
    }
}
