    // containers for class
const cont_ram = document.getElementById("div1");
const cont_cpu = document.getElementById("div2");
const cont_disk = document.getElementById("div3");
const cont_net = document.getElementById("div4");
const cont_system = document.getElementById("div5");
    //func
const ram = document.getElementById("ram");
const cpu = document.getElementById("cpu");
const disk = document.getElementById("disk");
const net = document.getElementById("net");
const system = document.getElementById("os");
match = [ram, cpu, disk, net, system]
match2 = [cont_cpu, cont_ram, cont_disk, cont_net, cont_system]
function set_active(btn){
    match.forEach((answer, index) => {
        if (answer == btn)
            answer.classList.add("active");
        else
            answer.classList.remove("active");
    });
};
function change_display (btn){
    match2.forEach((answer, index) => {
        if (answer == btn)
            answer.style.display = "flex";
        else
            answer.style.display = "none";
    })
}
window.addEventListener('pywebviewready', function() {
  window.pywebview.api.get_locales().then(locale => {
    ram.innerHTML = locale["ram"];
  });
});
    
//section ram

const p1 = document.querySelector("#p1");
ram.addEventListener("click", () => {
    set_active(ram)
    change_display(cont_ram)
    window.pywebview.api.send_data("ram").then(data => {
        used_ram = data["used_ram"]
        document.querySelector("#diva1 span").innerHTML = `${used_ram.toFixed(2)}Gb`;
        document.querySelector("#diva2 span").innerHTML = `${(data["total_ram"] - data["used_ram"]).toFixed(2)}Gb`;
        document.querySelector("#diva3 span").innerHTML = `${data["total_ram"].toFixed(2)}Gb`;
        ram_percent = data["ram_percent"]
        document.querySelector("#diva4 span").innerHTML = `${ram_percent.toFixed(1)}%`;

        drawGauge1("ram-gauge1", data.used_ram, data["total_ram"], "GB");
        p1.innerHTML = `${(data["used_ram"] / data["total_ram"] * 100).toFixed(1)}%`;
    });
});

function drawGauge1(svgId, used, total, unit) {
    const percent = (used / total) * 100;  
    const width = 800, height = 375, radius = 180;
    const tau = 2 * Math.PI;

    d3.select(`#${svgId}`).selectAll("*").remove();

    const svg = d3.select(`#${svgId}`)
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    const arc = d3.arc()
        .innerRadius(radius - 30)
        .outerRadius(radius)
        .startAngle(-Math.PI * 0.75)
        .endAngle(Math.PI * 0.75);

    g.append("path").attr("d", arc()).attr("fill", "#333");

    const fillArc = d3.arc()
        .innerRadius(radius - 30)
        .outerRadius(radius)
        .startAngle(-Math.PI * 0.75)
        .endAngle(-Math.PI * 0.75 + (percent / 100) * tau * 0.75);

    const color = percent > 75 ? "#E24B4A" : percent > 45 ? "#EF9F27" : "#9B59B6";

    g.append("path").attr("d", fillArc()).attr("fill", color);
}
const p1_capitalize = p1.style.fontSize = "100px";

