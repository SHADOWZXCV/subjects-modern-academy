function gpaEnableInteraction() {
    const gpa_view = document.getElementById('gpa-calculator')
    const search_view = document.getElementById('search-details')
    const ngpaView = document.getElementById('ngpa-calc')
    
    ngpaView.style.display = 'grid'
    gpa_view.style.display = 'flex'
    search_view.style.display = 'none'
    
    toggleHintMessageMode("first")

    enableSubjectsSelectOnTable()
}

function toggleHintMessageMode(mode = "first") {
    const hint_message = document.getElementById('select-hint-message')
    const firstModeMessage = "Click any <span id='subject-explain'>subject</span> to add it, or the <span id='subheader-explain'>blue bordered rectangle</span> to select a <b>column</b>"
    const secondModeMessage = "Choose the any <span id='old-subject-explain'>subject</span> to add it, or <span id='old-subheader-explain'>red bordered rectangle</span> to select a <b>column</b>"

    hint_message.innerHTML = mode === "first" ? firstModeMessage : secondModeMessage

    const subheader_explain = document.getElementById(mode === "first" ? "subheader-explain" : "old-subheader-explain")

    subheader_explain.addEventListener("mouseenter", e => {
        const subheaders = document.querySelectorAll(`.${modesMap[mode]["subheader_to_be_selected_class"]}:not(.${modesMap[mode]['subheader_selected_class']})`)

        Array.from(subheaders).forEach(subheader => {
            subheader.classList.add(`flowsheet-subheader-explain_${mode}`)
        })
    })

    subheader_explain.addEventListener("mouseleave", e => {
        const subheaders = document.querySelectorAll(`.${modesMap[mode]["subheader_to_be_selected_class"]}:not(.${modesMap[mode]['subheader_selected_class']})`)

        Array.from(subheaders).forEach(subheader => {
            subheader.classList.remove(`flowsheet-subheader-explain_${mode}`)
        })
    })
}

function gpaDisableInteraction() {
    const gpa_view = document.getElementById('gpa-calculator')
    const search_view = document.getElementById('search-details')
    const gpa_res_block = document.getElementById("gpa-res-block")
    const ngpa_container = document.getElementById('ngpa-calc')
    const rows = ngpa_container.getElementsByClassName('gpa-subjects-rows')[0]
    const selectTextStep1 = document.getElementById("gpa-calculate-step-1")
    const selectStep2 = document.getElementById("gpa-calculate-step-2")


    gpa_res_block.style.display = 'none'
    gpa_view.style.display = 'none'
    selectTextStep1.style.display = 'block'
    selectStep2.style.display = 'none'
    search_view.style.display = 'block'

    resetCalculator(rows)

    gpaDetails.currentSubjects = {}
    gpaDetails.oldSubjects = {}
    GPA_MODE = false
    
    if(SELECT_OLD)
    {
        toggleConfusedCGPAView()        
        SELECT_OLD = false
    }
    if(CGPA_VIEW)
    {
        toggleTotalGPAClick()
        CGPA_VIEW = false
    }

    disableSelectOnTable()
}

function toggleNGPACalcView(state = false) {
    const searchView = document.getElementById('ngpa-calc')

    searchView.style.display = state ? 'grid' : 'none'
}

function toggleCGPACalcView(state = false) {
    const searchView = document.getElementById('cgpa-calc')

    searchView.style.display = state ? 'flex' : 'none'
}


function enableSubjectsSelectOnTable() {
    const semestersSubHeaders = [...document.getElementsByClassName('flowsheet-subheader-cell')]
    const cells = [...document.getElementsByClassName('cell')]
    .filter(cell => !cell.dataset.isEmpty)

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

function enableOldSubjectsSelectOnTable() {
    const semestersSubHeaders = [...document.querySelectorAll('.flowsheet-subheader-cell:not(.cell-subheader-gpa_selected)')]

    semestersSubHeaders.forEach(header => {

        header.classList.remove('flowsheet-subheader-cell_gpa_select')
        header.classList.add('flowsheet-subheader-cell_gpa_select_second')
    })
}

function disableOldSubjectsSelectOnTable() {
    const semestersSubHeaders = [...document.querySelectorAll('.flowsheet-subheader-cell:not(.cell-subheader-gpa_selected)')]

    semestersSubHeaders.forEach(header => {
        header.classList.add('flowsheet-subheader-cell_gpa_select')
        header.classList.remove('flowsheet-subheader-cell_gpa_select_second')
    })
}

function disableSelectOnTable() {
    const hint_message = document.getElementById('select-hint-message')
    const semestersHeaders = [...document.getElementsByClassName('flowsheet-header-cell')]
    const semestersSubHeaders = [...document.getElementsByClassName('flowsheet-subheader-cell')]
    const cells = [...document.getElementsByClassName('cell')]
    .filter(cell => !cell.dataset.isEmpty)

    hint_message.innerHTML = ""
    semestersHeaders.forEach(header => {
        header.classList.remove('cell-header-gpa_selected')
        header.classList.remove('cell-header-gpa_selected_second')
        header.removeEventListener('click', handleGPASelect)
    })
    semestersSubHeaders.forEach(header => {
        header.classList.remove('flowsheet-subheader-cell_gpa_select')
        header.classList.remove('flowsheet-subheader-cell_gpa_select_second')
        header.classList.remove('cell-subheader-gpa_selected')
        header.classList.remove('cell-subheader-gpa_selected_second')
        header.classList.remove("flowsheet-subheader_explain")
        header.removeEventListener('click', handleGPASelect)
    })

    cells.forEach(cell => {
        cell.classList.remove('cell_gpa')
        cell.classList.remove('cell-gpa_selected')
        cell.classList.remove('cell-gpa_selected_second')
        cell.classList.remove('optional_cell_gpa')
        cell.classList.remove('no_cell_gpa')
        delete cell.dataset.gpaSelectMode
    })
}
