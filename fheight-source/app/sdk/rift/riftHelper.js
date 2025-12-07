/*
 * decaffeinate suggestions:
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');

class RiftHelper {

  // Returns the current level for a given total number of points
  static levelForPoints(points){
    let totalRequired = 10;
    let level = 1;
    for (let i = 2; i <= 1000; i++) {
      if (points < totalRequired) {
        return level;
      } else {
        totalRequired += i * 10;
        level = i;
      }
    }
    return level;
  }

  // Returns the number of points a player must reach to get to the the level passed in.
  // E.G. If a play is level 5 and you want to know how many points they need to level up, call pointsRequiredForLevel(6)
  static pointsRequiredForLevel(level){
    return (level-1) * 10;
  }

  // Returns the base number of points a player has when at a level
  static totalPointsForLevel(level){
    let total = 0;
    for (let i = 1, end = level, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
      total += RiftHelper.pointsRequiredForLevel(i);
    }
    return total;
  }

  // Returns 0 to 1 giving a percentage of progress a player has in their current level towards the next level
  static progressTowardsNextLevel(points){
    const currentLevel = RiftHelper.levelForPoints(points);
    const pointProgress = points - RiftHelper.totalPointsForLevel(currentLevel);
    return pointProgress / RiftHelper.pointsRequiredForLevel(currentLevel);
  }

  static spiritCostForNextReroll(currentUpgradeRerollCount, runTotalRerollCount) {
//    linearValue = ((runTotalRerollCount + 1) * 25) + ((currentUpgradeRerollCount + 1) * 25)
//    minnedValue = Math.min(500,linearValue)
//    return minnedValue
    const expValue = 25 * Math.pow(2,currentUpgradeRerollCount);
    return expValue;
  }
}


module.exports = RiftHelper;
