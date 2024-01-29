function renderVertex(prevCellPtr, currentCellPtr, vertex, isTrainingSem, rowPtr, optionalId) {
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
        cell = createCell(row, colId, vertex, optionalId)

    else if(cell && !cell.contains(null))
    {   
        cell.remove()
        cell = createCell(row, colId, vertex, optionalId)
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

function createCell(row, colId, vertex, optionalId) {
    const { id: subjectId, subjectName, creditHours } = vertex ? vertex.vertex.data : {}
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
    const creditHrs = document.createElement('span')
    creditHrs.className = 'cell-credit-hours'

    creditHrs.innerHTML = vertex ? creditHours : ''

    iconsDiv.appendChild(creditHrs)

    outerDiv.className = 'inner-cell-container'
    outerDiv.appendChild(div)
    outerDiv.appendChild(iconsDiv)
    cell.appendChild(outerDiv)
    row.appendChild(cell)

    if(!vertex)
        return cell

    if(optionalId) {
        cell.dataset.optionalId = optionalId
    }
    
    attachCellActions(vertex, cell, optionalId)

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

function resetHighlightedCells() {
    const current = document.querySelector('[data-current]')
    const dependent = document.querySelectorAll('[data-dependent]')
    const required = document.querySelectorAll('[data-required]')

    if(!current)
        return

    const creditHrs = current.querySelector('.cell-credit-hours')
    creditHrs.style.display = 'none'

    current.removeAttribute('data-current');
    current.removeAttribute('data-is-Held');
    [...dependent].map(elem => elem.removeAttribute('data-dependent'));
    [...required].map(elem => elem.removeAttribute('data-required'))

    const optionalSet = document.querySelectorAll(`[data-is-optional-sibling]`);
    [...optionalSet].forEach(element => {
        element.dataset.isOptionalSibling = false
    });
}

function highlightCell(cell, vertex, optionalId) {
    const isAnythingHeld = document.querySelector('[data-is-held]')
    const isHeldEnabled = isHeld()
    let siblingVertex = vertex.vertex.next
    let dirWeight = vertex.vertex.dirWeight


    // hold the state of the table if there is a held element
    if(cell.dataset.current || (isAnythingHeld && isHeldEnabled))
        return

    if(isAnythingHeld)
        isAnythingHeld.removeAttribute('data-is-held')

    resetHighlightedCells()

    if(GPA_MODE){
        return
    }

    cell.dataset.current = true

    const creditHrs = cell.querySelector('.cell-credit-hours')
    creditHrs.style.display = 'block'

    // check for requirements and dependencies
    while(siblingVertex) {
        const elem = document.querySelector(`[data-subject-id="${siblingVertex.data.id}"]`)

        // detects a bad graph connection, and wrong ids
        
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
}

function attachCellActions(vertex, cell, optionalId) {
    // add necessary data for hover action
    const { vertex: { data: { id, semester, creditHours }} } = vertex

    cell.dataset.subjectId = id
    cell.dataset.semester = semester
    cell.dataset.creditHours = creditHours
    
    cell.addEventListener('mouseenter', e => highlightCell(cell, vertex, optionalId))
    cell.addEventListener('click', e => handleCellClick(e, vertex))

    cell.addEventListener('mouseleave', e => {
        let siblingVertex = vertex.vertex.next
        let dirWeight = vertex.vertex.dirWeight

        if(!e.target.dataset.current || cell.dataset.isHeld)
        {
            return
        }

        e.target.removeAttribute('data-current')

        const creditHrs = cell.querySelector('.cell-credit-hours')
        creditHrs.style.display = 'none'

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

        if(GPA_MODE){
            return
        }
    })
}

function handleCellClick(e, vertex) {
    if(!GPA_MODE)
        return renderSubject(vertex)

    // js/gpa/GPAInterfaceController
    return handleGPASelect(e, vertex.vertex.data.creditHours)
}

function holdCells() {
    const current = document.querySelector('[data-current]')

    if(!current)
        return

    current.dataset.isHeld = true
}

function releaseCells() {
    const current = document.querySelector('[data-current]')

    if(!current)
        return

    current.dataset.isHeld = false
}

// isHeld checkbox enabled
function isHeld() {
    const toggleTableState = document.getElementById('search-hold')
    const isHeld = toggleTableState.checked

    return isHeld
}

function renderSubject(vertex) {
    holdCells()
    const side = document.getElementById('subject-info-container')
    const blank = document.getElementById('subject-info-main')
    side.style.display = 'flex'
    side.dataset.currentViewId = vertex.vertex.data.id

    blank.innerHTML = ''
    fillInfoSide(blank, vertex)
}

function fillInfoSide(blank, vertex) {
    const { vertex: { data: { type, optionalSetId, subjectName , creditHours, requirements, conditions }}, optionalId } = vertex
    const header = createElement('h1')
    header.innerHTML = subjectName

    const typeP = createElement('p')
    typeP.innerHTML = `<span id="subject-info-type">type:</span>`

    if(optionalSetId)
        typeP.innerHTML += ' optional, choose 1 only'
    else if(type)
        typeP.innerHTML += ' training course'
    else 
        typeP.innerHTML += ' required'

    const creditHrs = createElement('p')
    creditHrs.innerHTML = `<span id="subject-info-type">credit hours:</span> ${creditHours} hours`

    const requiredP = createElement('p')
    requiredP.innerHTML = `<span id="subject-info-type">requirements for the course:</span> `
    if(requirements.length)
    requiredP.innerHTML += `<br><ul>`

    requirements.forEach(req => requiredP.innerHTML += `<li>${req}<br></li>`)

    if(requirements.length)
        requiredP.innerHTML += `</ul>`
    else
        requiredP.innerHTML += `none`

    const conditionsP = createElement('p')

    if(conditions)
    {
        conditionsP.innerHTML = `<span id="subject-info-type">Can take the course only if:</span> `
        conditionsP.innerHTML += `<br><ul>`
    
        conditions.forEach(req => conditionsP.innerHTML += `<li>${req}<br></li>`)
        conditionsP.innerHTML += `</ul>`
    }

    const hr = document.createElement('hr')
    hr.id = 'footer-line'
    blank.appendChild(header)
    blank.appendChild(typeP)
    blank.appendChild(creditHrs)
    blank.appendChild(requiredP)
    blank.appendChild(conditionsP)
    blank.appendChild(hr)
}

function unmountSubjectInfo() {
    releaseCells()
    const side = document.getElementById('subject-info-container')
    const blank = document.getElementById('subject-info-main')

    side.style.display = 'none'
    side.removeAttribute('data-current-view-id')
    blank.innerHTML = ''
}