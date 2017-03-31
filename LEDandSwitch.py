import time
import RPi.GPIO as GPIO
import random

pin=[26,29,31,33,35,37,32,36,38,40]

# to use Raspberry Pi board pin numbers
GPIO.setmode(GPIO.BOARD)
GPIO.setup(24, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

def setup(p):
  GPIO.setup(pin[p], GPIO.OUT)

def out(p, v):
  GPIO.output(pin[i], v)
for i in range(0, len(pin)): setup(i)
isClick=False
for i in range(0, len(pin)): out(i, 0);
def gotit(channel):
  global isClick
  isClick=True
GPIO.add_event_detect(24, GPIO.RISING, callback=gotit, bouncetime=300)
try:
  while True:
    answer=random.randrange(0,len(pin))
    print("Click the switch at "+str(answer+1)+" th LED")
    time.sleep(2)
    for i in range(0, len(pin)):
      out(i, 1);
      time.sleep(0.5)
#      print(isClick)
      if isClick==True and i==answer:
        print ("Success")
      elif isClick==True and i!=answer:
        print ("Fail")
      elif i==answer and isClick==False:
        print ("Fail")
      out(i,0)
      #print("i : "+str(i))
      time.sleep(0.1)
      #if isClick==False:
       # print ("FAIL")
      isClick=False

    #for i in range(len(pin)-1, -1, -1):
     # out(i, 0);
     # time.sleep(0.1)
      #print("-I:"+str(i))
    
    time.sleep(3)

except KeyboardInterrupt:
  GPIO.cleanup()

