# GitHub Repository Setup Instructions

Your Phishing Guard extension is now ready to be pushed to GitHub!

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it: `phishing-guard` (or any name you prefer)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/mi/Desktop/mtibrahi_1581/Phishing-guard

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/phishing-guard.git

# Rename branch to main if needed (GitHub uses 'main' by default)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/phishing-guard.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Go to your GitHub repository page
2. You should see all your files
3. The README.md will automatically display on the repository homepage

## Optional: Add Repository Topics

On GitHub, you can add topics to make your repo discoverable:
- `chrome-extension`
- `phishing-protection`
- `security`
- `anti-phishing`
- `browser-extension`
- `javascript`

## Optional: Create a Release

1. Go to "Releases" → "Create a new release"
2. Tag version: `v1.0.0`
3. Release title: `Phishing Guard v1.0.0`
4. Description: Initial release of Phishing Guard Chrome Extension
5. Click "Publish release"

## Repository is Ready!

Your extension is now on GitHub and ready to share! 🎉
