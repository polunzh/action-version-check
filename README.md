# action-version-check

This is a Github Action that ensures that your PR has updated version.

## Usage

```yml
name: "Check Version"
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
      - uses: action-version-check@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Rules

1. The updated version must be larger than the current version
1. Version updates greater than 1 are not allowed. e.g. 1.0.0 -> 1.0.3, 1.0.0 -> 1.2.0, 1.3.3 -> 3.0.0, such updates will fail
1. To update the major version, then you need to include [release-major] in the PR title
1. To update the minor version, then you need to include [release-minor] in the PR title