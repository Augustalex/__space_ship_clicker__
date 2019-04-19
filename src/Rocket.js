export default function (normalizedState) {

  const state = { ...normalizedState };
  if (!state.id) state.id = ((Math.random() * 10000) * Math.random()).toString();

  return {
    upgradeCost,
    upgrade,
    autopilotCost,
    canInstallAutopilot,
    installAutopilot,
    launchReward,
    normalize
  };

  function upgradeCost() {
    return 1000 * state.level * state.level;
  }

  function upgrade() {
    state.level++;
  }

  function canInstallAutopilot() {
    return !state.autopilot && state.level > 2;
  }

  function autopilotCost() {
    return 10000;
  }

  function installAutopilot() {
    state.autopilot = true;
  }

  function launchReward() {
    return 100 * (state.level * state.level);
  }

  function normalize() {
    return { ...state };
  }
}
