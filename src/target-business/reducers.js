const Actions = require('./actions');

const initialState = {
    messages: [],
};

/**
 * @param {Object} state The current application state
 * @param {Object} action The redux action
 * @return {Object} The update state if it changed
 */
module.exports = (state = initialState, action) => {
    switch (action.type) {
        default: return state;
    }
};
