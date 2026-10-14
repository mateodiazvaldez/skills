---
name: auto-pr-handler
description: Automatically checks open Pull Requests, reads code reviews, merges approved PRs, and dispatches subagents to fix PRs that have change requests.
---

# Auto PR Handler

Use this skill when the user asks to "check PR reviews", "merge approved PRs", or "handle PR feedback".

## Workflow

1. **Check Open Pull Requests**
   - Run `gh pr list` to see all currently open PRs in the repository.

2. **Analyze Reviews and Status**
   - For each open PR, run `gh pr view <number> --comments` and `gh pr checks <number>` to read the review verdicts, comments, and CI statuses.
   - Classify each PR into one of three categories:
     - **Ready for Merge**: Reviewers explicitly approved or said "LGTM", and CI checks are passing. Minor cosmetic suggestions count as ready unless the user states otherwise.
     - **Needs Changes**: Reviewers explicitly requested changes, or CI checks are failing.
     - **Pending**: No reviews yet or waiting for CI. Ignore these.

3. **Handle Approved PRs (Automated Merge)**
   - For all PRs classified as "Ready for Merge", ask the user for a quick confirmation if there are cosmetic suggestions.
   - **Pre-merge Validation:** Verify that CI passed (`gh pr checks <number>`) and the PR has no merge conflicts.
   - If approved and all checks pass, merge using `gh pr merge <number> --squash --delete-branch`.
   - **Close Associated Issues:** After merging, read the PR description for linked issues (e.g., "Resuelve #X") and close them with `gh issue close <number>` if GitHub didn't do it automatically.
   - Run `git checkout master` (or main) and `git pull` to keep the local repo synced.

4. **Handle Change Requests (Dispatch Subagents)**
   - For PRs that need changes, check out the PR's branch locally.
   - Summarize the review feedback and present it to the user for approval before making any changes.
   - Wait for user approval.
   - Spawn a subagent on the PR branch in an isolated worktree.
   - Instruct the subagent to read the review comments, apply the requested changes, test them, and commit locally. Prohibit `git push` — the orchestrator handles that.
   - Once the subagent finishes, push the updates: `git push origin <branch-name>` so the PR updates automatically.

5. **Report**
   - Provide a final, clear summary to the user.
   - List exactly which PRs were merged into master.
   - List exactly which PRs were updated by subagents and now require a new review.
