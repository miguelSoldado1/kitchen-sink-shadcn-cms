"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { FormItemWrapper } from "@/components/ui/form-item-wrapper";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const folderNameForm = z.object({
  name: z.string().min(1),
});

export function AddFolderDialog() {
  const form = useForm<z.infer<typeof folderNameForm>>({
    resolver: zodResolver(folderNameForm),
    defaultValues: { name: "" },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Folder</DialogTitle>
          <DialogDescription>Create a new folder.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-folder-form" onSubmit={form.handleSubmit(() => {})}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapper label="Name">
                  <Input {...field} />
                </FormItemWrapper>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-folder-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
