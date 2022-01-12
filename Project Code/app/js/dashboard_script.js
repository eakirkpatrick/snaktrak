const data = {

  datasets: [{
    label: 'Balance',
    data: <%- JSON.stringify(prices) %>,
    labels: <%- JSON.stringify(names) %>,
    backgroundColor: <%- JSON.stringify(rgb_vals) %>,
    hoverOffset: 4
  }]
};
const config = {
  type: 'doughnut',
  data: data,
  options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                      var index = context.dataIndex;
                      var value = context.dataset.data[index];
                      var label = context.dataset.labels[index];
                      return label + '  $' + value;
                    },
                }
            }
        }
  }
};
var ctx = document.getElementById('balanceChart');
var myChart = new Chart(ctx,
  config
);
