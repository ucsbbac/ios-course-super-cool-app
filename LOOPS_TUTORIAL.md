# Loops Tutorial

Two related skills, both about repeating work automatically:

1. **Swift loops** — repeating code inside the app itself (`Tutorials/LoopsTutorial.swift`).
2. **Claude Code's `/loop`** — repeating a *prompt or command* on a schedule, so Claude
   handles a recurring daily task for you (checking CI, summarizing new commits, etc.).

Work through Part 1, then Part 2. Both are meant to be run, not just read.

## Part 1 — Swift loops for building apps

The runnable examples live in [`Tutorials/LoopsTutorial.swift`](Tutorials/LoopsTutorial.swift):
9 short, independent functions, each printing its own output.

| # | Construct | App-relevant use case |
|---|-----------|------------------------|
| 1 | `for i in 0..<n` | Paging through onboarding screens |
| 2 | `for x in array` | Checking a list of feature flags |
| 3 | `for x in array where …` | Flagging large downloads while iterating |
| 4 | `while` | Retrying a flaky network call |
| 5 | `repeat-while` | Validating a field at least once before checking the condition |
| 6 | `break` / `continue` / labeled loops | Scanning a 2D game board and stopping early |
| 7 | `.forEach` | Uploading a batch of files |
| 8 | `.map` / `.filter` / `.reduce` | Transforming and summarizing user records |
| 9 | Task-list loop | A tiny "daily task runner" — the bridge into Part 2 |

### Run it

Pick whichever you have available:

- **Xcode Playground** (easiest, no setup): File → New → Playground → macOS → Blank,
  then paste the contents of `LoopsTutorial.swift` in and watch results in the sidebar.
- **Command line** (macOS with Xcode Command Line Tools installed):
  ```bash
  swift Tutorials/LoopsTutorial.swift
  ```
- **In the app itself**: `SupperCool/ViewController.swift`'s `makeMeNotSoUncool` action
  is a one-line example of imperative UI code. Try replacing it with a loop, e.g. hide
  a whole array of views in one pass:
  ```swift
  @IBAction func makeMeNotSoUncool(sender: AnyObject) {
      let viewsToReveal = [coolLogo, coolBg]
      for view in viewsToReveal {
          view?.hidden = false
      }
      uncoolButton.hidden = true
  }
  ```

Once you've run it and seen the printed output match the table above, you've proven
the examples work — safe to copy into your own project or share the file as-is.

## Part 2 — Claude's `/loop` for daily tasks

`/loop` runs a prompt or slash command repeatedly on an interval, instead of once.
Use it for recurring checks, not one-off requests.

### Syntax

```
/loop <interval> <prompt or /slash-command>
/loop <prompt or /slash-command>     (interval defaults to 10 minutes)
```

Examples:

```
/loop 30m "Check origin/master for new commits since last time and summarize them."
/loop 1h /code-review
/loop 15m "Run the test suite and report any failures."
```

Claude re-schedules its own next wake-up after each run, so the loop keeps going
in the background — you don't have to keep the session open and watching.

### Prove it works first (do this before pointing it at anything real)

Run a harmless loop for a few cycles so you can see the mechanism fire before
trusting it with something important:

```
/loop 5m "Reply with the current time and confirm you're still running."
```

Watch it fire 2-3 times, then stop it by saying "stop the loop" (or `/loop` has no
separate stop subcommand — just tell Claude to end it). Once you've seen it behave,
you know the pattern is safe to reuse.

### Realistic daily tasks for this repo

- `/loop 1h "Check if CI is passing on the current branch; if it's red, summarize why."`
- `/loop 30m "Check for new review comments on the open PR and list any that need a reply."`
- `/loop 1440m "Write a one-paragraph daily summary of what changed on this branch."` (daily, since 1440m = 24h; the max wakeup delay is 1 hour, so for anything longer than an hour a scheduled Routine is a better fit than `/loop` — ask Claude to set one up with `create_trigger`.)

### Sharing

Once you've verified both parts locally (Swift examples printing the right output,
and `/loop` firing on schedule), this file plus `Tutorials/LoopsTutorial.swift` are
plain, self-contained artifacts — commit and share the branch/PR with others as-is.
