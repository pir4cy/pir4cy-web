---
title: 'HackSmarter: Welcome'
date: '2026-09-14'
excerpt: 'A short overview of the challenge, the initial foothold, and the exploitation path leading to complete domain compromise.'
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Windows
  - Active Directory
  - Medium
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hsm-welcome-cover.png
draft: true
---

# Welcome

## Objective / Scope

You are a member of the Hack Smarter Red Team. During a phishing engagement, you were able to retrieve credentials for the client's Active Directory environment. Use these credentials to enumerate the environment, elevate your privileges, and demonstrate impact for the client.

## Starting Credentials

```
e.hills:Il0vemyj0b2025!
```

## Enumeration

### NMAP

![Nmap Scan](/images/writeups/machines/hacksmarter/HSM_Welcome/password-from-start-guide.png "NMAP")

### SMB Enumeration

Begin with domain and share enumeration to discover available services and user data.

![SMB Enumeration](/images/writeups/machines/hacksmarter/HSM_Welcome/nxc-ehills-smb-shares.png "SMB Enumeration")

![Files from HR](/images/writeups/machines/hacksmarter/HSM_Welcome/smbclient-download-hr-files.png "Files from HR Share")

### Bloodhound

Let's also run bloodhound since we can authenticate to LDAP.

![Bloodhound Enum](/images/writeups/machines/hacksmarter/HSM_Welcome/nxc-ehills-bloodhound.png "Bloodhound Enum")

## Foothold

- from one of the files retrieved above, we find a default password for all users.

![Password Discovery](/images/writeups/machines/hacksmarter/HSM_Welcome/password-from-start-guide.png "Password Discovery")

Let's test the password against all users

![Password Spray](/images/writeups/machines/hacksmarter/HSM_Welcome/a-harris-default-password.png "Password-Spray")

- `a.harris` is using the default password. 

## Lateral Movement - i.park

a.harris has GenericAll permissions for `i.park` via the HR group.

![a.harris -> i.park](/images/writeups/machines/hacksmarter/HSM_Welcome/harris-bloodhound-genericAll-ipark.png "A.Harris GenericAll I.Park")


### Certificate / ADCS Abuse

The exploitation flow may involve vulnerable cert templates, ESC attacks, or related ADCS weaknesses.

![ADCS Vulnerability](/images/writeups/machines/hacksmarter/HSM_Welcome/adcs-vuln-confirmed.png "ADCS Vulnerability")

```bash
# Example commands
certipy req -debug -target [dc] -u [user] -p [pass] -template [template]
```