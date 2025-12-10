---
title: You Should Build a Lab
date: 2025-12-09
excerpt: Getting Started with the Homelab Series
tags:
  - homelab
  - selfhost
author: pir4cy
coverImage: /images/blog/homelab-cover.png
draft: false
---
## You Should Build a Lab

One of the reasons I started this “blog” is to document my journey into one of my favourite hobbies: homelabbing. 

A homelab is basically your own little corner of the internet at home, where you can run servers, virtual machines, containers, or services just for learning, experimenting, and tinkering. It’s a safe playground to try new tech, host your own apps, and understand how things work behind the scenes.

With this post, I want to get started in writing down the basics of my homelab, the services that I have running, the beginner lab environment and just take you along the way of the process.

### Why Homelab?

Before asking why you should build one, ask yourself why you shouldn’t. Unless your answer is "I hate computers", you should continue reading.

Once you start setting up your own lab, you’ll find your own niche uses for it and those uses start adding up until suddenly your homelab becomes part of your life. At that point, congratulations, you’re hooked.

Here’s why I built mine:

- Self host your services. Be free from the restrictions and slow decay of the modern internet. This is my answer to the enshittification of everything online.
- Cybersecurity lab. Build environments, attack them, break them, fix them, log everything and learn in the process.

I’ll go deeper into each of these in future posts and talk about the things I have setup and my recommendations for a beginner homelab. 

Now that you know why a homelab can be fun and useful, let’s talk about how to get started.

### Getting Started

If you’re anything like me, you probably imagine that you need a full server rack or some monster PC to start a homelab. You don’t. You can start with any old laptop or desktop you have lying around. Seriously, if it turns on, it’s probably enough.

You will need a basic understanding of operating systems, virtualization and hypervisors. Nothing intense. Just enough that the next posts don’t sound like black magic. I will encourage you to learn about the things you encounter during your journey. The self host and homelab communities are encouraging and ready to help out, as long as you have the drive to get busy.

> Experience is the best teacher.

Once you have a device, let's start with the Operating System of choice.
#### Operating System
To kick things off, we’re going to wipe the device and install Proxmox. Proxmox is what we’ll use to set up all our virtual machines and containers moving forward. I chose Proxmox because
1. It’s open source. No licensing nonsense, no feature paywalls sneaking up on you later, and a huge community behind it.
	- Community Scripts is a great repository if you're looking to explore new things: [Community Scripts by ttek](https://community-scripts.github.io/ProxmoxVE/) 
2. It’s QEMU based. This means solid virtualization performance, wide OS support, and the flexibility to run pretty much anything you want.
3. I love it.

Here are the system requirements for Proxmox VE:
- CPU: 64-bit processor with Intel VT-x or AMD-V support 
- RAM: Minimum 4 GB but realistically 8 GB or more if you want multiple VMs 
- Storage: At least 32 GB drive, SSD highly recommended 
- Network: 1x network port (more is better, but 1 is enough to start) 
- Boot Mode: UEFI or Legacy BIOS both work 
- GPU: Not required unless you plan to use GPU passthrough
If you want to read ahead, Proxmox has a solid installation guide:  
[https://pve.proxmox.com/wiki/Installation](https://pve.proxmox.com/wiki/Installation) 

#### Other Choices
My obvious bias towards Proxmox aside, you can also go with ANY type 1 hypervisor you want to explore (and I emphasize again, that you _should_ explore). There’s no single “correct” option. Pick what interests you and play around with it.

Here are some alternatives:

- **ESXi**  
    By far the most common choice for a lot of folks. It’s used everywhere in the industry, so getting hands-on with ESXi gives you familiarity that translates directly into real jobs. The downside is that VMware’s licensing changes have been… questionable to say the least… but the tech itself is rock solid.

- **Hyper-V**  
    Built into Windows and extremely common in corporate environments. Not the top pick in homelabs, but if you’re running Windows and don’t want to bother installing a whole new operating system just to get started, Hyper-V is a perfectly fine option. Quick to enable, easy to use, and a good way to understand how virtualization works on the Windows side.

- **KVM (raw)**  
    If you want to go full Linux nerd, you can run KVM directly without a management layer like Proxmox. Tools like Cockpit can make it easier. Not the friendliest for beginners, but you’ll definitely learn a lot.

At the end of the day, pick whatever excites you. The whole point of a homelab is to experiment, break things, and learn more than you would by just reading documentation.

> Also worth mentioning: you don’t need a full lab or a hypervisor to start self hosting. If you want, you can run most services directly on a single machine using Docker. I’ll talk more about that in the next post.

#### Proxmox Post Install Tips
If you choose Proxmox, you can then access the web portal @ `<Proxmox IP Address>:8006`.

Here are some post install steps that you can take before jumping into the action. These are the things that I added to my lab over time as I was excited to just get my VMs up and running but if you're getting started, just get these out of your way: 

- **Switch to the No-Subscription Repository**
	- By default, Proxmox points to the Enterprise repo, which requires a subscription. For a home lab, switching to the no-subscription repo gives you free updates without any warnings.
    - You can do this manually or use the [Proxmox Community Post-Install Script](https://community-scripts.github.io/ProxmoxVE/scripts?id=post-pve-install), which also handles other handy tasks.
- **Suppress the “No Subscription” Warning**
    - That nag banner in the web UI can be distracting. The community script can safely disable it, keeping the interface clean for beginners.
- **Enable Dark Mode in the Web Interface** 
    - Makes the web UI easier on the eyes during long lab sessions.
    - Go to your user settings (top-right → Preferences → Theme → Dark).
- **Update Proxmox VE and Reboot**
    - Always a good idea to ensure you’re on the latest version. The community script can handle updating the system and optionally rebooting it automatically.
- **Add any extra storage devices that you may have**
	- If you have extra drives, configure them in Proxmox as directories, LVM, or ZFS pools so your VMs and containers have more space.

![Proxmox Web Page](/images/blog/proxmox-1.png "Proxmox Beginning")

---

With the basics of Proxmox out of the way, the next step is to make sure your network is ready for whatever you’re going to build. In the next post, we’ll go over setting up your firewall, local DNS filtering, and the core network structure your homelab will rely on.