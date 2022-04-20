const fs = require('fs');
const { DefaultDeserializer } = require('v8');
const bankJson = require('../bank.json');

const getUsers = (req, res) => res.status(200).json({ users: bankJson.users });
const getUser = (req, res) => {
  const { id } = req.params;
  let user = bankJson.users.find((u) => u.id === id);
  !user || user === null || undefined
    ? res.status(200).json('User does not exist')
    : res.status(200).json({ user });
};
const addUser = (req, res) => {
  const { id, cash, credit } = req.body;
  let user = bankJson.users.find((u) => u.id === id);
  const userObj = {
    id: id,
    cash: cash,
    credit: credit,
  };

  if (!id) res.status(200).json('add id pls');
  else if (user) res.status(200).json('user exists');
  else {
    bankJson.users.push(userObj);
    fs.writeFileSync('bank.json', JSON.stringify(bankJson));
    res.status(200).json({ success: 'user added successfully' });
  }
};
const depositUser = (req, res) => {
  const { id } = req.params;
  const { cash } = req.body;
  let user = bankJson.users.find((u) => u.id === id);

  if (cash < 0 || !cash) res.status(200).json('something wrong with cash');
  else {
    user.cash += +cash;
    fs.writeFileSync('bank.json', JSON.stringify(bankJson));
    res.status(200).json({ success: 'cash added successfully' });
  }
};
const updateCredit = (req, res) => {
  const { id } = req.params;
  const { credit } = req.body;
  let user = bankJson.users.find((u) => u.id === id);

  if (credit < 100 || !credit)
    res.status(200).json('something wrong with credit');
  else {
    user.credit = +credit;
    fs.writeFileSync('bank.json', JSON.stringify(bankJson));
    res.status(200).json({ success: 'credit added successfully' });
  }
};

const withdraw = (req, res) => {
  const { id } = req.params;
  const { cash } = req.body;
  let user = bankJson.users.find((u) => u.id === id);

  if (!cash || cash < 0) res.status(200).json({ error: 'wrong amount!' });
  else if (user.cash <= -Math.abs(user.credit))
    res
      .status(200)
      .json(
        `Your balance empty, your credit balance is ${user.credit + user.cash}`
      );
  else {
    user.cash -= +cash;
    fs.writeFileSync('bank.json', JSON.stringify(bankJson));
    res
      .status(200)
      .json({
        success: `withdraw works successfully, your credit is ${
          user.cash > 0 ? user.credit : user.credit + user.cash
        }`,
      });
  }
};
const userTransfer = (req, res) => {
  const { from, to, amount } = req.body;
  const fromUser = bankJson.users.find((u) => u.id === from.toString());
  const toUser = bankJson.users.find((u) => u.id === to.toString());

  if (!from || !to) res.status(200).json({ error: 'invalid ID' });
  else if (!amount || amount < 0)
    res.status(200).json({ error: 'invalid amount' });
  else if (fromUser.cash <= -Math.abs(fromUser.credit))
    res
      .status(200)
      .json(
        `User ${fromUser.id} balance empty, current credit balance is ${
          fromUser.credit + fromUser.cash
        }`
      );
  else {
    fromUser.cash -= +amount;
    toUser.cash += +amount;
    fs.writeFileSync('bank.json', JSON.stringify(bankJson));
    res.status(200).json({ success: 'Money transfer successful' });
  }
};
module.exports = {
  getUsers,
  addUser,
  depositUser,
  updateCredit,
  withdraw,
  userTransfer,
  getUser,
};
