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
    elif btn_id == "btn4" and "investir.html" in window.location.href:
        creditar_debitar(event)

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

if "comparar.html" or "investir.html" in window.location.href: # Adiciona os event listeners para os inputs
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
        window.location.assign(f"resultado.html?resultado={preçoP1:.2f}")
    elif valorP1 < valorP2:
        window.location.assign(f"resultado.html?resultado={preçoP2:.2f}")
    else:
        window.location.assign("resultado.html?resultado=EMPATE")

def creditar_debitar(event):
    qtdPARC = float(document.getElementById("qtdPARC").value)
    vlrPARC = float(document.getElementById("vlrPARC").value)
    vlrAVISTA = float(document.getElementById("vlrAVISTA").value)
    percREND = float(document.getElementById("percREND").value)
    total = qtdPARC * vlrPARC
    montante = vlrAVISTA * (1 + percREND / 1) ** (1 * qtdPARC)
    
    montante = round(montante, 2)
    total = round(total, 2)
    
    # if qtdPARC <= 0 or vlrPARC <= 0 or vlrAVISTA <= 0 or percREND <= 0: # Verifica se os valores são válidos

    if montante > total:
        lucro = round(montante - total, 2)
        resultado = f'''resultado.html?resultado=
            Manter seus R${vlrAVISTA:.2f}
            investidos a {percREND:.2f}% ao mês
            te retornará o montante de R${montante:.2f}
            ...
            R${lucro:.2f} a mais do que os
            R${total:.2f} pagos em {qtdPARC} meses.
            '''
    elif montante < total:
        lucro = round(total - montante, 2)
        resultado = f'''resultado.html?resultado=
            Depois de {qtdPARC} meses
            seu investimento teria retornado
            apenas R${montante:.2f}
            ...
            R${lucro:.2f} é a economia que você
            fará quitando esta divida agora!
            '''
    else:
        resultado = f'''vencedor.html?resultado=
            Tanto faz pagar à vista ou parcelado.
            '''
    window.location.assign(resultado)

# Verifica se estamos na página de resultado e mostra o resultado
if 'resultado.html' in window.location.href:
    url = window.location.href
    resultado = url.split('resultado=')[1]
    document.getElementById('resultado').text = resultado

document.bind("click", handle_click)