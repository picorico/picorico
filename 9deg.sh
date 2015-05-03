#!/bin/sh
# Edison startup script

echo 214 > /sys/class/gpio/export 2>&1
echo high > /sys/class/gpio/gpio214/direction
echo low > /sys/class/gpio/gpio214/direction

echo 131 > /sys/class/gpio/export 2>&1
echo mode1 > /sys/kernel/debug/gpio_debug/gpio131/current_pinmux
echo 249 > /sys/class/gpio/export 2>&1
echo high > /sys/class/gpio/gpio249/direction
echo 1 > /sys/class/gpio/gpio249/value
echo 217 > /sys/class/gpio/export 2>&1
echo high > /sys/class/gpio/gpio217/direction
echo 1 > /sys/class/gpio/gpio217/value
echo out > /sys/class/gpio/gpio131/direction
echo 0 > /sys/class/gpio/gpio131/value


echo 130 > /sys/class/gpio/export 2>&1
echo mode1 > /sys/kernel/debug/gpio_debug/gpio130/current_pinmux
echo 248 > /sys/class/gpio/export 2>&1
echo low > /sys/class/gpio/gpio248/direction
echo 0 > /sys/class/gpio/gpio248/value
echo 216 > /sys/class/gpio/export 2>&1
echo in > /sys/class/gpio/gpio216/direction
echo in > /sys/class/gpio/gpio130/direction

echo high > /sys/class/gpio/gpio214/direction

sleep 1
echo "Starting 9deg script"
/usr/bin/python /home/root/9deg.py 2>&1 > /home/root/9deg.log &
