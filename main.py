from fastapi import FastAPI
import psutil as ps
import os
import uvicorn
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
if __name__ == "__main__":
    try:
        if os.path.exists("config.txt"):
            with open("config.txt", "r", encoding="utf-8") as f:
                data = f.read()
            a, b = data.split("\n")
            host = a.split("=")
            port = b.split("=")
            uvicorn.run(app, host=host[1], port=int(port[1]))
        else:
            raise Exception("No config file")
    except Exception:
        raise Exception("Config file was damaged. Try to fix it manually or delete config.txt file to restart configuration")