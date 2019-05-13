---
title: When was this file added to version control?
date: 2019-05-11
tags: git, version, source, control, file, added, date, time
category: til
---

Git provides a lot of information to you about the history of your project. Much of this information can be accessed using `git log`.

By default, running `git log` will show you all the most recent commits on your branch in reverse chronological order. Meaning, the most recent commits show up first.

There are a lot of useful options you can use to adjust how `git log` functions though.

## Filter Commits

`--diff-filter` option allows you to filter the results of your git log command's output. There are a lot of different options for how to filter. The 3 most useful (in my non-expert opinion) are:

- `A` - Added
- `D` - Deleted
- `M` - Modified

These will filter out all commits that do not have a file added, deleted, or modified.

```bash
git log --diff-filter=A
```

## Get File Names Changed

`--name-only` will print all files involved in a given commit in addition to the original commit message.

```bash
git log --diff-filter=A --name-only
```

## Target a Specific Directory

Git commands generally let you pass a trailing `-- <path>` option to narrow down the files you wish to target. `git log` is no different.

```bash
git log --diff-filter=A --name-only -- target/directory
```

## Remove Commit Body

If you've got a lot of commits to search through, you might not need to see all of the commit messages in your git history. You can use the option `--pretty=oneline` flag to only show the commit hash and title of your commits instead. Pretty has many options and you can get even more complex, custom formatting with the `--format` flag.

```bash
git log --diff-filter=A --name-only --pretty=oneline -- target/directory
```

Our final command will search `target/directory` for when all files were added to the git repository. These will be sorted with the most recently added files first.

## References

[https://git-scm.com/docs/git-log](https://git-scm.com/docs/git-log)

[https://stackoverflow.com/questions/40837225/how-to-get-git-log-without-the-commit-message](https://stackoverflow.com/questions/40837225/how-to-get-git-log-without-the-commit-message)

[https://stackoverflow.com/questions/1230084/how-to-have-git-log-show-filenames-like-svn-log-v](https://stackoverflow.com/questions/1230084/how-to-have-git-log-show-filenames-like-svn-log-v)
