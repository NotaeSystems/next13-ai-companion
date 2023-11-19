import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { zodResolver } from "@hookform/resolvers/zod";
//import { Note } from "@prisma/client";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Companion } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  companion: Companion;
  noteToEdit?: Note;
}

export default function AddEditNoteDialog({
  open,
  setOpen,
  companion,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
    try {
      console.log("made it to Submit Note");
      if (noteToEdit) {
        console.log("there is a noteToEdit: " + noteToEdit.companionId);
        const response = await fetch(
          `/api/admin/companion/${noteToEdit.companionId}/notes`,
          {
            method: "PUT",
            body: JSON.stringify({
              id: noteToEdit.id,
              ...input,
            }),
          }
        );
        if (!response.ok) throw Error("Status code: " + response.status);
      } else {
        const response = await fetch(
          `/api/admin/companion/${companion.id}/notes`,
          {
            method: "POST",
            body: JSON.stringify(input),
          }
        );
        if (!response.ok) throw Error("Status code: " + response.status);
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.xx");
    }
  }

  async function deleteNote() {
    console.log("made it to deleteNote");
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      console.log("Deleting note of companion: " + noteToEdit.companionId);
      const response = await fetch(
        `/api/admin/companion/${companion.id}/notes`,
        {
          method: "DELETE",
          body: JSON.stringify({
            id: noteToEdit.id,
          }),
        }
      );
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {noteToEdit ? "Edit Note" : "Add Companion Note"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
