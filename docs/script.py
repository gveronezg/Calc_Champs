from browser import document, window # type: ignore

def handle_click(event):
    btn_id = event.target.id
    if btn_id == "btn0":
        window.location.assign("index.html")
    elif btn_id == "btn1":
        window.location.assign("comparar.html")
    elif btn_id == "btn2":
        window.location.assign("investir.html")
    elif btn_id == "btn3" and "comparar.html" in window.location.href:
        comparar_produtos(event)

def formatar_numero(event):
    input_element = event.target
    valor = input_element.value
    
    # Remove qualquer caractere que não seja número
    valor = ''.join(filter(str.isdigit, valor))
    
    # Se o valor estiver vazio, limpa o input
    if not valor:
        input_element.value = ''
        return
    
    # Converte para float e divide por 100 para obter o valor em reais
    try:
        numero = float(valor) / 100
        input_element.value = f"{numero:.2f}"
    except:
        input_element.value = ''

if "comparar.html" in window.location.href: # Adiciona os event listeners para os inputs
    inputs = document.select("input[type='text']")
    for input_element in inputs:
        input_element.bind("input", formatar_numero)

def comparar_produtos(event):
    preçoP1 = float(document.getElementById("preçoP1").value)
    unidP1 = float(document.getElementById("unidP1").value)
    pesoP1 = float(document.getElementById("pesoP1").value)
    valorP1 = (unidP1 * pesoP1) / preçoP1
    preçoP2 = float(document.getElementById("preçoP2").value)
    unidP2 = float(document.getElementById("unidP2").value)
    pesoP2 = float(document.getElementById("pesoP2").value)
    valorP2 = (unidP2 * pesoP2) / preçoP2

    if valorP1 > valorP2:
        window.location.assign(f"vencedor.html?resultado={preçoP1:.2f}")
    elif valorP1 < valorP2:
        window.location.assign(f"vencedor.html?resultado={preçoP2:.2f}")
    else:
        window.location.assign("vencedor.html?resultado=EMPATE")

# Verifica se estamos na página de resultado e mostra o resultado
if 'vencedor.html' in window.location.href:
    url = window.location.href
    resultado = url.split('resultado=')[1]
    document.getElementById('resultado').text = resultado

document.bind("click", handle_click)