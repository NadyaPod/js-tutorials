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

const dispayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
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

let isSorted = false

btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  isSorted = !isSorted;
  dispayMovements(currentAccount.movements, isSorted)
})

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

// Loan
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
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

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. 

2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

// 1.
const recommended = (value) => value ** 0.75 * 28;

dogs.forEach (dog => dog.recommendedFood = recommended(dog.weight));
console.log(dogs);

// 2.

dogs
  .filter(dog => dog.owners.includes('Sarah'))
  .forEach(dog => {
    if (dog.curFood < recommended(dog.weight) * 0.9) {
      console.log(`${dog.owners.join(', ')} dog${dog.owners.length > 1 ? 's' : ''} eats too little`);
    } else if (dog.curFood > recommended(dog.weight) * 1.1) {
    console.log(`${dog.owners.join(', ')} dog${dog.owners.length > 1 ? 's' : ''} eats too much`)
    } else if (dog.curFood === recommended(dog.weight)) {
      console.log(`${dog.owners.join(', ')} dog${dog.owners.length > 1 ? 's' : ''} eats Exactly`);
    }
  })

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > recommended(dog.weight))
  .flatMap(dog => dog.owners)

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < recommended(dog.weight))
  .flatMap(dog => dog.owners)

// 4.
console.log(ownersEatTooMuch.map((owner, i, arr) => arr.indexOf(owner) === arr.length - 1 ? `${owner}` : `${owner} and `).join('') + ' dogs eat too much!');

console.log(ownersEatTooLittle.map((owner, i, arr) => arr.indexOf(owner) === arr.length - 1 ? `${owner}` : `${owner} and `).join('') + ' dogs eat too little!');

// 5.
console.log(dogs
  .some(dog => dog.curFood === recommended(dog.weight)));

// 6.
const okay = dog => dog.curFood > recommended(dog.weight) * 0.9 && dog.curFood < recommended(dog.weight) * 1.1
console.log(dogs
  .some(okay));

// 7.
console.log(dogs
  .filter(okay));

// 8.
console.log(dogs);
const sorted = [...dogs].sort((a, b) => a.recommendedFood - b.recommendedFood)
console.log(sorted);