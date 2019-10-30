const {
  createTeam: createTeamGithub,
  getTeams: getTeamsGithub,
  addMemberToTeam: addMemberToTeamGithub,
  deleteTeam: deleteTeamGithub
} = require('../interactors/github');

const getAllOfTheTeams = async () => {
  let actualFetch = await getTeamsGithub({
    perPage: 100,
    pageNumber: 1
  });
  const fetchAll = actualFetch;

  let pageNumber = 2;

  while (actualFetch.teams.length === 100) {
    actualFetch = await getTeamsGithub({
      perPage: 100,
      pageNumber
    });

    fetchAll.teams = fetchAll.teams.concat(actualFetch.teams);
    pageNumber++;
  }
  return fetchAll;
};

const getTeams = (req, res) => {
  if (!(req.query && req.query.limit) && !(req.query && req.query.page)) {
    return getAllOfTheTeams().then(resp => res.send(resp));
  }

  return getTeamsGithub({
    perPage: req.query.limit || 50,
    pageNumber: req.query.page || 0
  }).then(resp => res.send(resp));
};

const createTeam = (req, res) => createTeamGithub(req.body.name).then(resp => res.send(resp));
const addMembersToTeam = (req, res) =>
  Promise.all(req.body.usernames.map(user => addMemberToTeamGithub(req.params.teamId, user))).then(resp =>
    res.send(resp)
  );
const deleteTeam = (req, res) => deleteTeamGithub(req.params.teamId).then(resp => res.send(resp));

module.exports = { getTeams, createTeam, addMembersToTeam, deleteTeam };
