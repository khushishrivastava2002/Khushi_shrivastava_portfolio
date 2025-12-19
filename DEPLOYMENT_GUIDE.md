# How to Host Your Portfolio for Free

Here are two of the best ways to host your portfolio for free.

## Option 1: GitHub Pages (Recommended for Developers)

Since you are a software engineer, hosting on GitHub Pages is professional and shows you know how to use Git.

1.  **Initialize Git (if not already done):**
    Open your terminal in the project folder and run:

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub:**

    - Go to [GitHub.com](https://github.com) and sign in.
    - Click the "+" icon in the top right and select "New repository".
    - Name it `portfolio` (or `username.github.io` if you want that specific domain).
    - Click "Create repository".

3.  **Push Your Code:**
    Follow the instructions shown on GitHub to push your existing repository. It usually looks like this:

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
    git branch -M main
    git push -u origin main
    ```

4.  **Enable GitHub Pages:**
    - Go to your repository **Settings**.
    - Click on **Pages** in the left sidebar.
    - Under **Source**, select `Deploy from a branch`.
    - Under **Branch**, select `main` and click **Save**.
    - Your site will be live at `https://YOUR_USERNAME.github.io/portfolio/` in a few minutes!

## Option 2: Netlify Drop (Easiest)

If you want to get it online in seconds without using the command line:

1.  Go to [Netlify Drop](https://app.netlify.com/drop).
2.  Drag and drop your entire `potfolio` folder onto the page.
3.  Netlify will upload and host it instantly.
4.  You can then claim the site to change the URL (e.g., `khushi-portfolio.netlify.app`).
