let SELECT_OLD = false,
CGPA_VIEW = false
const gpaDetails = {
    oldSubjects: {},
    currentSubjects: {},
    currentCreditHrs: 0,
}

function toggleSemestersHeadings(actions) {
    const { mode, selectType } = actions
    const { dataset: { semester: subjectSemester } } = actions.element
    const subjectSemesterNumber = Number(subjectSemester)
    const selectedModeClass = `${selectType}_selected_class`
    const selectedCurrentSemester = document.querySelectorAll(`.${modesMap[mode][selectedModeClass]}[data-semester="${subjectSemesterNumber}"]:not([data-optional-id],[data-is-training])`)
    const otherMode = mode === "first" ? "second" : mode === "second" ? "first" : ""
    const allCurrentSemester = document.querySelectorAll(`[data-semester="${subjectSemesterNumber}"]:not([data-optional-id],[data-is-training])`)
    const currentSubjectSemesterHeader = document.querySelector(`[data-header-semester="${subjectSemester}"]`)
    
    const otherSemesterNumber = subjectSemesterNumber % 2 === 0 ? subjectSemesterNumber - 1 : subjectSemesterNumber + 1
    const yearNumber = Math.trunc((subjectSemesterNumber + 1) / 2)
    const selectedOtherSemester = document.querySelectorAll(`.${modesMap[mode][selectedModeClass]}[data-semester="${subjectSemesterNumber}"]:not([data-optional-id],[data-is-training])`)
    const allOtherSemester = document.querySelectorAll(`[data-semester="${otherSemesterNumber}"]:not([data-optional-id],[data-is-training])`)
    const yearHeaderElement = document.querySelector(`[data-header-year="${yearNumber}"]`)

    if(actions.status === 'on'){
        if(selectedCurrentSemester.length === allCurrentSemester.length)
            currentSubjectSemesterHeader.classList.add(modesMap[mode]["subheader_selected_class"])
    
        if(selectedCurrentSemester.length + selectedOtherSemester.length === allCurrentSemester.length + allOtherSemester.length - 1)
            yearHeaderElement.classList.add(modesMap[mode]["header_selected_class"])
    } else {
        if(selectedCurrentSemester.length === allCurrentSemester.length - 1)
            currentSubjectSemesterHeader.classList.remove(modesMap[mode]["subheader_selected_class"])
    
        if(selectedCurrentSemester.length + selectedOtherSemester.length === allCurrentSemester.length + allOtherSemester.length)
            yearHeaderElement.classList.remove(modesMap[mode]["header_selected_class"])
    }

}

const modesMap = {
    'first': {
        gpaDetailsReserve: 'currentSubjects',
        cell_selected_class: 'cell-gpa_selected',
        header_selected_class: 'cell-header-gpa_selected',
        subheader_selected_class: 'cell-subheader-gpa_selected',
        subheader_to_be_selected_class: 'flowsheet-subheader-cell_gpa_select'
    },
    'second': {
        gpaDetailsReserve: 'oldSubjects',
        cell_selected_class: 'cell-gpa_selected_second',
        header_selected_class: 'cell-header-gpa_selected_second',
        subheader_selected_class: 'cell-subheader-gpa_selected_second',
        subheader_to_be_selected_class: 'flowsheet-subheader-cell_gpa_select_second'
    }
}

function toggleGPACell(actions) {
    const { mode, status } = actions
    const { dataset: { subjectId, creditHours }, classList } = actions.element

    if(status === 'on'){
        gpaDetails[modesMap[mode].gpaDetailsReserve][subjectId] = Number(creditHours) 
        classList.add(modesMap[mode].cell_selected_class)
        actions.element.dataset.gpaSelectMode = mode
    } else {
        delete gpaDetails[modesMap[mode].gpaDetailsReserve][subjectId]
        classList.remove(modesMap[mode].cell_selected_class)
        delete actions.element.dataset.gpaSelectMode
    }
}

function togglecolumnGPACell(actions) {
    const { status, element: { classList }, selectType, mode } = actions
    const otherMode = mode === "first" ? "second" : mode === "second" ? "first" : ""
    const areOtherModesApplied = classList.contains(modesMap[otherMode][`${selectType}_selected_class`])

    if(!otherMode || areOtherModesApplied)
        return

    if(status === "on")
        classList.add(modesMap[mode][`${selectType}_selected_class`])
    else
        classList.remove(modesMap[mode][`${selectType}_selected_class`])

    toggleAllRelatedCells(actions)
}

