
export default function tree(state = {trees: {}}, action) {
    switch (action.type) {
        case 'ADD_TREE':
            state.trees = action.nodes
        default:
            return state
    }
}
