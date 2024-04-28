"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

type ModuleErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ModuleError = ({ error, reset }: ModuleErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Sorry.. Server Error</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center place-items-center">
        <Button onClick={() => reset()}>Try Again</Button>
      </CardContent>
    </Card>
  );
};

export default ModuleError;
