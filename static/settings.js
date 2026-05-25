   const SVG = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="16" cy="16" r="15" fill="#4a148c" stroke="#a855f7" stroke-width="1.5"/>
  <line x1="9" y1="9" x2="23" y2="23" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" filter="url(#glow)"/>
  <line x1="23" y1="9" x2="9" y2="23" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" filter="url(#glow)"/>
</svg>`
document.getElementById("return").innerHTML = SVG;
const css_cfg = document.getElementById("css_cfg");
css_cfg.addEventListener("click", () => {
  window.pywebview.api.open_file()
});
/*const apply = document.getElementById("apply");

apply.addEventListener("click", () =>{
  const ip = document.getElementById("ip").value;
  const port = document.getElementById("port").value;
  const p = document.getElementById("s-e")
  window.pywebview.api.create_config(ip, port).then(result => {
    if (result == "succeful"){
      //zrob tu wyswietlanie succeful ladnie
      p.innerHTML = 'Gratulacje! Poprawnie dodałeś port i IP';
    }
    else{
      //tu zrob wyswietlani erroru ladnie
      p.innerHTML = 'Sprawdź ponownie IP i port';
    }
  });
});*/
// test.addEventListener("click", () => {
window.addEventListener('pywebviewready', function() {
  const ip = document.getElementById("ip");
  const port = document.getElementById("port");
  const language = document.getElementById("choose").value = "Russian"; //example of changing select value manually
  const connect = document.getElementById("method");
  port.value = "5500" ; // example of changing input value manually
  send = {
    "ip": ip,
    "port": port.value,
    "lang": language,
    "method": connect
  }
  window.pywebview.api.create_config(send).then(config => {

  });
});