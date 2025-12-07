// npm modules
import _ from 'underscore';
import fs from 'fs';
import qs from 'querystring';
import gulp from 'gulp';
import gutil from 'gulp-util';
import Promise from 'bluebird';
import colors from 'colors';
import path from 'path';

// local modules
import config from '../config/config';
import ShopData from '../app/data/shop.json';
import CosmeticsFactory from '../app/sdk/cosmetics/cosmeticsFactory.js';
import CosmeticsTypeLookup from '../app/sdk/cosmetics/cosmeticsTypeLookup.js';
import RarityFactory from '../app/sdk/cards/rarityFactory.js';

const paths = [];
Promise.promisifyAll(fs);
