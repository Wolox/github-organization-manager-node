const getTeamsSerializer = response =>
  response.data.map(team => ({
    name: team.name,
    description: team.description,
    id: team.id,
    privacy: team.privacy,
    slug: team.slug
  }));

module.exports = { getTeamsSerializer };
