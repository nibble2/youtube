const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractCSS = require('mini-css-extract-plugin');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js');
const OUTPUT_DIR = path.join(__dirname, 'static');

const config = {
	entry: ENTRY_FILE,
	mode: MODE,
	modules: {
		rules: [
			{
				test: /\.(scss)$/,
				use: ExtractCSS.extract([
					{
						loader: 'css-loader',
					},
					{
						loader: 'posstcss-loader',
						options: {
							plugin() {
								return [autoprefixer({ browsers: 'cover 99.5%' })];
							},
						},
					},
					{
						loader: 'sass-loader',
					},
				]),
			},
		],
	},
	output: {
		path: OUTPUT_DIR,
		filename: '[name].[format]',
	},
};

// start
module.exports = config;
