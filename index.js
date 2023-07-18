//    loadSpecificationData('./db/computer_engineering.json')
(function () {
    const side = document.getElementById('subject-info-container')
    const toggleTableState = document.getElementById('toggle-hold-form')
    side.addEventListener('click', e => {
        if(e.target === side)
            unmountSubjectInfo()
    })
    toggleTableState.addEventListener('change', e => {
        const isHeld = new FormData(toggleTableState).get('search-hold')
        if(isHeld)
            holdCells()
    })

    loadSpecificationData('./db/computer_engineering.json')
    .then(subjects => {
        const viewHeading = document.getElementById('chosen-semester-heading')
        viewHeading.innerHTML = `Currently viewing: <b>Computer Engineering</b>`

        initTable(subjects)
    })
})()


function renderTable() {
    // reset search and table holding position
    const searchForm = document.getElementsByName('search-entry')[0]
    searchForm.value = ''
    const holdBox = document.getElementsByName('search-hold')[0]
    holdBox.checked = false

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

function highlightCellByCode(graph) {
    const searchForm = document.getElementById('search-bar')
    const search = new FormData(searchForm)
    const searchEntry = search.get('search-entry')
    const cell = document.querySelector(`[data-subject-id='${searchEntry}']`)
    const vertex = graph.search(searchEntry)

    if(!cell || !vertex)
    {
        resetHighlightedCells()
        return false
    }

    
    highlightCell(cell, vertex, cell.dataset.optionalId)
    
    // Holds cell if a cell is found and the hold checkbox is checked
    if(isHeld())
        holdCells()

    return false
}
