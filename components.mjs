export const getComponents = (storyId, oAuthToken) => {
  return fetch(`https://mapi.storyblok.com/v1/spaces/${storyId}/components/`, {
    headers: {
      Authorization: oAuthToken,
      "Content-Type": "application/json"
    }
  });
};
