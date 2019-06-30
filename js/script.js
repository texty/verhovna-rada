d3.csv("data/rating.csv", function(dataSet) {

    dataSet.forEach(function (d) {
        d.sim = +d.sim;
    });

    $('#myTable').DataTable({
        "order": [[ 2, "desc" ]],
        data: dataSet,
        columns: [
            {mData: "full_name", title: "ПІБ"},
            {mData: "member", title: "Партія"},
            {mData: "sim", title: "Відстань"}

        ]
    })

});


d3.csv("data/parties_rating.csv", function(dataSet) {

    dataSet.forEach(function (d) {
        d.sim = +d.sim;
    });

    $('#myTable_parties').DataTable({
        "order": [[ 1, "desc" ]],
        data: dataSet,
        paging:false,
        searching:false,
        columns: [
            {mData: "full_name", title: "Назва"},
            {mData: "sim", title: "Відстань"}

        ]
    })

});