function toggleAllRelatedCells(actions) {
    const { selectType, status, mode } = actions
    const { headerYear, headerSemester } = actions.element.dataset
    const [firstSem, secSem] = [(headerYear * 2) - 1, headerYear * 2]
    const selectedClass = actions.status === "off" ? `.${modesMap[mode]["cell_selected_class"]}` : ""
    const secondSemesterSelector = `, ${selectedClass}[data-semester="${secSem}"]:not([data-optional-id],[data-is-training])`
    const semesterSubjects = document.querySelectorAll(`${selectedClass}[data-semester="${actions.selectType === 'header' ? firstSem : headerSemester}"]:not([data-optional-id],[data-is-training])${actions.selectType === 'header' ? secondSemesterSelector : ''}`)
    const semesterSubHeaders = document.querySelectorAll(`[data-header-semester="${firstSem}"], [data-header-semester="${secSem}"]`)


    semesterSubjects.forEach(subject => {

        const subjectActions = { ...actions, selectType: 'cell', element: subject }
        if(!subject.dataset.gpaSelectMode || subject.dataset.gpaSelectMode === mode)
            toggleGPACell(subjectActions)
    })

    if(selectType === "header") {
        semesterSubHeaders.forEach(sub_header => {
            if(status === "on")
                sub_header.classList.add(modesMap[mode][subheader_selected_class])
            else
                sub_header.classList.remove(modesMap[mode][subheader_selected_class])
        })
    }
}

function toggleYearBasedOnSemesters(actions) {
    const { mode } = actions
    const { dataset: { headerSemester }, classList } = actions.element
    const year = Math.trunc((Number(headerSemester) + 1) / 2)
    const yearHeader = document.querySelector(`[data-header-year="${year}"]`)
    const otherSemester = Number(headerSemester) === (year * 2 - 1) ? (year * 2) : (year * 2 - 1)
    const otherSemesterHeader = document.querySelector(`[data-header-semester="${otherSemester}"]`)
    const isSemesterSelected = classList.contains(modesMap[mode]["subheader_selected_class"])
    const isOtherSemesterSelected = otherSemesterHeader.classList.contains(modesMap[mode]["subheader_selected_class"])

    if(!isSemesterSelected && isOtherSemesterSelected){
        yearHeader.classList.add(modesMap[mode]["header_selected_class"])
    } else if(isSemesterSelected && isOtherSemesterSelected){
        yearHeader.classList.remove(modesMap[mode]["header_selected_class"])
    }
}

function isElementToggled(action) {
    // find all classes related to element type
    const { element: { classList }, mode, selectType } = action
    const styleClasses = Object.keys(modesMap).map(mapMode => modesMap[mapMode][`${selectType}_selected_class`])

    return !styleClasses.reduce((res, styleClass) => res &= !classList.contains(styleClass), true)
}

function handleGPASelect(event) {
    if(!event.currentTarget)
        return;

    const { dataset: { subjectId, gpaSelectMode } } = event.currentTarget
    const { headerYear, headerSemester } = event.currentTarget.dataset
    const actions = {
        element: event.currentTarget,
        selectType: subjectId ? 'cell' : headerYear ? 'header' : headerSemester ? 'subheader' : '', // header | subheader | cell
        mode: SELECT_OLD ? 'second' : 'first', // first | second
        status: '', // on | off
    }

    if(gpaSelectMode && actions.mode !== gpaSelectMode)
        return

    actions.status = !isElementToggled(actions) ? "on" : "off"

    if(subjectId) {
        toggleGPACell(actions)
        toggleSemestersHeadings(actions)
    } else if(headerYear) {
        togglecolumnGPACell(actions)
    } else if(headerSemester) {
        // check/uncheck year if both semesters are selected
        toggleYearBasedOnSemesters(actions)
        togglecolumnGPACell(actions)
    }

    setGPAValues("0.000")
    
    if(actions.mode === "first")
        addSubjectsToCalculator()
    else if(actions.mode === "second")
        updatePreviousCompletedHours()
}

