const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const app = require('../config/app');
const Admin = require('../models/Admin');

const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DB_USER,
  DB_PASS,
  DB_CLUSTER,
  DB_NAME_TEST,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}.tdwf4.mongodb.net/${DB_NAME_TEST}?retryWrites=true&w=majority`;

const goodAdmin = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};
const badAdmin = {
  email: 'test@email.com',
  password: 'testtest123',
};

describe('POST /admin/register', () => {
  before(async () => {
    await mongoose.connect(DB_URI);
    await Admin.collection.drop();
  });

  it('Email required!', async () => {
    const response = await request(app)
      .post('/admin/register')
      .send({})
      .expect(422);
    expect(response.body.message).to.equal('"email" is required');
  });
  it('Password required!', async () => {
    const response = await request(app)
      .post('/admin/register')
      .send({ email: badAdmin.email })
      .expect(422);
    expect(response.body.message).to.equal('"password" is required');
  });
  it('Create new User.', async () => {
    const response = await request(app)
      .post('/admin/register')
      .send(goodAdmin)
      .expect(200);
    expect(response.body.message).to.equal('User was created successfully.');
  });
  it('Do not create User with same credentials.', async () => {
    const response = await request(app)
      .post('/admin/register')
      .send(goodAdmin)
      .expect(409);
    expect(response.body.message).to.equal('User already exists with this email.');
  });
});

describe('POST /admin/login', () => {
  let cookie;
  after(async () => {
    await mongoose.disconnect();
  });

  it('Email required!', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send({})
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });
  it('Password required!', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send({ email: badAdmin.email })
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });
  it('Login with incorrect credentials.', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send(badAdmin)
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });
  it('Login with correct credentials (get tokens).', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send(goodAdmin)
      .expect(200);
    expect(response.body).to.have.property('token');
    cookie = JSON.stringify(response.headers['set-cookie'][0]).split(';')[0].replace('"', '');
  });
  it('Refresh access token.', async () => {
    const response = await request(app)
      .post('/admin/refresh')
      .set('Cookie', cookie)
      .expect(200);
    expect(response.body).to.have.property('token');
    __log.info(cookie);
  });
});
