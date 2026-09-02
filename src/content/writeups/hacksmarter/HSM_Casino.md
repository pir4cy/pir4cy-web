---
title: 'HackSmarter: Casino'
date: 2026-09-02
excerpt: Las Vegas is gearing up for a massive cybersecurity conference, and you've been hired to conduct a penetration test against one of the casinos. The client - Hack Smarter World - is a luxury resort where many of the attendees will be staying. Your objective is to identify all vulnerabilities and elevate your privileges to root (if possible).
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Linux
  - Web
  - Medium
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter-casino-cover.png
draft: false
---

# Casino

## Objective

Las Vegas is gearing up for a massive cybersecurity conference, and you've been hired to conduct a penetration test against one of the casinos. The client - Hack Smarter World - is a luxury resort where many of the attendees will be staying. Your objective is to identify all vulnerabilities and elevate your privileges to root (if possible).

## Initial Access

You have been provided the IP of the Wifi Captive Portal... but no other information.

## Recon

We just have the IP Address of the WiFi Captive Portal. Let's run a quick nmap scan to identify open ports and services:

```
nmap -T4 -A 10.0.23.114 -p- -oA casino  
```


![HackSmarter Nmap](/images/writeups/machines/HackSmarter%20-%20Casino/nmap.png "Nmap")

Nothing much of note, however we did find out that the web portal is a Python server.

```
80/tcp   open  http    Werkzeug httpd 3.1.8 (Python 3.10.18)
```
