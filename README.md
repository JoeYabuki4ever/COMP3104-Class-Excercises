# COMP3104 Lab 06 Static Hosting with GitHub Pages

Student: Taharim Haque  
Student ID: 101418321

This project continues the supplied Lab 05 Student Information System. Lab 06
adds a Travis CI build and deploys the generated files to the `gh-pages` branch
after changes are merged into `main`. The application design and student form
are preserved.

The source and build configuration are prepared. Connecting your GitHub
repository to Travis, entering your deployment token, merging the pull request
and enabling GitHub Pages are account actions you must still complete.

## Run locally

Extract the ZIP, open Git Bash in the folder containing `package.json`, and run
each command separately:

```bash
npm install
npm run build:pages
npm start
```

The app opens at http://localhost:3000/. Keep the terminal running while using
it. Press Ctrl+C to stop the development server before entering Git commands.

`npm run build:pages` creates the production app in `build/`, retains
`index.html`, copies it to `404.html`, and creates `.nojekyll`. The ordinary
`npm run build` still works, but the Pages command additionally prepares these
hosting files. To check the student form, run:

```bash
npm run test:app -- --runInBand
```

## Continue in your existing Lab 05 repository

1. Stop the running app with Ctrl+C.
2. Copy the Lab 06 files into your Lab 05 project folder, replacing matching
files. Include `.travis.yml`, `scripts`, `package.json`, `package-lock.json`,
`.gitignore` and this README. Windows may hide filenames beginning with a
dot, so enable **View > Show > Hidden items** if needed.
3. Keep your existing repository's `.git` folder and any unrelated files. This
download contains no Git history and does not replace your commits.
4. In Git Bash, confirm the project and remote:

```bash
   git rev-parse --show-toplevel
   git remote -v
   git status
   ```

   The root must be your individual SPA project folder. If the root is your
home directory or a different assignment, use the fresh repository steps
below in the extracted Lab 06 folder instead.

5. Continue the Lab 05 branch:

```bash
   git checkout dep-inclusions
   ```

   If you already merged that branch during earlier work, create a new branch
from your up-to-date main branch instead and compare that branch in the PR.

6. Build and commit the changes:

```bash
   npm install
   npm run build:pages
   git add .travis.yml scripts package.json package-lock.json .gitignore README.md START\_HERE.txt VERIFICATION.txt
   git commit -m "Configure Travis CI deployment to GitHub Pages"
   git push -u origin dep-inclusions
   ```

Continue with **Connect Travis CI** below.

## If you have not created an individual SPA repository

Use the freshly extracted Lab 06 project folder. This is separate from your
Group 10 text-file assignment. Create an empty public repository on GitHub,
for example `COMP3104\_Labs`. Leave GitHub's options to add a README, license and
.gitignore unchecked. Then run:

```bash
git init -b main
git add .gitignore README.md START\_HERE.txt VERIFICATION.txt
git commit -m "Initialize individual COMP3104 lab repository"
git checkout -b dep-inclusions

git add package.json package-lock.json
git commit -m "Add React dependencies and dependency lockfile"

git add src public
git commit -m "Add student information application"

git add .travis.yml scripts
git commit -m "Add Travis CI and GitHub Pages build configuration"
```

If Git requests your identity, set your name and verified GitHub email, then
retry the failed commit:

```bash
git config user.name "Taharim Haque"
git config user.email "YOUR\_VERIFIED\_GITHUB\_EMAIL"
```

Connect the HTTPS URL of the new individual repository. Replace both uppercase
placeholders below with its actual owner and repository name:

```bash
git remote add origin https://github.com/YOUR\_USERNAME/YOUR\_SPA\_REPOSITORY.git
git push -u origin main
git push -u origin dep-inclusions
```

If Git says a remote named origin already exists, inspect `git remote -v` and
confirm it is your SPA repository before proceeding. Use the correct GitHub
account when authentication opens in your browser.

## Connect Travis CI

1. Open https://app.travis-ci.com/ and sign in with the GitHub account that owns
your individual SPA repository.
2. Enable the repository through the Travis GitHub integration. If it is absent
from Travis, check the Travis integration's repository access in GitHub.
3. Enable builds for pushes and pull requests in the repository's Travis settings.
4. Use the deployment token from your earlier lab, if you already created one.
Otherwise, follow **Create the deployment token** below.
5. In the SPA repository's Travis **Settings > Environment Variables**, add:

   * Name: `github\_token`
   * Value: your GitHub deployment token
   * Display value in build log: OFF
6. Save the variable. The file `.travis.yml` refers to this variable and does not
contain the token itself. Enter the token only in Travis settings; do not
paste it into source files, screenshots or a chat message.

### Create the deployment token if needed

For the public repository and the classic-token approach documented by Travis:

