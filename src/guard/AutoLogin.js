import { Auth } from "aws-amplify";

export default async function AutoLoign() {
    // let variable = 'usuario'
    try {
      await Auth.currentSession();
      await Auth.currentAuthenticatedUser();
      return new Promise((resolve, reject) => {
        reject(new Error('/home/menu'));
      })

    } catch (error) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }