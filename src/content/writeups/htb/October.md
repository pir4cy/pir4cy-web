---
title: 'HTB: October'
date: '2019-03-27'
excerpt: 'October is a fairly easy machine to gain an initial foothold on, however it presents a fair challenge for users who have never worked with NX/DEP or ASLR while exploiting buffer overflows.'
readingTime: 3
tags: ['HTB', 'Writeup', 'Medium', 'Linux', 'Web', 'Pwn']
author: 'pir4cy'
coverImage: '/images/writeups/covers/october-cover.png'
---

# October

## Info
  * IP : 10.10.10.16
  * OS : Linux
  * Difficulty: Medium

## System Enumeration
 
### Nmap

![Nmap](/images/writeups/machines/October/nmap.png "Nmap")

### Dirbuster

![Dirbuster](/images/writeups/machines/October/dirbuster.png "Dirbuster")

### WebPortal

![Web Portal](/images/writeups/machines/October/webportal.png "Vanilla CMS")

#### Backend

![Web Backend](/images/writeups/machines/October/backend.png "October Backend")


## Exploitation
 
Trying the default user and password, i.e, `admin` and `admin`, we manage to get in and see that there is a media tab.  
This opens up the possibility of a reverse shell upload.  
Since the already uploaded file is in php5, I renamed my shell from php to php5, just to ensure that I'll be successful in uploading a shell.  

![PHP Uploaded](/images/writeups/machines/October/uploadphp.png "PHP Shell")

We create a netcat listener on our local machine using `nc -lvnp 1234`.  
Click on the uploaded file and view it.  

And voila! We have a shell.

### User Exposed

Simple enumeration let's us find `user.txt` and read it even though we are `www-data`.

![User Exposed](/images/writeups/machines/October/userExposed.png "Exposed User")

## Privilege Escalation

Now, to obtain `root.txt`, we need to escalate our privileges to root.  

As a first step, I always use `find / -perm -4000 -type f 2>/dev/null` to find SUID binaries and luckily enough, we find `/usr/local/bin/ovrflw`.  
Running `ovrflw` tells us that it needs an input string.  
This can be exploited using a Ret2Lib Attack.  

To debug further, I downloaded the binary to my local machine using base64 conversions.  
  1. On host machine, base64 /usr/local/bin/ovrflw  
  2. Copy the output and store it in a file on your machine  
  3. Use `base64 -d <localfile.b64> > ovrflw`  
  4. chmod +x ovrflw  
  5. gdb ovrflw  

Using `pattern_create 200`, we create a unique pattern of 200 characters and pass it to ovrflw as argument  

![Segmentation Fault](/images/writeups/machines/October/segfault.png "Seg Fault")  

And we are root:

![Pwnage](/images/writeups/machines/October/owned.png "Rooted")
