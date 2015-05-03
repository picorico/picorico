# Run on Edison with 9 Degrees Sparkfun Breakboard attached via UART
import serial
import requests

API_URL = 'http://192.168.43.246:3002/send'
N = 50

spark = serial.Serial('/dev/ttyMFD1', 57600)
i = 0
while True:
    data = spark.readline()
    i += 1
    if i % N != 0:
        continue # process only 1/N samples
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
        r = requests.post(API_URL, data=payload, timeout=0.5)
    except requests.exceptions.Timeout:
        print "# Timeout:", data
    except Exception as e:
        print '# Other error:', e
