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

    printGraph() {
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

const subjects = [
    [
        { semester: 1, id: 'CHEn001', subjectName: 'Chemistry', creditHours: 3, requirements: [] },
        { semester: 1, id: 'MNFn003', subjectName: 'Principles of Production Engineering', creditHours: 3, requirements: [] },
        { semester: 1, id: 'GENn042', subjectName: 'English Language', creditHours: 2, requirements: [] },
        { semester: 1, id: 'MNFn001', subjectName: 'Engineering Graphics-1', creditHours: 2, requirements: [] },
        { semester: 1, id: 'MECn001', subjectName: 'Mechanics-1', creditHours: 2, requirements: [] },
        { semester: 1, id: 'MTHn001', subjectName: 'Mathematics-1 (Algebra and Calculus)', creditHours: 3, requirements: [] },
        { semester: 1, id: 'PHYn001', subjectName: 'Physics-1', creditHours: 3, requirements: [] },
    ],
    [
        { semester: 2, id: 'CMPn010', subjectName: 'Program Design and Computer Languages', creditHours: 4, requirements: [] },
        { semester: 2, id: 'GENn043', subjectName: 'Contemporary Social Issues', creditHours: 2, requirements: [] },
        { semester: 2, id: 'GENn041', subjectName: 'History of Engineering and Technology', creditHours: 2, requirements: [] },
        { semester: 2, id: 'MNFn002', subjectName: 'Engineering Graphics-2', creditHours: 2, requirements: ['MNFn001'] },
        { semester: 2, id: 'MECn002', subjectName: 'Mechanics-2', creditHours: 2, requirements: ['MECn001'] },
        { semester: 2, id: 'MTHn002', subjectName: 'Mathematics-2', creditHours: 3, requirements: ['MTHn001'] },
        { semester: 2, id: 'PHYn002', subjectName: 'Physics-2', creditHours: 3, requirements: ['PHYn001'] },
    ],
    [
        { semester: 2, type: TRAINING, id: 'ELCn060', subjectName: 'Summer Training for level zero', creditHours: 0, requirements: [] },
    ],
    [
        { semester: 3, id: 'ELCn111', subjectName: 'Electrical Circuit Analysis-1', creditHours: 3, requirements: ['ELCn060' ,'MTHn002'] },
        { semester: 3, id: 'MTHn103', subjectName: 'Mathematics-3 (Differential Equations and Transforms) ', creditHours: 3, requirements: ['MTHn002'] },
        { semester: 3, id: 'ELCn114', subjectName: 'Modern Theory of Solids', creditHours: 2, requirements: ['PHYn002'] },
        { semester: 3, id: 'CMPn111', subjectName: 'Logic Circuits Design-1', creditHours: 4, requirements: ['MTHn001'] },
        { semester: 3, id: 'GENn14la', subjectName: 'Presentation Skills', creditHours: 2, requirements: [] },
        { semester: 3, id: 'ENGn311', subjectName: 'Engineering Economy', creditHours: 2, requirements: [] },
    ],
    [
        { semester: 4, id: 'ELCnl12', subjectName: 'Electrical Circuit Analysis-2', creditHours: 3, requirements: ['ELCn111'] },
        { semester: 4, id: 'ELCn113', subjectName: 'Electrical Measurements', creditHours: 3, requirements: ['ELCn111'] },
        { semester: 4, id: 'CMPn110', subjectName: 'Data Structures and Algorithms', creditHours: 3, requirements: ['CMPn010'] },
        { semester: 4, id: 'ELCn211', subjectName: 'Signal Analysis', creditHours: 3, requirements: ['MTHnl03'] },
        { semester: 4, id: 'ELCn115', subjectName: 'Semiconductors for Microelectronics', creditHours: 2, requirements: ['ELCn114'] },
        { semester: 4, id: 'MTHn104', subjectName: 'Mathematics-4 (Advanced Calculus)', creditHours: 3, requirements: ['MTHn001'] },
    ],
    [
        { semester: 4, type: TRAINING, id: 'ELCn160', subjectName: 'Summer Training for level one', creditHours: 0, requirements: ['ELCn060'] },
    ],
    [
        { semester: 5, id: 'CMPn325', subjectName: 'Information Systems', creditHours: 3, requirements: ['CMPn110'] },
        { semester: 5, id: 'ELCn212', subjectName: 'Microelectronic Circuits-1', creditHours: 3, requirements: ['ELCn115', 'ELCnl60'] },
        { semester: 5, id: 'ELCn214', subjectName: 'Electronic Measurements', creditHours: 3, requirements: ['ELCn113'] },
        { semester: 5, id: 'CMPn210', subjectName: 'Engineering Computer Applications', creditHours: 3, requirements: ['CMPn010'] },
        { semester: 5, id: 'MTHn107', subjectName: 'Mathematics-7 (Introduction to Probability and Statistics)', creditHours: 3, requirements: ['MTHn002'] },
        { semester: 5, id: 'GENn341', subjectName: 'Project Management', creditHours: 2, requirements: [] },
    ],
    [
        { semester: 6, id: 'ELCn210', subjectName: 'Control-1 (Principles of Automatic Control)', creditHours: 4, requirements: ['MTHnl03'] },
        { semester: 6, id: 'CMPn321', subjectName: 'Computer Architecture', creditHours: 3, requirements: ['CMPn111'] },
        { semester: 6, id: 'MTHn208', subjectName: 'Mathematics-8 (Complex Analysis and P. D, E)', creditHours: 2, requirements: ['MTHn002'] },
        { semester: 6, id: 'CMPn261', subjectName: 'Seminar', creditHours: 1, requirements: [], conditions: ['66 Credits']},
        { semester: 6, id: 'ENGn213c', subjectName: 'Advanced Computer Systems Implementation', creditHours: 3, requirements: ['CMPn010'] },
        { semester: 6, id: 'GENn142a', subjectName: 'Technical Report Writing', creditHours: 2, requirements: [] },
    ],
    [
        { semester: 6, type: TRAINING, id: 'ELCn260', subjectName: 'Industrial Training -1', creditHours: 0, requirements: ['ELCn160'] },
    ],
    [
        { semester: 7, id: 'ELCn215', subjectName: 'Communications-1', creditHours: 3, requirements: ['ELCn211'] },
        { semester: 7, id: 'CMPn323', subjectName: 'Data Base Management', creditHours: 4, requirements: ['CMPn010'] },
        { semester: 7, id: 'CMPn361', subjectName: 'Project-1', creditHours: 2, requirements: ['ENGn213a'], conditions: ['99 Credits'] },
        { semester: 7, id: 'CMPn310', subjectName: 'Microprocessor Based Systems.', creditHours: 3, requirements: ['CMPn111'] },
        { semester: 7, id: 'ELCn218a', subjectName: 'Electrical Power Engineering', creditHours: 3, requirements: ['ELCn112'] },
        { semester: 7, id: 123, optionalSet: ['GENn351b','GENn352', 'GENn353'], list: [
            { semester: 7, id: 'GENn351b', subjectName: 'Technical English', creditHours: 2, requirements: [],    optionalSetId: 123 },
            { semester: 7, id: 'GENn352', subjectName: 'Risk Management', creditHours: 2, requirements: [],       optionalSetId: 123 },
            { semester: 7, id: 'GENn353', subjectName: 'Industrial Psychology', creditHours: 2, requirements: [], optionalSetId: 123 },
        ] }
    ],
    [
        { semester: 8, id: 'CMPn322', subjectName: 'Computer Graphics and Man Machine Interface', creditHours: 3, requirements: ['CMPn010', 'CMPn321'] },
        { semester: 8, id: 'CMPn324', subjectName: 'Data Transmission and Computer Networks', creditHours: 4, requirements: ['CMPn321'] },
        { semester: 8, id: 'CMPn326', subjectName: 'Logic Design -2', creditHours: 3, requirements: ['CMPn111'] },
        { semester: 8, id: 124, optionalSet: ['CMPn333', 'CMPn335', 'CMPn433'], list: [
            { semester: 8, id: 'CMPn333', subjectName: 'Embedded Systems', creditHours: 3, requirements: ['CMPn310'],      optionalSetId: 124 },
            { semester: 8, id: 'CMPn335', subjectName: 'Operating Systems', creditHours: 3, requirements: ['CMPn321'],     optionalSetId: 124 },
            { semester: 8, id: 'CMPn433', subjectName: 'Computer Organization', creditHours: 3, requirements: ['CMPn321'], optionalSetId: 124 },
        ]},
        { semester: 8, id: 125, optionalSet: ['CMPn331', 'CMPn336', 'CMPn434'], list: [
            { semester: 8, id: 'CMPn331', subjectName: 'Computer Peripherals', creditHours: 3, requirements: ['CMPn321'], optionalSetId: 125 },
            { semester: 8, id: 'CMPn336', subjectName: 'Software Engineering', creditHours: 3, requirements: ['CMPn325'], optionalSetId: 125 },
            { semester: 8, id: 'CMPn434', subjectName: 'Computer Performance', creditHours: 3, requirements: ['CMPn110'], optionalSetId: 125 },
        ]}
    ],
    [
        { semester: 8, type: TRAINING, id: 'ELCn360', subjectName: 'Industrial Training -2', creditHours: 0, requirements: ['ELCn260'], conditions: ['99 Credits'] },
    ],
    [
        { semester: 9, id: 126, optionalSet: ['CMPn332', 'CMPn334', 'CMPn431'], list: [
            { semester: 9, id: 'CMPn332', subjectName: 'Digital Image Processing', creditHours: 3, requirements: ['CMPn210'], optionalSetId: 126 },
            { semester: 9, id: 'CMPn334', subjectName: 'Multimedia', creditHours: 3, requirements: ['CMPn110'] , optionalSetId: 126 },
            { semester: 9, id: 'CMPn431', subjectName: 'Advanced Computer Systems', creditHours: 3, requirements: ['CMPn310'], optionalSetId: 126 },
        ]},
        { semester: 9, id: 'CMPn421', subjectName: 'Distributed Computer Systems', creditHours: 3, requirements: ['CMPn324'] },
        { semester: 9, id: 'CMPn423', subjectName: 'Languages and Compilers', creditHours: 3, requirements: ['CMPn110'] },
        { semester: 9, id: 'ENGn312a', subjectName: 'Engineering Laws and Professional Ethics', creditHours: 2, requirements: [] },
        { semester: 9, id: 127, optionalSet: ['GENn451b', 'GENn452a', 'GENn453'], list: [
            { semester: 9, id: 'GENn451b', subjectName: 'Environmental Effects of Electromagnetic Waves', creditHours: 2, requirements: [], optionalSetId: 127 },
            { semester: 9, id: 'GENn452a', subjectName: 'Civilization and heritage', creditHours: 2, requirements: [], optionalSetId: 127 },
            { semester: 9, id: 'GENn453', subjectName: 'Marketing', creditHours: 2, requirements: [], optionalSetId: 127 },
        ] },
        { semester: 9, id: 'CMPn460', subjectName: 'Project-2 a', creditHours: 3, requirements: ['CMPn361', 'CMPn360'], conditions: ['GPA > 2: 120 Credits/ 123 Credits', 'GPA < 2: 128 Credits/ 131 Credits'] },
    ],
    [
        { semester: 10, id: 'CMPn422', subjectName: 'Artificial Intelligence', creditHours: 3, requirements: ['CMPn325'] },
        { semester: 10, id: 'CMPn424', subjectName: 'Computer Modeling and Simulation', creditHours: 3, requirements: ['CMPn210'] },
        { semester: 10, id: 128, optionalSet: ['CMPn436', 'CMPn435', 'CMPn437', 'CMPn438'], list: [
            { semester: 10, id: 'CMPn436', subjectName: 'Fault Tolerant Computing', creditHours: 3, requirements: ['CMPn010'], optionalSetId: 128 },
            { semester: 10, id: 'CMPn435', subjectName: 'Computer Systems Technology', creditHours: 3, requirements: ['CMPn321'], optionalSetId: 128 },
            { semester: 10, id: 'CMPn437', subjectName: 'Computer Interfacing', creditHours: 3, requirements: ['CMPa321'], optionalSetId: 128 },
            { semester: 10, id: 'CMPn438', subjectName: 'Pattern Recognition and Neural Networks', creditHours: 3, requirements: ['MTHnl03', 'CMPn310'], optionalSetId: 128 },
        ]},
        { semester: 10, id: 129, optionalSet: ['ELCn425', 'CMPn432', 'CMPn439'], list: [
            { semester: 10, id: 'ELCn425', subjectName: 'Digital Signal Processing', creditHours: 3, requirements: ['MTHnl03', 'CMPn111'], optionalSetId: 129 },
            { semester: 10, id: 'CMPn432', subjectName: 'Advanced Database Systems', creditHours: 3, requirements: ['CMPn323'], optionalSetId: 129 },
            { semester: 10, id: 'CMPn439', subjectName: 'Real Time Computing', creditHours: 3, requirements: ['CMPn010'], optionalSetId: 129 },
        ]},
        { semester: 10, id: 'CMPn461', subjectName: 'Project-2 b(Second Stage)', creditHours: 3, requirements: ['CMPn460'] },
    ],
]

const MAX_SEMESTER_SUBJECTS = subjects[subjects.length - 1][0].semester

function initGraph(semester) {
    semester.map(subject => {
        const { requirements, id } = subject
        if(subject.optionalSet){
            graph.addEdgeSet({ id: subject.id, set: subject.optionalSet })

            return initGraph(subject.list);
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

const graph = new MirectedGraph()
subjects.map(semester => 
    initGraph(semester)
)

let count = 0, prev = count, currentSemesterPtr = 1
const tbody = document.getElementById('table-body-flowsheet')


subjects.forEach((sem) => {
    let isTrainingSem = false
    for (let index = 0; index < MAX_SEMESTER_SUBJECTS; index++) {
        const subject = sem[index]
        if(!subject)
            continue

        if(subject.type === TRAINING)
            isTrainingSem = true

        if(subject.optionalSet)
        {
            subject.optionalSet.forEach(optionalSubject => {
                const vertex = graph.search(optionalSubject)
                renderVertex(vertex)
            })
            continue
        }
    
        const vertex = graph.search(subject.id)
        renderVertex(vertex)
    }

    if(count >= MAX_SEMESTER_SUBJECTS){
        currentSemesterPtr++
        count = 0
        return
    }
    if(!isTrainingSem){
        for (let index = count; index < 10; index++) {
            renderEmptyVertex(currentSemesterPtr)
        }
        currentSemesterPtr++
    }

    count = 0
});

// const rows = document.querySelectorAll('.flowsheet-row')

// rows.forEach(row => {
//     const cells = row.children
//     const rowNum = row.id
//     if(cells.length === 10)
//         return

//     for (let currentCellNo = 1; currentCellNo <= 10; currentCellNo++) {
//         const cell = cells[currentCellNo -1]
//         if(!cell){
//             console.log(rowNum[]);
//         }
//     }

//     // [...cells].forEach(cell => {
        
//     // })
// })

function renderVertex(vertex) {
    const { vertex: { data: { semester, type, subjectName } } } = vertex
    count++
    let rowId = `sub-${count}`
    let colId = `sem-${semester}-sub-${count}`
    let correctRow
    console.log('vertex: ');
    console.log(vertex.vertex.data);
    
    if (type === TRAINING){
        console.log('training ', prev);
        rowId = `sub-${prev + 1}`
        colId = `sem-${semester}-sub-${prev +1}`
    }
    console.log('row id: ', rowId, ' colId: ', colId);

    correctRow = document.getElementById(rowId)
    // console.log(correctRow);

    if(!correctRow){
        correctRow = document.createElement('tr')
        correctRow.className = 'flowsheet-row'
        correctRow.id = rowId
        tbody.appendChild(correctRow)
    }
    // console.log('new correctRow: ');
    // console.log(correctRow);

    let col = document.getElementById(colId)
    if(!col){
        col = document.createElement('td')
        col.innerHTML = subjectName
        col.id = colId
        correctRow.appendChild(col)
    } else if(col.innerHTML === ' ') {
        col.innerHTML = subjectName
    }

    prev = count ? count : 0
}

function renderEmptyVertex(semester) {
    let rowId = `sub-${count + 1}`
    let colId = `sem-${semester}-sub-${++count}`
    let correctRow

    console.log('vertex: empty, row id: ', rowId, ' colId: ', colId);

    correctRow = document.getElementById(rowId)
    let col = document.getElementById(colId)

    if(col)
        return

    if(!correctRow){
        correctRow = document.createElement('tr')
        correctRow.className = 'flowsheet-row'
        correctRow.id = rowId
        tbody.appendChild(correctRow)
    }


    if(!col){
        col = document.createElement('td')
        col.innerHTML = ' '
        col.id = colId
        correctRow.appendChild(col)
    }
}
