"use client";

// relationship-form
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Profile } from "@prisma/client";

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

  status: z.string().min(1, {
    message: "Status is required",
  }),

  firstName: z.string().min(1, {
    message: "First Name require at least 1 character.",
  }),

  lastName: z.string().min(1, {
    message: "Last Name require at least 1 character.",
  }),

  gender: z.string().min(1, {
    message: "Select your gender",
  }),

  educationLevel: z.string().min(1, {
    message: "Education level is required.",
  }),

  ageLevel: z.string().min(1, {
    message: "Age level is required.",
  }),
});

interface ProfileFormProps {
  //categories: Category[];
  Profile: Profile;
}

export const ProfileForm = ({
  //categories,
  Profile,
}: ProfileFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Profile || {
      status: "",
      firstName: "",
      lastName: "",
      gender: "",
      educationLevel: "",
      ageLevel: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("inside of submit");
      await axios.patch(`/api/admin/profile/${Profile.id}`, values);

      toast({
        description: "Success.",
        duration: 3000,
      });

      router.refresh();
      router.push(`/admin`);
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
              <p className="text-sm text-muted-foreground">Profile</p>
            </div>
            <Separator className="bg-primary/10" />
          </div>

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
                        placeholder="Select a Status"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the status</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Your First Name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your First Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Your Last Name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your Last Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
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
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Undisclosed">Undisclosed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select your Gender</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="educationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Level</FormLabel>
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
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Trade School">Trade School</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Professional Degree">
                      Professional
                    </SelectItem>
                    <SelectItem value="Undisclosed">Undisclosed</SelectItem>
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
                <FormLabel>Age Level</FormLabel>
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
                    <SelectItem value="Young Teenager">
                      Young Teenager
                    </SelectItem>
                    <SelectItem value="Teenager">Teenager</SelectItem>
                    <SelectItem value="Adult">Adult</SelectItem>
                    <SelectItem value="Older Adult">Older Adult</SelectItem>
                    <SelectItem value="Undisclosed">Undisclosed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select your Age Level</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
