// const Store = require('./store');
// const Actions = require('./actions');
//
// const Logger = require('./lib/log/Logger');
// const TargetService = require('./target/target-service');
// const inquirer = require('inquirer');
//
// const players = [];
// let store;
//
// const init = async (env) => {
//
//   Logger.info(`Initializing app`);
//   const config = {};
//
//   store = Store.createAppStore();
//   await TargetService.init(config, store);
//   players.push(TargetService.getDevices().map((d, i) => ({name: `Player ${i + 1}`})));
//   await configureDeviceToPlayerMapping();
//
// };
//
// const configureDeviceToPlayerMapping = async () => {
//   let devices = TargetService.getDevices();
//   let possiblePlayers = devices.map((d, i) => ({name: `Player ${i + 1}`, value: i}));
//   for (let i in devices) {
//     let d = devices[i];
//     store.dispatch(Actions.connectToDevice(d, i));
//     let result = await getDeviceToPlayerMappingPrompt(possiblePlayers, d);
//     players[result.assignment.value].device = result.assignment.device;
//   }
// };
//
// const getDeviceToPlayerMappingPrompt = async (possiblePlayers, d) => {
//   return await inquirer.prompt({
//     name: 'assignment',
//     type: 'list',
//     choices: possiblePlayers,
//     message: 'One of the targets is blinking. Which player will that be?',
//     filter: (value) => {
//       return {device: d, value: value};
//     },
//     validate: (value) => {
//       if (value.length) {
//         return true;
//       } else {
//         return 'Wrong answer, please try again';
//       }
//     }
//   });
// };
//
// module.exports = {init};