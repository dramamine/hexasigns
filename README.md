LED-Magic
e.g. artet-hexes

Draw custom patterns on LED signs.
[images needed]

- Runs on Windows, Linux, and ARM (Raspberry Pi etc.).

## Hardware Setup
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
