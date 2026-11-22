
RV2001DRCA

# Day 1
What the hell
Performed an nmap on my network and found 2 strange IPs
![[Pasted image 20260121202539.png]]
![[Pasted image 20260121202707.png]]

Investigating both of them, starting with 10.0.0.98

## 10.0.0.98

Port 80 - "Test"
![[Pasted image 20260121202917.png]]
nothing here? looks like there might be some potential tests for traversing, but nothing off the top

Port 443

Well this is interesting, as soon as I loaded this page for the first time, my Shark Roomba started up. Why is my roomba hosting a web page...
![[Pasted image 20260121203344.png]]

This is basically a web control panel, okay so I'm assuming this is here for the app to connect to? 
But it also contains info about device firmware, debug logs, would be interesting to look through

Connect RobArtN
![[Pasted image 20260121204350.png]]

maybe this is how the robot connects to the app? 

Port 8080
![[Pasted image 20260121205459.png]]
File upload?
![[Pasted image 20260121205831.png]]

There's direct control mode in here too, what 

okay so each "tab" is just an iframe loading other html pages

something tells me there should be some sort of lfi in there or something but still doesn't give ssh access.

If you're gonna keep ssh open, at least let your users know? who is this ssh for 

# Day 2

some things to continue working on from last night
- What's RobArtN? 
- How am I able to connect to this device outside of my network? 
- How do I get ssh access?

A new point came up when showing this to my fiance - there's bluetooth pairing? 
- Can i pair with any device? And then what?

Let's start with opening up the android app. Why isn't there a cli app to just download the apk?

> Found a tool! Downloaded the apk using a neat tool - https://github.com/EFForg/apkkeep


Using this cheat sheet: https://github.com/ivan-sincek/android-penetration-testing-cheat-sheet?tab=readme-ov-file#pull-an-apk-baseapk 

Decoding the apk using Apktool
> it was an xapk file which had multiple other apk files in an "unknown" folder

allows cleartext traffic 
![[Pasted image 20260122222315.png]]

taskaffinity is blank - taskjacking? 
![[Pasted image 20260122222632.png]]

exported="true"
![[Pasted image 20260122222712.png]]

# Day 3

manifest.json is an interesting file, with permissions and configs

the hosts that we pulled from url schemes are also interesting
![[Pasted image 20260125210241.png]]

jadx was a good tool to review android files so we'll do that

from androidmanifest.xml
![[Pasted image 20260125214647.png]]