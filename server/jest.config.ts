import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	coverageReporters: ['json-summary', 'text', 'lcov', 'clover', 'cobertura'],
	testEnvironment: 'node',
};

export default config;
