---
title: 'HackSmarter: ShareThePain'
date: 'YYYY-MM-DD'
excerpt: 'An overview of the compromise chain, including the initial foothold, lateral movement, and the final privilege escalation path.'
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Windows
  - SQL
  - Medium
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hsm-sharethepain-cover.png
draft: true
---

# ShareThePain

## Info
- IP: [IP Address]
- OS: [Windows / Linux]
- Difficulty: [Easy / Medium / Hard]

## Initial Reconnaissance

### NMAP

![Nmap Scan](/images/writeups/machines/hacksmarter/HSM_ShareThePain/nxc-null-smb-shares.png "NMAP")

### SMB Enumeration

Look for anonymous or guest services before moving into exploitation.

![SMB Shares](/images/writeups/machines/hacksmarter/HSM_ShareThePain/nxc-null-smb-shares.png "SMB Shares")

## Enumeration

### Service Discovery

This stage focuses on identifying relevant internal services, ports, and user names.

![Service Enumeration](/images/writeups/machines/hacksmarter/HSM_ShareThePain/internal-mssql-port.png "Service Enumeration")

### Lateral Movement / Access to Internal Services

Once a foothold has been gained, examine other exposed services and credentials for pivoting paths.

![Lateral Movement](/images/writeups/machines/hacksmarter/HSM_ShareThePain/alice-user-found.png "Lateral Movement")

## Foothold

The initial compromise often comes from a misconfigured service, an exposed share, or a weak credential.

![Initial Access](/images/writeups/machines/hacksmarter/HSM_ShareThePain/alice-mssql-revshell.png "Initial Access")

## Privilege Escalation

### [PrivEsc Method]

Describe the misconfigured service, token abuse, or binary exploitation used to escalate to a higher privilege context.

![Privilege Escalation](/images/writeups/machines/hacksmarter/HSM_ShareThePain/efspotato-privesc-alice.png "Privilege Escalation")

```bash
# Example privilege escalation commands
```

## Persistence / Final Access

After compromising the target, use the system to reach the intended outcome and capture the final flags.

![Rooted](/images/writeups/machines/hacksmarter/HSM_ShareThePain/upload-ligolo-run-agent.png "Rooted")

## Summary

This machine demonstrates how a simple service misconfiguration and weak authentication patterns can snowball into a broader internal compromise. It is also a good reminder to review both lateral movement and privilege escalation vectors together.

## Flags

- User: [user.txt content]
- Root: [root.txt content]
