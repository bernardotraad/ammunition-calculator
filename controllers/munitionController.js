exports.calculate = (req, res) => {
    try {
        const { pistola, fuzil, sub, escopeta, sniper, aplicarDesconto, descontoPredefinido, desconto } = req.body;

        const precos = {
            pistola: 1100,
            fuzil: 720,
            sub: 720,
            escopeta: 11000,
            sniper: 70000
        };

        const quantidade = {
            pistola: parseInt(pistola) || 0,
            fuzil: parseInt(fuzil) || 0,
            sub: parseInt(sub) || 0,
            escopeta: parseInt(escopeta) || 0,
            sniper: parseInt(sniper) || 0
        };

        let total = 0;
        for (let key in quantidade) {
            total += quantidade[key] * precos[key];
        }

        if (aplicarDesconto) {
            let descontoPercentual = 0;
            if (descontoPredefinido) {
                descontoPercentual = parseFloat(descontoPredefinido);
            } else if (desconto) {
                descontoPercentual = parseFloat(desconto);
            }

            if (descontoPercentual > 0 && descontoPercentual <= 100) {
                total -= total * (descontoPercentual / 100);
            } else {
                return res.status(400).json({ message: 'Desconto inválido!' });
            }
        }

        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.clear = (req, res) => {
    res.status(200).json({ message: 'Cleared' });
};
