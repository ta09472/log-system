const customLocalStorage = {
  getItem,
  createItem,
  deleteItem,
  editItem,
  addItem,
  removeItem,
};

type Key = "form";

function getItem(key: Key) {
  const target = localStorage.getItem(key);

  if (!target) {
    return null;
  }
  return JSON.parse(target);
}

function createItem(key: string, value: object) {
  const index = localStorage.getItem(key)?.length ?? 0;
  localStorage.setItem(key, JSON.stringify([{ ...value, id: index }]));
}

function deleteItem(key: Key) {
  const target = localStorage.getItem(key);

  if (!target) {
    return;
  }

  localStorage.removeItem(key);
}

function editItem(key: Key, value: unknown) {
  const target = localStorage.getItem(key);

  if (!target) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function addItem(key: Key, value: object) {
  const target = localStorage.getItem(key);
  const index = JSON.parse(target ?? "").length;
  +1;

  if (!target) {
    return;
  }

  const arr = [...JSON.parse(target), { ...value, id: index }];

  localStorage.setItem(key, JSON.stringify(arr));
}

function removeItem(key: Key, index: number) {
  const target = localStorage.getItem(key);

  if (!target) {
    return;
  }

  const arr = [...JSON.parse(target)].filter(v => {
    return v.id !== index;
  });

  localStorage.setItem(key, JSON.stringify(arr));
}

export default customLocalStorage;
