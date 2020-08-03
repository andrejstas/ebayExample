import {testSaga} from 'redux-saga-test-plan';

import util from 'util';
import {NAME} from './constants';
import saga, {trackRoleDimensionSaga, getMyRoleSaga, trackPageViewSaga, trackAllActionsSaga} from './saga';
import {connectToMatomoServer} from './trackingAPI';

describe('tracking saga', () => {
    it('call the main sagas when starting the app', () => testSaga(saga)
        .next()
        .call(connectToMatomoServer)
        .next()
        .call(util.tryFetch, NAME, getMyRoleSaga)
        .next()
        .call(trackRoleDimensionSaga, undefined)
        .next()
        .fork(trackPageViewSaga)
        .next()
        .takeEvery('*', trackAllActionsSaga)
        .next()
        .isDone());
});
