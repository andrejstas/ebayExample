export default (reducerPath) => {
    const getModel = (state) => state.getIn(reducerPath);

    return {
        isShowRequestEditEffortDialog: (state) => getModel(state).get('dialogEditEffort'),
        isShowRequestEditActualLtsDateDialog: (state) => getModel(state).get('dialogEditActualLtsDate'),
    };
};