//section cpu
const p6 = document.querySelector("#p6");
const p7_5 = document.querySelector("#p7_5");
const cpu_gauge = document.querySelector("#cpu-gauge");
cpu.addEventListener("click", () => {
    window.pywebview.api.send_data("cpu").then(data => {
        change_display(cont_cpu);
        set_active(cpu);
        document.querySelector("#diva5 span").innerHTML = `${data["cpu_temp"]}°C`;
        document.querySelector("#diva6 span").innerHTML = `${(data["one_cpu"].current / 1000).toFixed(1)} GHz`;       
        document.querySelector("#diva7 span").innerHTML = data["cores"];
        p6.innerHTML = `${data["cpu_used"].toFixed(1)}%`;
        p7_5.innerHTML = data["cpu_type"];
        drawGauge2("cpu-gauge1", data["cpu_used"], 100, "%");
        drawRect1("cpu-rect1", data["cpu_temp"])
        const cpuHistory = createCpuHistory("cpu-history1", data["cpu_used"], 100, "%");
        for (let i = 0; i < 100; i++) {
            cpuHistory.push(2 * Math.random() * 10);
        } // tutorial how to add data to cpu history
    });
});
function drawGauge2(svgId, used, total, unit) {
    const percent = (used / total) * 100;  
    const width = 500, height = 375, radius = 180;
    const tau = 2 * Math.PI;

    d3.select(`#${svgId}`).selectAll("*").remove();

    const svg = d3.select(`#${svgId}`)
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    const arc = d3.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius)
        .startAngle(-Math.PI * 0.75)
        .endAngle(Math.PI * 0.75);

    g.append("path").attr("d", arc()).attr("fill", "#333");

    const fillArc = d3.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius)
        .startAngle(-Math.PI * 0.75)
        .endAngle(-Math.PI * 0.75 + (percent / 100) * tau * 0.75);

    const color = percent > 80 ? "#E24B4A" : percent > 60 ? "#EF9F27" : "#9B59B6";

    g.append("path").attr("d", fillArc()).attr("fill", color);
}

const p6_capitalize = p6.style.fontSize = "100px";

function drawRect1(svgId, cpu_temp) {
    const width = 100, height = 300;
    const maxTemp = 100;
    const pad = 10;

    d3.select(`#${svgId}`).selectAll("*").remove();

    const svg = d3.select(`#${svgId}`)
        .attr("width", width + 60)
        .attr("height", height);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("rx", 6)
        .attr("fill", "#333");

    const color = cpu_temp > 80 ? "#E24B4A" : cpu_temp > 60 ? "#EF9F27" : "#6fc437";

    const barHeight = (cpu_temp / maxTemp) * (height - pad);
    svg.append("rect")
        .attr("width", width)
        .attr("y", height)
        .attr("height", 0)
        .attr("rx", 6)
        .attr("fill", color)
        .transition().duration(800)
        .attr("y", height - barHeight)
        .attr("height", barHeight);

    const temps = [20, 40, 60, 80, 100];
    temps.forEach(t => {
        const y = pad + (height - pad) - (t / maxTemp) * (height - pad);

        svg.append("line")
            .attr("x1", 0).attr("x2", width)
            .attr("y1", y).attr("y2", y)
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.4);

        svg.append("text")
            .attr("x", width + 5)
            .attr("y", y + 4)
            .attr("font-size", "15px")
            .attr("fill", "#e040fb")
            .text(`${t}°`);
    });

    const currentY = pad + (height - pad) - (cpu_temp / maxTemp) * (height - pad);

    svg.append("line")
        .attr("x1", 0).attr("x2", width)
        .attr("y1", currentY).attr("y2", currentY)
        .attr("stroke", "#00BFFF")
        .attr("stroke-width", 1.5);

    svg.append("text")
        .attr("x", width - 65)
        .attr("y", currentY + 25)
        .attr("font-size", "18px")
        .attr("fill", "#8f18f1")
        .attr("font-weight", "bold")
        .text(`${cpu_temp}°`);
}

