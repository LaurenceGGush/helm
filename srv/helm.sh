#!/bin/sh

# rotate display to vertical
DISPLAY=:0 xrandr --output HDMI-1 --mode 800x480 --rotate right

xset -dpms     # disable DPMS (Energy Star) features.
xset s off     # disable screen saver
xset s noblank # don't blank the video device

# Remove exit errors from the config files that could trigger a warning
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

matchbox-window-manager -use_titlebar no &
unclutter &    # hide X mouse cursor unless mouse activated
chromium-browser --display=:0 --kiosk --noerrdialogs --enable-features=OverlayScrollbar --window-position=0,0 http://127.0.0.1:3080
