import { Auth } from "aws-amplify";

export default async function checkAuth() {

  // let variable = 'usuario'
  try {
    await Auth.currentSession();
    await Auth.currentAuthenticatedUser();
    return new Promise((resolve, reject) => {
      resolve()
    })

  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(new Error('/'));
    })
  }
}
