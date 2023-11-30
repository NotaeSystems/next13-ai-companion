import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={60}
        height={60}
        className="mr-6"
      />
    </Link>
  );
};

export default Logo;
