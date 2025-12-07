const fs = require('fs');
const file = 'app/ui/managers/package_manager.js';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `    } else {
      // show loading dialog and destroy all UI
      loadPromise = NavigationManager.getInstance().showDialogForLoad().then(function () {`;

const newCode = `    } else if (this.getMajorPackageId() == null) {
      // FIRST LOAD - skip loading dialog
      this._removePreloadingUI();
      loadPromise = Promise.all([
        this.loadMajorPackage(majorId, minorIds, resources),
        this.activateLoadingMajorPackage(),
      ]).then(function () {
        return (uiSwapCallback != null && uiSwapCallback() || Promise.resolve());
      }).catch(function (error) {
        EventBus.getInstance().trigger(EVENTS.error, error);
      });
    } else {
      // show loading dialog and destroy all UI
      loadPromise = NavigationManager.getInstance().showDialogForLoad().then(function () {`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(file, content);
  console.log('Patched successfully!');
} else {
  console.log('Pattern not found - may already be patched');
}
