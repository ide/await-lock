module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.ts'],
  moduleFileExtensions: ['ts', 'js']
};