1. In GitHub, open **profile picture > Settings > Developer settings**.
2. Open **Personal access tokens > Tokens (classic)**.
3. Select **Generate new token > Generate new token (classic)**.
4. Name it `COMP3104 Lab 06 Travis deployment` and choose an expiration covering
your lab work and grading period.
5. Select the `public\_repo` scope for this public SPA repository and generate
the token. Copy it directly into the hidden Travis environment variable above.

If your course already specifies another token type or your organization
restricts classic tokens, follow that setup instead. The token owner must have
write access to the SPA repository.

## Open the Lab 06 pull request

On your individual SPA repository, select **Pull requests > New pull request**:

|Setting|Value|
|-|-|
|Base|main|
|Compare|dep-inclusions|
|Title|Configure SPA deployment with Travis CI and GitHub Pages|

Suggested description:

> Adds the Student Information System source and a Travis CI pipeline that
> installs dependencies, runs the application checks, builds the React SPA with
> Yarn and publishes the generated files to gh-pages after a merge into main.
> The Pages build keeps index.html, adds a 404.html fallback and disables Jekyll
> processing for the static output.

If your existing Lab 05 source is already on main, adjust the description to
list only the changes in this pull request.

Wait for Travis to pass, review the changes, then merge the pull request using
**Create a merge commit**. Travis skips deployment for pull request builds.
After the merge, the build triggered on `main` must pass its deployment step.
Confirm that `gh-pages` appears in the repository's branch list.

If your default branch is `master`, change both `main` values in `.travis.yml`
to `master` before committing, and select `master` as the PR base.

## Enable GitHub Pages

After Travis creates the gh-pages branch:

1. Open the SPA repository's **Settings > Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **gh-pages** and **/ (root)**.
4. Click **Save** and wait for GitHub's Pages publishing workflow to finish.
5. Open the website URL displayed in Pages settings.
6. Add a sample student and confirm the name, age and major appear.

The usual project website address is:

`https://YOUR\_USERNAME.github.io/YOUR\_SPA\_REPOSITORY/`

The Pages build automatically reads the actual repository owner and name from
Travis's `TRAVIS\_REPO\_SLUG` variable and builds the correct asset URLs. There is
no guessed repository name or account-specific URL in the source. A repository
named `YOUR\_USERNAME.github.io` is handled as a user site at the domain root.

## Pipeline configuration and changes from the sample

* Node.js 24 is used instead of an automatically changing `stable` alias.
* `npm ci` installs the versions recorded in package-lock.json.
* Yarn Classic 1.22.22 runs the Pages build, retaining the lab's use of Yarn.
* npm and dependency directories are cached as configured in `.travis.yml`.
* The three real student-form checks run before the production build.
* `scripts/build-pages.cjs` builds the app and prepares the Pages output.
* `index.html` is copied to 404.html; it is retained as the website entry file.
* Current dpl v2 options `provider: pages:git`, `token` and `cleanup: false`
replace the sample's legacy deployment syntax.
* Only builds of main can deploy. Pull requests are built and reviewed first.
* The deploy target is gh-pages, and existing deployment history is retained.

## Suggested submission evidence

The supplied Lab 06 Word document does not state an exact screenshot count or
hand-in format. Follow the Lab 06 instructions shown in D2L. Useful evidence is:

|Evidence|What to capture from your own account|
|-|-|
|Configuration|.travis.yml in your repository|
|Pull request|The merged Lab 06 pull request|
|CI and deployment|A successful Travis main-branch job, including deployment|
|Hosting configuration|Pages settings showing gh-pages and / (root)|
|Website|The running online app with its public URL visible|

If D2L requests a report, include your name, student ID, repository URL, website
URL and the requested screenshots. Submit it through the Lab 06 submission
page and check for confirmation. A suitable report name is
`101418321\_COMP3104\_Lab06.pdf`; this is a suggestion, not a filename specified
by the supplied Word document.

## Troubleshooting

* **No gh-pages branch:** open the Travis main-branch job and inspect the first
failed step. A successful PR check does not itself publish the website.
* **Build skipped:** confirm the PR targets main, or update both main values
in .travis.yml for a master repository.
* **GitHub permission denied:** sign in with an account that has write access.
The deployment token and the Git Bash login are separate credentials.
* **Blank website or missing assets:** check that the latest successful Travis
build deployed to gh-pages and that Pages publishes from that branch.
* **Local command not found:** reopen Git Bash after installing Node.js.

## Sources and preparation

* Course instructions: `lab-06-hosting-spa-github-pages (1).docx`.
* Course starter: `Week05 COMP3104 React App Code.zip` and the prepared Lab 05 app.
* Travis Pages provider: https://docs.travis-ci.com/user/deployment-v2/providers/pages/
* GitHub Pages settings: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
* GitHub token management: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

Prepared with ChatGPT assistance. See VERIFICATION.txt for actual local checks.
No GitHub push, Travis deployment, Pages publication or D2L submission is claimed
by the local package.

## Project Links



Repository: https://github.com/JoeYabuki4ever/COMP3104-Class-Excercises



Expected website: https://joeyabuki4ever.github.io/COMP3104-Class-Excercises/

