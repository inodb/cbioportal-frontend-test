import React from 'react'
import ReactDOM from 'react-dom'
import {Table, Column, Cell} from 'fixed-data-table'
import 'fixed-data-table/dist/fixed-data-table.min.css'

// const store = createStore(counter)
const rootEl = document.getElementById('root')


var rows = [
    [ "OS_MONTHS" , "58" ],
    [ "AGE" ,  "28" ],
    [ "OS_STATUS" , "DECEASED" ],
    [ "GENDER", "Male" ],
    [ "CANCER_TYPE", "Glioma" ]
];

function render() {
  ReactDOM.render(
    <Table
      rowHeight={50}
      rowsCount={rows.length}
      width={400}
      height={(rows.length+1) * 50 + 2}
      headerHeight={50}>
      <Column
        header={<Cell>Attributes</Cell>}
        cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          {rows[rowIndex][0]}
        </Cell>
        )}
        width={200}
      />
      <Column
        header={<Cell>Values</Cell>}
        cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          {rows[rowIndex][1]}
        </Cell>
        )}
        width={200}
      />
    </Table>,
    rootEl
  )
}

render()
// store.subscribe(renderTree)
