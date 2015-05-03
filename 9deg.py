# Run on Edison with 9 Degrees Sparkfun Breakboard attached via UART
import serial
import requests
import json

API_URL = 'http://10.10.13.12:3000/'

spark = serial.Serial('/dev/ttyMFD1', 57600)
while True:
    data = spark.readline()
    # Example output: #YPR=165.66,13.37,0.25
    data = data[5:-1]
    try:
        x, y, z = [float(n) for n in data.split(',')]
    except ValueError:
        print "# Error parsing:", data
        continue
    payload = {'x': x, 'y': y, 'z': z}
    print payload
    try:
        r = requests.post(API_URL, data=json.dumps(payload), timeout=0.1)
    except requests.exceptions.Timeout:
        print "# Timeout:", data
