import { expect } from 'chai';
const localGit = require('../src/localGitAccess/localGitREAD');
const path = require('path');
const localGitPath = path.join(__dirname, '../.git')
const simpleGit = require('simple-git')(localGitPath);
//
// beforeEach(function(){
//   var test = this;
//
//   return
// })

describe('Local git READ Access', () => {
  it('Should retrieve the complete local git log', () => {

  });
  it('Should retrieve the latest git log message');
  it('Should retrieve the current git branch');
  it('Should retrieve all branch names');
});



it('Should pass', () => {
  expect(1).to.equal(2);
});
