from browser import document, window

def credito_ou_debito(event):
    window.location.assign("../docs/pages/investir.html")

def qual_produto(event):
    window.location.assign("../docs/pages/comparar.html")

document["btn1"].bind("click", qual_produto)
document["btn2"].bind("click", credito_ou_debito) 