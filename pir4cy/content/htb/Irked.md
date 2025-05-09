---
title: 'HTB: Irked'
date: '2019-04-27'
excerpt: 'Irked is a pretty simple and straight-forward box which requires basic enumeration skills. It shows the need to scan all ports on machines and to investigate any out of the place binaries found while enumerating a system.'
readingTime: 1
tags: ['HTB', 'Writeup', 'HTB', 'Writeup', 'Easy', 'Linux']
author: 'pir4cy'
coverImage: '/images/htb/covers/irked-cover.png'
---

# IRKED
## Info

IP Address: 10.10.10.117  
OS: Linux  
Difficulty: Easy  

## System Enumeration

### NMAP

Using `nmap`, we check for open ports on the machine  
![Nmap](/images/htb/machines/Irked/nmap.png "nmap")

Noticing a common and old backdoor which can be exploited, I went directly for it.  

## Using the Metasploit

Looking up `UnrealIRCD`, we find an existing exploit in metasploit, which makes our work easier than it has to be.  

![Unreal Exploit Found](/images/htb/machines/Irked/unrealExploitFound.png "Unreal Exploit Found")

### Using the Exploit

![Unreal Exploit Config](/images/htb/machines/Irked/unrealExploitConfig.png "Unreal Exploit Config")

![Unreal Exploited](/images/htb/machines/Irked/unrealExploited.png "Unreal Exploited")

And we are in!   

But we don't have any user permissions, yet!  

So let's go for basic privilege escalation.  

## Privilege Escalation

Checking out system info using `uname -a` 

```
Linux irked 3.16.0-6-686-pae #1 SMP Debian 3.16.56-1+deb8u1 (2018-05-08) i686 GNU/Linux
```
Looking for SUID binaries using  
`find / -perm -4000 -type f 2>/dev/null`
![SUID](/images/htb/machines/Irked/suidfound.png "SUID found")
The `viewuser` binary seems to be different than usual, let's check it out.  
![view user](/images/htb/machines/Irked/viewUser.png "ViewUser")

It's just calling `/tmp/listusers`  

Checking the contents of `tmp`
![ls tmp](/images/htb/machines/Irked/lstmp.png "tmp/ ls")

Since there's no `listusers`, we can create one and use it to elevate our privileges.  
![list users](/images/htb/machines/Irked/listusers.png "List users")
![Permissions](/images/htb/machines/Irked/permissionlistuser.png "Permissions")

## Rooted

Finally, calling `viewuser`, we finally get root  

![Rooted](/images/htb/machines/Irked/rooted.png "Rooted")


