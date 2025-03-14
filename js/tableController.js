const TRAINING = 1
// A undirected graph is essential for determining what requirements are 
//for a subject, and what the subject can unlock. 
const graph = new MirectedGraph()

function initTable(subjects) {
    const tableBody = document.getElementById('table-body-flowsheet')
    const tableCreditRow = document.getElementById('credit-table-row')
    tableBody.innerHTML = ''
    tableCreditRow.innerHTML = ''

    // reset the table
    graph.clear()
    subjects.map(semester => initGraph(graph, semester))

    // initialize the search functionality
    const searchForm = document.getElementsByName('search-entry')[0]

    if(searchForm)
       searchForm.addEventListener('keyup', e => highlightCellByCode(graph))

    // get value of maximum table rows
    const maxRows = getMaxTableRowLength(subjects)

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

    // column-row from a mirected-graph loader, loads the cells for each row instead of row after row
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
                subject.list.forEach(optionalSubject => {
                    const vertex = graph.search(optionalSubject.id)
                    const {semester: rowPtr, optionalSetId} = optionalSubject
                
                    prevCellPtr = renderVertex(prevCellPtr, ++currentCellPtr, vertex, isTrainingSem, rowPtr, optionalSetId)
                    optionalCreditHours = vertex.vertex.data.creditHours
                })

                optionalCreditHoursTotal += optionalCreditHours

                return
            }
                
                const vertex = graph.search(subject.id)
                const rowPtr = subject.semester
                
                creditHours += vertex.vertex.data.creditHours
                prevCellPtr = renderVertex(prevCellPtr, ++currentCellPtr, vertex, isTrainingSem, rowPtr)

        })

        // render empty spaces ONLY after the summer courses has been loaded as a part
        // of the 2nd semester.
        if(!isTrainingSem){
            /*
             * Description & importance of maxRows:
             * The loop times is directly correspondent to the maximum number of subjects in all of the columns..
             * as it is responsible for adding empty cells to each row, aligning the table's cells properly.
             * if not changed and max has changed, the subjects which are more than the max number will not have
             * the right offset, and will look off-table.
             * 
             */
            for (let index = currentCellPtr; index < maxRows; index++) 
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

    semestersCreditHours.forEach((credit, idx) => {
        const cell = document.createElement('th')
        cell.className = 'credit-cell'
        cell.dataset.tableYear = Math.trunc((idx + 2) / 2)
        cell.dataset.tableSemester = idx + 1
        cell.dataset.semesterCredits = credit

        cell.innerHTML = `${credit} Hours`

        row.appendChild(cell)
    })
    return row
}

/*
 * getMaxTableRowLength: as name suggests :/
 * This determines the max number of rows in the table, important
 * for adding empty cells to align table properly later.
 * Notes:
 * - Implementation is dependent on the way the data is structured inside the json files!
 */
function getMaxTableRowLength(subjects) {
    let maxRows = 0
    let counter = 0
    let curSem = 0
    let prevSem = 0

    subjects.forEach((semester) => {
        semester.forEach(subject => {
            curSem = subject.semester
            if(curSem != prevSem)
            {
                counter = 0
                prevSem = curSem
            }

            if(subject.optionalSet)
                counter += subject.optionalSet.length
            else
                counter++
        })

        maxRows = counter > maxRows ? counter : maxRows
    })

    return maxRows
}
