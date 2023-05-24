## No Longer Being Maintained
Due to time constraints, I'm no longer able to keep updating this module with any amount of frequency. You're welcome to keep using it; there's a decent chance that it'll get updated from time to time because my group uses it, but I won't be keeping up with feature requests or non-critical bug reports at the level that'd be expected for something actively being maintained. Thanks for sticking with me on this wild ride, it's been a lot of fun!

![GitHub All Releases](https://img.shields.io/github/downloads/crash1115/ready-check/total) ![GitHub Releases](https://img.shields.io/github/downloads/crash1115/ready-check/latest/total) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/crash1115/ready-check?label=latest%20version)

Ready Set Go! is a system agnostic module for Foundry VTT designed to help GM's and players communicate when they're ready to play. GM's are given the option to initiate ready checks, and both GM's and players can indicate that they're ready (or not) at any time.

[![Image from Gyazo](https://i.gyazo.com/daca34d0b06c3de5371f487a27b4f6aa.jpg)](https://gyazo.com/daca34d0b06c3de5371f487a27b4f6aa)

# Instructions

## Starting a Ready Check (GM Only)
To initiate a ready check, you must be logged in as a user with GM permissions. Click on the hourglass button above the chat input, then select "Start A Ready Check". This will reset all player statuses to "Not Ready" and put a dialog on each user's screen asking them if they're ready.

Video (GM View): https://i.gyazo.com/5b98ca43945d9796833a8912a95a6945.mp4

You can use the Ready Check when you first start up the game, right before combat starts, or when you're taking a quick break so you can see when everyone is back and ready to play!

## Responding to a Ready Check (GM and Players)
When a ready check is initiated, a dialog will display on each user's screen. To let everyone know you're ready, just click the "Ready" button at the bottom of the window. When you do so, a green check mark will appear next to your name in the players window.

Video (Player View): https://i.gyazo.com/74080e4a2ed6b23d06df3f4cc27d665d.mp4

## Updating Your Ready Status (GM and Players)
Any user can update their status from "Ready" to "Not Ready" (and vice versa) at any time. To do this, click on the hourglass button above the chat input. (If you're logged in as GM, select the "Set My Ready Status" option; players won't need to.) This will display a dialog with buttons you can use to set your desired status. When you set your status to "Ready", a green check mark should appear next to your name. When you're set to "Not Ready", a red X will display instead.

Video (Player View): https://i.gyazo.com/0bb92cea345c0fa9f732d7e890cec9f7.mp4

You can use this toggle to help your group see when you have to step away to take a phone call, answer the door, slay the kobolds that have suddenly invaded your office, or when you just need a couple extra minutes to sort through your 9,000 spells to figure out which ones you'd like to prepare today. Pfft, wizards...

# Compatibility
- Should be compatible with all systems.
- Might have display issues with other modules that modify the players UI or the area around the chat interface.

# Installation
## Using The Manifest URL
1. Open up Foundry
2. Navigate to the Add-On Modules tab
3. Click Install Module
4. Paste the following URL into the Manifest URL text field: https://raw.githubusercontent.com/crash1115/ready-check/main/module.json
5. Click Install

# Got Questions?
Contact me on Discord (CRASH1115#2944).

# License
- This work is licensed under the [Foundry Virtual Tabletop EULA - Limited License Agreement for Module Development](https://foundryvtt.com/article/license/).
