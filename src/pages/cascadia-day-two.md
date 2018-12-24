---
title: Cascadia.js Day Two Notes
date: 2018-12-24T05:59:00.484Z
tags: javascript, cascadia, notes
category: tldr
---

CascadiaJS was a single track conference of 24 amazing speakers discussing the cutting-edge of JavaScript, web development and engineering culture over the course of 2 days in mid November. These notes are from the second day of the event and the accompanying [talks are now online](https://www.youtube.com/playlist?list=PL37ZVnwpeshHipbzU5EyjRkem3U5OVWxm).

### Even Faster: now with Functions!

**Brian Leroux**

- #1 problem with serverless is that nobody cares

- Did a livecoding serverless project demo to show you why you care

- Used open source project called architect he works on

- Demonstrating .arc file as a configuration for a serverless app

- Cold start is less of a problem now if you have small lambda functions

- Build small functions across lots of lambdas. Your whole app doesn’t belong in a single lambda

- Only pay for what you use

- Better security model, sandboxed and torn down after every execution

- Focusing on business value, less time maintains infrastructure

- Faster to deploy

### Fostering the Next Generation of Developers

**Laker Sparks**

- Roblox, Lua based platform to teach young developers to build games

- Jumpstarted someone’s career (for the case study) because they started so young

- Incubators and accelerators for young people, but lacking real applied experience on their own

- Don’t force it

- Help them realize they don’t have to do it all, learn how to collaborate and get soft skills

- Not advertising for the best of the best, you’re asking more for a confident personality type than a skill set. Focus on a range of people instead. Drive & passion are important.

- Hour of code

- Roblox, creator challenge

### How Linters, Compilers & Other Cool Things Work

**Will Klein**

- First problem we run into: Code reviews. There’s room for improvement, tribal knowledge.

- Changing language features are also something you have to keep on top of to actually apply

- Dealing with api changes in external frameworks

- Compilers break stuff down into parsing, transformation and come generation

- Super tiny compiler by Jamie builds

- Abstract syntax tree is code representation, the DOM is a tree web devs use all the time

- ASTExplorer.net

- Writing an eslint rule for nested ternaries in astexplorer. Just a js function with a special reporting output.

- Write a Babel transform for variable declaration and assignment with same name shorthand

- Astsareawesome.com

- Use ASTs for code review!!! You can write your own custom eslint rules to do this!!!!

- Code modifications

- Build your own tools!

### Teaching the Sighted to Touch & Feel a Bit More

**Faddah Wolf**

- Demoed how unfriendly using a smart phone is when blind, open your phone and send a text with your eyes closed

- Universal design lab at psu, started a project to help family of visually impaired learn Braille

- Building a 6 input Braille keyboard that doesn’t break mobile app experiences

- Built a React Native 6 key input package on npm to offer a more seamless experience than what android and iOS offer

- Used multitouch to input complicated Braille characters. Demoed React Native gesture responder implementation

- Check out open source UEB (universal English Braille) package as an alternative to OS standard accessibility inputs

---

**Note:** progress bars on talks are very nice

---

### Conversational Semantics for the Web

**Aaron Gustafson**

- Lots of data is trapped in non semantic web pages that can’t be accessed via text or voice (virtual assistants and screen readers)

- Phrasing elements (inline elements) like `<em>` or `<strong>`. Covered a lot of semantic use cases

- Links. Id headings for anchor tags. Download keyword. Use semantic language, not click here.

- Organize the actual content in your web page

- Landmarks, ARIA tags

- Give elements a “role” attribute to describe what elements function as for assistive technologies

- 24 ways to impress your friends site

- Use other meaningful elements besides just a div

- Forms are often poorly executed on for accessibility. Use label elements. Use the right field types.

- These allow browsers to perform special inputs or validates for special fields. Perfect example of Progressive enhancement, and adaptive web design book

- Lots of cool specifier autocomplete tokens can be used in form input fields “shipping mobile tel” as an example

- Pattern attribute for creating your own validation logic in modern browsers

### Move over GUI, let's build a VUI with JavaScript!

**Memo Doring**

- VUI are a new important type of UI but they’re not here to replace other types of UI (like web, mobile, GUI)

- Ask-sdk is the Alexa api package

- To write a js Alexa skill, you work with a JSON representation of a voice command and then return it back to Alexa with JSON.

- Need multiple language models for different locales because languages work differently even if words are the same. Like UK trousers vs. US pants

- Map the literal language that is spoken to the “intent” behind the code. A bunch of “utterances” get mapped to a specific intent. This is used to train a ML model.

- Live code an Alexa cascadia.js intent

- Voice design tips

- Friction is the enemy! If it doesn’t pass the couch test, it’s not a good use case for voice

- We don’t talk the way we type, say it out loud before you think it’s good

- Follow the one breath rule, if it takes longer than a breath to say it’s going to be too much information. Talk to humans not at them.

- Variety is your friend. Add variables and change it up.

- Design for situation: utterance, situation, response, prompt. This can all change how we respond

- Flowcharts are bad for designing a voice conversation. It can go anywhere at all.

### Raiders of the Javascript-based Malware

**Pranshu bajpai**

- ransom ware - initial entry, encryption secret, file encryption, and then a ransom demand

- RAA ransomware is the first entirely JavaScript written

- Specific indicators of compromise, you can detect network requests and file system changes caused by the library

- Takes advantage of the windows script executor

- Cryptojacking - use of infected computer to mine cryptocurrencies

- It’s very observable right now because they use all of a systems resources, but they’re getting smarter and using more discrete tactics

- Better ways to detect malicious websites? How to protect users? How to keep ahead of attackers? What other services could attacker’s exploit besides WScript?

### N-API - The New Native in Node.js

**Atishay Jain**

- Interacting with native code (c++) from inside of node.js

- Why write Native code? You can talk directly to the OS. You can also use existing c++ libraries. You can also improve performance.

- Child process

- Foreign function injection, lets you inject C external functions directly into JavaScript. Helpful, but can still be slow.

- Native abstractions for node, a wrapper over v8 internals so that a native app can interact with JS

- N-API, stable with node 10, backwards and forward compatible, designed to work well with js and cpp.

- Demo app of integrating imagemagick within a node app, and easy to load in electron as well

- Tips and tricks, don’t write native code!

### Let's Talk About Mentoring

**Glenn Block**

- A mentor is a person volunteering to help others be successful, and have more experience than you do in an area

- Mentor types, role focused, is a mentor who helps you do your job better

- Career/growth focused mentor can help you figure out your career path and find good opportunities from a different vantage point

- Skill specific mentor, teach you one specific skill (like pricing)

- What makes a good mentor? They’re more experienced than you. You feel comfortable talking to them. You trust them. They’re a good listener. They’re consistent and available.

- A mentors job is not to solve your problems, but to give you advice to help you work through it yourself

- Finding a mentor. Company programs. Friends or coworkers.

### Observing Node.js

**James Snell**

- How can you tell how all the different ways of scheduling async task execute?

- Four things you need to answer: The event loop, the next tick queue, the micro task queue, JavaScript is not asynchronous (you can schedule it async, but it’s not fun async).

- Event loop executes one task at a time

- First rule of node.js performance is to know when all of your functions are running.

- Trace events! Node outputs JSON events whenever significant events happen inside of node (like what async thing is happening right now). Async hooks api facilitates this.

- Chrome://tracing - it can parse the trace event file and builds a timeline of your node process

- Clinic.js - helps diagnose problems in your node apps

### How to be a Web AV Artist

**Ruth John**

- Audio visual artist, build visualizations to accompany provided sound files

- Web audio api allows you to process audio file data

- Interact with css transforms or dom or svg manipulation

- D3.js - data driven documents

- Canvas visualizations in 2d/3d

- Web MIDI API - its a data protocol describing digital instruments, not just bleeps sounds

- Can use a midi controller pad to ad additional functionality as an input. Different than a keyboard...?

### The Future of the Web

**Mikeal Rogers**

- The web is built on the network effects of links.

- URL parts: transport, authority, content. What do I want (index.html), who do I ask for it (domain), how do I get it (protocol)?

- Data centralization is built into the way the web functions today

- Because of this developers have to gain attention as much as possible to support data infrastructure via ads

- In a decentralized system, you need a way to address data without specifying the owner. This uses a cryptographic hash.

- A CID is a content identifier (the hash of a document) a pointer that spans the internet

- This content addressability issue allows truly decentralized data. No one piece of data can compete with the type of data twitter or Facebook has. However large data aggregators can’t compete with all of the info in a decentralized data network