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
  - evil-winrm
  - writeowner
  - certipy
  - certificate-templates
author: pir4cy
coverImage: /images/writeups/covers/escapetwo-cover.png
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
![Attack Path](/images/writeups/machines/EscapeTwo/attack-path.png)

> **Conclusion:**
> This box demonstrates a realistic attack chain involving credential discovery, Active Directory permission abuse, and certificate template exploitation. It showcases important security weaknesses in certificate templates that are often overlooked. 
