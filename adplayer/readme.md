# Advertising error

## Notes 

Player code copied from brightcove player dialog in the studio

Advertising sample taken from https://support.brightcove.com/advertising-freewheel-plugin

Playlist code samples taken from https://support.brightcove.com/brightcove-player-sample-custom-playlist

## Steps to reproduce

cd into directory run python

sudo python -m SimpleHTTPServer 80

You might want to set in your host file
127.0.0.1   dev.www.discoveryfamily.fr

browse to http://dev.www.discoveryfamily.fr


- Open your console in chrome
- Click play
- Skip the video by clicking 2nd or 3rd video in the playlist.
- Video won't play
- See error in console 

**Note: Firefox behaves the same but does not report the error.**

