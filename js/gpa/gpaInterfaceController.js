const gpaDetails = {
    oldSubjects: {},
    currentCreditHrs: 0,
}

function getSelectedCellsBySemester(semester = 1) {
    return document.querySelectorAll(`.cell-gpa_selected[data-semester="${semester}"]:not([data-optional-id],[data-is-training])`)
}

function getAllCellsBySemester(semester = 1) {
    return document.querySelectorAll(`[data-semester="${semester}"]:not([data-optional-id],[data-is-training])`)
}

function handleGPASelect(event, creditHours = 0) {
    if(!event.currentTarget)
        return;

    const { dataset: { subjectId, semester: subjectSemester }, classList } = event.currentTarget
    const { headerYear, headerSemester } = event.currentTarget.dataset

    // It is a subject
    if(subjectId)
    {
        const subjectSemesterNumber = Number(subjectSemester)
        const selectedCurrentSemester = getSelectedCellsBySemester(subjectSemesterNumber)
        const allCurrentSemester = getAllCellsBySemester(subjectSemesterNumber)
        const currentSubjectSemesterHeader = document.querySelector(`[data-header-semester="${subjectSemester}"]`)
        
        const otherSemesterNumber = subjectSemesterNumber % 2 === 0 ? subjectSemesterNumber - 1 : subjectSemesterNumber + 1
        const yearNumber = Math.trunc((subjectSemesterNumber + 1) / 2)
        const selectedOtherSemester = getSelectedCellsBySemester(otherSemesterNumber)
        const allOtherSemester = getAllCellsBySemester(otherSemesterNumber)
        const yearHeaderElement = document.querySelector(`[data-header-year="${yearNumber}"]`)

        if(!classList.contains('cell-gpa_selected'))
        {
            if(selectedCurrentSemester.length === allCurrentSemester.length - 1)
                currentSubjectSemesterHeader.classList.add('cell-subheader-gpa_selected')
            
            if(selectedCurrentSemester.length + selectedOtherSemester.length === allCurrentSemester.length + allOtherSemester.length - 1)
                yearHeaderElement.classList.add('cell-header-gpa_selected')

            gpaDetails.oldSubjects[subjectId] = creditHours 
            classList.add('cell-gpa_selected')
        }
        else
        {
            if(selectedCurrentSemester.length === allCurrentSemester.length)
                currentSubjectSemesterHeader.classList.remove('cell-subheader-gpa_selected')

            if(selectedCurrentSemester.length + selectedOtherSemester.length === allCurrentSemester.length + allOtherSemester.length)
                yearHeaderElement.classList.remove('cell-header-gpa_selected')

            delete gpaDetails.oldSubjects[subjectId]
            classList.remove('cell-gpa_selected')
        }
    } 
    // we chose a year!
    else if(headerYear) {
        const [firstSem, secSem] = [(headerYear * 2) - 1, headerYear * 2]
        const semesterSubHeaders = document.querySelectorAll(`[data-header-semester="${firstSem}"], [data-header-semester="${secSem}"]`)

        if(!classList.contains('cell-header-gpa_selected'))
        {
            const semesterSubjects = document.querySelectorAll(`[data-semester="${firstSem}"]:not([data-optional-id]), [data-semester="${secSem}"]:not([data-optional-id])`)

            semesterSubjects.forEach(subject => {
                subject.classList.add('cell-gpa_selected')
                
                gpaDetails.oldSubjects[subject.dataset.subjectId] = Number(subject.dataset.creditHours)
            }, 0)

            classList.add('cell-header-gpa_selected')
            semesterSubHeaders.forEach(sub_header => sub_header.classList.add('cell-subheader-gpa_selected'))
        } else {
            const remainingSemesterSubjects = document.querySelectorAll(`.cell-gpa_selected[data-semester="${firstSem}"]:not([data-optional-id]), .cell-gpa_selected[data-semester="${secSem}"]:not([data-optional-id])`)
            remainingSemesterSubjects.forEach(subject => {
                subject.classList.remove('cell-gpa_selected')

                delete gpaDetails.oldSubjects[subject.dataset.subjectId]
            }, 0)

            classList.remove('cell-header-gpa_selected')
            semesterSubHeaders.forEach(sub_header => sub_header.classList.remove('cell-subheader-gpa_selected'))
        }
    } else if(headerSemester) {
        const year = Math.trunc((Number(headerSemester) + 1) / 2)
        const yearHeader = document.querySelector(`[data-header-year="${year}"]`)
        const otherSemester = Number(headerSemester) === (year * 2 - 1) ? (year * 2) : (year * 2 - 1)
        const otherSemesterHeader = document.querySelector(`[data-header-semester="${otherSemester}"]`)
        const isSemesterSelected = classList.contains('cell-subheader-gpa_selected')
        const isOtherSemesterSelected = otherSemesterHeader.classList.contains('cell-subheader-gpa_selected')

        // check-uncheck year if both semesters are selected
        if(!isSemesterSelected && isOtherSemesterSelected){
            yearHeader.classList.add('cell-header-gpa_selected')
        } else if(isSemesterSelected && isOtherSemesterSelected){
            yearHeader.classList.remove('cell-header-gpa_selected')
        }

        if(!isSemesterSelected)
        {
            const semesterSubjects = document.querySelectorAll(`[data-semester="${headerSemester}"]:not([data-optional-id])`)
            semesterSubjects.forEach(subject => {
                subject.classList.add('cell-gpa_selected')
                
                gpaDetails.oldSubjects[subject.dataset.subjectId] = Number(subject.dataset.creditHours)
            }, 0)
            
            classList.add('cell-subheader-gpa_selected')
        } else {
            const remainingSemesterSubjects = document.querySelectorAll(`.cell-gpa_selected[data-semester="${headerSemester}"]:not([data-optional-id])`)
            remainingSemesterSubjects.forEach(subject => {
                subject.classList.remove('cell-gpa_selected')

                delete gpaDetails.oldSubjects[subject.dataset.subjectId]
            }, 0)

            classList.remove('cell-subheader-gpa_selected')
        }
    }

}