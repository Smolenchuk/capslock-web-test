# Triggering Capslock Web Tests from Another Repository

Add this workflow file to any repo that should trigger E2E tests on PRs.

## Setup

1. Create a [Personal Access Token](https://github.com/settings/tokens) (classic) with `repo` scope, or a fine-grained token with **Actions: write** permission on the `capslock-web-test` repo.
2. Add the token as a secret (e.g. `E2E_TRIGGER_TOKEN`) in the calling repository.
3. Copy the workflow below into `.github/workflows/trigger-e2e.yml` in the calling repo.

## Example Caller Workflow

```yaml
name: Trigger E2E Tests
on:
  pull_request:
    branches: [main, master]

jobs:
  trigger-e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Capslock Web Tests
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.E2E_TRIGGER_TOKEN }}
          script: |
            await github.rest.actions.createWorkflowDispatch({
              owner: '<org-or-user>',
              repo: 'capslock-web-test',
              workflow_id: 'playwright.yml',
              ref: 'main',
              inputs: {
                app_url: 'https://your-pr-preview-url.example.com',
                trigger_repo: '${{ github.repository }}',
                trigger_ref: '${{ github.head_ref }}'
              }
            });
```

Replace `<org-or-user>` with the GitHub owner of the `capslock-web-test` repo and adjust `app_url` to point to the PR's preview/staging environment.

## How It Works

1. A PR is opened in the calling repo.
2. The caller workflow fires a `workflow_dispatch` event on `capslock-web-test`.
3. The Playwright workflow runs against the provided `app_url`.
4. Results are available as artifacts in the `capslock-web-test` repo's Actions tab.
