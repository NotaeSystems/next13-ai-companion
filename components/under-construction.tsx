import Image from "next/image";

export default function UnderConstruction() {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <Image
          src="/under-construction.jpg"
          alt="Under Construction"
          height={300}
          width={300}
        />
      </div>
    </>
  );
}
