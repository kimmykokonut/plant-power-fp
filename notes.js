// In this application, a user is growing a plant. The plant needs water, soil, and sunshine. The user may increment a plant's values through the functions hydrate(), feed(), and giveLight().
//object-oriented-use classes. prone to bugs and not as reusable
class Plant {
  constructor() {
    this.water = 0;
    this.soil = 0;
    this.light = 0;
  }

  hydrate() {
    this.water++
  }

  feed() {
    this.soil++
  }

  giveLight() {
    this.light++
  }
}
//to create and hydrate plant
let plant = new Plant();
plant.hydrate()
plant
//Plant { water: 1, soil: 0, light: 0 }

//functional approach-use composition instead
const hydrate = (plant) => {
  return { //return new obj (shallow clone) that represents plant's new state
    ...plant,
    water: (plant.water || 0) + 1 //default 0 if no water prop on plant
  }
};
const feed = (plant) => {
  return {
    ...plant,
    soil: (plant.soil || 0) + 1
  }
};
//this refactors and can take in and alter soil, water or light.
const changePlantState = (plant, property) => {
  return {
    ...plant,
    [property]: (plant[property] || 0) + 1
  }
} //[] to pass value of variable into obj key or property (es6)
//to call function
let plant = { soil: 0, light: 0, water: 0 }
changePlantState(plant, "soil")
//{ soil: 1, light: 0, water: 0 }

//refactor-make var more abstract
const changeState = (state, prop) => {
  return {
    ...state,
    [prop]: (state[prop] || 0) + 1
  }
}
//refactor again to accept a value and add flex. issue-3 arguments
const changeState2 = (state, prop, value) => ({
  ...state,
  [prop] : (state[prop] || 0) + value 
})
//curry the function-canpass arg in any order
const changeState3 = (prop) => {
  return (value) => {
    return (state) => ({
      ...state,
      [prop] : (state[prop] || 0) + value 
    })
  }
}
//function factories
const feed = changeState3("soil");
const hydrate = changeState3("water");
const giveLight = changeState3("light");
feed(5)(plant) //add 5 to plant's soil
const blueFood = changeState3("soil")(5)
const greenFood = changeState3("soil")(10)
const yuckyFood = changeState3("soil")(-5)
blueFood(plant) //inc plant food level by 5
//store state in function (or retrieve state from DOM-inefficient)
const storeState = () => { //storeState() job to store currentState of obj
  let currentState = {};
  return (stateChangeFunction) => {
    const newState = stateChangeFunction(currentState);
    currentState = {...newState}; //update currentstate by copying newState
    return newState; 
  }
}
//store function in another constant
const stateControl = storeState(); //this creates closure over currentState var in outer function. it holds the INNER function and retains currentState var from outer function.
//it is very important that we pass in a variable holding a function into stateControl and not the invoked function. This would NOT work: const fedPlant = stateControl(blueFood()) -error because the blueFood function would expects to be given an object as an argument.
const fedPlant = stateControl(blueFood);
// { soil: 5}
const plantFedAgain = statecontrol(greenFood);
// { soil: 15 }  state store success.
//to initialize plant w all 3 properties: but now less reusable
const storeState2 = () => {
  let currentState = { soil: 0, light: 0, water: 0 }; //Small change made to function here.
  return (stateChangeFunction) => {
    const newState = stateChangeFunction(currentState);
    currentState = { ...newState };
    return newState;
  }
}
//to give outer function an initial value for starting attributes (not needed here)
const storeState3 = (initialState) => {
  let currentState = initialState; // We could pass in an initial state to the object instead of starting with an empty object as well.
  return (stateChangeFunction) => {
    const newState = stateChangeFunction(currentState);
    currentState = { ...newState };
    return newState;
  }
}
//to access state but not change it:
const storeState = () => {
  let currentState = {};
  return (stateChangeFunction = state => state) => { //if sCF is undefined(no arg), sCF should be state => state. call stateControl() to just return current state.
    const newState = stateChangeFunction(currentState);
    currentState = { ...newState };
    return newState;
  }
}
//This example does not include webpack, testing, or separation of logic. Try adding this functionality on your own. Note also that manipulating the DOM will always lead to functions that produce side effects. There's no way around it!