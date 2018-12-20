---
title: Cascadia.js Day One Notes
date: 2018-12-20T23:00:07.586Z
tags: javascript, cascadia, notes
category: notes
---

CascadiaJS was a single track conference of 24 amazing speakers discussing the cutting-edge of JavaScript, web development and engineering culture over the course of 2 days in mid November. These notes are from the first day of the event and the accompanying [talks are now online](https://www.youtube.com/playlist?list=PL37ZVnwpeshHipbzU5EyjRkem3U5OVWxm).

### Reclaiming the Web with peer-to-peer protocols

*Tara Vancil*

- Beaker browser is a p2p browser
- p2p.taravancil.com
- Does every computer need to store everyone’s data? Or does only my computer serve my profile?

### Augmenting the Internet with Browser Extensions

*Shannon Capper*

- From textio
- Cross platform api by w3c apparently
- Very good example of a presentation, nice slides, gifs, animations, “memes”, examples
- Don’t write site specific conditionals
- config object per site that lets you describe how a single site looks and gives a uniform api for the rest of your code base
- Don’t break the host page
- Be careful modifying the dom, could be especially bad for SPAs
- Use shadow dom to help with this???

### Hitchhiker's Guide to Web Standards

*Dominic Farolino*

- Tc39 and ecma standardizes only JavaScript the language
- W3c and WHATWG are the people who standardize the actual web APIs

### Why I chose to Modularize the Ducks in my React App

*Lauren Lee*

- Universal redux stores lets you move components anywhere in the application without breaking prop chains passing down state
- Demoed organizing your redux architecture by type (the common, standard way)
- Ducks is another way of organizing your code by redux module instead of file structure (group action, constants, and reducer for each pairing into a single file)

### Lessons in WebAssembly: Client Side Video Editing

*Megan Slater*

- Built client side “native” video recording/editing app for ChromeOS
- Not possible in Native JS, what language to use instead? Wasm?
- Can convert rust as well as c/c++ to wasm
- Why to use WASM? Performance, adding other functionality not present in web
- Emscripten is the buildtool for WASM that does c/c++ to wasm. Similar to Babel.
- Emconfigure is a cli tool that lets you substitute emscripten to replace standard C++ build pipelines so that we can create a wasm compiled c library
- Check emscripten website and other experts to build wasm libraries for you, we’ll probably just import wasm libs and wrap them in JS

### SPA at Scale

*Patrick Woo*

- AWS employee
- Applications need to consider how actual users will use the app, slow machines, old OS, slow network, etc
- Lighthouse chrome extension!
- Documentation is pivotal and hard!
- Used typescript to help with documentation, made code “self-documenting”
- Storybook functions as a single source of truth for the design team to work with the developers, rather than random files bouncing around
- Use tests! Confidence, faster onboarding, prevent regressions
- testingjavascript.com
- Monitors and alarms allow you to ensure production is working as intended (deployments, dependencies, other things you rely on outside of your tests)
- YAGNI - you ain’t gonna need it
- Get feedback early and often
> Be kind, rewind
- consider the people who are going to be following after you. Show empathy for the people you work with.

### Building a Culture of Learning and Growth

*Tre Ammatuna*

- Cultural learning - how groups of people pass info to each other faster than lone individuals
- Only 31% of employees only actually engaged in work, this number increases to 65% if people learn something same day
> What happens if we train them and they leave? What happens if we don’t and they stay?
- Lunch & Learns! Lightning talks! 3rd Party Talks! Learning Stipends! Libraries! Mentorship programs! Conferences! 20% time! Deep dive days!
- Consume > Build > Teach - Kent c Dodds

### Down the Rabbit Hole with WebVR

*Shannon Foster*

- AR art gallery demo
- WebXR is the thing now, not WebVR
- Lots of cool XR demos

### Creative Coding & Opening Up Open Source

*Elgin-Skye McLaren*

- Child computer interaction and tangible computing (computing and its relation to physical objects)
- Creative coding - arts-based and inclusive
> You don’t need to be an artist to be an artist.
- D3.js, three.js, p5.js
- P5.js Community statement - “everyone is welcome here”
- Friendly machine learning for the web website
- Very cool machine learning/p5 demo

### Creative Collaboration: Building a Universal Design System

*Julie Busch*

- Built a large system to support all brand sites of Condé Nast, but gave each individual brand site a configuration file on JSON
- How???
- JSON! Compiled JSON files of “style tokens” into SASS functions that dynamically build your css
- Atomic design!
- Had designers create a tokenized template instead of a single .psd. They’re the ones building all the brands anyway!
- Gave a single team access to the JSON files, and only let consumers use an API or SASS functions

### Open Source and the Volunteer Workforce

*Michale Lange*

- From CIVIC (Hack Oregon)
- Org Charts keep contributors organized
- Conways Law - anything your organization makes is a product of your org
- If you build it, they won’t come
- Hindsight bias makes popular projects seems like they’re destiny
- Recruiting!
- Ask what your community offers the members?
- Autonomy, mastery, and purpose
- Product management is for everyone
- Vanishing point as a product management goal, things nearby mist be clear and well defined, but what you see in the distance is small and hazy and might change
- Lower your expectations!
> Slow and steady is so much faster than not moving at all.
- Write the docs, docs are asynchronous and don’t block volunteers while they wait on you
- Be proactive with your Diversity and Inclusion
- Be open about your values
- Write rubrics for all assessments beforehand
- Have 1:1 meetings with people and listen
- This is ongoing work
- Apologize, reflect, and be better

### Secret Talk

*Yehuda Kats*

- In 2009 Specs are written for people who write specs, not for web developers using them.
- How to fix this? Try to give standards team a ton of feedback that web devs want more. 200+ more responses
- Among first web developers (who actually build websites) to join tc39 via being registered jquery non profit.
- Joined w3c technical architecture group
- Moved documentation of specs onto GitHub
- The extensible web manifesto - tighten feedback loop between standards writers and web developers
- Lots of developers from all sorts of parts of the ecosystem on tc39 now
- Chrome is now involving framework developers in intent to implement features in the browser
> We must enable web developers to build the future of the web.
