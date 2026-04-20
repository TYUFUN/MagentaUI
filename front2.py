
import webview
webview.create_window('KBC', 'index.html', maximized=True,
    resizable=True,
    easy_drag=True,
    background_color="#000000") #html= для передачи переменной в вебвью
webview.start()