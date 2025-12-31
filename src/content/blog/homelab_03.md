---
title: "Homelab #3 - Global Access and 3rd party VPN"
date: 2025-12-31
excerpt: With your lab setup, let's get remote access and VPN solutions set up as well. Once setup, we will have access to our internal network from anywhere in the world.
tags:
  - Cybersecurity
  - Tech
  - selfhost
  - homelab
  - vpn
  - remote-access
author: pir4cy
coverImage: /images/blog/remote-access-vpn-cover.png
draft: false
---
This is a smaller post that I could not fit in my networking setup. Remote Access and In this post, we will be focusing on setting up remote and VPN access at the firewall level. 

## Remote Access - Personal VPN?
In my opinion, having remote access you can leave your lab running at home and connect to it from anywhere in the world as long as you are able to connect to the personal VPN created at the firewall level.

At our current point, this will allow us to do the following:
1. Global ad block for all your end devices, as long as they're connected to the VPN.
2. Allow playing around with homelab from anywhere in the world (as long as you don't mess up any firewall rules)
3. Essentially creates your personal VPN server that connects you to the internet "from home".
#### Okay sold! How do we set it up?
Perfect! Now, there are 3 common ways to go about setting this up: 
1. Wireguard (Locally hosted, best one to setup)
2. Tailscale (Easiest to setup, third-party)
3. Headscale (Locally hosted version of Tailscale)

I have been using Tailscale for various things at this point, and I like the service. The setup is quite simple as well.

1. Install Tailscale package on pfSense. System > Package Manager > Available Packages
2. Go to Tailscale, create an account and generate an Auth key from Settings. Disable the expiry on this if you want it to be always connected.
![tailscale auth key](/images/blog/tailscale-auth-key.png)
3. With the auth key, you should now be able to connect your firewall to Tailscale.
![pfsense tailscale auth](/images/blog/pfsense-tailscale-auth.png)
4. From your pfSense settings, ensure that you have enabled advertising for your local network, like so.
![pfsense tailscale settings](/images/blog/pfsense-tailscale-settings.png)
5. Once the device shows up in your Tailscale portal, make sure to enable "Use as exit node" and specify subnet route.
![tailscale subnet route](/images/blog/tailscale-subnet-route.png)

Once this is configured, you can install tailscale on your mobile device and set pfsense as your exit node.

Now test it out! Disconnect your phone from home WiFi and connect to the internet using another network (cellular is fine). 

- [ ] Disable exit node and access https://canyoublockit.com/extreme-test/.
- [ ] Enable exit node and access the same website to notice the difference. 

If ads are being blocked with the exit node, that means your phone's traffic is now going through your home network.

For most people, this is enough of a VPN setup and honestly you do not require anything else. But if you're interested a VPN to further protect your privacy, read ahead.
## 3rd Party VPN Integration (Optional)

There's multiple ways of going about setting up VPNs for your end devices. Granted you have a personal VPN with the Tailscale method above but what if you also want to hide from your ISP? What if you want to access something that is blocked in your country? 

That is where a 3rd party VPN will come in handy. My favourite so far has been Mullvad, so I will continue to plug them, but you can use ANY VPN service.

### Setup
Commonly, we simply install these VPN clients to our device and then link to whatever end point we wish to. However, my favourite method of connecting to the VPN is connecting my firewall to the VPN directly.
This way, all my endpoints that connect to the firewall can enjoy VPN access across the board.

If I want all my devices to show up as Sweden I can have all devices show up as Sweden. 

I recommend following the Wireguard guide: https://mullvad.net/en/help/pfsense-with-wireguard 

Once you have this setup, you can choose which devices are allowed to run via the Mullvad tunnel and which should only remain internal with no VPN connectivity. 

> For my purposes I only keep 1 VM running through Mullvad VPN. You can just connect all your LAN devices to the VPN if you wish to. Configure rules accordingly.

---
## Conclusion

With VPNs in place, we now have remote access via Tailscale and then a VPN for some devices depending on your setup. While simply a firewall + pi-hole is good enough feature for your VPN, you may want to start adding some additional services in your home network.

Below are some key services that will greatly benefit you. I will not be going into depth for each one right now as I will be focusing on setting up the security lab going forward, I highly recommend setting the following up for your local network + personal devices. Make sure to use vmbr1 for the network device so internal network has access:

1. Immich - https://immich.app/
	- Replacement for cloud photo storage such as Google Photos/iCloud. I love Immich way more than any other service out there AND I love saving the extra money that I was paying to iCloud.
	- At the very least, I recommend setting this up and give it a chance. You can also add your family and their libraries in Immich.
	- Looks very similar to Google Photos. This makes it easy for non-technical folk to start using. 
	- Mobile apps are also available for perfect syncing across devices.
	- Community script is available for install: https://community-scripts.github.io/ProxmoxVE/scripts?id=immich. 

2. NextCloud - https://nextcloud.com/install/
	- Basically, after freeing yourself from Photo storage, how about hosting your own cloud storage for everything else? 
	- This also has mobile apps for seamless syncing from home server to mobile. 
	- Community script is available: https://community-scripts.github.io/ProxmoxVE/scripts?id=nextcloudpi 
3. Paperless NGX (optional)
	- Perfect for document storage and classification.
	- Provides better support for documents such as ability to search within documents, tagging, OCR scanning of documents and much more.
	- Community script: https://community-scripts.github.io/ProxmoxVE/scripts?id=paperless-ngx 

I will go over all the services I host in another post, that will require a much longer post or maybe a video, depending on how I'm feeling.

For now, I want to continue building the lab for security training. In the next post, let's start with setting up an AD environment, we'll then configure monitoring and logging from the network and the endpoints.

