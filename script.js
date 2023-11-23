'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
const nameToAbbr = (accs) => 
  accs.forEach((acc) => {
    acc.userName = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('')
  })

nameToAbbr(accounts)

const dispayMovements = function(movements) {
  containerMovements.innerHTML = ''
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

const calcPrintBalance = (acc) => {
  acc.balance = acc.movements.reduce((mov, data) => mov + data, 0);
  labelBalance.textContent = `${acc.balance}€`
}

const calcDisplaySummary = (acc) => {
  const sumIn = acc.movements
  .filter((data) => data >= 0)
  .reduce((acc, data) => acc + data, 0)
  labelSumIn.textContent = `${sumIn}€`

  const sumOut = acc.movements
  .filter((data) => data < 0)
  .reduce((acc, data) => acc + data, 0)
  labelSumOut.textContent = `${sumOut}€`

  const interest = acc.movements
  .filter((data) => data >= 0)
  .map(data => data * acc.interestRate / 100)
  .filter(data => data >= 1)
  .reduce((acc, data) => acc + data, 0)

  labelSumInterest.textContent = `${interest}€`
}

const updateUI = (acc) => {
  dispayMovements(acc.movements);
  calcDisplaySummary(acc);
  calcPrintBalance(acc);
} 

// Login
let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value)

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
  }
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();
})

// Transfer
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amountToTransfer = +inputTransferAmount.value;
  const accountToTransfer = accounts.find((acc) => acc.userName === inputTransferTo.value.toLowerCase());

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferTo.blur();

  if (amountToTransfer > 0 && currentAccount.balance >= amountToTransfer && accountToTransfer && accountToTransfer.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amountToTransfer);
    accountToTransfer.movements.push(amountToTransfer);

    updateUI(currentAccount);
  } 
})

// Delete Account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === +inputClosePin.value) {
    const indToDelete = accounts.findIndex((acc) => acc.userName === inputCloseUsername.value
    )
    accounts.splice(indToDelete, 1)
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started'
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputClosePin.blur();
})


// const withDrawals = movements.filter(mov => mov < 0);
// const sum = movements.reduce((acc, mov) => acc + mov, 0)

// const eurToUsd = 1.1;
// const eurConverted = movements.map(move => move * eurToUsd);

// const eurConverted_1 = [];

// for (let move of movements) {
//   eurConverted_1.push(move * eurToUsd)
// }

const maxValue = (arr) => {
  return arr.reduce((acc, value) => acc = acc >= value ? acc : value, arr[0])
}

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀*/

const checkDogs = (dog1, dog2) => {
  const filterDog1 = dog1.slice(0, -2);
  [...filterDog1, ...dog2].forEach((dog, i) => {
    dog >= 3 ? console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
    : console.log(`Dog number ${i} is still a puppy 🐶`)
  })
}

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3])

const calcAverageHumanAge = (ages) => 
  ages
  .map(age => age <= 2 ? age * 2 : 16 + age * 4)
  .filter(age => age >= 18)
  .reduce((acc, age, i, arr) => acc + age / arr.length, 0)

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
