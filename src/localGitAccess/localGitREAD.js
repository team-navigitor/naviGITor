const simpleGit = require('simple-git')()

module.exports = {

// Git methods to Access Read only Properties of local repository

   getFullLog: function(){
    simpleGit.log(function(err, log) {
        return log;
    })
  },

   getLatestLogMessage: function(){
    simpleGit.log(function(err, log) {
        return log.latest;
    })
  },

   getCurrentBranch: function(){
    simpleGit.status(function(err, status){
      return status.current;
    })
  },

   getAllBranchNames: function(){
    simpleGit.branch(function(err, branches){
      return branches.all; //returns an array
    })
  }
};
