d3.csv("data/rating.csv", function(dataSet) {

    dataSet.forEach(function (d) {
        d.sim = +d.sim;
    });

    $('#myTable').DataTable({
        "order": [[ 2, "desc" ]],
        data: dataSet,
        columns: [
            {mData: "full_name", title: "ПІБ"},
            {mData: "member", title: "партія"},
            {mData: "sim", title: "відстань"}

        ]
    })

});