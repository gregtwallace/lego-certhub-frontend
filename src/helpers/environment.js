// environment file variables
// use process.env in dev and window.env (env.js) in prod
const useFile = process.env.NODE_ENV === 'production';

// basename - BASE_PATH_NAME: '__BASE_PATH_NAME__',
export const basePathName = useFile
  ? window.env.BASE_PATH_NAME
  : process.env.REACT_APP_BASE_PATH_NAME;

// api url  API_URL: '__API_URL__',
export const apiUrl = useFile
  ? window.env.API_URL
  : process.env.REACT_APP_API_URL;

// dev mode - DEV_MODE: '__DEV_MODE__',
export const devMode = useFile
  ? window.env.DEV_MODE
  : process.env.REACT_APP_DEV_MODE;
