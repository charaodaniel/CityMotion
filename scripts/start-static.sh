#!/bin/bash
# Start static file server in background
cd /home/daniel/Documents/CityMotion
node serve-static.mjs > /tmp/static-server.log 2>&1 &
echo $! > /tmp/static-server.pid
echo "Server started on PID $(cat /tmp/static-server.pid)"
sleep 2
curl -s -o /dev/null -w '%{http_code}' http://localhost:9002/index.html
echo ""
