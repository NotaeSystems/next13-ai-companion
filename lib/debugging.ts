import Global from "@/Global";
const debugging = Global.debugging;

export async function Debugging(message: string) {
  try {
    if (debugging) {
      console.log(message);
    }
    return null;
  } catch (error) {}
}
