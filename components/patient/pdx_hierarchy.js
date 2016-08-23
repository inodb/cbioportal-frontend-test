import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import tree from '../../reducers/index.js'
import Tree, { getTreeNodesFromClinicalData } from '../../components/patient/Tree'
import QueryString from '../../util'
import 'lodash'

const store = createStore(tree)
const rootEl = document.getElementById('root')

function renderTree() {
  ReactDOM.render(
    <Tree
      width={800}
      height={300}
      nodes={store.getState().trees}
    />,
    rootEl
  )
}

store.subscribe(renderTree)

if (QueryString.cancer_study_id && QueryString.case_id) {
	fetch(`http://localhost:8080/api/samples?study_id=${QueryString.cancer_study_id}&patient_ids=${QueryString.case_id}`)
		.then((response) => response.json())
		.then((responseJson) => {
			let sampleIds = responseJson.map((sample) => { return sample.id }).sort()
			fetch(`http://localhost:8080/api/clinicaldata/samples?study_id=${QueryString.cancer_study_id}&attribute_ids=PDX_PARENT&sample_ids=${sampleIds}`)
				.then((response) => response.json())
				.then((responseJson) => {
					let clinicalDataMap = _.zipObject(responseJson.map((x) => { return x.sample_id }),
							responseJson.map((sample) => {
								return {"PDX_PARENT": sample.attr_val}
							})
					)
					// Add samples without a PDX_PARENT
					for (let i=0; i < sampleIds.length; i++) {
						if (!(sampleIds[i] in clinicalDataMap)) {
							clinicalDataMap[sampleIds[i]] = {}
						}
					}
					store.dispatch({ type: 'ADD_TREE', nodes: getTreeNodesFromClinicalData(clinicalDataMap, sampleIds)[0] })
				})
		})
} else {
	const nodes = {
		"name": "Top Node",
		"label": "1",
		"children": [
			{
				"name": "Bob: Child of Top Node",
				"label": "1.1",
				"parent": "Top Node",
				"children": [
					{
						"name": "Son of Bob",
						"label": "1.1.1",
						"parent": "Bob: Child of Top Node"
					},
					{
						"name": "Daughter of Bob",
						"label": "1.1.2",
						"parent": "Bob: Child of Top Node"
					}
				]
			},
			{
				"name": "Sally: Child of Top Node",
				"label": "1.2",
				"parent": "Top Node",
				"children": [
					{
						"name": "Son of Sally",
						"label": "1.2.1",
						"parent": "Sally: Child of Top Node"
					},
					{
						"name": "Daughter of Sally",
						"label": "1.2.2",
						"parent": "Sally: Child of Top Node"
					},
					{
						"name": "Daughter #2 of Sally",
						"label": "1.2.3",
						"parent": "Sally: Child of Top Node",
						"children": [
							{
								"name": "Daughter of Daughter #2 of Sally",
								"label": "1.2.3.1",
								"parent": "Daughter #2 of Sally"
							}
						]
					}
				]
			},
			{
				"name": "Dirk: Child of Top Node",
				"label": "1.3",
				"parent": "Top Node",
				"children": [
					{
						"name": "Son of Dirk",
						"label": "1.3.1",
						"parent": "Dirk: Child of Top Node"
					},
				]
			}
		]
	}
  store.dispatch({ type: 'ADD_TREE', nodes: nodes })
}
