import { RadioTower } from "lucide-react";
import React from "react";
import Image from "next/image";

function Logo() {
  return (
      <Image src={"/image/kemendagrilogo.png"} alt="Logo" width={140} height={140} />
  );
}

export function LogoMobile() {
  return (
    <Image src={"/image/kemendagrilogo.png"} alt="Brand" width={50} height={50} />
  );
}

export default Logo;
