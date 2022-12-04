export const getDopplerSecrets = async () => {
  return new Promise(async (resolve, reject) => {
    fetch(`https://${process.env.DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`).then((response) => {
      let secrets = "";
      const data = response.json();
      return JSON.parse((secrets += data));
    });
  });
};
