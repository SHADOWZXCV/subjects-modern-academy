//    loadSpecificationData('./db/computer_engineering.json')
(function () {
    loadSpecificationData('./db/computer_engineering.json')
    .then(subjects => {
        const viewHeading = document.getElementById('chosen-semester-heading')
        viewHeading.innerHTML = `Currently viewing: <b>Computer Engineering</b>`
        initTable(subjects)
    })
})()


function renderTable() {
    const selected = document.getElementById('header-select-main').value
    loadSpecificationData('./db/index.json')
    .then(files => {
        if(files[selected])
        loadSpecificationData(`./db/${files[selected]}.json`)
        .then(subjects => {
            const viewHeading = document.getElementById('chosen-semester-heading')
            viewHeading.innerHTML = `Currently viewing: <b>${selected} Engineering</b>`
            initTable(subjects)
        })
    })
}
