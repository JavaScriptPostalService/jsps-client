# How to contribute

For catsnake to keep up to date, and become the best tool it can be; we need contributors like you!
We know trying to add your own work might be scary, what will people say? Is my code quality good enough? What if I look dumb?
It's fine! Just go ahead and submit your work, worst case we'll tidy things up a bit; I'm positive we can benifit from seeing your ideas.

## Getting Started

* Make sure you have a [GitHub account](https://github.com/signup/free)
* Submit a ticket for your issue, assuming one does not already exist.
  * Clearly describe the issue including steps to reproduce when it is a bug.
  * Make sure you fill in the earliest version that you know has the issue.
* Fork the repository on GitHub
* Ensure that you are using ESLint in your editor to conform to our style guides. (Airbnb)
* Continue to Making Changes...

## Making Changes

* Create a topic branch from where you want to base your work.
  * This should always be from the master branch.
  * Only target release branches if you are certain your fix must be on that
    branch.
  * To quickly create a topic branch based on master; `git checkout -b <@yourhandle>-<fix/feat/chore>-<issue #> master`.
* Make commits of logical units.
* Make sure your commit messages are in the proper format.
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure your commit messages are in the proper format.

```
<type>(<scope>): <subject> <issue #>
```
   * Examples
    * `feat(Security): Added hashing to message to prevent interception #45`
    * `fix(Security) hashing function wasn't being called correctly #121`
    * `chore(tag/release) release-X.Y.Z`


* Make sure you have tested that your changes do not break anything in the package.

## Submitting Changes

* Push your changes to a topic branch in your fork of the repository.
* Submit a pull request to the repository in the catsnakejs organization.
* Update GitHub issue to mark that you have submitted code and are ready for it to be reviewed (Status: Ready for Merge).
  * Include a link to the pull request in the ticket.
* Feedback will be given directly in the GitHub Pull request Ticket
* After feedback has been given we expect responses within two weeks. After two
  weeks we may close the pull request if it isn't showing any activity.
