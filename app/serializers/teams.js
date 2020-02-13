const getTeamsSerializer = response => response.data.map(team => team.name);

module.exports = { getTeamsSerializer };
