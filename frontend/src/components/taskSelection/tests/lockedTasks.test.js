import React from 'react';
import TestRenderer from 'react-test-renderer';
import { FormattedMessage } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  LockedTaskModalContent,
  SameProjectLock,
  AnotherProjectLock,
  LicenseError,
  LockError,
} from '../lockedTasks';
import { createComponentWithReduxAndIntl } from '../../../utils/testWithIntl';
import { store } from '../../../store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}));

describe('test LockedTaskModalContent', () => {
  const { act } = TestRenderer;
  it('return SameProjectLock message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: 1 });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [21] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: 'LOCKED_FOR_MAPPING' });
    });
    const instance = createComponentWithReduxAndIntl(
      <MemoryRouter>
        <LockedTaskModalContent project={{ projectId: 1 }} error={null} />
      </MemoryRouter>,
    );
    const element = instance.root;
    expect(element.findByType(SameProjectLock)).toBeTruthy();
  });

  it('return SameProjectLock message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: 2 });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [21] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: 'LOCKED_FOR_MAPPING' });
    });
    const instance = createComponentWithReduxAndIntl(
      <MemoryRouter>
        <LockedTaskModalContent project={{ projectId: 1 }} error={null} />
      </MemoryRouter>,
    );
    const element = instance.root;
    expect(element.findByType(AnotherProjectLock)).toBeTruthy();
  });

  it('return LicenseError message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: null });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: null });
    });
    const instance = createComponentWithReduxAndIntl(
      <LockedTaskModalContent
        project={{ projectId: 1, licenseId: 123 }}
        error={'UserLicenseError'}
      />,
    );
    const element = instance.root;
    expect(element.findByType(LicenseError)).toBeTruthy();
  });

  it('return JosmError message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: null });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: null });
    });
    const instance = createComponentWithReduxAndIntl(
      <LockedTaskModalContent project={{ projectId: 1, licenseId: 123 }} error={'JOSM'} />,
    );
    const element = instance.root;
    expect(element.findByType(LockError)).toBeTruthy();
    expect(element.findAllByType(FormattedMessage).length).toBe(3);
  });

  it('return forbidden to map the task message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: null });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: null });
    });
    const instance = createComponentWithReduxAndIntl(
      <LockedTaskModalContent project={{ projectId: 1, licenseId: 123 }} error={'FORBIDDEN'} />,
    );
    const element = instance.root;
    expect(element.findByType(LockError)).toBeTruthy();
  });

  it('return no map tasks selected message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: null });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: null });
    });
    const instance = createComponentWithReduxAndIntl(
      <LockedTaskModalContent
        project={{ projectId: 1, licenseId: 123 }}
        error={'noMappedTasksSelected'}
      />,
    );
    const element = instance.root;
    expect(element.findByType(LockError)).toBeTruthy();
  });

  it('return LockError message', () => {
    act(() => {
      store.dispatch({ type: 'SET_PROJECT', project: null });
      store.dispatch({ type: 'SET_LOCKED_TASKS', tasks: [] });
      store.dispatch({ type: 'SET_TASKS_STATUS', status: null });
    });
    const instance = createComponentWithReduxAndIntl(
      <LockedTaskModalContent project={{ projectId: 1, licenseId: 123 }} error={'BAD REQUEST'} />,
    );
    const element = instance.root;
    expect(element.findByType(LockError)).toBeTruthy();
  });
});
