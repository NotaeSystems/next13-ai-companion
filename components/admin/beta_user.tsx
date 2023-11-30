import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserIsBetaProps {
  currentUser: any;
}

export const UserIsBeta = ({ currentUser }: UserIsBetaProps) => {
  if (currentUser.profile.isBeta) return true;
  else {
    return false;
  }
};