function updatePreviousCompletedHours() {
    const credits_input = document.getElementsByName("cgpa-credits")[0]

    credits_input.value = Object.keys(gpaDetails.oldSubjects)
    .reduce((sum, subject) => sum + gpaDetails.oldSubjects[subject], 0)
}

function setGPAValues(value = "0.000") {
    const score = document.getElementById("ngpa-score")

    score.innerText = value
}

function addSubjectsToCalculator() {
    const ngpa_container = document.getElementById('ngpa-calc')
    const fragment = document.createDocumentFragment()
    const rows = ngpa_container.getElementsByClassName('gpa-subjects-rows')[0]
    let creditHrs = 0

    Object.keys(gpaDetails.currentSubjects).forEach(subject => {
        creditHrs += gpaDetails.currentSubjects[subject]
        const { vertex: { data: { subjectName }}} = MirectedGraph.search(graph, subject)

        const row = document.createElement('div')
        const gpa_entry1 = document.createElement('div')
        const gpa_entry2 = document.createElement('div')
        const gpa_entry3 = document.createElement('div')
        const gpa_entry4 = document.createElement('div')
        const subject_name = document.createElement('input')        
        const subject_code = document.createElement('input')
        const credits = document.createElement('input')
        const select_grade = document.createElement('select')
        const optionsText = '<option disabled>Choose</option> <option value="4.0">A+</option> <option value="4.0" selected>A</option> <option value="3.7">A-</option> <option value="3.3">B+</option> <option value="3.0">B</option> <option value="2.7">B-</option> <option value="2.3">C+</option> <option value="2.0">C</option> <option value="1.7">C-</option> <option value="1.3">D+</option> <option value="1.0">D</option> <option value="0.0">F</option>'
        const options = new DOMParser().parseFromString(optionsText, "text/html")

        subject_name.type = "text"
        subject_code.type = "text"
        credits.type = "text"

        subject_name.className = "gpa-input"
        subject_code.className = "gpa-input-small"
        credits.className = "gpa-input-small"
        select_grade.className = "gpa-select"

        subject_name.name = `ngpa-row-subject-name-${subject}`
        subject_code.name = `ngpa-row-subject-code-${subject}`
        credits.name = `ngpa-row-credit-hours-${subject}`
        select_grade.id = `gpa-select-${subject}`

        subject_name.placeholder = 'Subject name'
        subject_code.placeholder = 'Subject code'
        credits.placeholder = 'Credits'

        gpa_entry1.className = "gpa-entry"
        gpa_entry2.className = "gpa-entry"
        gpa_entry3.className = "gpa-entry"
        gpa_entry4.className = "gpa-entry"
        row.className = "gpa-subject-row"

        subject_name.value = subjectName
        subject_code.value = subject
        credits.value = gpaDetails.currentSubjects[subject]
        credits.dataset.creditHoursInput = gpaDetails.currentSubjects[subject]

        subject_code.disabled = true
        credits.disabled = true

        select_grade.innerHTML = options.body.innerHTML
        gpa_entry1.appendChild(subject_code)
        gpa_entry2.appendChild(credits)
        gpa_entry3.appendChild(select_grade)
        gpa_entry4.appendChild(subject_name)
        row.append(gpa_entry4, gpa_entry1, gpa_entry2, gpa_entry3)
        fragment.appendChild(row)
    })

    // if(creditHrs > 21)
    //     return

    const gpa_res_block = document.getElementById("gpa-res-block")
    const selectTextStep1 = document.getElementById("gpa-calculate-step-1")
    const selectStep2 = document.getElementById("gpa-calculate-step-2")

    if(!Object.keys(gpaDetails.currentSubjects).length)
    {
        selectTextStep1.style.display = "block"
        selectStep2.style.display = "none"
        gpa_res_block.style.display = "none"
    }
    else {
        selectTextStep1.style.display = "none"
        selectStep2.style.display = "block"
        gpa_res_block.style.display = "grid"
    }

    resetCalculator(rows)
    rows.appendChild(fragment)
}

