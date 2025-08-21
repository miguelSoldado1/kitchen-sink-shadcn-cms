import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";

interface FormItemWrapperProps {
  label: string;
  children: React.ReactNode;
}

export function FormItemWrapper({ label, children }: FormItemWrapperProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
