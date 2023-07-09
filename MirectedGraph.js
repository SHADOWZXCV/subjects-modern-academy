const GO_RIGHT = 0
const GO_LEFT = 1
const UNIDIRECTIONAL = -1

const REQUIRED = 1
const DEPENDENT = 2

class Vertex {
    constructor(val) {
        this.data = val
        this.dirWeight = 0
        this.next = null
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

    toString() {
        Object.keys(this.adjacencyList).map(mainId => {
            let vertex = this.adjacencyList[mainId]
            let { data: { id }, dirWeight } = vertex
            let dependency = dirWeight === REQUIRED ? ' is a requirement for: ' : dirWeight === DEPENDENT ? ' depends on: ' : ' not depending in anything '
            console.log(id, dependency, '->')

            while(vertex.next != null)
            {
                vertex = vertex.next
                dirWeight = vertex.dirWeight
                dependency = dirWeight === REQUIRED ? ' is a requirement for: ' : dirWeight === DEPENDENT ? ' depends on: ' : ' not depending in anything '
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

        if(!this.adjacencyList[src.id])
        {
            this.size++
            this.adjacencyList[src.id] = new Vertex(src);
        }

        if(!this.adjacencyList[dest.id])
        {
            this.size++
            this.adjacencyList[dest.id] = new Vertex(dest);
        }

        let newEdge = this.adjacencyList[!dir ? dest.id : src.id];
        while(newEdge.next != null)
            newEdge = newEdge.next
        
        
        newEdge.next = new Vertex(this.adjacencyList[!dir ? src.id : dest.id].data);

        // undirected vertices
        if(dir === UNIDIRECTIONAL){
            newEdge.dirWeight = DEPENDENT
            newEdge = this.adjacencyList[dest.id];
            while(newEdge.next)
                newEdge = newEdge.next

            newEdge.next = new Vertex(this.adjacencyList[src.id].data);
            newEdge.dirWeight = REQUIRED
        }

        /*
        * Directed vertices
        * Direction 0 (src -> dest) >> 1: requirement for ,
        * Direction 1 (dest -> src) >> 2: dependent on or requiring (dest -> src)
        */
        if(dir === GO_RIGHT)
            newEdge.dirWeight = REQUIRED
        else if(dir === GO_LEFT)
            newEdge.dirWeight = DEPENDENT
    }
}


function initGraph(graph, semester) {
    semester.map(subject => {
        const { id, requirements, optionalSet, list } = subject

        // some objects may come with optional sets, these objects are just
        // containers and no need to add them to the graph, unlike the contents
        // of it, that's why we return a recursive function.
        if(optionalSet){
            // makes an optional array for holding optional lists, to be used in determining
            // subjects that are optional together.
            graph.addEdgeSet({ id, set: optionalSet })

            return initGraph(graph, list)
        }

        if(!requirements.length)
            graph.addEdge(subject, null, GO_RIGHT)
        else
            requirements.forEach(id => graph.addEdge(subject, { id, data: null }, UNIDIRECTIONAL))
    })
}