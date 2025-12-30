---
title: "Homelab #2 - Network Setup"
date: 2025-12-30
excerpt: "This post focuses on setting up a network for your home. Starting your homelab journey right, the first step is having a robust network alongwith segmentation. Comic credit: xkcd"
tags:
  - Cybersecurity
  - Tech
  - Casual
  - homelab
  - selfhost
  - dns
  - firewall
  - pfsense
  - opnsense
  - pihole
  - unbound
author: pir4cy
coverImage: https://imgs.xkcd.com/comics/network.png
draft: false
---
This one took way longer to write than I had hoped. I spent all this time troubleshooting a hardware issue that took up the entire week. The winter blues also boosted my procrastination but here we are.

In this post, I wanted to go over how to start with the basic networking setup that each homelab should have. As with all recommendations, these are just my personal preferences. There are plenty of alternatives, and exploring them is part of the fun.

In 2025, it has become essential to protect yourself from the internet. The amount of data collected from every interaction you have online is mind-boggling. Since we’re already building a homelab, it makes sense to use it to secure our home network and take control of our traffic.

My aim today is to just setup the networking infrastructure of my lab - creating firewalls, configuring rules and ensuring segmentation between my home network and my lab network. 

---

## Proxmox Overview

Before diving in, it helps to understand a few core Proxmox concepts and how they fit into a homelab.

### Virtualization

Proxmox lets you run **Virtual Machines (VMs)** and **Containers (LXC)** on the same system.

- **VMs** act like full computers with their own operating systems. These are ideal for Windows, Active Directory, Kali, firewalls, and anything that needs strong isolation. VMs will require ISOs that can directly be added to your Proxmox instance as shown below: 
	![Proxmox VMs](/images/blog/proxmox-vms-page.png)
- **Containers (LXC)** are lightweight and share the host kernel. They’re perfect for infrastructure services like Pi-hole, monitoring tools, or dashboards. These will require Templates that can be added to your Proxmox instance as shown below:
	![Proxmox CTs](/images/blog/proxmox-cts-1.png) ![Proxmox CT Templates](/images/blog/proxmox-cts-2.png)


Most homelabs use a mix of both, and that’s exactly what we’ll do.
### Networking and VLANs

Proxmox connects VMs and containers using **network bridges**, which function like virtual switches. By default, everything on the same bridge can talk to everything else.

For a lab, this quickly becomes messy and unsafe. This is where **VLANs** come in.

VLANs allow you to logically segment your network into isolated zones, such as:

- Home or management devices
- Lab environments (Active Directory, testing)
- Restricted or malware analysis networks

Proxmox supports VLAN aware bridges which will come in handy.

In my case, this is what I have setup
![Proxmox Network Overview](/images/blog/proxmox-network-coverage.png)

Here, vmbr0 will be our connection to the internet.
The second bridge, vmbr1 will be our local network (make sure this is vlan aware). 

---

## The Plan

Here's the setup I will be going for: 
![Proxmox Network Setup](/images/blog/proxmox-network-setup.png)

## Edge Firewall

I used pfSense as the edge firewall when I started my lab. I had familiarity with pfSense from an earlier project and eager to get started, so pfSense was the way. 

- To set this up, start with downloading pfsense ISO to Proxmox - https://www.pfsense.org/download/  
>  I'm not really a fan of the extra long steps it takes to download pfSense ISO from their official website.
>  
>  You can download CE versions here - https://atxfiles.netgate.com/mirror/downloads/. 
>  
>  You can update to latest version after installing 2.7.3.

- Once you have the ISO, you can start by creating a FreeBSD VM. 
- During VM creation, you can simply connect both vmbr0 (WAN bridge), vmbr1 (LAN bridge) as network devices.

After the install completes, you will be led to pfSense's setup wizard, which helps you get started with the configuration.

1. General Info - firewall name, domain (all your devices will be `<device>.domain` once the dhcp server is setup) and DNS.
	1. Firewall name: fw-edge-01
	2. For now, you can set this up to 1.1.1.1, we will be replacing this with our pi-hole later.
