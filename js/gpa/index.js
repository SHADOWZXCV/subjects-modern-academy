function gpaEnableInteraction() {
    const semestersHeaders = [...document.getElementsByClassName('flowsheet-header-cell')]
    const semestersSubHeaders = [...document.getElementsByClassName('flowsheet-subheader-cell')]
    const cells = [...document.getElementsByClassName('cell')]
    .filter(cell => !cell.dataset.isEmpty)

    semestersHeaders.forEach(header => {
        header.classList.add('flowsheet-header-cell_gpa_select')
        header.addEventListener('click', handleGPASelect)
    })
    semestersSubHeaders.forEach(header => {
        header.classList.add('flowsheet-subheader-cell_gpa_select')
        header.addEventListener('click', handleGPASelect)
    })
    cells.forEach(cell => {
        if(cell.dataset.optionalId){
            cell.classList.add('optional_cell_gpa')
        }
        else if(cell.dataset.isTraining){
            // since it has no effect on gpa
            cell.classList.add('no_cell_gpa')
        }
        else
            cell.classList.add('cell_gpa')
    })

}

function gpaDisableInteraction() {
    const semestersHeaders = [...document.getElementsByClassName('flowsheet-header-cell')]
    const semestersSubHeaders = [...document.getElementsByClassName('flowsheet-subheader-cell')]
    const cells = [...document.getElementsByClassName('cell')]
    .filter(cell => !cell.dataset.isEmpty)

    semestersHeaders.forEach(header => {
        header.classList.remove('flowsheet-header-cell_gpa_select')
    })
    semestersSubHeaders.forEach(header => {
        header.classList.remove('flowsheet-subheader-cell_gpa_select')
    })

    cells.forEach(header => {
        header.classList.remove('cell_gpa')
    })
}