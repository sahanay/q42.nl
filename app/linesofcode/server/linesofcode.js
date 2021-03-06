import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'

import { Employees } from '../../employees/lib/shared'

class Engineer {
  constructor() {
    this.codeLinesPerDay = _.random(100, 600);
    this.hoursWorkPerDay = _.random(6, 8);

    this.startsAtMinutes = _.random(8 * 60, 11 * 60);
  }
  linesWritten(date) {
    const dateInMinutes = (date.getHours() * 60) + date.getMinutes();
    const timeWorkedInMinutes = Math.max(0, dateInMinutes - this.startsAtMinutes);
    const minutesWorkPerDay = this.hoursWorkPerDay * 60;
    const perc = Math.min(1, timeWorkedInMinutes / minutesWorkPerDay);
    return Math.round(this.codeLinesPerDay * perc);
  }
}

let Engineers = [];
const numEngineers = Employees.find({labels:'Software Engineer'}).count();
_.times(numEngineers, () => Engineers.push(new Engineer()));

function numLinesOfCode(date) {
  if (_.contains([0,6], date.getDay()))
    return 0;

  return Engineers.reduce((lines, engineer) => lines += engineer.linesWritten(date), 0);
}

Meteor.methods({
  linesOfCodeCounter() {
    return numLinesOfCode(new Date());
  }
});
