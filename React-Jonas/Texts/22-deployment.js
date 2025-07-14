// ! DEPLOYMENT !
// --------------
/**
 * ! 1. Deploying to Netlify
 * -------------------------
 * $ REMEMBER
 *      - Vite takes all development files and "bundles" them into single file
 *      - that bundled file will be deployed to production 
 * 
 * - open terminal => run "npm run build" 
 *      - this will create a huge bundle >>> "dist" folder
 * 
 * - create a file called "netlify.toml"
 * and insert the following.. 
 * [code]
 * ------
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
 * 
 * - copy that same file inside main folder of the project
 * 
 * * deployment
 *      - open "netlify.com" => login/signup with an account 
 *      - click on "add new project" => select "deploy manually" => upload "dist-folder" [that we had created by running: "npm run build"] 
 * 
 * => more real world approach!
 * - use "CONTINUOUS INTEGRATION" 
 *      - for this we have to upload code into GiHub and then connect that repo to "NETLIFY"
 * ... in next lecture
 * 
 * ! 2. Setting Up a Git and GitHub Repository
 * 
 * - visit "git-scm.com" => install "git" on the computer
 *      - open terminal within project-folder => run.. "git init" [to initialize git inside project-folder] 
 * (git repo will track every single change within every file... inside folder where git was initialized with "git init")
 * 
 * - before running "git add -A" => which adds every file to "STAGING-AREA"
 *      - create "readme.md" [a "md"... markdown file] >>> describe some features of application in that file
 * 
 * - create an account on GitHub => create a repository on GitHub
 * - open local-project inside terminal 
 *      - in-order to connect local project folder to github repository.. we need access token
 *          - inside github/settings.. generate a access token 
 *          - copy that access_token and paste it some where on ur computer.. [cause that token may disappear soon from GitHub]
 *          (this access token will be useful while pushing code to GitHub)!
 * 
 * >>> follow below commands to push code into GitHub
 *      - initialize git inside project folder:                         "git init"
 *      - add every file to "STAGING-AREA":                             "git add ." (OR) "git add -A"
 *      - save snapshot of current state of repository / commit:        "git commit -m "<a-commit-message>" "       [commit message can be of any comments / progress made with project]
 *      - to push that code into repo on GitHub >>> we need repo URL:   "git add remote origin <repo-http-url>"     [for every repo there will be unique URL]
 *      - finally push the code from local folder into GitHub-repo:     "git push -u origin <branch-name>"          [branch_name can be "main / master"]
 * (before pushing code into repo.. GitHub ask for credentials.. enter "username" and copied-access-token as "password")
 * 
 * (repo has to be on branch MAIN)
 * - to check whether branch is on MASTER / MAIN.. use:     "git status"
 * - if on MASTER, change it to MAIN using:                 "git branch -M main"          
 * 
 * ! 3. Deploying to Vercel
 * ------------------------
 * - we use GitHub repo that was created earlier to set-up continuous integration on "VERCEL"
 * 
 * - we could set-up a continuous integration on NETLIFY too.. 
 * [steps]
 *      - click on "add new project" => select "import an existing project"
 *      - select "github" >>> authorize => select that repo that we build in previous lecture!
 * 
 * [alternative]
 * * VERCEL
 * - very easy-to-use / free for small projects / hosting provider for react-applications
 * 
 * [steps-to-deploy-git-repo-onto-VERCEL]
 * - to use vercel, 1st we must have to sign-up onto it! >>> use GitHub for easy sign-up process 
 * - navigate to "dashboard">>> click on "add new" >>> select "project" 
 * - it asks to "install"   >>> click on "install" [which then connects with "GitHub"] >>> which imports all GitHub repositories on our GitHub account 
 * - select the "project" that we wanted to host on to "VERCEL"
 * 
 * [configuration of project on VERCEL]
 * - after selecting a project.. inside "Build and Output Settings" there will be non-editable [build commands, output directory, install command]
 * 
 * >>> build command: "npm run build"
 *      - whenever there is change inside our code and we pushed inside GitHub [after changing code]
 *          - vercel detects that change has happened and run command: "npm run build"
 * this is called // => CONTINUOUS INTEGRATION
 * 
 * 
 * !DEPLOYMENT SUCCESSFUL!
 *      
 * 
 * !REACT COMPLETED!
 * -----------------
 * next lectures on
 *       => next.js
 * 
 */