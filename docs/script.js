/**
 * Calc Champs - Lógica de Funcionamento
 * 
 * Este arquivo controla a interatividade da página, incluindo a troca de abas
 * e os cálculos matemáticos para as ferramentas de comparação, investimento e combustível.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LÓGICA DE SELEÇÃO DE ABAS
    // ==========================================

    // Selecionamos todos os botões de aba e as seções de conteúdo
    const botoesAbas = document.querySelectorAll('.botao-aba');
    const conteudosFerramentas = document.querySelectorAll('.conteudo-ferramenta');

    // Para cada botão de aba, adicionamos um "ouvinte" de clique
    botoesAbas.forEach(botao => {
        botao.addEventListener('click', () => {
            // Pegamos o identificador da aba que o usuário clicou (armazenado em 'data-aba')
            const abaAlvo = botao.getAttribute('data-aba');

            // 1.1 Atualizar os Botões: Removemos a classe 'ativo' de todos e colocamos apenas no clicado
            botoesAbas.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            // 1.2 Atualizar o Conteúdo: Escondemos todos e mostramos apenas o que tem o ID igual à aba alvo
            conteudosFerramentas.forEach(conteudo => {
                conteudo.classList.remove('ativo');
                if (conteudo.id === abaAlvo) {
                    conteudo.classList.add('ativo');
                }
            });
        });
    });

    // ==========================================
    // 2. LÓGICA DE CÁLCULO CENTRAL
    // ==========================================

    /**
     * FERRAMENTA: 1. COMPARAÇÃO DE PRODUTOS
     * Objetivo: Descobrir qual produto rende mais por cada real investido.
     */

    // Lista de IDs dos campos de entrada desta ferramenta
    const entradasComparacao = ['precoA', 'unidadesA', 'pesoA', 'precoB', 'unidadesB', 'pesoB'];

    // Adicionamos um ouvinte para disparar o cálculo toda vez que o usuário digitar algo
    entradasComparacao.forEach(id => {
        document.getElementById(id).addEventListener('input', calcularComparacao);
    });

    function calcularComparacao() {
        // Capturamos os valores dos campos do Produto A
        const precoA = parseFloat(document.getElementById('precoA').value);
        const unidadesA = parseFloat(document.getElementById('unidadesA').value) || 1;
        const pesoA = parseFloat(document.getElementById('pesoA').value);

        // Capturamos os valores dos campos do Produto B
        const precoB = parseFloat(document.getElementById('precoB').value);
        const unidadesB = parseFloat(document.getElementById('unidadesB').value) || 1;
        const pesoB = parseFloat(document.getElementById('pesoB').value);

        // Referenciamos os elementos onde exibiremos o resultado
        const divResultado = document.getElementById('resultado-comparacao');
        const spanTexto = document.getElementById('texto-comparacao');
        const spanDetalhe = document.getElementById('detalhe-comparacao');

        // Só fazemos o cálculo se os campos essenciais estiverem preenchidos
        if (precoA && pesoA && precoB && pesoB) {
            // Regra de Três: (Quantidade Total) / Preço = Gramas ou ML por cada R$ 1,00
            const rendimentoA = (unidadesA * pesoA) / precoA;
            const rendimentoB = (unidadesB * pesoB) / precoB;

            // Mostramos o banner de resultado
            divResultado.style.display = 'block';

            if (rendimentoA > rendimentoB) {
                // Produto A é melhor
                const diferenca = ((rendimentoA / rendimentoB - 1) * 100).toFixed(1);
                spanTexto.innerHTML = 'Opção: <span class="destaque-verde">Produto A</span>';
                spanDetalhe.innerHTML = `O Produto A rende <strong>${diferenca}%</strong> a mais por cada Real investido.`;
            } else if (rendimentoB > rendimentoA) {
                // Produto B é melhor
                const diferenca = ((rendimentoB / rendimentoA - 1) * 100).toFixed(1);
                spanTexto.innerHTML = 'Opção: <span class="destaque-verde">Produto B</span>';
                spanDetalhe.innerHTML = `O O Produto B rende <strong>${diferenca}%</strong> a mais por cada Real investido.`;
            } else {
                // Empate técnico
                spanTexto.innerText = 'Custo idêntico';
                spanDetalhe.innerText = 'Ambos os produtos têm a mesma relação custo-benefício.';
            }
        } else {
            // Se faltar dados, escondemos o resultado
            divResultado.style.display = 'none';
        }
    }

    /**
     * FERRAMENTA: 2. ANÁLISE DE INVESTIMENTO
     * Objetivo: Comparar se vale a pena pagar à vista com desconto ou parcelar e investir o dinheiro.
     */

    const entradasInvestimento = ['parcelas', 'valorParcela', 'valorAVista', 'rendimentoPerc'];

    entradasInvestimento.forEach(id => {
        document.getElementById(id).addEventListener('input', calcularInvestimento);
    });

    function calcularInvestimento() {
        // Coleta os valores numéricos dos inputs
        const qtdParcelas = parseInt(document.getElementById('parcelas').value);
        const valorParcela = parseFloat(document.getElementById('valorParcela').value);
        const valorAVista = parseFloat(document.getElementById('valorAVista').value);
        const percRendimento = parseFloat(document.getElementById('rendimentoPerc').value) || 0;

        const divResultado = document.getElementById('resultado-investimento');
        const spanTexto = document.getElementById('texto-investimento');
        const spanDetalhe = document.getElementById('detalhe-investimento');

        if (qtdParcelas && valorParcela && valorAVista) {
            // Cálculo do custo total se for parcelado
            const totalPagoAoFinal = qtdParcelas * valorParcela;

            // Cálculo de Juros Compostos: M = P * (1 + i)^n
            // M = Montante Final, P = Principal (Valor que seria pago à vista), i = taxa, n = tempo
            const valorFuturoDoInvestimento = valorAVista * Math.pow((1 + (percRendimento / 100)), qtdParcelas);

            divResultado.style.display = 'block';

            // Se o dinheiro investido crescer mais do que o custo total das parcelas, parcerlar é melhor
            if (valorFuturoDoInvestimento > totalPagoAoFinal) {
                const lucro = (valorFuturoDoInvestimento - totalPagoAoFinal).toFixed(2);
                spanTexto.innerHTML = 'Melhor: <span class="destaque-verde">PARCELAR</span>';
                spanDetalhe.innerHTML = `Se você investir o valor à vista, terá <strong>R$ ${valorFuturoDoInvestimento.toFixed(2)}</strong> ao final do tempo.<br>Isso supera o parcelamento em <strong>R$ ${lucro}</strong>.`;
            } else {
                // Caso contrário, o desconto à vista compensa mais
                const prejuizo = (totalPagoAoFinal - valorFuturoDoInvestimento).toFixed(2);
                spanTexto.innerHTML = 'Melhor: <span class="destaque-rosa">À VISTA</span>';
                spanDetalhe.innerHTML = `O rendimento do investimento não supera o preço total parcelado.<br>Pagar à vista economiza <strong>R$ ${prejuizo}</strong> reais no comparativo final.`;
            }
        } else {
            divResultado.style.display = 'none';
        }
    }

    /**
     * FERRAMENTA: 3. AUTONOMIA DE COMBUSTÍVEL
     * Objetivo: Calcular quantos KM você vai rodar com o valor abastecido.
     */

    const entradasCombustivel = ['precoCombustivel', 'valorAbastecido', 'kmAtual'];

    entradasCombustivel.forEach(id => {
        document.getElementById(id).addEventListener('input', calcularCombustivel);
    });

    function calcularCombustivel() {
        const precoLitro = parseFloat(document.getElementById('precoCombustivel').value);
        const valorGasto = parseFloat(document.getElementById('valorAbastecido').value);
        const kmAtualDoVeiculo = parseFloat(document.getElementById('kmAtual').value);

        const divResultado = document.getElementById('resultado-combustivel');
        const spanTexto = document.getElementById('texto-combustivel');
        const spanDetalhe = document.getElementById('detalhe-combustivel');

        if (precoLitro && valorGasto && kmAtualDoVeiculo) {
            // 1. Calculamos quantos litros foram colocados no tanque
            const litrosTotal = valorGasto / precoLitro;

            // 2. Estimamos a distância (Média padrão de 10km por litro)
            const distanciaEstimada = litrosTotal * 10;

            // 3. Calculamos em qual KM o motorista precisará abastecer novamente
            const proximoAbastecimentoEmEm = kmAtualDoVeiculo + distanciaEstimada;

            divResultado.style.display = 'block';
            spanTexto.innerHTML = `<span class="destaque">${proximoAbastecimentoEmEm.toFixed(0)} KM</span>`;
            spanDetalhe.innerHTML = `Com R$ ${valorGasto.toFixed(2)}, você colocou <strong>${litrosTotal.toFixed(2)} litros</strong>.<br>Deve rodar aproximadamente <strong>${distanciaEstimada.toFixed(0)} KM</strong>.`;
        } else {
            divResultado.style.display = 'none';
        }
    }
});
