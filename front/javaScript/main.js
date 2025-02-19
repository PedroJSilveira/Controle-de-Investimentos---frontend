//Esperando que todo o HTML da página seja carregado para que as funções e eventos possam ser executados
document.addEventListener('DOMContentLoaded', function() {
    //Resgatando o elemento form e o elemendo tabela
    const form = document.getElementById('investimentoForm');
    const tabela = document.getElementById('investimentosTabela');

    if(form){
        //Qaundo o botão do Cadastrar do form for pressionado enviar os dados dos campos preenchidos para o backend 
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            //Pegando os valores dos inputs 
            const nome = document.getElementById('nomeInvestimentoInp').value;
            const tipo = document.getElementById('tipoInvestimentoInp').value;
            const valor = document.getElementById('valorInvestimentoInp').value;
            const data = document.getElementById('dataInvestimentoInp').value;

            //Criando um objeto com os valores
            const investimento = { nome, tipo, valor, data };

            //Método post para enviar os dados para o back-end
            const response = await fetch('http://localhost:3000/investimentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(investimento)
            });

            //Caso o response.ok retorne true o investimento foi cadastrado, caso contrário ele mostra o erro
            if(response.ok){
                alert('Investimento cadastrado com sucesso!');
                form.reset();
                carregarInvestimentos();
            } 
            else{
                const error = await response.json();
                alert(error.erro);
            }
        });
    }

    //Função para buscar os investimentos ja existentes no back-end e mostrar em uma tabela
    async function carregarInvestimentos() {
        //Buscando dados no back-end
        const response = await fetch('http://localhost:3000/investimentos');
        const investimentos = await response.json();
        
        //Criando os filhos da tabela com os investimentos ja existentes
        //Os filhos são criados ou como um texto normal ou como um valor de input para editar o elemento quando o botão editar é pressionado 
        tabela.innerHTML = '';
        investimentos.forEach(investimento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span id='span-nome-${investimento.id}'>${investimento.nome}</span>
                    <input type='text' value='${investimento.nome}' id='nome-${investimento.id}' style='display:none;'>
                </td>
                <td>
                    <span id='span-tipo-${investimento.id}'>${investimento.tipo}</span>
                    <input type='text' value='${investimento.tipo}' id='tipo-${investimento.id}' style='display:none;'>
                </td>
                <td>
                    <span id='span-valor-${investimento.id}'>${investimento.valor}</span>
                    <input type='text' value='${investimento.valor}' id='valor-${investimento.id}' onInput='mascaraMoeda(event);' style='display:none;'>
                </td>
                <td>
                    <span id='span-data-${investimento.id}'>${investimento.data}</span>
                    <input type='date' value='${investimento.data}' id='data-${investimento.id}' style='display:none;'>
                </td>
                <td>
                    <button onclick='editarInvestimento(${investimento.id})' id='editar-${investimento.id}'>Editar</button>
                    <button onclick='salvarInvestimentoEditado(${investimento.id})' id='salvar-${investimento.id}' style='display:none;'>Salvar</button>
                    <button id='buttonExcluir' onclick='excluirInvestimento(${investimento.id})'>Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });
    }
    carregarInvestimentos();

    //Alterando os dados da tabela para input
    window.editarInvestimento = function(id) {
        document.getElementById(`span-nome-${id}`).style.display = 'none';
        document.getElementById(`nome-${id}`).style.display = 'inline';
        
        document.getElementById(`span-tipo-${id}`).style.display = 'none';
        document.getElementById(`tipo-${id}`).style.display = 'inline';
        
        document.getElementById(`span-valor-${id}`).style.display = 'none';
        document.getElementById(`valor-${id}`).style.display = 'inline';
        
        document.getElementById(`span-data-${id}`).style.display = 'none';
        document.getElementById(`data-${id}`).style.display = 'inline';
        
        document.getElementById(`editar-${id}`).style.display = 'none';
        document.getElementById(`salvar-${id}`).style.display = 'inline';
    };

    //Salvando os dados editados da tabela
    window.salvarInvestimentoEditado = async function(id) {
        const nome = document.getElementById(`nome-${id}`).value.trim();
        const tipo = document.getElementById(`tipo-${id}`).value.trim();
        const valor = document.getElementById(`valor-${id}`).value.trim();
        const data = document.getElementById(`data-${id}`).value.trim();
    
        // Validação para garantir que nenhum campo está vazio
        if(!nome || !tipo || !valor || !data){
            alert('Preencha todos os campos antes de salvar.');
            return;
        }
    
        const investimento = { nome, tipo, valor, data };
    
        const response = await fetch(`http://localhost:3000/investimentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(investimento)
        });
    
        if(response.ok) {
            carregarInvestimentos();
            location.reload();
            alert('Investimento atualizado com sucesso!');
        } 
        else{
            const error = await response.json();
            alert(error.erro);
        }
    };
    

    //Excluindo um investimento da tabela
    window.excluirInvestimento = async function(id) {
        await fetch(`http://localhost:3000/investimentos/${id}`, {
            method: 'DELETE'
        });
        location.reload()
        carregarInvestimentos();
        alert("Investimento deletado com sucesso!")
    };

});

//Máscara para o valor do investimento ser mostrado em R$ 999.999,99
const mascaraMoeda = (event) => {
    const onlyDigits = event.target.value
      .split('')
      .filter(s => /\d/.test(s))
      .join('')
      .padStart(3, '0')
    const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2)
    event.target.value = maskCurrency(digitsFloat)
  }
  
  const maskCurrency = (valor, locale = 'pt-BR', currency = 'BRL') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor)
  }


