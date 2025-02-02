---
title: FAQ
group: shard-owners
description: Frequently asked questions about the ClassicUO Client from shard owners
---
# Shard Owners FAQ

### How can I add my shard to the server list?
Right now we're keeping the pool of servers small for testing purposes. 
Please make a [Shard Request issue over on our Github](https://github.com/ClassicUO/classicuo-web/issues/new/choose) and we will get back to you.

### Will ClassicUO Web be open-source?
We don't currently have plans to open-source the web client. Though we do have plans to allow customization by shard owners.

There's many reasons why, but to outline a few:

1. **Discovery.**  
We're aspiring to be the OSRS of UO essentially. There should be a single destination people can remember to go to play UO and discover new shards/experiences. 
In my opinion, a lot of great shards go overlooked as players have a hard time finding them, and the servers have a hard time attracting users. 
Having a centralised server listing that is also the entrypoint to playing the servers makes that experience 100x better and will bring new players to the game.

2. **Fragmentation/Support.**  
It's taken us over a year to get a properly stable version of CUO Web.
We don't want to have to support 100s of fragmented installs with their own bugs and give support on how to bootstrap/maintain the infrastructure needed.
We're not a PaaS app, we're three dudes working on this in our free time with full-time jobs and families.

3. **Cheating.**  
As others have shown, in order to combat cheating you need to have a modified closed-source client, and then compile it AOT. 
Usually with changes to the network protocol to prevent standard CUO from connecting. 
This is essentially the same reason it's a bad idea to release the web client source. 
People will take it and make modified clients all over again.

With all that said, we might be open to allowing larger shards to host their own game proxy. However, we'd need to decouple some parts of th authentication system to do that.

### I have custom MUL/UOP files for my shard, can I use them with the web client?
We have a working version of file patching, we will release more details soon.

### I have a customized ClassicUO client for my shard, how can I modify the web client?
We're working on exposing tools to shard owners for adding custom UI and interactivity powered by React.   
However, we need to work on sandboxing the environment to keep players browsers secure and preventing cheats from being created.  

In general the CUO web client will stay stock. However, we're working on a Typescript API that shard owners can use to customize the client. 
Essentially your code will be run in a QuickJS sandbox with access to APIs to add customisation to the client.
Right now we're exploring what that API might have while keeping it out of the hands of cheaters. 
We'll open up a separate shard-owners private channel to discuss directly there.

If you have a lot of C# changes to your client -- I'm sorry they're probably not going to make it. 
However, the web client will be a lot easier to maintain for you, have the power to render UI using React, and potentially even fetch data from external APIs. 
Say goodbye to Gumps basically. The iteration speed will be a lot faster, and you can deploy updates to players almost instantly.

We're also planning to implement a feature negotiation packet that will allow shard owners to turn off/disable CUO features and parts of the Assistant (e.g. scripting).

### Why is there a game proxy/DDOS issue?

There's no way to make a direct tcp connection from a web-browser to a random server for web security reasons. 
In order to connect to a shard we need to proxy the tcp connection over websockets. 
Right now we use Deno Deploy for hosting the game proxy which is a edge-compute service, 
meaning when you connect you go via a local POP to then connect to the server. 
The proxy itself is pretty dumb but also controls the authentication for the web client.

If you were to ping the proxy the IP you would see is Deno Deploy's anycast IP address, it's not a single server. 
They have 26 POPs around the world and IIRC their infrastructure is on GCP, so if someone wants to DDOS google then they can have fun. 
Furthermore, the proxy hides the shards IP address and the internal Shard ID is used when connecting the login/game sockets. 
If your shard were to only use ClassicUO Web and never share the IP publicly your shard would be protected from DDOS.

One of the reasons for the Beta is to test the game proxy, 
we're not actually sure on the upper limit for connections or how long a websocket connection will live. 

Deno Deploy itself is also in beta. Any feedback/issues you find please let us know!
