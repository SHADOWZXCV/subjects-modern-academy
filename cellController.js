function renderVertex(prevCellPtr, currentCellPtr, vertex, isTrainingSem) {
    const { vertex: { data: { semester: rowPtr } } } = vertex
    let rowId = `sub-${currentCellPtr}`
    let colId = `sem-${rowPtr}-sub-${currentCellPtr}`
    
    if (isTrainingSem){
        rowId = `sub-${prevCellPtr + 1}`
        colId = `sem-${rowPtr}-sub-${prevCellPtr + 1}`
    }
    
    
    let row = document.getElementById(rowId)
    let cell = document.getElementById(colId)
    
    if(!row)
        row = createSemestersRow(rowId)
    if(!cell)
        cell = createCell(row, colId, vertex)

    else if(cell && !cell.contains(null))
    {   
        cell.remove()
        cell = createCell(row, colId, vertex)
    }
    
    if (isTrainingSem){
        cell.dataset.isTraining = true
    }

    // returns to assign prevCellPtr to its value
    return currentCellPtr
}

function renderEmptyCell(rowPtr, currentCellPtr) {
    let rowId = `sub-${currentCellPtr}`
    let colId = `sem-${rowPtr}-sub-${currentCellPtr}`
    let row = document.getElementById(rowId)
    let cell = document.getElementById(colId)

    // prevents loading a loaded cell
    // if(col)
    //     return
    

    if(!row)
        row = createSemestersRow(rowId)

    if(!cell)
        cell = createCell(row, colId, null)
    
    cell.dataset.isEmpty = true
}

function createCell(row, colId, vertex) {
    const { id: subjectId, subjectName } = vertex ? vertex.vertex.data : {}
    const cell = document.createElement('td')
    const div = document.createElement('div')
    const outerDiv = document.createElement('div')

    div.innerHTML = !vertex ? ' ' : `
    <b class="cell-subjectCode">${subjectId}</b><br>
    <p>${subjectName}</p>
    `
    div.className = 'cell-text'
    cell.className = 'cell'
    cell.id = colId

    const iconsDiv = renderIcons(cell)

    outerDiv.className = 'inner-cell-container'
    outerDiv.appendChild(div)
    outerDiv.appendChild(iconsDiv)
    cell.appendChild(outerDiv)
    row.appendChild(cell)

    if(!vertex)
        return cell

    if(vertex.optionalId) {
        cell.dataset.optionalId = vertex.optionalId
    }
    
    attachCellActions(vertex, cell)

    return cell
}

function renderIcons(cell) {
    const div = document.createElement('div')
    const leftIcon = document.createElement('i')
    const rightIcon = document.createElement('i')
    const aboutIcon = document.createElement('i')
    const leftImg = document.createElement('img')
    const rightImg = document.createElement('img')
    const aboutImg = document.createElement('img')

    div.className = "cell-icons-container"
    leftImg.src = './assets/images/arrow-left.svg'
    leftImg.width = '10'
    rightImg.src = './assets/images/arrow-right.svg'
    rightImg.width = '10'
    aboutImg.src = './assets/images/info-circle.svg'
    aboutImg.width = '15'

    leftIcon.appendChild(leftImg)
    rightIcon.appendChild(rightImg)
    aboutIcon.appendChild(aboutImg)

    const regex = new RegExp(/^sem-(\d+)-sub-(\d+)$/)
    const search = cell.id.match(regex)
    const iconId = `${search[1]}-${search[2]}`
    leftIcon.id = `left-icon-${iconId}`
    rightIcon.id = `right-icon-${iconId}`
    aboutIcon.id = `about-icon-${iconId}`
    leftIcon.className = `left-cell-icon`
    rightIcon.className = `right-cell-icon`
    aboutIcon.className = `about-cell-icon`

    div.appendChild(leftIcon)
    div.appendChild(rightIcon)
    div.appendChild(aboutIcon)
    cell.appendChild(div)

    return div
}

function attachCellActions(vertex, cell) {
    // add necessary data for hover action
    const { vertex: { data: { id }}, optionalId } = vertex

    cell.dataset.subjectId = id
    cell.addEventListener('mouseenter', e => {
        let siblingVertex = vertex.vertex.next
        let dirWeight = vertex.vertex.dirWeight

        if(e.target.dataset.current)
            return

        e.target.dataset.current = true

        // check for requirements and dependencies
        while(siblingVertex) {
            const elem = document.querySelector(`[data-subject-id="${siblingVertex.data.id}"]`)

            // detects a bad connection, and wrong ids
            if(!elem){
                console.log(`There is no such subject with ID: ${siblingVertex.data.id}!`);
                break
            }

            if(dirWeight === DEPENDENT)
                elem.dataset.required = true
            else if(dirWeight === REQUIRED)
                elem.dataset.dependent = true            

            dirWeight = siblingVertex.dirWeight
            siblingVertex = siblingVertex.next
        }

        siblingVertex = vertex
        // check for optional sets
    
        if(optionalId) {
            const optionalSet = document.querySelectorAll(`[data-optional-id="${optionalId}"]`);
            [...optionalSet].forEach(element => {
                element.dataset.isOptionalSibling = true
            });
        }
    })


    cell.addEventListener('mouseleave', e => {
        let siblingVertex = vertex.vertex.next
        let dirWeight = vertex.vertex.dirWeight

        if(!e.target.dataset.current)
            return

        e.target.removeAttribute('data-current')

        while(siblingVertex) {
            const elem = document.querySelector(`[data-subject-id="${siblingVertex.data.id}"]`)
            if(!elem)
                return
            if(dirWeight === DEPENDENT)
                elem.removeAttribute('data-required')
            else if(dirWeight === REQUIRED)
                elem.removeAttribute('data-dependent')

            dirWeight = siblingVertex.dirWeight
            siblingVertex = siblingVertex.next
        }

        siblingVertex = vertex

        if(optionalId) {
            const optionalSet = document.querySelectorAll(`[data-optional-id="${optionalId}"]`);
            [...optionalSet].forEach(element => {
                element.dataset.isOptionalSibling = false
            });
        }
    })
}