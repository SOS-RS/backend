const colOrder = [
  'id',
  'name',
  'shelterSupplies',
  'contact',
  'capacity',
  'shelteredPeople',
  'address',
  'pix',
  'verified',
  'petFriendly',
  'createdAt',
  'updatedAt',
];

const getSupplies = collection => {
  // sort by priority, desc
  const sorted = collection.sort(x => -x.priority);

  // convert into an array of strings
  const items = sorted.map(i => {
    const name = i.supply.name;
    const priority = i.priority == 10 ? ' (baixa)' : ' (alta)';
    return name + priority;
  });

  return items.join(', ');
};

const getApiData = async () => {
  //
  const endpoint = 'https://api.sos-rs.com/shelters' + '?perPage=100';

  let shelters = [];

  let total = 5000;
  let page = 1;

  while (shelters.length !== total) {
    const uri = endpoint + `&page=${page}`;

    const response = await (await fetch(uri)).json();

    const { results, count } = response.data;

    shelters.push(...results);

    total = count;
    page++;
  }

  const rowsById = {};

  for (let s of shelters) {
    const columns = [];

    for (let c of colOrder) {
      let col = s[c];

      // convert collection to string
      if (c === 'shelterSupplies') {
        col = getSupplies(col);
      }
      // convert bool to yes/no
      else if (c === 'verified' || c === 'petFriendly') {
        col = col ? 'sim' : 'não';
      }

      if (col === null) {
        col = '';
      }

      columns.push(col);
    }

    rowsById[s.id] = columns;
  }

  return rowsById;
};

module.exports = { getApiData };
