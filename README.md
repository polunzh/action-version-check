# action-version-check

This is a Github Action that ensures that your PR has bumped version.

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
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: ArcBlock/action-version-check@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
