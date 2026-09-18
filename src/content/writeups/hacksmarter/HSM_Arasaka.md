---
title: 'HackSmarter: Arasaka'
date: 'YYYY-MM-DD'
excerpt: 'A brief overview of the challenge, the objective, and the key weaknesses or attack paths you exploited.'
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Windows
  - Active Directory
  - Medium
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hsm-arasaka-cover.png
draft: true
---

# Arasaka

## Info
- IP: [IP Address]
- OS: [Windows / Linux]
- Difficulty: [Easy / Medium / Hard]

## Initial Reconnaissance

### NMAP

![Nmap Scan](/images/writeups/machines/hacksmarter/HSM_Arasaka/nmap.png "NMAP")

### SMB / LDAP Enumeration

We begin by checking for exposed services and user-related information.

![SMB Shares](/images/writeups/machines/hacksmarter/HSM_Arasaka/nxc-smb-shares.png "SMB Shares")

## Enumeration

### User Discovery

Reviewing accessible directories and LDAP data can expose valid users and service identities.

![LDAP Enumeration](/images/writeups/machines/hacksmarter/HSM_Arasaka/nxc-ldap-kerberoast.png "LDAP Enumeration")

### Kerberoasting / Credential Abuse

This phase focuses on cracking service account tickets or identifying reusable credentials.

![Kerberoast](/images/writeups/machines/hacksmarter/HSM_Arasaka/soulkiller_svc_targeted_krbroast.png "Kerberoast")

```bash
# Example commands
nxc ldap [target] -u [user] -p [pass] --kerberoasting kerberoast.txt
hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt
```

## Foothold

Once a valid credential has been recovered, authenticate to the target and continue enumerating for privilege escalation paths.

![Credential Access](/images/writeups/machines/hacksmarter/HSM_Arasaka/hashcat-krb-cracked.png "Credential Access")

## Privilege Escalation

### [PrivEsc Method]

Describe the vulnerable service, misconfiguration, or abuse path used to move laterally or escalate privileges.

![Privilege Escalation](/images/writeups/machines/hacksmarter/HSM_Arasaka/yorinobu-krb-crack-fail.png "Privilege Escalation")

```bash
# Commands used for escalation
```

## Final Access

After obtaining higher privileges, confirm ownership of the system and collect the final artifacts.

![Rooted](/images/writeups/machines/hacksmarter/HSM_Arasaka/root-via-emperor.png "Rooted")

## Summary

This machine reinforced the value of enumerating LDAP, cracking service tickets, and understanding the environment's trust relationships. The primary learning point was how small misconfigurations can compound into a full domain compromise.

## Flags

- User: [user.txt content]
- Root: [root.txt content]
