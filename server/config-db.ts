import { Model } from 'objection';
import Knex from 'knex';

const CONFIG = require('./knexfile');

const knex = Knex(CONFIG.development);

Model.knex(knex);
