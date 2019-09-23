const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '../../../.env'), });
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const client = sendgrid;

module.exports = client;
