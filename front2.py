import webview
from subprocess import Popen
import platform
if platform.system() == "Windows":
    import os
info =  [{'class': 'ram',
          'value': 
              {'availble_ram': 5.489540100097656,
               'used_ram': 8.36599349975586,
               'ram_percent': 60.4}},
         {'class': 'disk',
          'value':
              {'availble_disk': 54.70027542114258,
               'disk_total': 237.41112899780273,
               'disk_used': 182.71085357666016,
               'disk_percent': 77.0}},
         {'class': 'cpu',
          'value':
              {'all_cpu': [{'current': 3301.0, 'min': 0.0, 'max': 3301.0}], 
                'one_cpu': {'current': 3301.0, 'min': 0.0, 'max': 3301.0},
               'cpu_used': 2.9,
               'cores': 8}},
         {'class': 'network',
          'value': {'connections': {'Ethernet 3': [True, 2, 1000, 1500, ''], 'Ethernet': [False, 2, 0, 1500, ''], 'Сетевое подключение Bluetooth': [False, 2, 3, 1500, ''], 'Loopback Pseudo-Interface 1': [True, 2, 1073, 1500, ''], 'Wi-Fi': [True, 2, 270, 1500, ''], 'Połączenie lokalne* 1': [False, 2, 0, 1500, ''], 'Połączenie lokalne* 2': [False, 2, 0, 1500, ''], 'Teredo Tunneling Pseudo-Interface': [True, 2, 0, 1472, '']}}}]
# example input data
class Api:
    def send_data(self, want: str) -> dict:
        for a in info:
            if want == a["class"]:
                return a["value"]
        return {}
    def open_file(self):
        if platform.system() == "Windows":
            os.startfile("static") # type: ignore
        else:
            Popen(["xdg-open", "static"]) 
    def create_cofnig(self, ip:str, port:str):
        with open("data1", "w", encoding="utf-8") as b:
            b.write(f"IP={ip}\nport={port}")
api = Api()
webview.create_window('MagentaUI', 'index.html', width = 1000, height = 800,
    resizable=False,
    easy_drag=True,
    background_color="#000000", js_api=api) #html= для передачи переменной в вебвью
webview.start()