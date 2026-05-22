import webview
from subprocess import Popen
from platform import system
import os
from pathlib import Path
import json
BASE_DIR = Path(__file__).resolve().parent
info = [
    {'class': 'ram',
     'value': 
            {'used_ram': 7.5337982177734375,
            'total_ram': 13.509342193603516,
            'ram_percent': 44.2}},
    {'class': 'disk',
     'value': 
            {'used_disk': 30.42206192016602,
            'disk_total': 162.98172760009766,
            'disk_percent': 18.2}},
    {'class': 'cpu',
     'value':
            {'cpu_used': 14.0,
            'one_cpu': {'current': 2274.0077499999998, 'min': 1108.0, 'max': 4280.0},
            'cores': 8,
            'cpu_temp': 59.9,
            'cpu_type': 'AMD Ryzen 5 5500H with Radeon Graphics'}},
    {'class': 'os',
     'value':
            {'name': 'Linux',
            'version': '#1 SMP PREEMPT_DYNAMIC Debian 6.12.85-1 (2026-04-30)',
            'machine': 'x86_64',
            'python': '3.13.5',
            'load_avg': (1.38623046875, 1.4521484375, 1.41015625)}},
    {'class': 'network',
        'value':
            {'ports': [631, 1716, 8858, 42193, 56621, 57998],
            'host': 'debian'}}]
#example data
def load_locale(selected:str) -> dict:
    with open(BASE_DIR / f"locale/{selected}.json", "r", encoding="utf-8") as q:
        return json.load(q)
class Api:
    def send_data(self, want: str) -> dict:
        for a in info:
            if want == a["class"]:
                return a["value"]
        return {}
    def open_file(self):
        if system() == "Windows":
            os.startfile(BASE_DIR / "static") # type: ignore
        else:
            Popen(["xdg-open", BASE_DIR / "static/styles"]) 
    def create_config(self, data:dict):
        with open(BASE_DIR / "bin/data1", "w", encoding="utf-8") as c:
            json.dump(data, c, indent=4)
        return "succeful"
    def get_locales(self):
        try:
            with open(BASE_DIR / "bin/data1", "r", encoding="utf-8") as c:
                data = json.load(c)
                if "lang" not in data:
                    return load_locale("en")
                match data["lang"]:
                    case "ru":
                        return load_locale("ru")
                    case "en":
                        return load_locale("en")
                    case _:
                        return load_locale("en")
        except Exception as e:
            return load_locale("en")
api = Api()
webview.create_window('MagentaUI', 'index.html', width = 1000, height = 800,
    resizable=False,
    easy_drag=True,
    background_color="#000000", js_api=api) #html= для передачи переменной в вебвью
webview.start() #debug=True can help solve problems
