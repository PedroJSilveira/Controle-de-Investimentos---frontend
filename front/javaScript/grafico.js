//Função para pegar os dados do back-end e transformar em gráfico de tipos de investimento
async function graficoDeTipos() {
    try {
        //Recuperando dados
        const response = await fetch('http://localhost:3000/investimentos/distribuicao');
        const data = await response.json();
        const labels = Object.keys(data); 
        const valores = Object.values(data); 

        //Criando gráfico do tipo pizza
        const grafico = document.getElementById("graficoInvestimentos").getContext("2d");
        new Chart(grafico, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Distribuição de Investimentos",
                    data: valores,
                    backgroundColor: [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"
                    ],
                    borderWidth: 1
                }]
            }
        });
    } catch (erro) {
        console.error("Erro no gráfico:", erro);
    }
}


graficoDeTipos();