(function () {
    loadSpecificationData('./db/computer_engineering.json')
    .then(subjects => {
        initTable(subjects)
    })
})()