function createCpuHistory(containerId, used, total, unit) {
    const history = Array(60).fill(0);
    const margin = {top: 10, right: 16, bottom: 10, left: 40};

    d3.select(`#${containerId}`).selectAll("*").remove();

    const container = document.getElementById(containerId);
    const width = container.offsetWidth || 770;
    const height = 150;
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient")
        .attr("id", "memGrad")
        .attr("x1", "0").attr("x2", "0")
        .attr("y1", "0").attr("y2", "1");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#d63af9").attr("stop-opacity", 0.4);
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#d63af9").attr("stop-opacity", 0.02);

    [0, 1, 2, 3, 4].map(i => parseFloat(((total / 4) * i).toFixed(1))).forEach(val => {
        const y = h - (val / total) * h;
        g.append("line")
            .attr("x1", 0).attr("x2", w)
            .attr("y1", y).attr("y2", y)
            .attr("stroke", "rgba(255,255,255,0.08)");
        g.append("text")
            .attr("x", -8).attr("y", y + 4)
            .attr("text-anchor", "end")
            .attr("fill", "rgba(255,255,255,0.35)")
            .attr("font-size", "11px")
            .text(val === 0 ? "0 %" : `${String(val).replace(".", ",")} ${unit}`);
    });

    const areaPath = g.append("path").attr("fill", "url(#memGrad)");
    const linePath = g.append("path").attr("fill", "none").attr("stroke", "#d63af9").attr("stroke-width", 1.5);

    function buildPath(data) {
        const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (v / total) * h]);
        let d = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length - 1; i++) {
            const cx = (pts[i][0] + pts[i + 1][0]) / 2;
            const cy = (pts[i][1] + pts[i + 1][1]) / 2;
            d += ` Q ${pts[i][0]} ${pts[i][1]} ${cx} ${cy}`;
        }
        d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
        return {line: d, area: d + ` L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`};
    }

    function render() {
        const {line, area} = buildPath(history);
        linePath.attr("d", line);
        areaPath.attr("d", area);
    }

    history[history.length - 1] = used;
    render();

    return {
        push(value) {
            history.shift();
            history.push(Math.min(value, total));
            render();
        }
    };
}
//section disk
const p8 = document.querySelector("#p8");
const p9 = document.querySelector("#p9");
const p10 = document.querySelector("#p10");
const p11 = document.querySelector("#p11");
disk.addEventListener("click", () => {
    window.pywebview.api.send_data("disk").then(data => {
        set_active(disk)
        change_display(cont_disk)
        used_disk = data["used_disk"]
        p8.innerHTML = `used_disk: ${used_disk.toFixed(2)}Gb`;
        disk_total = data["disk_total"]
        p9.innerHTML = `disk_total: ${disk_total.toFixed(2)}Gb`;
        disk_used = data["disk_total"] - data["used_disk"]
        p10.innerHTML = `disk_used: ${disk_used.toFixed(2)}Gb`;
        disk_percent = data["disk_percent"]
        p11.innerHTML = `disk_percent: ${disk_percent.toFixed(1)}%`;
    });
});
//section network
const p12 = document.querySelector("#p12");
const p13 = document.querySelector("#p13");
net.addEventListener("click", () => {
    window.pywebview.api.send_data("network").then(data => {
        change_display(cont_net)
        set_active(net)
        p12.innerHTML = `ports: ${data["ports"]}`;
        p13.innerHTML = `host name: ${data["host"]}`

    });
});
// section system
const p14 = document.querySelector("#p14");
const p15 = document.querySelector("#p15");
const p16 = document.querySelector("#p16");
const p17 = document.querySelector("#p17");
const p18 = document.querySelector("#p18");;
system.addEventListener("click", () => {
    window.pywebview.api.send_data("os").then(data => {
        change_display(cont_system)
        set_active(system)
        p14.innerHTML = `name: ${data["name"]}`;
        p15.innerHTML = `version: ${data["version"]}`;
        p16.innerHTML = `machine: ${data["machine"]}`;
        p17.innerHTML = `Average usage: ${data["load_avg"][0].toFixed(2)}`;
        p18.innerHTML = `python version: ${data["python"]}`;

    });
});
const SVG_GEAR = `
<svg id="main-gear" width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
        <circle cx="50" cy="50" r="33"/>
        
        <g transform="translate(50, 50)">
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(45)"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(90)"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(135)"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(180)"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(225)"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(270)"/>
            <rect x="-10" y="-50" width="20" height="20" rx="3" ry="3" transform="rotate(315)"/>
        </g>
    </g>
    
    <circle cx="50" cy="50" r="18" fill="#1e1e1e" id="gear-hole"/>
</svg>
`;
document.getElementById('gear').innerHTML = SVG_GEAR;