2. Time server information - the host name should be good as the default, and change timezone to your timezone.
3. WAN configuration
	1. Setup a static WAN IP, you could do DHCP from your router but I don't really like my ISP router dashboard. 
4. Setup a static LAN IP which will act as gateway for all your LAN devices. 

With that, your basic firewall should be up and running. 
Before we move on, let's setup the VLAN10 interface. 
You can set this up in Interfaces > VLAN. We just need 1 VLAN for our lab environment right now.

In my case I setup VLAN 10, which we will then utilize in Interface Assignments and create an interface for our VLAN. 
- For the interface, I've setup a static IP of 10.10.10.1/24

At this point you should have the following interfaces:
![pfsense interfaces](/images/blog/pfsense-interfaces.png)

With the following configuration for each:
- WAN - Static, Upstream Gateway - router IP (usually 192.168.2.1 or 192.168.1.1)
- LAN - Static, Local Network - 10.0.0.1/24
- VLAN10 - Static, Local Network VLAN 10 - 10.10.10.1/24

To assign IP addresses, you will have to enable DHCP servers on both LAN and VLAN10 interfaces. 
- For LAN
	- Address Pool range - 10.0.0.10 - 10.0.0.100
	- DNS Server: 1.1.1.1 (this will be replaced later)
	- Gateway: pfSense LAN IP (10.0.0.1)
	- Add domain name for your home network - The Pirate's Lair? Be creative with it.
