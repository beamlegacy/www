import moduleInterface from './interface';

export default function() {
  var self = this;

  function loadApp() {
    loadInterface()
  }

  function loadInterface() {
    new moduleInterface();
  }

  loadApp();
};