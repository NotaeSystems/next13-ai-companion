import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/patientchat/chat";

// export const runtime = "edge";

export default function PatientPage() {
  const id = nanoid();
  console.log("Random Chat Id: " + id);
  return <Chat id={id} />;
}
