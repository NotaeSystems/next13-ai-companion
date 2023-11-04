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
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),

  temperature: z.coerce
    .number()
    .min(0, {
      message: "Temperature at least 0.0 required.",
    })
    .max(1.0, {
      message: "Temperature must be between 0.0 and 1.0",
    }),

  content: z.string().min(50, {
    message: "Instructions require at least 100 characters.",
  }),

  pineconeIndex: z.string().optional(),
});

interface RelationshipFormProps {
  //categories: Category[];
  Companion: Companion;
  Relationship: Relationship;
}

export const RelationshipForm = ({
  //categories,
  Relationship,
}: RelationshipFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Relationship || {
      name: "",
      status: "Pending",
      content: "",
      temperature: "0.5",
      pineconeIndex: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/relationship/${Relationship.id}`, values);

      toast({
        description: "Success.",
        duration: 3000,
      });

      router.refresh();
      router.push("/");
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
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Pending"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Status of Compannion.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="pineconeIndex"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Pine Cone Index</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Pinecone Index name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The Pine Cone Index Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Facts about your relationship</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="I am a great fan of you"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Facts about your relationship.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
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
                      <SelectItem value={"0.0"}>{"Blunt"}</SelectItem>

                      <SelectItem value={"0.0"}>{"Very Talkative"}</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    Select a temperature for your AI
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
