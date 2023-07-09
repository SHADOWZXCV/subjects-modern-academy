const TRAINING = 1

class Vertex {
    constructor(val) {
        this.data = val;
        this.dirWeight = 0;
        this.next = null;
    }
}

class MirectedGraph {
    constructor(verticesLength = 0) {
        this.adjacencyList = {}
        this.adjacencyListOptionals = {}
        this.size = verticesLength
    }

    search(id) {
        const vertex = this.adjacencyList[id]

        return {
            vertex,
            optionalId: vertex.data.optionalSetId || false
        }
    }

    print() {
        Object.keys(this.adjacencyList).map(mainId => {
            let vertex = this.adjacencyList[mainId]
            let { data: { id }, dirWeight } = vertex
            let dependency = dirWeight === 1 ? ' is a requirement for: ' : dirWeight === 2 ? ' depends on: ' : ' not depending in anything '
            console.log(id, dependency, '->')

            while(vertex.next != null)
            {
                vertex = vertex.next
                dirWeight = vertex.dirWeight
                dependency = dirWeight === 1 ? ' is a requirement for: ' : dirWeight === 2 ? ' depends on: ' : ' not depending in anything '
                console.log(vertex.data.id, vertex.data.data && !vertex.data.data.optional ? '' : ' this one is optional ', dependency, '->')
            }
            console.log(null);
        })
    }
    
    addEdgeSet(edgeSet) {
        this.adjacencyListOptionals = {
            ...this.adjacencyListOptionals,
            [edgeSet.id]: edgeSet.set
        }
    }

    /*
    * src: {id, data}
    * dir: 1 ( src -> dest ), 0 ( dest -> src ), -1 ( bi-directional )
    */
    addEdge(src, dest, dir) {
        if(dest === null)
        {
            this.size++
            this.adjacencyList[src.id] = new Vertex(src)

            return
        } else if(src === null)
            return

        if(this.adjacencyList[src.id] == null)
        {
            this.size++
            this.adjacencyList[src.id] = new Vertex(src);
        }

        if(this.adjacencyList[dest.id] == null)
        {
            this.size++
            this.adjacencyList[dest.id] = new Vertex(dest);
        }

        let newEdge = this.adjacencyList[!dir ? dest.id : src.id];
        while(newEdge.next != null)
            newEdge = newEdge.next
        
        
        newEdge.next = new Vertex(this.adjacencyList[!dir ? src.id : dest.id].data);

        if(dir === -1){
            newEdge.dirWeight = 2
            newEdge = this.adjacencyList[dest.id];
            while(newEdge.next != null)
                newEdge = newEdge.next
            newEdge.next = new Vertex(this.adjacencyList[src.id].data);
            newEdge.dirWeight = 1
        }

        // 1: requirement for, 2: dependent on
        if(dir === 0)
            newEdge.dirWeight = 1
        else if(dir === 1)
            newEdge.dirWeight = 2
    }
}

async function loadSpecificationData(spec) {
    return await fetch(spec).then(val => val.json()).then(data => data)
}

const subjects = loadSpecificationData('./data.json')
                .then(subjects => {
                    initTable(subjects)
                })


function initTable(subjects) {
    const MAX_SEMESTER_SUBJECTS = subjects[subjects.length - 1][0].semester
    const graph = new MirectedGraph()

    subjects.map(semester => {
            initGraph(graph, semester)
        }
    )

    let currentSubjectPtr = 0, prevSubjectPtr = currentSubjectPtr, currentSemesterPtr = 1

    // column-row from u-graph loader, loads cells for each row instead of row after row
    subjects.forEach((sem) => {
        let isTrainingSem = false

        for (let index = 0; index < MAX_SEMESTER_SUBJECTS; index++) {
            const subject = sem[index]

            if(!subject)
                continue

            // training does not have any empty spaces after it, hence the exception..
            else if(subject.type === TRAINING)
                isTrainingSem = true

            // optionalSets are loaded within the subjects, they are sets of subjects.
            else if(subject.optionalSet)
            {
                subject.optionalSet.forEach(optionalSubject => currentSubjectPtr = renderVertex(prevSubjectPtr, currentSubjectPtr, graph.search(optionalSubject)))
                continue
            }
            const vertex = graph.search(subject.id)
            currentSubjectPtr = renderVertex(prevSubjectPtr, currentSubjectPtr, vertex)
        }

        // render empty spaces ONLY after a non-training set
        if(!isTrainingSem){
            for (let index = currentSubjectPtr; index < 10; index++) 
                renderEmptyCell(currentSemesterPtr, currentSubjectPtr)
            
            currentSemesterPtr++
        }

        currentSubjectPtr = 0
    })
}


