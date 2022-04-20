# Prometheus exporter

The goal of this version is to offer a few basic metrics for
initial testing. The set of supported metrics can be extended.

The current implementation is partly
[unconventional](https://prometheus.io/docs/instrumenting/writing_exporters)
in that it creates new metrics each time but does not register a
custom collector. Reasons are that the exporter should
[clear out metrics](https://github.com/prometheus/client_python/issues/182)
for closed connections but that `prom-client`
[does not yet support](https://github.com/siimon/prom-client/issues/241)
custom collectors.

This version has been ported from an earlier Python version that was not part
of `Ejtimaa` but connected as an interactive client.

## Configuration

See `prometheus` in `server/config/config.example.js` for options and
applicable defaults.

If `Ejtimaa` was installed with
[`mm-absible`](https://github.com/Ejtimaa/Ejtimaa-ansible)
it may be necessary to open the `iptables` firewall for incoming TCP traffic
on the allocated port (see `/etc/ferm/ferm.conf`).

## Metrics

| metric                                | value                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Ejtimaa_peers`                       |                                                                                                     |
| `Ejtimaa_rooms`                       |                                                                                                     |
| `mediasoup_consumer_byte_count_bytes` | [`byteCount`](https://mediasoup.org/documentation/v3/mediasoup/rtc-statistics/#Consumer-Statistics) |
| `mediasoup_consumer_score`            | [`score`](https://mediasoup.org/documentation/v3/mediasoup/rtc-statistics/#Consumer-Statistics)     |
| `mediasoup_producer_byte_count_bytes` | [`byteCount`](https://mediasoup.org/documentation/v3/mediasoup/rtc-statistics/#Producer-Statistics) |
| `mediasoup_producer_score`            | [`score`](https://mediasoup.org/documentation/v3/mediasoup/rtc-statistics/#Producer-Statistics)     |

## Architecture

```
+-----------+      +---------------------------------------------+
| workers   |      | server                    observer API      |
|           | sock |                    +------o------+----o-----+
|           +------+                    | int. server | exporter |
|           |      |                    |             |          |
| mediasoup |      | express  socket.io |     net     | express  |
+-----+-----+      +----+---------+-----+-----+-------+-----+----+
      ^ min-max         ^ 443     ^ 443       ^ sock        ^ 8889
      | RTP             | HTTPS   | ws        |             | HTTP
      |                 |         |           |             |
      |               +-+---------+-+  +------+------+  +---+--------+
      +---------------+     app     |  | int. client |  | Prometheus |
                      +-------------+  +-------------+  +------------+
```
