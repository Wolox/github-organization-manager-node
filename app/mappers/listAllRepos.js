const repositoryMapper = response => response.data.map(element => element.name);

module.exports = { repositoryMapper };