function initGraph(graph, semester) {
    semester.map(subject => {
        const { requirements, id } = subject
        if(subject.optionalSet){
            graph.addEdgeSet({ id: subject.id, set: subject.optionalSet })

            return initGraph(graph, subject.list);
        }

        const src = {
             id, 
             ...Object.keys(subject).filter(key => key !== 'id').reduce((obj, key) => { return {
                ...obj,
                [key]: subject[key]
              }
            }, {})
        }
        if(!requirements.length)
        {
            graph.addEdge(src, null, 1)
        }
        else {
            requirements.forEach(id => graph.addEdge(src, { id, data: null }, -1))
        }
    })
}

function renderVertex(prevSubjectPtr, currentSubjectPtr, vertex) {
    const { vertex: { data: { semester, type, subjectName } } } = vertex
    let rowId = `sub-${++currentSubjectPtr}`
    let colId = `sem-${semester}-sub-${currentSubjectPtr}`
    let correctRow = document.getElementById(rowId)
    if (type === TRAINING){
        rowId = `sub-${prevSubjectPtr + 1}`
        colId = `sem-${semester}-sub-${prevSubjectPtr +1}`
    }

    let col = document.getElementById(colId)

    if(!correctRow)
        correctRow = createSemestersRow(rowId)


    if(!col){
        // console.log(vertex.vertex.data);
        col = createSubjectCell(correctRow, colId, vertex)
    }
    else if(col.innerHTML === ' ')
    {        
        col.innerHTML = subjectName
        attachCellActions(vertex, col)
    }

    return currentSubjectPtr ? currentSubjectPtr : 0
}

function renderEmptyCell(semester, currentSubjectPtr) {
    let rowId = `sub-${currentSubjectPtr + 1}`
    let colId = `sem-${semester}-sub-${++currentSubjectPtr}`
    let correctRow = document.getElementById(rowId)
    let col = document.getElementById(colId)

    // prevents loading a loaded cell
    // if(col)
    //     return

    if(!correctRow)
        correctRow = createSemestersRow(rowId)

    if(!col)
        col = createSubjectCell(correctRow, colId, null)
}

function createSemestersRow(rowId) {
    const tbody = document.getElementById('table-body-flowsheet')
    let correctRow = document.createElement('tr')

    correctRow.className = 'flowsheet-row'
    correctRow.id = rowId
    tbody.appendChild(correctRow)

    return correctRow
}

function createSubjectCell(correctRow, colId, vertex) {
    const subjectName = vertex ? vertex.vertex.data.subjectName : null

    col = document.createElement('td')
    col.innerHTML = !vertex ? ' ' : subjectName
    col.id = colId
    correctRow.appendChild(col)

    if(!vertex)
        return
    
    attachCellActions(vertex, col)

    return col
}

function attachCellActions(vertex, col) {
        // add necessary data for hover action
    const { vertex: { data: { id }}} = vertex

    col.dataset.subjectId = id


    col.addEventListener('mouseover', e => {
        let siblingVertex = vertex.vertex.next
        let dirWeight = vertex.vertex.dirWeight

        if(e.target.dataset.current)
            return

        e.target.dataset.current = true

        while(siblingVertex) {
            const elem = document.querySelector(`[data-subject-id="${siblingVertex.data.id}"]`)
            if(!elem){
                console.log('has no elem: ');
                console.log(siblingVertex);
                break
            }

            if(dirWeight === 2)
                elem.dataset.required = true
            else if(dirWeight === 1)
                elem.dataset.dependent = true
            

            dirWeight = siblingVertex.dirWeight
            siblingVertex = siblingVertex.next
        }

        siblingVertex = vertex
    })

    col.addEventListener('mouseleave', e => {
        let siblingVertex = vertex.vertex.next
        let dirWeight = vertex.vertex.dirWeight

        if(!e.target.dataset.current)
        return

        e.target.removeAttribute('data-current')

        while(siblingVertex) {
            const elem = document.querySelector(`[data-subject-id="${siblingVertex.data.id}"]`)
            if(!elem)
                return
            if(dirWeight === 2)
                elem.removeAttribute('data-required')
            else if(dirWeight === 1)
                elem.removeAttribute('data-dependent')

            dirWeight = siblingVertex.dirWeight
            siblingVertex = siblingVertex.next
        }

        siblingVertex = vertex
    })
}
