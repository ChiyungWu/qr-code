import axios from 'axios';

export async function ipify(): Promise<string> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
