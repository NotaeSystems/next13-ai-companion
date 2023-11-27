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
import Image from "next/image";
import { cp } from "fs";
import { ImagePersonaLargeComponent } from "@/components/image/image-persona-large";

const formSchema = z.object({
  // name: z.string().min(1, {
  //   message: "Name is required.",
  // }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
  role: z.string().optional(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),

  nickNames: z.string().optional(),

  gender: z.string().optional(),

  educationalLevel: z.string().optional(),

  ageLevel: z.string().optional(),
  // temperature: z.coerce
  //   .number()
  //   .min(0, {
  //     message: "Temperature at least 0.0 required.",
  //   })
  //   .max(1.0, {
  //     message: "Temperature must be between 0.0 and 1.0",
  //   }),

  content: z.string().min(25, {
    message: "Instructions require at least 100 characters.",
  }),

  // pineconeIndex: z.string().optional(),
});

interface RelationshipFormProps {
  //categories: Category[];
  companion: Companion;
  relationship: Relationship;
}

export const RelationshipForm = ({
  companion,
  relationship,
}: RelationshipFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: relationship || {
      name: "",
      nickNames: "",
      role: "",
      gender: "",
      educationalLevel: "",
      ageLevel: "",
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
      await axios.patch(`/api/relationship/${relationship.id}`, values);

      toast({
        description: "Success.",
        duration: 3000,
      });

      router.refresh();
      router.push(`/dashboard/companion/${relationship.companionId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    }
  };
  const lover: string = relationship.name + " " + "is a lover";
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
            <p className="text-xl text-center my-5 ">
              General information about your Relationship with {companion.name}
            </p>
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                <Link href={`/dashboard/companion/${companion.id}`}>
                  <ImagePersonaLargeComponent companion={companion} />
                  {/* <Image
                    src={companion.src}
                    className="rounded-xl object-cover"
                    alt="Persona ${companion.name}"
                    height={150}
                    width={150}
                  /> */}
                </Link>
              </div>
            </div>
            <Separator className="bg-primary/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="Pending">Inactive</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select whether your relationship is Active or not.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Your Role or Relationship to Persona.You are a:{" "}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Gender"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={
                          relationship.name +
                          " has an undisclosed relationship to " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} has an undisclosed relationship to{" "}
                        {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a stranger to " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is a stranger to {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a lover to " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name + " is a lover to " + companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a fan of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is a fan of {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a friend of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is a friend of {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a boyfriend of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is a boyfriend of {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a girlfriend of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is a girlfriend of {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is the son of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is the son of {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is the daughter of" +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is the daughter of {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is the Father of " +
                          companion.name +
                          "."
                        }
                      >
                        {relationship.name} is the father of {companion.name}.
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is the Mother of " +
                          companion.name
                        }
                      >
                        {relationship.name} is the mother of {companion.name}.
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a Grandfather of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is the Grandfather of
                        {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is the Grandmother of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is the GrandMother of
                        {companion.name}
                      </SelectItem>

                      <SelectItem
                        value={
                          relationship.name +
                          " is a cousin of " +
                          companion.name +
                          ". "
                        }
                      >
                        {relationship.name} is a cousin of {companion.name}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your Relationship with {companion.name}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Mary Smith"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="nickNames"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Enter Nicknames You May Have</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Buddy, Sammie"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Gender"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={relationship.name + " gender is a male. "}
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value={relationship.name + " gender is a female. "}
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value={
                          relationship.name + " has an undisclosed gender. "
                        }
                      >
                        Undisclosed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your Gender</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="educationalLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Education Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select your Highest Education Level"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={
                          relationship.name + " has an high school education. "
                        }
                      >
                        High School
                      </SelectItem>
                      <SelectItem
                        value={
                          relationship.name + " has a trade school education. "
                        }
                      >
                        Trade School
                      </SelectItem>
                      <SelectItem
                        value={relationship.name + " has a college education. "}
                      >
                        College
                      </SelectItem>
                      <SelectItem
                        value={
                          relationship.name + " has a professional education. "
                        }
                      >
                        Professional
                      </SelectItem>
                      <SelectItem
                        value={
                          relationship.name + " has an undisclosed education. "
                        }
                      >
                        Undisclosed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your Education Level</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ageLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Age Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select your Age Level"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Teenager">Young Teenager</SelectItem>
                      <SelectItem
                        value={relationship.name + " is a teenager. "}
                      >
                        Teenager
                      </SelectItem>
                      <SelectItem value={relationship.name + " is an adult. "}>
                        Adult
                      </SelectItem>
                      <SelectItem
                        value={relationship.name + " is an older adult. "}
                      >
                        Older Adult
                      </SelectItem>
                      <SelectItem
                        value={relationship.name + " has undisclosed age. "}
                      >
                        Undisclosed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your Age Level</FormDescription>
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
                  <FormLabel> Describe other relationship details.</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      rows={15}
                      className="bg-background resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe other relevant details.
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
