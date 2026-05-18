    // containers for class
const cont_ram = document.getElementById("diva1");
const cont_cpu = document.getElementById("diva2");
const cont_disk = document.getElementById("diva3");
const cont_net = document.getElementById("diva4");
    //func
const ram = document.getElementById("ram");
const cpu = document.getElementById("cpu");
const disk = document.getElementById("disk");
const net = document.getElementById("net");
match = [ram, cpu, disk, net]
match2 = [cont_cpu, cont_ram, cont_disk, cont_net]
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
const p2 = document.querySelector("#p2");
const p3 = document.querySelector("#p3");
ram.addEventListener("click", () => {
    set_active(ram)
    change_display(cont_ram)
    window.pywebview.api.send_data("ram").then(data => {
        availble_ram = data["availble_ram"]
        p1.innerHTML = `availble_ram: ${availble_ram.toFixed(2)}Gb`;
        used_ram = data["used_ram"]
        p2.innerHTML = `used_ram: ${used_ram.toFixed(2)}Gb`;
        ram_percent = data["ram_percent"]
        p3.innerHTML = `ram_percent: ${ram_percent.toFixed(1)}%`;


        drawGauge("ram-gauge", data.availble_ram, 64, "GB");
    });
});

function drawGauge(svgId, used, total, unit) {
    const percent = (used / total) * 100;  
    const width = 100, height = 120, radius = 50;
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

    const color = percent > 75 ? "#E24B4A" : percent > 45 ? "#EF9F27" : "#9B59B6";

    g.append("path").attr("d", fillArc()).attr("fill", color);

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr("font-size", "16px")
        .attr("fill", "#ff0909")
        .text(`${used.toFixed(1)} ${unit}`);
}

//section cpu
const p4 = document.querySelector("#p4");
const p5 = document.querySelector("#p5");
const p6 = document.querySelector("#p6");
const p7 = document.querySelector("#p7");
cpu.addEventListener("click", () => {
    window.pywebview.api.send_data("cpu").then(data => {
        change_display(cont_cpu)
        set_active(cpu)
        all_cpu = data["all_cpu"][0]
        p4.innerHTML = `
            all_cpu: ${all_cpu.current.toFixed(1)}GHz <br>
        `;
        one_cpu = data["one_cpu"] 
        p5.innerHTML = `
            one_cpu:  ${one_cpu.current.toFixed(1)}GHz <br>
        `; 
        cpu_used = data["cpu_used"]
        p6.innerHTML = `cpu_used: ${cpu_used.toFixed(1)}%`;
        cores = data["cores"]
        p7.innerHTML = `cores: ${cores}`;
    });
});
//section disk
const p8 = document.querySelector("#p8");
const p9 = document.querySelector("#p9");
const p10 = document.querySelector("#p10");
const p11 = document.querySelector("#p11");
disk.addEventListener("click", () => {
    window.pywebview.api.send_data("disk").then(data => {
        set_active(disk)
        change_display(cont_disk)
        availble_disk = data["availble_disk"]
        p8.innerHTML = `avaible_disk: ${availble_disk.toFixed(2)}Gb`;
        disk_total = data["disk_total"]
        p9.innerHTML = `disk_total: ${disk_total.toFixed(2)}Gb`;
        disk_used = data["disk_used"]
        p10.innerHTML = `disk_used: ${disk_used.toFixed(2)}Gb`;
        disk_percent = data["disk_percent"]
        p11.innerHTML = `disk_percent: ${disk_percent.toFixed(1)}%`;
    });
});
//section network
const p12 = document.querySelector("#p12");
net.addEventListener("click", () => {
    window.pywebview.api.send_data("network").then(data => {
        change_display(cont_net)
        set_active(net)
        a = data["connections"]
        p12.innerHTML = `
            connections: <br>
            Ethernet 3: ${a["Ethernet 3"][2]} Mbps <br><br>
            Ethernet: ${a["Ethernet"][2]} Mbps <br><br>
            Сетевое подключение Bluetooth: ${a["Сетевое подключение Bluetooth"][2]} Mbps <br><br>
            Loopback Pseudo-Interface 1: ${a["Loopback Pseudo-Interface 1"][2]} Mbps <br><br>
            Wi-Fi: ${a["Wi-Fi"][2]} Mbps <br><br>
            Połączenie lokalne* 1: ${a["Połączenie lokalne* 1"][2]} Mbps <br><br>
            Połączenie lokalne* 2: ${a["Połączenie lokalne* 2"][2]} Mbps <br><br>
            Teredo Tunneling Pseudo-Interface: ${a["Teredo Tunneling Pseudo-Interface"][2]} Mbps <br><br>
        `;
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