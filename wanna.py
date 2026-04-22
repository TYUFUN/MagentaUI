import os
import requests
from time import sleep
def parser(type: str, want: str) ->  str: # type: ignore
    for p in data:
        if p["class"] == type:
            for name, value in p["value"].items():
                if name == want:
                    return name, value  # type: ignore
        return "", ""  # type: ignore
    
    
    
if not os.path.exists("config2.txt"):
    print("didn't find file config.txt, starting configuration:")
    host_value = str(input("Enter host ip: "))
    port_value = str(input("Enter port: "))
    with open("config2.txt", "a", encoding="utf-8") as b:
        b.write(f"IP={host_value}\nport={port_value}")
#start
with open("config2.txt", "r", encoding="utf-8") as f:
    data2 = f.read()
a, b = data2.split("\n")
host = a.split("=")
port = b.split("=")
#end

while True:
    r = requests.get(f"http://{host[1]}:{port[1]}/")
    data = r.json()
    print(data)          
    sleep(2)