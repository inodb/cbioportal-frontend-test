import React from 'react'
import SampleLabel from './SampleLabel'

export default class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.renderNode = this.renderNode.bind(this)
  }

  /*
   * Recursive function to draw SVG Tree
   */
  renderNode(node, width, yDistance, x, y, level) {
    if (node.children) {
      return <g key={node.name}>
               <SampleLabel x={x} y={y} color={'black'} label={node.label} />
               {node.children.map((n, i) => { 
                 let newX = x - (width/2) + (i+.5)*(width/node.children.length)
                 let newY = (level+1)*yDistance

                 return ([<path d={`M${x},${y+10} C${x},${y+10} ${newX},${newY+10} ${newX},${newY-10}`} fill={'none'} stroke={'red'} />,
                   this.renderNode(n,
                                   width/node.children.length,
                                   yDistance,
                                   newX,
                                   newY,
                                   level + 1)])
               })}
             </g>
    } else {
      return <g key={node.name}>
               <SampleLabel x={x} y={y} color={'black'} label={node.label} />
             </g>
    }
  }

  render() {

    const { width, height, nodes } = this.props
    if (nodes.children) {
      let maxDepth = Math.max(...nodes.children.map((n, i) => {
        let depth = 0
        let curN = n

        while (n) {
          n = n.children
          depth += 1
        }
        return depth
      }))

      return (
        <svg width={width} height={height}>
          {this.renderNode(nodes, width, (height-15)/(maxDepth+1), width/2, 15, 0, 0)}
        </svg>
      )
    } else {
        return (
          <svg width={width} height={height}>
          </svg>
        )
    }
  }
}

Tree.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  nodes: React.PropTypes.object.isRequired,
}

/*
 * Convert cBioPortal clinical data format and given sampleOrder (for labels)
 * to input format accepted by the Tree component.
 * @param {Object} clinicalDataMap keys are sample ids and values are clinical
 * attribute objects
 * @param {Array} sampleOrder order of samples, used for labeling samples 1..n
 */
export function getTreeNodesFromClinicalData(clinicalDataMap, sampleOrder) {
  // Add label to clinicalDataMap copy
  const clinicalDataMapExtended = JSON.parse(JSON.stringify(clinicalDataMap))
  sampleOrder.map((n, i) => {
    clinicalDataMapExtended[n].label = i + 1
  })
  let roots = Object.keys(clinicalDataMapExtended).filter((sample) => {
    return !clinicalDataMapExtended[sample].PDX_PARENT
  })

  /*
   * Recursive function to make a tree from root node using clinicalData
   */
  let getNode = (clinicalDataMapExtended, sampleName) => {
    let children = Object.keys(clinicalDataMapExtended).filter((sample) => {
      return clinicalDataMapExtended[sample].PDX_PARENT === sampleName
    })
    if (children.length === 0) {
      return {
        "name": sampleName,
        "label": clinicalDataMapExtended[sampleName].label
      }
    } else {
      return {
        "name": sampleName,
        "label": clinicalDataMapExtended[sampleName].label, 
        "children": children.map((c) => {
          return getNode(clinicalDataMapExtended, c)
        })
      }
    }
  }
  let trees = roots.map((n) => {
    return getNode(clinicalDataMapExtended, n)
  })

  return trees
}

export default Tree