- For VLAN10, you can just fill out the Address pool range and hit save, we will configure this later. (I'm using 10.10.10.100 - 10.10.10.199)

To validate that the firewall is working, you have 2 ways:
1. You can create a user VM of your choice with vmbr1 and assign LAN IP as gateway, this will force traffic to go through the firewall but DHCP will still be handled by your router. 
2. If you're like me and love taking risks, you can just disable your router's DHCP and clear all leases. 
	1. You can then force an IP lease renewal using `ipconfig /release` and `/renew` on Windows, re-enable the interface in Linux  or a complete reboot of the system. 
	2. In any case, the device should finally show LAN IP as the gateway, DHCP and DNS server.
3. If everything is setup correctly, you should be able to ping locally `ping 10.0.0.1` and externally `ping 8.8.8.8`. If one of these fail, there is some issue in the firewall rules blocking traffic.

Once you have reached a point where you have internet access on an internal device through pfSense, we can start with the Pi-Hole setup.

## Pi-Hole + Unbound
Now you can utilize the DNS resolver in pfSense with Google/OpenDNS as your DNS servers, but I would rather setup my own DNS resolver with ad-blocks in place. 

When you look up self hosted ad blockers, Pi-hole is usually one of the first few recommendations. There are alternatives, of course - AdGuard is another great one. 
So far, my experience with Pi-Hole has been great with little to no issues, so I am not looking to explore AdGuard but I have read great things. 

The basic idea is this:
![Basic Setup PiHole](/images/blog/dns-resolve-pihole.png)

### Unbound
Pi-Hole is great for basic ad blocking but by default you will utilize an external DNS provider. Since we are going full local, having Unbound alongside Pi-Hole just makes everything local to our network. 

Pi-Hole docs go into depth: https://docs.pi-hole.net/guides/dns/unbound/ 

### Installation
- Quick and easy install - [Community Scripts TTEK | Pi-Hole](https://community-scripts.github.io/ProxmoxVE/scripts?id=pihole)
	- Sets up the LXC with the defaults.
	- I recommend going through the advanced install, just so you are aware of everything that is being setup.
	- Make sure to set it up with vmbr1 network bridge so LAN devices can connect.

Once configured, change your pfSense's default DNS server to the IP address of the Pi-Hole.

Go to the Pi-Hole admin dashboard to watch it in action. If this is your first time, you will notice a sharp uptick in blocked queries. Over time, you will be able to see how many DNS queries were happening from your network without you ever knowing. 

Here's what mine looks like after a little more configuration:
![pihole dashboard](/images/blog/pihole-dashboard.png)

> To test it out, you can visit https://canyoublockit.com/extreme-test/ and see how many you're blocking. *Do not trust anything on the page above.*

Once you trust your Pi-Hole, you can go ahead and disable your router's DNS service and make the Pi-Hole your default DNS resolver. 
> I am not responsible for any angry family members in your household if this Pi-Hole fails. Make sure you are aware of the impacts and potential downtime in case there are any networking issues.
> Worst case, you can just reset the router to factory settings and fix the issue.

You might have to tune your block list according to what you require. But in most cases, it should just work out of the box.

If you're only here for selfhosting and are not looking to build a security lab, you can stop here as most services will be built within the LAN subnet.
## OPNSense

I have been wanting to try OPNSense for a while now. In the selfhosted community, OPNSense has better credibility than pfSense. 
It is a fork of pfSense and based on reviews, it seems to be the better one overall. Let's set it up.

If you are already familiar with Proxmox and just want to get started, you can utilize the community script: [Community Scripts by ttek | OPNSense VM](https://community-scripts.github.io/ProxmoxVE/scripts?id=opnsense-vm&category=Network+%26+Firewall) 

- One interface connected to the WAN bridge.
	- Since I'm creating a 2nd firewall, this will be connected to the main firewall. Make sure you have your vlan10 network device connected here. (vmbr1, tag=10)
	- Use DHCP for this and let pfSense assign the IP address.
- One interface for the LAN bridge (vlan20 , vmbr1, tag= 20)
	- Static IP - this will be your internal lab. I chose 10.20.20.1/24
	- Gateway - 10.20.20.1

Once the install completes, this is what you will see:
![opnsense install complete](/images/blog/opnsense-install-complete.png)

To access the OPNSense router web page, you will need to have a machine on the vlan20 network -  create a new machine with vmbr1 and `tag=20`. To route the traffic, you have 2 options: 
1. Enable DHCP server on LAN, it will request an IP address from OPNsense. 
	- If you enable DHCP from the console, the lease will be stored under Services > Dnsmasq & DHCP. 
	- To maintain consistency across both firewalls, I am utilizing Kea DHCP instead. Feel free to switch DHCP as you see fit. 
2. Manually set IP address and gateway to opnsense's IP during install.

Once you have web dashboard access, enable Unbound DNS server and get internet access on your lab endpoint.
![opnsense dashboard](/images/blog/opnsense-dashboard.png)


---


At the end of all of that, you should have a basic setup.

1. LAN (10.0.0.0/24) devices can communicate with each other and the internet. 
	1. DNS requests for LAN devices go through Pi-Hole
2. Devices in VLAN20 can interact communicate with each other and the internet.
	1. DNS requests for VLAN20 go through OPNSense



Now that you have the basics setup, verify the following:
- [ ] LAN devices (10.0.0.0/24) can access each other and the Internet
	- [ ] `ping 10.0.0.1` for local
	- [ ] `ping 8.8.8.8` for external
- [ ] VLAN10 devices (10.10.10.0/24) can access internet but not LAN devices.
	- [ ] `ping 10.10.10.1` for local
	- [ ] `ping 8.8.8.8` for external access
	- [ ] `ping 10.0.0.1` for home lan access (this should fail)
		- To achieve this, I blocked WAN outbound to 10.0.0.0/24 from OpnSense
- [ ] DNS Resolution
	- [ ] Device from home lan - should be routed through pfsense -> pi-hole.
	- [ ] Device from vlan10 - should be routed from opnsense directly.

Once verified, I recommend playing around with everything you have just installed today. Let other devices connect to the LAN network and look at what Pi-Hole does. 
Test out firewall rules and get familiar with pfSense and OPNSense dashboards. As we add more things to the lab, we will have to setup firewall rules as needed. 

In the next post, I will go over setting up Remote Access to the lab and a permanent VPN solution. 

---

## References
- https://pi-hole.net/
- https://opnsense.org/
- https://www.pfsense.org/
- https://community-scripts.github.io/ProxmoxVE/