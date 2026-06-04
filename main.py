import time
import zoneinfo
from datetime import datetime
from fastapi import FastAPI
import psutil as ps
import os
import uvicorn
import platform
import cpuinfo
app = FastAPI()
if not os.path.exists("config.txt"):
    print("didn't find file config.txt, starting configuration:")
    host_value = str(input("Enter host ip: "))
    port_value = str(input("Enter port: "))
    with open("config.txt", "a", encoding="utf-8") as b:
        b.write(f"IP={host_value}\nport={port_value}")
def fix(num:int) -> float:
    return num / (1024**3)

@app.get("/")
async def test() -> list:
    # return f"Gb: {round(fix(ps.virtual_memory().available), 2)}"
    s = ps.virtual_memory()
    d = ps.disk_usage('/')
    result = []
    for f in ps.cpu_freq(percpu=True):
        result.append(f._asdict())
    info = [
        {
        "class": "ram", "value":
        {"availble_ram": fix(s.available),
         "used_ram": fix(s.total - s.available),
         "ram_percent": s.percent}},
        {"class": "disk", "value": 
        {"availble_disk": fix(d.free),
         "disk_total": fix(d.total),
         "disk_used": fix(d.used),
         "disk_percent": d.percent}},
        {"class": "cpu", "value":
            {"all_cpu": result,
            "one_cpu": ps.cpu_freq(percpu=False)._asdict(),
            "cpu_used": ps.cpu_percent(interval=2),
            "cores": ps.cpu_count()}
            },
        {"class": "network", "value":
            {"connections": dict(ps.net_if_stats().items())}}
    ]
    #"cpu_temp": ps.sensors_temperatures()["cpu_thermal"][0].current if "cpu_thermal" in ps.sensors_temperatures() else "your device Not supported"
    # want = "ram"
    # for p in info:
    #     if p["class"] == want:
    #         return p["value"]
    return info
# if __name__ == "__main__":
#     try:
#         if os.path.exists("config.txt"):
#             with open("config.txt", "r", encoding="utf-8") as f:
#                 data = f.read()
#             a, b = data.split("\n")
#             host = a.split("=")
#             port = b.split("=")
#             uvicorn.run(app, host=host[1], port=int(port[1]))
#         else:
#             raise Exception("No config file")
#     except Exception:
#         raise Exception("Config file was damaged. Try to fix it manually or delete config.txt file to restart configuration")
s = ps.virtual_memory()
d = ps.disk_usage('/')
result = []
for f in ps.cpu_freq(percpu=True):
    result.append(f._asdict())
def get_cpu_temp_simple():
    temps = ps.sensors_temperatures()
    
    # k10temp — AMD, coretemp — Intel
    for chip in ("k10temp", "coretemp"):
        if chip in temps:
            return round(temps[chip][0].current, 1)
    
    return None
def get_open_ports():
    ports = set()
    for conn in ps.net_connections():
        if conn.status == "LISTEN" and conn.laddr:
            ports.add(conn.laddr.port)
    return sorted(ports)
asf = ps.swap_memory()
boot_timestamp = ps.boot_time()
uptime_seconds = time.time() - boot_timestamp
try:
    load_avg = os.getloadavg()
except AttributeError:
    load_avg = None
info2 = [
        {
        "class": "ram", "value":
        {"used_ram": fix(s.used),
         "total_ram": fix(s.total),
         "ram_percent": s.percent,
         "swap_used": fix(asf.used),
         "swap_total": fix(asf.total),
         "swap_percent": asf.percent}}  ,
        {"class": "disk", "value": 
        {"used_disk": fix(d.used),
         "disk_total": fix(d.total),
         "disk_percent": d.percent}},
        {"class": "cpu", "value":
            {"cpu_used": ps.cpu_percent(interval=2),
             "one_cpu": ps.cpu_freq(percpu=False)._asdict(), #in MHz
            "cores": ps.cpu_count(),
            "cpu_temp": get_cpu_temp_simple(),
            "cpu_type": cpuinfo.get_cpu_info()["brand_raw"]
            }},
        {
        "class": "os",
        "value": {
        "name": platform.system(),
        "version": platform.version(),
        "machine": platform.machine(),
        "python": platform.python_version(),
        "load_avg": load_avg, 
        "boot_time": int(uptime_seconds // 3600),
        "timezone": str(datetime.now().astimezone().tzinfo), 
        "host": platform.node()  
        }},
        {"class": "network", "value":{
            "ports": get_open_ports(),  
            
        }
        #     {"connections": dict(ps.net_if_stats().items())}}
    }]
info3 = [{'class': 'ram', 'value': {'availble_ram': 7.5337982177734375, 'total_ram': 13.509342193603516, 'ram_percent': 44.2}}, {'class': 'disk', 'value': {'availble_disk': 126.42206192016602, 'disk_total': 162.98172760009766, 'disk_percent': 18.2}}, {'class': 'cpu', 'value': {'cpu_used': 14.0, 'one_cpu': {'current': 2274.0077499999998, 'min': 1108.0, 'max': 4280.0}, 'cores': 8, 'cpu_temp': 59.9, 'cpu_type': 'AMD Ryzen 5 5500H with Radeon Graphics'}}, {'class': 'os', 'value': {'name': 'Linux', 'version': '#1 SMP PREEMPT_DYNAMIC Debian 6.12.85-1 (2026-04-30)', 'machine': 'x86_64', 'python': '3.13.5', 'load_avg': (1.38623046875, 1.4521484375, 1.41015625)}}, {'class': 'network', 'value': {'ports': [631, 1716, 8828, 44193, 57621, 57999], 'host': 'debian'}}]
info4 = [
]
print(info4)
# processes = []
# for proc in ps.process_iter(["pid", "name", "memory_info", "status"]):
#     mem_mb = round(proc.info["memory_info"].rss / 1024 / 1024, 1)
#     if mem_mb < 10:  # фильтр мусора
#         continue
#     processes.append({
#     "pid": proc.info["pid"],
#     "name": proc.info["name"],
#     "ram_mb": mem_mb,
#     "status": proc.info["status"]
#             })
# print(processes)