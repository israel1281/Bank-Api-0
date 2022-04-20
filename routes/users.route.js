const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router
  .post('/users', (req, res) => usersController.addUser(req, res))
  .get('/users', (req, res) => usersController.getUsers(req, res))
  .get('/users/:id', (req, res) => usersController.getUser(req, res))
  .put('/deposit/:id', (req, res) => usersController.depositUser(req, res))
  .put('/credit/:id', (req, res) => usersController.updateCredit(req, res))
  .put('/withdraw/:id', (req, res) => usersController.withdraw(req, res))
  .put('/transfer', (req, res) => usersController.userTransfer(req, res));

module.exports = router;
