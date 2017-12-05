#!/usr/bin/bash
pid=`netstat -o -a -n| findstr 0.0.0.3011 | awk '{print $5}'`
TASKKILL //F //PID $pid