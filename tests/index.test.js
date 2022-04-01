const { check } = require('../src');

describe('check', () => {
  test('should throw error if current version is not valid', () => {
    expect(() => check({ prTitle: 'test', nextVersion: '1.0.1' })).toThrow(
      /invalid current version/i
    );

    expect(() =>
      check({ prTitle: 'test', nextVersion: '1.0.1', currentVersion: 'ab' })
    ).toThrow(/invalid current version/i);
  });

  test('should throw error if next version is not valid', () => {
    expect(() => check({ prTitle: 'test', currentVersion: '1.0.1' })).toThrow(
      /invalid next version/i
    );

    expect(() =>
      check({ prTitle: 'test', currentVersion: '1.0.1', nextVersion: 'ab' })
    ).toThrow(/invalid next version/i);
  });

  test('should throw error if nextVersion <= currentVersion', () => {
    expect(() =>
      check({ prTitle: 'test', currentVersion: '1.0.1', nextVersion: '1.0.0' })
    ).toThrow(/The version is not updated/i);

    expect(() =>
      check({ prTitle: 'test', currentVersion: '1.0.1', nextVersion: '1.0.1' })
    ).toThrow(/The version is not updated/i);
  });

  test('should throw error if updated the major version without [release-major] in PR title', () => {
    expect(() =>
      check({ prTitle: 'test', currentVersion: '1.0.1', nextVersion: '2.0.0' })
    ).toThrow(/does not contain \[release-major\]/i);

    expect(() =>
      check({
        prTitle: 'test [release-minor]',
        currentVersion: '1.0.1',
        nextVersion: '2.1.0',
      })
    ).toThrow(/does not contain \[release-major\]/i);
  });

  test('should throw error if updated the minor version without [release-minor] in PR title', () => {
    expect(() =>
      check({ prTitle: 'test', currentVersion: '1.0.1', nextVersion: '1.1.0' })
    ).toThrow(/does not contain \[release-minor\]/i);
  });

  test('should throw error if updated > 1', () => {
    expect(() =>
      check({
        prTitle: 'test',
        currentVersion: '1.0.1',
        nextVersion: '1.0.3',
      })
    ).toThrow(/Warning: the version number you updated is greater than 1/i);

    expect(() =>
      check({
        prTitle: 'test [release-major]',
        currentVersion: '1.0.1',
        nextVersion: '3.0.0',
      })
    ).toThrow(/Warning: the version number you updated is greater than 1/i);

    expect(() =>
      check({
        prTitle: 'test [release-minor]',
        currentVersion: '1.0.1',
        nextVersion: '1.2.0',
      })
    ).toThrow(/Warning: the version number you updated is greater than 1/i);
  });

  test('should pass the test', () => {
    check({
      prTitle: 'test',
      currentVersion: '1.1.1',
      nextVersion: '1.1.2',
    });

    check({
      prTitle: 'test [release-minor]',
      currentVersion: '1.0.1',
      nextVersion: '1.1.0',
    });

    check({
      prTitle: 'test [release-major]',
      currentVersion: '1.0.1',
      nextVersion: '2.0.0',
    });
  });
});
