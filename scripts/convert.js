const { promisify } = require('util');
const fs = require('fs');
const { exec } = require('child_process');

const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const pexec = promisify(exec);

function grabTitle(data) {
  const title = data.match(/# (.*)\n/);

  return title && title[1];
}

function grabTags(data) {
  const tags = data.match(/## tags\n(.*)\n/);

  return tags && tags[1].replace(/#/g, '').split(' ');
}

function grabBody(data) {
  // const body = data.match(/## tags\n.*\n\n([\s\S]*)/);
  const body = data.match(/# .*\n([\s\S]*)/);

  return body && body[1];
}

function grabDate(data) {
  const date = data.match(/Date:   (.*)\n/);

  return date && new Date(date[1]).toISOString();
}

function buildFrontmatter(title, date, tags) {
  return `---
title: ${title}
date: ${date}
---`;
}

// tags: ${tags.filter((tag) => tag !== '').join(', ')}

// const inDir = '../../til';
const inDir = '../../tldr';
const exceptions = ['.git', 'TODO.md', 'README.md', 'TEMPLATE.md', 'assets'];

async function convert() {
  const files = await readDir(inDir);
  const filesWithoutExceptions = files.filter((file) => !exceptions.includes(file));

  const filePromises = filesWithoutExceptions.map((file) => readFile(`${inDir}/${file}`));

  const commitPromises = filesWithoutExceptions.map((file) =>
    pexec(`git log --diff-filter=A -- ${file}`, { cwd: inDir }),
  );

  Promise.all(filePromises)
    .then((markdownFiles) => {
      const titles = markdownFiles.map((file) => grabTitle(file.toString()));
      // const tags = markdownFiles.map((file) => grabTags(file.toString()));
      const bodies = markdownFiles.map((file) => grabBody(file.toString()));

      Promise.all(commitPromises)
        .then((commits) => {
          const dates = commits.map(({ stdout }) => grabDate(stdout));
          const frontmatters = titles.map(
            (title, index) => buildFrontmatter(title, dates[index]), // tags[index]),
          );
          const newFiles = frontmatters.map(
            (frontmatter, index) => `${frontmatter}\n\n${bodies[index]}`,
          );
          const writeFiles = filesWithoutExceptions.map((file, index) =>
            writeFile(`temp/${file}`, newFiles[index]),
          );
          Promise.all(writeFiles)
            .then(console.log('All files converted!'))
            .catch(console.error);
        })
        .catch(console.error);
    })
    .catch(console.error);
}

convert();
