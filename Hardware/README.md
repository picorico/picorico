# Hardware

## AMT203

The AMT203 is a high accuracy absolute encoder outputting 12 bits of absolute
position information.

Here the pinout to connect the AMT203 to the arduino mini pro

                  | |
                  | |
EMPTY - EMPTY - ORANGE - BLUE - YELLOW
EMPTY - EMPTY - WHITE - BLACK - GREEN

Where:
- black -> GND
- White -> +5V
- blue -> SCK
- yellow -> MISO
- orange -> MOSI
- green -> CSB

## Intel Edison

The Intel Edison is used to aggregate metrics from the ADXL345 sensor and to forward
them to the remote platform.

- 9deg.sh configures the GPIOs and starts the script 9deg.py
- 9deg.py reads the serial output of the sensor and send an HTTP post request with
  the metrics.
