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
    valor = ''.join(filter(str.isdigit, valor)) # Remove qualquer caractere que não seja número
    if not valor: # Se o valor estiver vazio, limpa o input
        input_element.value = ''
        return
    try: # Converte para float e divide por 100 para obter o valor em reais
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
        window.location.assign(f"resultado.html?resultado={preçoP1:.2f}&tipo=1")
    elif valorP1 < valorP2:
        window.location.assign(f"resultado.html?resultado={preçoP2:.2f}&tipo=1")
    else:
        window.location.assign(f"resultado.html?resultado={None}&tipo=2")

def creditar_debitar(event):
    qtdPARC = float(document.getElementById("qtdPARC").value)
    vlrPARC = float(document.getElementById("vlrPARC").value)
    vlrAVISTA = float(document.getElementById("vlrAVISTA").value)
    percREND = float(document.getElementById("percREND").value)
    total = qtdPARC * vlrPARC
    montante = vlrAVISTA * (1 + percREND / 100) ** (1 * qtdPARC)
    montante = round(montante, 2)
    total = round(total, 2)

    if montante > total:
        lucro = round(montante - total, 2)
        resultado = f"{vlrAVISTA},{percREND},{montante},{qtdPARC},{lucro},{total}"
        window.location.assign(f"resultado.html?resultado={resultado}&tipo=3")
    elif montante < total:
        lucro = round(total - montante, 2)
        resultado = f"{qtdPARC},{montante},{lucro}"
        window.location.assign(f"resultado.html?resultado={resultado}&tipo=4")
    else:
        window.location.assign(f"resultado.html?resultado={None}&tipo=5")

def formatar_resultado(resultado,tipo):
    if tipo == "1":
        return f'''O produto que sai por
            R$ {resultado}
            Vale mais a pena!
        '''
    elif tipo == "2":
        return "Os 2 produtos tem o mesmo custo benefício!"
    elif tipo == "3":
        valores = [float(x) for x in resultado.split(',')]
        return f'''Manter seus R${valores[0]:.2f} <br>
            rentabilizando {valores[1]:.2f}% ao mês <br>
            te retornará o montante de <br>
            R${valores[2]:.2f} em {valores[3]:.0f} meses! <br>
            ... <br>
            R${valores[4]:.2f} a mais do que os <br>
            R${valores[5]:.2f} pagos <br>
            nestas {valores[3]:.0f} parcelas.
        '''
    elif tipo == "4":
        valores = [float(x) for x in resultado.split(',')]
        return f'''Depois de {valores[0]:.0f} meses <br>
            seus investimentos <br>
            teriam retornado apenas <br>
            R${valores[1]:.2f} <br>
            ... <br>
            R${valores[2]:.2f} é a <br>
            economia que você fará <br>
            quitando esta divida agora!
        '''
    elif tipo == "5":
        return "Tanto faz pagar à vista ou parcelado."

# Verifica se estamos na página de resultado e mostra o resultado
if 'resultado.html' in window.location.href:
    url = window.location.href
    params = url.split('?')[1].split('&')
    resultado = params[0].split('=')[1]
    tipo = params[1].split('=')[1]
    texto_formatado = formatar_resultado(resultado,tipo)
    document.getElementById('resultado').innerHTML = texto_formatado

document.bind("click", handle_click)