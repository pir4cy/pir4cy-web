---
title: 'HTB: Teacher'
date: '2019-04-22'
excerpt: 'Teacher is a medium difficulty machine, which teaches techniques for identifying and exploiting logical flaws and vulnerabilities of outdated modules within popular CMS (in this instance Moodle), enumeration of sensitive information within the backend database and leverage misconfigurations on the operating system, which lead to a complete compromise of a system.'
readingTime: 3
tags: ['HTB', 'Writeup', 'Easy', 'Medium', 'Linux', 'Web']
author: 'pir4cy'
coverImage: '/images/writeups/covers/teacher-cover.png'
---

# TEACHER
## Info

IP Address: 10.10.10.153  
OS: Linux  
Difficulty: Easy/Medium  

## System Enumeration

### NMAP
Using `nmap`, we check for open ports to access  
![Nmap](/images/writeups/machines/Teacher/nmap.png "nmap")

Only `Port 80` is up.

### Dirbuster
To enumerate the website we use, `dirbuster`  
![Dirbuster](/images/writeups/machines/Teacher/dirbuster.png "dirbuster")

### Website

![Website Front](/images/writeups/machines/Teacher/websitefront.png "Website")
