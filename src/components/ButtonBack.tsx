'use client'

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const ButtonBack = () => {
    const router = useRouter()
    return <Button onClick={router.back}>Back</Button>
};

export { ButtonBack };
