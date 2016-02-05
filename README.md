# ChatZilla Plugin: Network Trace

This plugin for [ChatZilla](http://chatzilla.hacksrus.com/) allows you to see the incoming and outgoing network messages easily.

## Commands

* `/network-trace [<toggle>]`

  Without any arguments, displays the tracing status for the current network.

  With the `toggle` argument, controls the tracing status for the current network. "true", "on", "yes" and "1" will enable tracing. "false", "off", "no" and "0" will disable tracing.

## Output

```
[<<] PING :fripp.mozilla.org
[>>] PONG :fripp.mozilla.org
[>>] JOIN #channel 
[<<] :Nickname!chatzilla@hostname JOIN :#channel
[<<] :fripp.mozilla.org 353 Nickname = #channel :@Nickname 
[<<] :fripp.mozilla.org 366 Nickname #channel :End of /NAMES list.
[>>] MODE #channel
[<<] :fripp.mozilla.org 324 Nickname #channel +nt
[<<] :fripp.mozilla.org 329 Nickname #channel 1454711109
[>>] PART #channel :
[<<] :Nickname!chatzilla@moz-eif.ga4.155.217.IP PART #channel :""
```