export const data = "123"
const CONFIG_JSON_ID = process.env.CONFIG_JSON_ID;
let customConfig = JSON.parse(localStorage.getItem(`reporting-secondary-${CONFIG_JSON_ID}`))?.customConfig || {};
export let mockCustomConfig = customConfig;
export const mockChangeCustomConfig = (customConfig) => {
  const mockData = JSON.parse(localStorage.getItem(`reporting-secondary-${CONFIG_JSON_ID}`)) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(`reporting-secondary-${CONFIG_JSON_ID}`, JSON.stringify(mockData));
};
export const formConfig = {
  theme: "default"
};

export const onChange = () => {
  console.log("has changed");
};
export const component = {

  id: "mockId"
};

export const child_id = "mock_child_id";
export const index = 1;
