"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Verification = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/forgot-password");
  }, [router]);

  return null;
};

export default Verification;

