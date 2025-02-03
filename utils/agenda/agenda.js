const Agenda = require('agenda');
const { updateStates, runUpdateStates } = require('./updateStates');
const { startNotifs, runStartNotifs } = require('./startNotifs');
const { lateNotifs, runLateNotifs } = require('./lateNotifs');
const { endNotifs, runEndNotifs } = require('./endNotifs');
const { errorLogger } = require('../helpers/Logger');

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'agendaJobs',
    options: {
      useNewUrlParser: true,
    },
  },
  processEvery: '1 hour',
  maxConcurrency: 20,
  defaultConcurrency: 5,
});

agenda.define('update_states', updateStates);
agenda.define('start_notifications', startNotifs);
agenda.define('late_notifications', lateNotifs);
agenda.define('end_notifications', endNotifs);

agenda.on('ready', async () => {
  try {
    await agenda.start();
    await runUpdateStates(agenda);
    await runStartNotifs(agenda);
    await runLateNotifs(agenda);
    await runEndNotifs(agenda);
  } catch (err) {
    errorLogger('agenda jobs failed');
    errorLogger(err);
  }
});

function graceful() {
  agenda.stop(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;
