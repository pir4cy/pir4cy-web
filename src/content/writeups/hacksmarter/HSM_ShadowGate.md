---
title: 'HackSmarter: ShadowGate'
date: 'YYYY-MM-DD'
excerpt: 'A short summary of the machine, the primary objective, and the overall attack path used to compromise the environment.'
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Windows
  - Active Directory
  - Medium
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hsm-shadowgate-cover.png
draft: true
---

# ShadowGate

## Info
- IP: [IP Address]
- OS: [Windows / Linux]
- Difficulty: [Easy / Medium / Hard]

## Initial Reconnaissance

### NMAP

![Nmap Scan](/images/writeups/machines/hacksmarter/HSM_ShadowGate/nxc-user-list.png "NMAP")

### Domain / AD Enumeration

Perform a quick review of SMB and LDAP exposure to identify users, service accounts, and trust relationships.

![User Enumeration](/images/writeups/machines/hacksmarter/HSM_ShadowGate/nxc-user-list.png "User Enumeration")

## Enumeration

### AS-REP Roast / Kerberos Abuse

This machine is a good example of how a weak account choice or Kerberos misconfiguration can quickly turn into a workable attack path.

![AS-REP Roast](/images/writeups/machines/hacksmarter/HSM_ShadowGate/hashcat-out-asreproast.png "AS-REP Roast")

```bash
# Example commands
nxc ldap [target] -u [user] -p [pass] --asreproast asreproast.txt
hashcat -m 18200 asreproast.txt /usr/share/wordlists/rockyou.txt
```

### BloodHound / Path Abuse

Once credentials are recovered, map the environment to identify the shortest path to high-value targets.

![BloodHound](/images/writeups/machines/hacksmarter/HSM_ShadowGate/bloodhound-abuse-path.png "BloodHound")

## Foothold

After discovering valid credentials or a vulnerable account, the next step is to access the victim host or service and continue pivoting.

![Initial Access](/images/writeups/machines/hacksmarter/HSM_ShadowGate/certipy-bbrown-vulnerable.png "Initial Access")

## Privilege Escalation

### [PrivEsc Method]

Describe the vulnerable binary, delegation flaw, or credential reuse that led to elevated privileges.

![Privilege Escalation](/images/writeups/machines/hacksmarter/HSM_ShadowGate/shadow-credential-attack-2.png "Privilege Escalation")

```bash
# Commands used for escalation
```

## Final Access

Confirm the compromise and grab the final flags.

![Rooted](/images/writeups/machines/hacksmarter/HSM_ShadowGate/secrets-dump-krbtgt-found.png "Rooted")

## Summary

This challenge centered on AD abuse, Kerberos weaknesses, and the importance of validated trust paths. It demonstrates how a seemingly minor misconfiguration can be chained into full domain takeover.

## Flags

- User: [user.txt content]
- Root: [root.txt content]
