/**
 * Created by Roman on 16.06.2015.
 */
var moment = require('../public/js/libs/moment/moment');

module.exports = function(week, year){
  console.log(moment().month(12).format('MMM'));
  return moment().year(year).hour(0).minute(0).seconds(0).day("Monday").week(week);
};