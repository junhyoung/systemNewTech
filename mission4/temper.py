import os
import glob
import time
import requests, json
import RPi.GPIO
import urllib.request
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')
base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'
def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines
def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c
while True:
 temper=read_temp()
 print(temper) 
 res1= urllib.request.Request("http://10.42.0.203:8080/logone?temp="+str(temper))
 data= urllib.request.urlopen(res1).read()
 res= requests.post("https://api.thingspeak.com/update?api_key=I1GWGSAM6V2EHB32&field1="+str(temper),data="a")
 time.sleep(1)