function resetCalculator(rows) {
    const headingText = '<div id="gpa-subject-headings"><div class="gpa-subject-heading"><b>Subject</b></div><div class="gpa-subject-heading"><b>Code</b></div><div class="gpa-subject-heading"><b>Credit hours</b></div><div class="gpa-subject-heading"><b>Grade</b></div></div>'
    const heading = new DOMParser().parseFromString(headingText, "text/html")

    rows.innerHTML = heading.body.innerHTML + ""
}

function toggleTotalGPAClick() {
    const button = document.getElementById("cgpa-btn")
    const old_gpa_details = document.getElementById("old-gpa-details")
    const old_gpa = document.getElementsByName("cgpa")[0]
    const credits_input = document.getElementsByName("cgpa-credits")[0]
    const gpa_text = document.getElementById("ngpa-result-text")

    setGPAValues("0.000")

    if(!CGPA_VIEW)
    {
        button.innerText = "Hide Total GPA"    
        delete credits_input.style.borderBottom
        credits_input.disabled = false
        old_gpa_details.style.visibility = "visible"
        credits_input.value = ""
        old_gpa.value = ""
        gpa_text.innerText = "Your CGPA score:"    
    } else {
        button.innerText = "Total GPA"
        credits_input.value = ""
        old_gpa.value = ""
        old_gpa_details.style.visibility = "hidden"
        gpa_text.innerText = "Your GPA score:"
        setGPAValues(calculateNGPA().value)
    }

    toggleHintMessageMode("first")
    CGPA_VIEW = !CGPA_VIEW
}

function toggleConfusedCGPAView() {
    const no_credits_button = document.getElementById("cgpa-no-credits-btn")
    const credits_input = document.getElementsByName("cgpa-credits")[0]
    const cgpa_btn = document.getElementById("cgpa-btn")
    
    setGPAValues("0.000")
    // Force-show total gpa
    if(!CGPA_VIEW)
        toggleTotalGPAClick()

    if(!SELECT_OLD)
    {
        cgpa_btn.disabled = true
        no_credits_button.innerText = "Done"
        no_credits_button.classList.add('calculate-gpa-btn_on')
        credits_input.disabled = true
        credits_input.style.borderBottom = "none"
        
        toggleHintMessageMode("second")
        enableOldSubjectsSelectOnTable()
        SELECT_OLD = true
    } else {
        cgpa_btn.disabled = false
        no_credits_button.innerText = "Total GPA but no credit hours"
        no_credits_button.classList.remove('calculate-gpa-btn_on')
        credits_input.disabled = false
        credits_input.removeAttribute('style');

        toggleHintMessageMode("first")
        disableOldSubjectsSelectOnTable()
        SELECT_OLD = false
    }
}

function updateNGPAView(result) {
    const { totalCredits, value } = result
    const score = document.getElementById("ngpa-score")
    const cgpaCredits = Number(document.getElementsByName("cgpa-credits")[0].value)
    const old_gpa = document.getElementsByName("cgpa")[0]
    const oldGpa = Number(old_gpa.value)
    const credits_input = document.getElementsByName("cgpa-credits")[0]

    credits_input.disabled = false
    delete credits_input.style.borderBottom
    toggleHintMessageMode("first")

    if(CGPA_VIEW){
        if(!oldGpa){
            old_gpa.classList.add('error-input')
            return
        } else {
            old_gpa.classList.remove('error-input')
        }

        if(!cgpaCredits)
        {
            credits_input.classList.add('error-input')
            return
        } else {
            credits_input.classList.remove('error-input')
        }
    
    }

    const finalValue = ((value * totalCredits) + (oldGpa * cgpaCredits)) / (totalCredits + cgpaCredits)
    score.innerHTML = finalValue.toFixed(3)
}

function calculateNGPA() {
    const credit_hours = document.querySelectorAll('[data-credit-hours-input]')
    const gpa_subjects = Array.from(document.getElementsByClassName('gpa-select'))

    let total = 0
    let totalCredits = 0

    if(!gpa_subjects.length)
        return {
            value: (0.0001).toFixed(3)
        }

    gpa_subjects.forEach((gpa_subject, index) => {
        total += Number(credit_hours[index].value) * Number(gpa_subject.value)
        totalCredits += Number(credit_hours[index].value)
    })

    return {
        total,
        totalCredits,
        value: (total / totalCredits).toFixed(3)
    }
}
