    // containers for class
const cont_ram = document.getElementById("diva1");
const cont_cpu = document.getElementById("diva2");
const cont_disk = document.getElementById("diva3");
const cont_net = document.getElementById("diva4");
const cont_system = document.getElementById("diva5");
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
const p2 = document.querySelector("#p2");
const p3 = document.querySelector("#p3");
ram.addEventListener("click", () => {
    set_active(ram)
    change_display(cont_ram)
    window.pywebview.api.send_data("ram").then(data => {
        availble_ram = data["availble_ram"]
        p1.innerHTML = `availble_ram: ${availble_ram.toFixed(2)}Gb`;
        p2.innerHTML = `used_ram: ${data["total_ram"].toFixed(2)}Gb`;
        ram_percent = data["ram_percent"]
        p3.innerHTML = `ram_percent: ${ram_percent.toFixed(1)}%`;


        drawGauge("ram-gauge", data.availble_ram, data["total_ram"], "GB");
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

    // g.append("text")
    //     .attr("text-anchor", "middle")
    //     .attr("dy", "0.3em")
    //     .attr("font-size", "16px")
    //     .attr("fill", "#ff0909")
    //     .text(`${used.toFixed(1)} ${unit}`);
}

//section cpu
const p6 = document.querySelector("#p6");
const p7_5 = document.querySelector("#p7_5");
const cpu_gauge = document.querySelector("#cpu-gauge");
cpu.addEventListener("click", () => {
    window.pywebview.api.send_data("cpu").then(data => {
        change_display(cont_cpu);
        set_active(cpu);
        
        // Записываем только цифры внутрь тега span каждой карточки
        document.querySelector("#p4 span").innerHTML = `${data["cpu_temp"]}°C`;
        document.querySelector("#p5 span").innerHTML = `${(data["one_cpu"].current / 1000).toFixed(1)} GHz`;       
        document.querySelector("#p7 span").innerHTML = data["cores"];
        
        // Проценты в центр круга
        p6.innerHTML = `${data["cpu_used"].toFixed(1)}%`;
        
        // Название процессора
        p7_5.innerHTML = data["cpu_type"];
        
        // Рисуем ободок
        drawGauge("cpu-gauge", data["cpu_used"], 100, "%");
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
        disk_used = data["disk_total"] - data["availble_disk"]
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