---
title: 'HackSmarter: Welcome'
date: 'YYYY-MM-DD'
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

## Info
- IP: [IP Address]
- OS: [Windows / Linux]
- Difficulty: [Easy / Medium / Hard]

## Initial Reconnaissance

### NMAP

![Nmap Scan](/images/writeups/machines/hacksmarter/HSM_Welcome/password-from-start-guide.png "NMAP")

### SMB / AD Enumeration

Begin with domain and share enumeration to discover available services and user data.

![SMB Enumeration](/images/writeups/machines/hacksmarter/HSM_Welcome/smbclient-download-hr-files.png "SMB Enumeration")

## Enumeration

### Credential Discovery

This zone often contains files, scripts, or user data that can reveal initial logins and support staff identities.

![Password Discovery](/images/writeups/machines/hacksmarter/HSM_Welcome/password-from-start-guide.png "Password Discovery")

### Certificate / ADCS Abuse

The exploitation flow may involve vulnerable cert templates, ESC attacks, or related ADCS weaknesses.

![ADCS Vulnerability](/images/writeups/machines/hacksmarter/HSM_Welcome/adcs-vuln-confirmed.png "ADCS Vulnerability")

```bash
# Example commands
certipy req -debug -target [dc] -u [user] -p [pass] -template [template]
```

## Foothold

After gathering the right credentials or certificate data, authenticate and continue the compromise path.

![Initial Access](/images/writeups/machines/hacksmarter/HSM_Welcome/req-auth-pwn-Admin.png "Initial Access")

## Privilege Escalation

### [PrivEsc Method]

Describe the privilege escalation method that moved the compromise from a standard user to a highly privileged role.

![Privilege Escalation](/images/writeups/machines/hacksmarter/HSM_Welcome/pw-change-svc-ca-&-adcs-check.png "Privilege Escalation")

```bash
# Commands used for escalation
```

## Final Access

Once the environment is fully compromised, verify admin access and collect flags.

![Rooted](/images/writeups/machines/hacksmarter/HSM_Welcome/rooted.png "Rooted")

## Summary

This machine illustrates the value of combining AD enumeration, certificate abuse, and privilege escalation. The key lesson is that once trust relationships and control points are exposed, full compromise can happen faster than expected.

## Flags

- User: [user.txt content]
- Root: [root.txt content]
