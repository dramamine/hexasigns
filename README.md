
Draw custom patterns on LED signs.

https://metal-heart.org/hexasigns/

## TODO
clockers -> snake_one transition leaves some pixels highlighted


## Updated Guide 2023

You can run this off way less hardware. Record the data to an SD card and play it off a Teensy 4.1:

- Record output via Lightjams (4 universes; starting universe is 1)
- Output saved to hexasigns-4u-aligned-10-patterns.mp4
- Convert to `output.bin` via `video2sdcard.py`
- Use `videosdcard.ino` to play back file on Teensy
- Data channels 0 and 1 serve the top & bottom half of the first hexagon
- Data channels 2 and 3 serve the top & bottom half of the second hexagon


## OLD GUIDE - Hardware Setup

Runs on Windows, Linux, and ARM (Raspberry Pi etc.).

- Get a Falcon F4V3 (firmware V2.0+)
- Default settings on it (DHCP)
- Cheap router ex. Netis WF2411
  - Set up wifi login if you need it
  - Rename the network to something cool
  - Assign an IP to F4V3 when it's connected. This IP is hardcoded in artnet.js
- Rextin WS2811 Pixels (12V 50pcs) x12 strands, or equivalent
- NES-350-12 power supply, or equivalent
http://puu.sh/DGCpj/a2908da07a.jpg

## How to Use
Check in index.js and make sure everything looks cool. Code to activate these:
- menu mode
- hardcoded single pattern
- @TODO rotate between em
- run `npm i`
- run `npm start`

## Raspberry Pi Setup Guide

```bash
# install/update node

curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get install -y nodejs
npm -v
node -v
cd /home/pi/led-magic/
npm i

# setup crontabs
sudo crontab -e
@reboot node /home/pi/led-magic/src/index.js

# boot into CLI/GUI
sudo raspi-config
```
