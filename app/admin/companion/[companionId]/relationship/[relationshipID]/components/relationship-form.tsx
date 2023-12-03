"use client";

// relationship-form
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Relationship, Companion } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

const formSchema = z.object({
  // name: z.string().min(1, {
  //   message: "Name is required.",
  // }),
  adminStatus: z.string().min(1, {
    message: "Admin Status is required.",
  }),
  adminAllowVoice: z.string().min(1, {
    message: "Admin Allow Voice is required.",
  }),
  adminAddPersonaNotes: z.string().min(1, {
    message: "Admin Allow Persona Notes is required.",
  }),
  adminAddRelationshipNotes: z.string().min(1, {
    message: "Admin Allow Realtionship Notes is required.",
  }),
  // addNotes: z.string().min(1, {
  //   message: "Admin Allow Notes is required.",
  // }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),

  // temperature: z.coerce
  //   .number()
  //   .min(0, {
  //     message: "Temperature at least 0.0 required.",
  //   })
  //   .max(1.0, {
  //     message: "Temperature must be between 0.0 and 1.0",
  //   }),

  content: z.string().min(25, {
    message: "Instructions require at least 25 characters.",
  }),

  // pineconeIndex: z.string().optional(),
});

interface RelationshipFormProps {
  //categories: Category[];
  companion: Companion;
  relationship: Relationship;
}

export const RelationshipForm = ({
  //categories,
  relationship,
}: RelationshipFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: relationship || {
      name: "",
      adminStatus: "Pending",
      adminAddPersonaNotes: "",
      adminAddRelationshipNotes: "",
      status: "Pending",
      content: "",
      temperature: "0.5",
      // pineconeIndex: "none",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("inside of submit");
      await axios.patch(`/api/admin/relationship/${relationship.id}`, values);

      toast({
        description: "Success.",
        duration: 3000,
      });

      router.refresh();
      router.push(`/admin/companion/${relationship.companionId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      {/* <Button variant="destructive">
        <Link href={`/dashboard/companion/relationship`}>End Relationship</Link>
      </Button> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Relationship with Companion
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="adminStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select an Admin Status"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an Admin Status for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminAllowVoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Allow Voice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder=""
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an Admin Status for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminAddPersonaNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Allow Persona Core Notes</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select an Admin Allow Voice Status"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an Admin Status for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminAddRelationshipNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Allow Relationship Notes</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Admin Allow Relationship Notes"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an Admin Status for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a status"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a status for your AI</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              name="temperature"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="0.5" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select a temperature from 0.0 to 1.0 with 0.0 being Blunt
                    and 1.0 being very Talkative
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a temperature"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0.0">{"Very Blunt"}</SelectItem>
                      <SelectItem value="0.1">{"Blunt"}</SelectItem>
                      <SelectItem value="0.2">{"Very Quiet"}</SelectItem>
                      <SelectItem value="0.3">{"Quiet"}</SelectItem>
                      <SelectItem value="0.4">{"Reserved"}</SelectItem>
                      <SelectItem value="0.5">{"Less Reserved"}</SelectItem>
                      <SelectItem value="0.6">{"Average"}</SelectItem>
                      <SelectItem value="0.7">{"Friendly"}</SelectItem>
                      <SelectItem value="0.8">{"More Friendly"}</SelectItem>

                      <SelectItem value="0.9">{"Talkative"}</SelectItem>
                      <SelectItem value="1.0">{"Very Talkative"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a temperature for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <div>
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facts About Relationship</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      rows={15}
                      className="bg-background resize-none"
                      //placeholder={PREAMBLE}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe in detail your relationship with Companion and
                    relevant details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              Edit your relationship
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
