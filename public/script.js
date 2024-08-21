document.getElementById('aplicarDesconto').addEventListener('change', function() {
    const descontoPredefinido = document.getElementById('descontoPredefinido');
    const desconto = document.getElementById('desconto');

    if (this.checked) {
        descontoPredefinido.disabled = false;
        desconto.disabled = false;
    } else {
        descontoPredefinido.disabled = true;
        desconto.disabled = true;
        descontoPredefinido.value = "";
        desconto.value = "";
    }
    calcular();
    calcularQuantidade();
});

const inputs = [
    document.getElementById('pistola'), document.getElementById('fuzil'), document.getElementById('sub'), document.getElementById('escopeta'),
    document.getElementById('sniper'), document.getElementById('desconto'), document.getElementById('valorDesejado'), document.getElementById('tipoMunicao')
];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        calcular();
        calcularQuantidade();
    });
});

document.getElementById('descontoPredefinido').addEventListener('change', () => {
    calcular();
    calcularQuantidade();
});

async function calcular() {
    const data = {
        pistola: document.getElementById('pistola').value,
        fuzil: document.getElementById('fuzil').value,
        sub: document.getElementById('sub').value,
        escopeta: document.getElementById('escopeta').value,
        sniper: document.getElementById('sniper').value,
        aplicarDesconto: document.getElementById('aplicarDesconto').checked,
        descontoPredefinido: document.getElementById('descontoPredefinido').value,
        desconto: document.getElementById('desconto').value
    };

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.status === 200) {
            document.getElementById('resultado').innerText = `Total: R$${result.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            document.getElementById('mensagemSucesso').innerText = "Cálculo realizado com sucesso!";
            document.getElementById('mensagemSucesso').style.display = 'block';
        } else {
            document.getElementById('mensagemErro').innerText = result.message;
        }
    } catch (error) {
        document.getElementById('mensagemErro').innerText = "Erro ao calcular.";
    }
}

async function calcularQuantidade() {
    const valorDesejado = parseFloat(document.getElementById('valorDesejado').value) || 0;
    const tipoMunicao = document.getElementById('tipoMunicao').value;

    if (valorDesejado <= 0 || isNaN(valorDesejado)) {
        document.getElementById('resultadoQuantidade').innerText = "Por favor, insira um valor válido.";
        return;
    }

    const data = {
        valorDesejado,
        tipoMunicao,
        aplicarDesconto: document.getElementById('aplicarDesconto').checked,
        descontoPredefinido: document.getElementById('descontoPredefinido').value,
        desconto: document.getElementById('desconto').value
    };

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.status === 200) {
            const precoPorUnidade = {
                pistola: 1100,
                fuzil: 720,
                sub: 720,
                escopeta: 11000,
                sniper: 70000
            }[tipoMunicao];
            const quantidade = Math.floor(valorDesejado / precoPorUnidade);

            document.getElementById('resultadoQuantidade').innerText = `R$${valorDesejado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} compram ${quantidade} munições de ${tipoMunicao}.`;
        } else {
            document.getElementById('mensagemErro').innerText = result.message;
        }
    } catch (error) {
        document.getElementById('mensagemErro').innerText = "Erro ao calcular.";
    }
}

function limpar() {
    document.getElementById('municaoForm').reset();
    document.getElementById('aplicarDesconto').checked = false;
    document.getElementById('descontoPredefinido').value = "";
    document.getElementById('desconto').value = "";
    document.getElementById('descontoPredefinido').disabled = true;
    document.getElementById('desconto').disabled = true;
    document.getElementById('valorDesejado').value = "";
    document.getElementById('tipoMunicao').value = "pistola";
    document.getElementById('resultado').innerText = "";
    document.getElementById('resultadoQuantidade').innerText = "";
    document.getElementById('mensagemSucesso').innerText = "";
    document.getElementById('mensagemErro').innerText = "";
    document.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
    document.querySelectorAll('small.error-message').forEach(small => small.innerText = "");
}
