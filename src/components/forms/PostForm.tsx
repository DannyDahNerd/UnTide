import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import LocationSelector from "@/components/shared/LocationSelector";
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

type PostFormProps = {
    post?:Models.Document;
    action: 'Create' | 'Update';
}
const PostForm = ({ post, action }: PostFormProps) => {
    const {mutateAsync:createPost, isPending: isLoadingCreate} = useCreatePost();
    const {mutateAsync:updatePost, isPending: isLoadingUpdate} = useUpdatePost();
    const {user} = useUserContext();
    const navigate = useNavigate();
    const {toast} = useToast();
    const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locationLabel, setLocationLabel] = useState<string>("");

    useEffect(() => {
      if (post && action === "Update") {
        setLocationLabel(post.location);
        setLocationCoords({
          lat: post.latitude,
          lng: post.longitude,
        });
      }
    }, [post, action]);

    // Define Form
    const form = useForm<z.infer<typeof PostValidation>>({
      resolver: zodResolver(PostValidation),
      mode: "onSubmit",
      defaultValues: {
        caption: post ? post?.caption : "",
        file: [],
        tags: post ? post.tags.join(',') : "",
        date: post?.date ? new Date(post.date) : undefined,
      },
    });
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
      if (!locationCoords || !locationLabel) {
        toast({ title: "Please select a location" });
        return;
      }
    
      const payload = {
        ...values,
        userId: user.id,
        location: locationLabel,
        latitude: locationCoords.lat,
        longitude: locationCoords.lng,
        date: values.date.toLocaleDateString('en-CA'),
      };
    
      let newPost;
      if (post && action === "Update") {
        newPost = await updatePost({
          ...payload,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
        });
      } else {
        console.log("Payload being sent:", payload);
        newPost = await createPost(payload);
      }
    
      if (!newPost) {
        toast({ title: "Please try again" });
        return;
      }
    
      navigate(post ? `/posts/${post.$id}` : "/");
    }

    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5x1">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Event Date</FormLabel>
              <FormControl>
                <div>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    className="shad-input rounded-xl px-4 py-3 text-sm"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    minDate={new Date()}
                  />
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel className="shad-form_label mb-2">Select a Location</FormLabel>
          <LocationSelector
            onSelect={(coords, label) => {
              setLocationCoords(coords);
              setLocationLabel(label);
            }}
            initialCoords={
              post && action === "Update"
                ? { lat: post.latitude, lng: post.longitude }
                : undefined
            }
            initialLabel={post && action === "Update" ? post.location : undefined}
          />
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags
                (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input 
                type="text" 
                className="shad-input" 
                placeholder = "Beach, CleanUp"
                {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className = "flex gap-4 items-center justify-end">
          <Button 
              type="button" 
              className="shad-button_dark_4"
              onClick={() => navigate(-1)} // Go back one page
            >
              Cancel
          </Button>
            <Button type="submit" className="untide-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
              {isLoadingCreate || isLoadingUpdate && 'Loading...'}
              {action} Post
            </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm