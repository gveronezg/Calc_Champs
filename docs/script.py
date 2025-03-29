from browser import document, window

def credito_ou_debito(event):
    window.location.assign("investir.html")

def comparar_produtos(event):
    window.location.assign("comparar.html")

def reiniciar(event):
    window.location.assign("index.html")

def handle_click(event):
    btn_id = event.target.id
    if btn_id == "btn0":
        reiniciar(event)
    elif btn_id == "btn1":
        comparar_produtos(event)
    elif btn_id == "btn2":
        credito_ou_debito(event)

document.bind("click", handle_click) 