const TRAINING = 1

function initTable(subjects) {
    // A undirected graph is essential for determining what requirements are 
    //for a subject, and what the subject can unlock. 
    const graph = new MirectedGraph()

    // reset the table
    const tableBody = document.getElementById('table-body-flowsheet')
    const tableCreditRow = document.getElementById('credit-table-row')
    tableBody.innerHTML = ''
    tableCreditRow.innerHTML = ''

    subjects.map(semester => initGraph(graph, semester))

    // initialize the search functionality
    const searchForm = document.getElementsByName('search-entry')[0]
    searchForm.addEventListener('keyup', e => highlightCellByCode(graph))

    /*
    *  These pointers point to current cell in table that needs to be filled!
    *  
    *  Previous pointer is made to be before the current by 1, it remembers
    *  the current pointer's last value after it's been reset, so that
    *  whenever the summer course array is loaded it is added as the LAST subject
    *  in the previous semester, even though it is in a different array.
    */
    let currentCellPtr = 0, 
    prevCellPtr = currentCellPtr, 
    currentRowPtr = 1,
    semestersCreditHours = []

    // column-row from u-graph loader, loads the cells for each row instead of row after row
    subjects.forEach((semester) => {
        /*
         * isTrainingSem: used to add spaces ONLY in 2 cases:
         * 1. No training courses in the next array
         * 2. If there is a training course, it adds the spaces
         * in the NEXT iteration, after the training course has been added.
         */
        let isTrainingSem = false
        let creditHours = 0
        let optionalCreditHoursTotal = 0
        
        semester.forEach(subject => {
            let optionalCreditHours = 0
            // training does not have any empty spaces after it, hence the exception..
            if(subject.type === TRAINING)
                isTrainingSem = true


            // optionalSets are loaded within the subjects, they are sets of subjects.
            else if(subject.optionalSet) {
                subject.optionalSet.forEach(optionalSubject => {
                    const vertex = graph.search(optionalSubject)

                    prevCellPtr = renderVertex(prevCellPtr, ++currentCellPtr, vertex, isTrainingSem)
                    optionalCreditHours = vertex.vertex.data.creditHours
                })

                optionalCreditHoursTotal += optionalCreditHours

                return
            }
                
                const vertex = graph.search(subject.id)
                
                creditHours += vertex.vertex.data.creditHours
                prevCellPtr = renderVertex(prevCellPtr, ++currentCellPtr, vertex, isTrainingSem)

        })

        // render empty spaces ONLY after the summer courses hsa been loaded as a part
        // of the 2nd semester.
        if(!isTrainingSem){
            for (let index = currentCellPtr; index < 10; index++) 
                renderEmptyCell(currentRowPtr, ++currentCellPtr)

            creditHours += optionalCreditHoursTotal
            semestersCreditHours.push(creditHours)
            // Go to next row after column has been filled
            currentRowPtr++
        }

        // reset the cell pointer, to start from cell 1 in the next column
        currentCellPtr = 0
    })

    renderCreditTable(semestersCreditHours)
}

function createSemestersRow(rowId) {
    const tbody = document.getElementById('table-body-flowsheet')
    let row = document.createElement('tr')

    row.className = 'flowsheet-row'
    row.id = rowId
    tbody.appendChild(row)

    return row
}

function renderCreditTable(semestersCreditHours) {
    const row = document.getElementById('credit-table-row')

    semestersCreditHours.forEach(credit => {
        const cell = document.createElement('th')
        cell.className = 'credit-cell'

        cell.innerHTML = `${credit} Hours`

        row.appendChild(cell)
    })
    return row
}