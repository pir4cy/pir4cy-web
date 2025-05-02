---
title: 'HTB: Lame'
date: '2019-03-25'
excerpt: 'Lame is an easy Linux machine, requiring only one exploit to obtain root access. It was the first machine published on Hack The Box and was often the first machine for new users prior to its retirement.'
readingTime: 1
tags: ['HTB', 'Writeup', 'HTB', 'Writeup', 'Easy', 'Linux', 'Pwn']
author: 'pir4cy'
coverImage: '/images/htb/covers/lame-cover.png'
---

# LAME

## Info

IP Address: 10.10.10.3  
OS: Linux  
Difficulty: Easy  

## System Enumeration

### NMAP

![Nmap](/images/htb/machines/Lame/nmap.png "NMAP")

We see that we have 4 open ports:  

  * 21 - FTP    
  * 22 - SSH  
  * 139 - Samba 3.X - 4.X  
  * 445 - Samba 3.0.20 - Debian  
  
#### FTP Exploit 

First thing that came to mind was logging in to the FTP, but that wasn't fruitful so I ended up searching for VSFTPD 2.3.4 and see if it had any possible vulnerabilities I could exploit and 
sure enough we had a backdoor exploit that could be used to get in.  
But it failed:

![FTP](/images/htb/machines/Lame/ftp.png "FTP")

So we move on to the other exploitable service I could see: `Samba`

#### Samba Exploit

A quick google of `Samba 3.0.20 - Debian` shows

![Google Search](/images/htb/machines/Lame/googlesamba.png "Google Result")

The first link directly gives us everything we need to pop this box

![Rapid7](/images/htb/machines/Lame/rapidpage.png "Rapid7")

## Exploit

A simple and straightforward exploit.  
  * set RHOST `10.10.10.3`
  * run
  
![Exploiting](/images/htb/machines/Lame/msfconsole.png "MSFConsole")

Finally, we obtain a root shell and hence our flags

![Pwnage](/images/htb/machines/Lame/owned.png "Owned")
