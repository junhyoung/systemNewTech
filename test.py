import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(24, GPIO.IN)

while True:
  v = GPIO.input(24)
  print(v)
  time.sleep(1)

GPIO.cleanup()
