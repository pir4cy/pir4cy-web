---
title: "HTB: Puppy"
date: 2025-10-24
excerpt: Puppy is a Windows machine that simulates a real life pentest scenario. Credentials are provided.
readingTime: 10
tags:
  - HTB
  - Writeup
  - Medium
  - Windows
  - bloodhound
  - bloodyAD
  - impacket
  - evil-winrm
  - winrm
  - smb
  - dpapi
  - credentials
author: pir4cy
coverImage: /images/writeups/covers/puppy-cover.png
draft: false
---

# Puppy

> **TL;DR:**
> 
> - Start with provided credentials (`levi.james:KingofAkron2025!`) and enumerate with nmap, netexec, and BloodHound.
> - Abuse `GenericWrite` on Developers group to access DEV share and extract a KeePass database.
> - Crack KeePass DB with keepass4brute to get new credentials (`ant.edwards:Antman2025!`).
> - Use new creds to gain `GenericAll` on `adam.silver`, reset password, and enable account with bloodyAD.
> - Use Evil-WinRM for shell as `adam.silver`, find backup files, and extract more credentials (`steph.cooper:ChefSteph2025!`).
> - Dump DPAPI master key and credential blob, then decrypt with impacket-dpapi and HackTricks guidance to get admin creds.
> - Use admin creds to grab the root flag. 
> 
> **Conclusion:**
> This box was a realistic and layered Windows pentest scenario, requiring a variety of tools and techniques. Enumeration, privilege escalation, and credential extraction were all key. The box was straightforward but challenging, and provided a great learning experience. Rating: 4.9/5.
