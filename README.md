# action-version-check

This is a [Github Action](https://github.com/features/actions) that ensures that your PR title matches the [Commitlint Spec](https://github.com/conventional-changelog/commitlint) according to the configuration file.

This is helpful when using the "Squash and merge" strategy, Github will suggest to use the PR title as the commit message. With this action you can validate that the PR title will lead to a correct commit message.

## Validation

Examples for valid PR titles:
- fix(some-scope): correct typo.
- feat(scope): add support for Node 12.
- feat: empty scope

### The commit config

This actions uses the [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) that is a shared commitlint config enforcing conventional commits.

Refer to https://www.conventionalcommits.org/en/v1.0.0/ for more information.

## Example github action config in your project

```yml
name: "Lint PR Title"
on:
  pull_request:
    types:
      - opened
      - reopened
      - edited
      - synchronize
    branches:
      - master
      - dev

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: ArcBlock/action-version-check@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
